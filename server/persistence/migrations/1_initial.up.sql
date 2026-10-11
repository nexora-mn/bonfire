-- Pre-production: every table lives in this one migration. Once the app is
-- live, add new numbered migrations instead of editing this file.

-- Money is stored as whole tögrög (MNT has no minor unit in practice).

CREATE TABLE creators (
    id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Supabase auth user (JWT `sub`). One creator page per account.
    user_id            UUID        NOT NULL UNIQUE,
    -- Public URL path: bonfire.mn/<slug>. Can change.
    slug               TEXT        NOT NULL UNIQUE
                                   CHECK (slug ~ '^[a-z0-9][a-z0-9_-]{1,30}[a-z0-9]$'),
    -- Permanent short code behind the QR code (/c/<code>); survives slug changes.
    code               TEXT        NOT NULL UNIQUE,
    display_name       TEXT        NOT NULL CHECK (char_length(display_name) BETWEEN 1 AND 80),
    about              TEXT        NOT NULL DEFAULT '' CHECK (char_length(about) <= 5000),
    -- Object keys in the creator-media bucket.
    avatar_key         TEXT,
    cover_key          TEXT,
    -- One-time ("buy me a coffee") support settings.
    one_time_enabled   BOOLEAN     NOT NULL DEFAULT TRUE,
    one_time_min       BIGINT      NOT NULL DEFAULT 1000 CHECK (one_time_min > 0),
    one_time_presets   BIGINT[]    NOT NULL DEFAULT '{5000,10000,20000}',
    one_time_thanks    TEXT        NOT NULL DEFAULT '' CHECK (char_length(one_time_thanks) <= 500),
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE creator_links (
    creator_id UUID    NOT NULL REFERENCES creators (id) ON DELETE CASCADE,
    position   INTEGER NOT NULL,
    platform   TEXT    NOT NULL,
    url        TEXT    NOT NULL,
    PRIMARY KEY (creator_id, position)
);

-- Monthly membership tiers.
CREATE TABLE tiers (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id    UUID        NOT NULL REFERENCES creators (id) ON DELETE CASCADE,
    name          TEXT        NOT NULL CHECK (char_length(name) BETWEEN 1 AND 60),
    description   TEXT        NOT NULL DEFAULT '' CHECK (char_length(description) <= 1000),
    monthly_price BIGINT      NOT NULL CHECK (monthly_price > 0),
    -- Optional image or icon, an object key in the creator-media bucket.
    image_key     TEXT,
    position      INTEGER     NOT NULL DEFAULT 0,
    is_active     BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX tiers_creator_idx ON tiers (creator_id, position);

CREATE TABLE posts (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id   UUID        NOT NULL REFERENCES creators (id) ON DELETE CASCADE,
    title        TEXT        NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
    body         TEXT        NOT NULL DEFAULT '' CHECK (char_length(body) <= 20000),
    image_key    TEXT,
    -- 'public' posts are visible to everyone, 'members' only to paying supporters.
    visibility   TEXT        NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'members')),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX posts_creator_idx ON posts (creator_id, created_at DESC);

-- Money received by a creator: one-time support or a membership charge.
-- Rows are written by the payment integration (not built yet).
CREATE TABLE supports (
    id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id     UUID        NOT NULL REFERENCES creators (id) ON DELETE CASCADE,
    kind           TEXT        NOT NULL CHECK (kind IN ('one_time', 'membership')),
    tier_id        UUID        REFERENCES tiers (id) ON DELETE SET NULL,
    -- Supabase user who paid, when signed in; null for guest supporters.
    supporter_user_id UUID,
    supporter_name TEXT        NOT NULL DEFAULT '',
    message        TEXT        NOT NULL DEFAULT '',
    amount         BIGINT      NOT NULL CHECK (amount > 0),
    status         TEXT        NOT NULL DEFAULT 'pending'
                               CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX supports_creator_idx ON supports (creator_id, created_at DESC);
CREATE INDEX supports_supporter_idx ON supports (supporter_user_id, created_at DESC)
    WHERE supporter_user_id IS NOT NULL;

CREATE TABLE post_likes (
    user_id    UUID        NOT NULL,
    post_id    UUID        NOT NULL REFERENCES posts (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, post_id)
);
CREATE INDEX post_likes_post_idx ON post_likes (post_id);

-- Where a creator's payouts go. bank_code is one of the codes in
-- server/payout/banks.go; the bank client maps it to the bank's own code.
CREATE TABLE payout_accounts (
    creator_id     UUID        PRIMARY KEY REFERENCES creators (id) ON DELETE CASCADE,
    bank_code      TEXT        NOT NULL,
    account_holder TEXT        NOT NULL,
    account_number TEXT        NOT NULL,
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One transfer per creator per payout run, written by the monthly workflow.
-- A run pays the creator's whole unpaid balance (succeeded supports minus
-- every payout that hasn't failed), so money that couldn't be sent - no
-- account, below the minimum, or a failed transfer - rolls into the next run.
CREATE TABLE payouts (
    id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id     UUID        NOT NULL REFERENCES creators (id) ON DELETE CASCADE,
    -- First day of the month the run closed; earnings up to its end are included.
    period         DATE        NOT NULL,
    -- Balance taken out of the creator's earnings; amount is what gets sent.
    gross          BIGINT      NOT NULL CHECK (gross > 0),
    fee            BIGINT      NOT NULL CHECK (fee >= 0),
    amount         BIGINT      NOT NULL CHECK (amount > 0 AND amount = gross - fee),
    -- pending: not sent yet. processing: the bank accepted it (or the result
    -- is unknown) and reconciliation will settle it. failed: no money moved,
    -- so the gross returns to the balance.
    status         TEXT        NOT NULL DEFAULT 'pending'
                               CHECK (status IN ('pending', 'processing', 'paid', 'failed')),
    -- Sandbox payouts are recorded but no money moves.
    sandbox        BOOLEAN     NOT NULL,
    -- Snapshot of the payout account at the time of the run.
    bank_code      TEXT        NOT NULL,
    account_holder TEXT        NOT NULL,
    account_number TEXT        NOT NULL,
    -- The bank's transaction reference, once it has one.
    bank_ref       TEXT,
    failure_reason TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    processed_at   TIMESTAMPTZ,
    UNIQUE (creator_id, period)
);
CREATE INDEX payouts_processing_idx ON payouts (id) WHERE status = 'processing';
