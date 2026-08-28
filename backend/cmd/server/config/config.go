package config

import (
	"errors"
	"os"
	"strings"
)

const (
	healthzAddrDefault = ":9090"
	addrDefault        = ":8080"
	logLevelDefault    = "INFO"
	logFormatDefault   = "text"
)

var logLevelAllowedValues = [...]string{"DEBUG", "INFO", "WARN", "ERROR"}
var logFormatAllowedValues = [...]string{"text", "json"}

type Config struct {
	// no defualt value
	CookieKey   string
	DatabaseURL string

	// have default value
	HealthzAddr string
	Addr        string
	LogLevel    string
	LogFormat   string
}

func Load() (Config, error) {
	var cfg Config
	var errs []error
	var err error

	cfg.HealthzAddr = envWithDefault("HEALTHZ_ADDR", healthzAddrDefault)
	cfg.Addr = envWithDefault("ADDR", addrDefault)

	logLevel := strings.ToUpper(envWithDefault("LOG_LEVEL", logLevelDefault))
	if err := checkAllowedValues("LOG_LEVEL", logLevel, logLevelAllowedValues[:]); err != nil {
		errs = append(errs, err)
	} else {
		cfg.LogLevel = logLevel
	}

	logFormat := strings.ToLower(envWithDefault("LOG_FORMAT", logFormatDefault))
	if err := checkAllowedValues("LOG_FORMAT", logFormat, logFormatAllowedValues[:]); err != nil {
		errs = append(errs, err)
	} else {
		cfg.LogFormat = logFormat
	}

	cfg.DatabaseURL, err = env("DATABASE_URL")
	errs = append(errs, err)

	cfg.CookieKey, err = env("COOKIE_SECRET_KEY")
	errs = append(errs, err)

	return cfg, errors.Join(errs...)
}

func envWithDefault(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func env(key string) (string, error) {
	if v := os.Getenv(key); v != "" {
		return v, nil
	}
	return "", errors.New(key + " not set")
}

func checkAllowedValues(key, value string, allowedValues []string) error {
	for _, target := range allowedValues {
		if value == target {
			return nil
		}
	}
	return errors.New(key + " " + value + " not found")
}
