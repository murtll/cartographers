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

	"github.com/murtll/cartographers/backend/internal/api"
	"github.com/murtll/cartographers/backend/internal/boards"
)

func main() {
	log := slog.New(slog.NewTextHandler(os.Stdout, nil))

	if err := boards.LoadAll(); err != nil {
		log.Error(err.Error())
		os.Exit(1)
	}

	addr := ":" + env("PORT", "8080")

	mux := api.NewRouter()

	srv := &http.Server{
		Addr:              addr,
		Handler:           mux,
		ReadHeaderTimeout: 5 * time.Second,
	}

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// WriteTimeout здесь нет намеренно: стрим событий висит открытым всю партию,
	// и общий таймаут на запись его бы обрывал. Сроки на отдельные запросы
	// ставят сами ручки.

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	go getmux(log, srv, shutdownCtx)

	healthzaddr := ":" + env("PORT", "9090")

	healthzmux := api.HealthzRouter()

	healthzsrv := &http.Server{
		Addr:              healthzaddr,
		Handler:           healthzmux,
		ReadHeaderTimeout: 5 * time.Second,
	}

	healthzShutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	go getmux(log, healthzsrv, healthzShutdownCtx)

	<-ctx.Done()
	log.Info("shutting down")
	log.Info("healthz shutting down")
}

func getmux(log *slog.Logger, srv *http.Server, shutdownCtx context.Context) {
	log.Info("server listening", "healthzaddr", srv.Addr)
	if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Error("listen failed", "err", err)
		os.Exit(1)
	}

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Error("healthz shutdown failed", "err", err)
	}
}

func env(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
