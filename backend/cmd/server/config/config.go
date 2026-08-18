package config

import (
	"errors"
	"os"
)

type Config struct {
	Port        string
	HealthzPort string
	DatabaseURL string
	CookieKey   []byte
}

func Load() (Config, error) {
	var cfg Config
	var errs []error

	cfg.Port = os.Getenv("PORT")
	if cfg.Port == "" {
		errs = append(errs, errors.New("PORT не задан"))
	}

	cfg.DatabaseURL = os.Getenv("DATABASE_URL")
	if cfg.DatabaseURL == "" {
		errs = append(errs, errors.New("DATABASE_URL не задан"))
	}

	cfg.CookieKey = []byte(os.Getenv("COOKIE_SIGNING_KEY"))
	if cfg.CookieKey == nil {
		errs = append(errs, errors.New("COOKIE_SIGNING_KEY не задан"))
	}

	return cfg, errors.Join(errs...)
}


// TODO дописать func env 
func env(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

// TODO написать func env для параметров с дефолт значениями что бы при запуске env код не падал а отдавал эти значения
