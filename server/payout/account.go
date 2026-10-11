package payout

import (
	"context"
	"regexp"
	"strings"
	"time"
	"unicode/utf8"

	"encore.app/persistence"
	"encore.dev/beta/errs"
)

type Account struct {
	// One of bankCodes, e.g. "khan".
	BankCode      string    `json:"bankCode"`
	AccountHolder string    `json:"accountHolder"`
	AccountNumber string    `json:"accountNumber" encore:"sensitive"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

type AccountResponse struct {
	// Null until the creator saves one.
	Account *Account `json:"account"`
}

// GetAccount returns where the creator's payouts are sent.
//
//encore:api auth method=GET path=/creator/me/payout-account
func (s *Service) GetAccount(ctx context.Context) (*AccountResponse, error) {
	c, err := s.mine(ctx)
	if err != nil {
		return nil, err
	}
	a, err := s.q.GetPayoutAccount(ctx, c.ID)
	if persistence.IsNotFound(err) {
		return &AccountResponse{}, nil
	} else if err != nil {
		return nil, err
	}
	return &AccountResponse{Account: toAccount(a)}, nil
}

func toAccount(a persistence.PayoutAccount) *Account {
	return &Account{
		BankCode:      a.BankCode,
		AccountHolder: a.AccountHolder,
		AccountNumber: a.AccountNumber,
		UpdatedAt:     a.UpdatedAt,
	}
}

type AccountParams struct {
	BankCode      string `json:"bankCode"`
	AccountHolder string `json:"accountHolder"`
	AccountNumber string `json:"accountNumber" encore:"sensitive"`
}

// Domestic account numbers are digits; IBANs are MN + 18 digits.
var accountNumberPattern = regexp.MustCompile(`^([0-9]{6,20}|MN[0-9]{18})$`)

func (p *AccountParams) Validate() error {
	p.AccountHolder = strings.TrimSpace(p.AccountHolder)
	p.AccountNumber = strings.ToUpper(strings.ReplaceAll(p.AccountNumber, " ", ""))
	if !bankCodes[p.BankCode] {
		return &errs.Error{Code: errs.InvalidArgument, Message: "unknown bank"}
	}
	if n := utf8.RuneCountInString(p.AccountHolder); n < 2 || n > 100 {
		return &errs.Error{Code: errs.InvalidArgument, Message: "account holder must be 2-100 characters"}
	}
	if !accountNumberPattern.MatchString(p.AccountNumber) {
		return &errs.Error{Code: errs.InvalidArgument, Message: "invalid account number"}
	}
	return nil
}

// SaveAccount sets where the creator's payouts are sent.
//
//encore:api auth method=PUT path=/creator/me/payout-account
func (s *Service) SaveAccount(ctx context.Context, p *AccountParams) (*AccountResponse, error) {
	c, err := s.mine(ctx)
	if err != nil {
		return nil, err
	}
	a, err := s.q.UpsertPayoutAccount(ctx, persistence.UpsertPayoutAccountParams{
		CreatorID:     c.ID,
		BankCode:      p.BankCode,
		AccountHolder: p.AccountHolder,
		AccountNumber: p.AccountNumber,
	})
	if err != nil {
		return nil, err
	}
	return &AccountResponse{Account: toAccount(a)}, nil
}

type PayoutItem struct {
	ID string `json:"id"`
	// YYYY-MM.
	Month string `json:"month"`
	// Earnings taken from the balance; Fee is the platform's share and
	// Amount (Gross - Fee) is what was sent.
	Gross  int64 `json:"gross"`
	Fee    int64 `json:"fee"`
	Amount int64 `json:"amount"`
	// pending, processing, paid or failed. A failed payout's gross goes back
	// into the balance for the next run.
	Status        string     `json:"status"`
	Sandbox       bool       `json:"sandbox"`
	BankCode      string     `json:"bankCode"`
	AccountNumber string     `json:"accountNumber" encore:"sensitive"`
	ProcessedAt   *time.Time `json:"processedAt"`
}

type PayoutList struct {
	Payouts []PayoutItem `json:"payouts"`
}

// ListPayouts returns the creator's last 24 monthly payouts.
//
//encore:api auth method=GET path=/creator/me/payouts
func (s *Service) ListPayouts(ctx context.Context) (*PayoutList, error) {
	c, err := s.mine(ctx)
	if err != nil {
		return nil, err
	}
	rows, err := s.q.ListPayouts(ctx, c.ID)
	if err != nil {
		return nil, err
	}
	out := make([]PayoutItem, len(rows))
	for i, r := range rows {
		out[i] = PayoutItem{
			ID:            r.ID.String(),
			Month:         r.Period.Format("2006-01"),
			Gross:         r.Gross,
			Fee:           r.Fee,
			Amount:        r.Amount,
			Status:        r.Status,
			Sandbox:       r.Sandbox,
			BankCode:      r.BankCode,
			AccountNumber: r.AccountNumber,
			ProcessedAt:   r.ProcessedAt,
		}
	}
	return &PayoutList{Payouts: out}, nil
}
