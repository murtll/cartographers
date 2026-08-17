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

	// WriteTimeout здесь нет намеренно: стрим событий висит открытым всю партию,
	// и общий таймаут на запись его бы обрывал. Сроки на отдельные запросы
	// ставят сами ручки.
	srv := &http.Server{
		Addr:              addr,
		Handler:           api.NewRouter(),
		ReadHeaderTimeout: 5 * time.Second,
	}

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()


	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	go startSrv(log, srv, shutdownCtx, "main")

	healthzaddr := ":" + env("HEALTHZ_PORT", "9090")

	healthzsrv := &http.Server{
		Addr:              healthzaddr,
		Handler:           api.HealthzRouter(),
		ReadHeaderTimeout: 5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	healthzShutdownCtx, healthzCancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer healthzCancel()

	go startSrv(log, healthzsrv, healthzShutdownCtx, "hehealthz")

	<-ctx.Done()
	log.Info("shutting down")
	log.Info("healthz shutting down")
}

func startSrv(log *slog.Logger, srv *http.Server, shutdownCtx context.Context, addrName string) {
	log.Info("server listening", addrName + "Addr", srv.Addr)
	if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Error("listen failed", "err", err)
		os.Exit(1)
	}

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Error("shutdown failed", "addrName", addrName, "err", err.Error())
	}
}

func env(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
