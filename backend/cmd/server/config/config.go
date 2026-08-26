package config

import (
	"errors"
	"log/slog"
	"os"
)

type Config struct {
	// no defualt value
	CookieKey   string
	DatabaseURL string

	// have default value
	HealthzAddr string
	Addr        string
	Logger		*slog.Logger //logLevel and logFormat will be parsed in Load()
}

func Load() (Config, error) {
	var cfg Config
	var errs []error

	cfg.HealthzAddr = envWithDefault("HEALTHZ_ADDR", ":9090")
	cfg.Addr = envWithDefault("ADDR", ":8080")
	level := parseLogLevel(envWithDefault("LOG_LEVEL", "INFO"))
	handler := newLogHandler(envWithDefault("LOG_FORMAT", "text"), level)
	cfg.Logger = slog.New(handler)

	var err error
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

func parseLogLevel(level string) slog.Level {
	switch level {
	case "DEBUG":
		return slog.LevelDebug
	case "WARN":
		return slog.LevelWarn
	case "ERROR":
		return slog.LevelError
	default:
		return slog.LevelInfo
	} 
}

func newLogHandler(format string, level slog.Level) slog.Handler {
	opts := slog.HandlerOptions{Level: level}
	switch format {
	case "json":
		return slog.NewJSONHandler(os.Stdout, &opts)
	default:
		return slog.NewTextHandler(os.Stdout, &opts)
	}
}
