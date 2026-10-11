-- New creators opt in to one-time donations from the studio.
ALTER TABLE creators ALTER COLUMN one_time_enabled SET DEFAULT FALSE;
