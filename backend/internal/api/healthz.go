package api

import (
	"log/slog"
	"net/http"

	"github.com/go-chi/chi/v5"
)

func HealthzRouter() *chi.Mux {
	mux := chi.NewRouter()

	mux.Get("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if _, err := w.Write([]byte(`{"status":"ok"}`)); err != nil {
			slog.Error("failed to sent request back to client")
		}
	})

	return mux
}
