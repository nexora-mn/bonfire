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
