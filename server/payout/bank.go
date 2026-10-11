package payout

import (
	"context"
	"fmt"
)

// Bank codes a payout account can name; each bank client maps them to the
// bank's own codes. The UI's BANKS list mirrors these.
var bankCodes = map[string]bool{
	"khan":      true,
	"golomt":    true,
	"tdb":       true,
	"xac":       true,
	"state":     true,
	"capitron":  true,
	"bogd":      true,
	"arig":      true,
	"transbank": true,
	"nibank":    true,
	"mbank":     true,
}

// transfer is one payout sent from Bonfire's account to a creator's.
type transfer struct {
	// The payout ID, used as the bank's idempotency key so a retried send
	// never pays twice.
	Ref           string
	BankCode      string
	AccountHolder string
	AccountNumber string
	Amount        int64
	Description   string
}

const (
	transferPaid       = "paid"
	transferProcessing = "processing"
	transferFailed     = "failed"
)

type transferResult struct {
	// transferPaid, transferProcessing or transferFailed.
	Status  string `json:"status"`
	BankRef string `json:"bankRef"`
	Reason  string `json:"reason"`
}

// bank is a corporate gateway that moves money out of Bonfire's account.
type bank interface {
	// Send must be idempotent on t.Ref. A definite rejection (closed account,
	// name mismatch) is a failed result; an error means the outcome is
	// unknown, and the send is retried and later reconciled.
	Send(ctx context.Context, t transfer) (transferResult, error)
	// Status looks a transfer up by Ref. One the bank never received is
	// failed, so its money goes back into the creator's balance.
	Status(ctx context.Context, ref string) (transferResult, error)
	// Sandbox reports that no real money moves.
	Sandbox() bool
}

func newBank(name string) (bank, error) {
	switch name {
	case "sandbox":
		return sandboxBank{}, nil
	}
	return nil, fmt.Errorf("payout: unknown bank %q", name)
}

// sandboxBank pays every transfer instantly without moving money.
type sandboxBank struct{}

func (sandboxBank) Send(_ context.Context, t transfer) (transferResult, error) {
	return transferResult{Status: transferPaid, BankRef: "sandbox-" + t.Ref}, nil
}

func (sandboxBank) Status(_ context.Context, ref string) (transferResult, error) {
	return transferResult{Status: transferPaid, BankRef: "sandbox-" + ref}, nil
}

func (sandboxBank) Sandbox() bool { return true }
