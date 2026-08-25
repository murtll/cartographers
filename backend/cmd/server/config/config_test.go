package config_test

import (
	"testing"

	"github.com/murtll/cartographers/backend/cmd/server/config"
)

func TestLoadEmptyEnv(t *testing.T) {
	_, err := config.Load()
	if err == nil {
		t.Errorf("should produce an error")
	}
}

func TestLoad(t *testing.T) {
	tv := "test"
	t.Setenv("DATABASE_URL", tv)
	t.Setenv("COOKIE_SECRET_KEY", tv)

	cfg, err := config.Load()
	if err != nil {
		t.Errorf("should not produce an error")
	}

	if cfg.DatabaseURL != tv {
		t.Errorf("DatabaseURL does not set correctly")
	}
	if cfg.CookieKey != tv {
		t.Errorf("CookieKEy does not set correctly")
	}
	if cfg.Addr != ":8080" {
		t.Errorf("Addr does not set correctly")
	}
}
