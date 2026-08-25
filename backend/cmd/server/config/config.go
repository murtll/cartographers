package config

import (
	"errors"
	"os"
)

type Config struct {
	// no defualt value
	CookieKey   string
	DatabaseURL string

	// have default value
	HealthzAddr string
	Addr        string
	LogLevel	string
	LogFormat	string
}

func Load() (Config, error) {
	var cfg Config
	var errs []error

	cfg.HealthzAddr = envWithDefault("HEALTHZ_ADDR", ":9090")
	cfg.Addr = envWithDefault("ADDR", ":8080")
	cfg.LogLevel = envWithDefault("LOG_LEVEL", "INFO")
	cfg.LogFormat = envWithDefault("LOG_FORMAT", "text")


	var err error
	cfg.DatabaseURL, err = env("DATABASE_URL")
	errs = append(errs, err)

	cfg.CookieKey, err = env("COOKIE_SECRET_KEY")
	errs = append(errs, err)

	return cfg, errors.Join(errs...)
}


// TODO дописать func env 
func envWithDefault(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

// TODO написать func env для параметров с дефолт значениями что бы при запуске env код не падал а отдавал эти значения
func env(key string) (string, error) {
	if v := os.Getenv(key); v != "" {
		return v, nil
	}
	return "", errors.New(key + " not set")
}