package logging

import (
	"errors"
	"log/slog"
	"os"
)

func NewLogger(format, level string) (*slog.Logger, error) {
	logLevel, err := parseLogLevel(level)
	if err != nil {
		return nil, err
	}

	handler, err := newLogHandler(format, logLevel)
	if err != nil {
		return nil, err
	}
	logger := slog.New(handler)
	return logger, nil
}

func parseLogLevel(level string) (slog.Level, error) {
	switch level {
	case "DEBUG":
		return slog.LevelDebug, nil
	case "WARN":
		return slog.LevelWarn, nil
	case "ERROR":
		return slog.LevelError, nil
	case "INFO":
		return slog.LevelInfo, nil
	default:
		return slog.LevelError, errors.New("unsupported log level " + level)
	}
}

func newLogHandler(format string, level slog.Level) (slog.Handler, error) {
	opts := slog.HandlerOptions{Level: level}
	switch format {
	case "json":
		return slog.NewJSONHandler(os.Stdout, &opts), nil
	case "text":
		return slog.NewTextHandler(os.Stdout, &opts), nil
	default:
		return nil, errors.New("unsupported log format " + format)
	}
}
