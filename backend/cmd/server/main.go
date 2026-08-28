// Команда server — точка входа HTTP-сервера «Картографов».
//
// Пока здесь только проверка живости: по ней видно, что контейнер собрался и
// что docker compose связал сервисы правильно. Правила игры, база и стрим
// событий появятся на следующих шагах плана M0.5.
package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/murtll/cartographers/backend/cmd/server/config"
	"github.com/murtll/cartographers/backend/cmd/server/logging"
	"github.com/murtll/cartographers/backend/internal/api"
	"github.com/murtll/cartographers/backend/internal/boards"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		slog.Error(err.Error())
		os.Exit(1)
	}

	log, err := logging.NewLogger(cfg.LogFormat, cfg.LogLevel)
	if err != nil {
		slog.Error(err.Error())
		os.Exit(1)
	}

	if err := boards.LoadAll(); err != nil {
		log.Error(err.Error())
		os.Exit(1)
	}

	// WriteTimeout здесь пока что нет намеренно с рассчетом на SSE
	// тк он долго держит запрос открытым
	// TODO: выделить SSE в отдельный сервер на отдельном роутере
	// и только у него не будет таймаутов
	// надо поресерчить чем будет плох такой подход
	servers := map[string]*http.Server{
		"main": {
			Addr:              cfg.Addr,
			Handler:           api.NewRouter(log),
			ReadHeaderTimeout: 5 * time.Second,
		},
		"healthz": {
			Addr:              cfg.HealthzAddr,
			Handler:           api.HealthzRouter(),
			ReadHeaderTimeout: 5 * time.Second,
			WriteTimeout:      10 * time.Second,
		},
	}

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	errCh := make(chan error, len(servers))
	for name, srv := range servers {
		go func() {
			log.Info("server listening", "server", name, "addr", srv.Addr)
			errCh <- srv.ListenAndServe()
		}()
	}

	select {
	case <-ctx.Done():
		log.Info("shutting down")
	case err := <-errCh:
		if err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Error("listen failed", "err", err)
			os.Exit(1)
		}
		return
	}

	for name, srv := range servers {
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		log.Info("shutting down server", "server", name, "addr", srv.Addr)
		if err := srv.Shutdown(shutdownCtx); err != nil {
			log.Error("shutdown failed", "addr", srv.Addr, "err", err)
		}
	}
}
