package api

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"

	"github.com/murtll/cartographers/backend/internal/boards"
)

func NewRouter() *chi.Mux {
	mux := chi.NewRouter()

	mux.Use(middleware.RequestID)
	mux.Use(middleware.Logger)
	mux.Use(middleware.Recoverer)

	mux.Route("/api", func(mux chi.Router) {
		mux.Route("/rooms", func(mux chi.Router) {
			mux.Post("/", createRoom)
			mux.Post("/{code}/join", joinRoom)
			mux.Get("/{code}/stream", stream)
			mux.Post("/{code}/moves", move)
		})
		mux.Get("/boards/{id}", getBoard)
		mux.Get("/panic", func(w http.ResponseWriter, r *http.Request) {
			panic("boom")
		})
	})

	return mux
}

func createRoom(w http.ResponseWriter, r *http.Request) {
	payload := make(map[string]any)
	payload["code"] = "FG3J6K"
	Send(w, http.StatusOK, payload)
}

func joinRoom(w http.ResponseWriter, r *http.Request) {
	_ = chi.URLParam(r, "code")
	body, err := io.ReadAll(r.Body)

	if err != nil {
		Send(w, http.StatusBadRequest, NewErrorRessponse(err))
		return
	}

	payload := make(map[string]any)
	if err := json.Unmarshal(body, &payload); err != nil {
		Send(w, http.StatusBadRequest, NewErrorRessponse(err))
		return
	}

	Send(w, http.StatusOK, nil)
}

func stream(w http.ResponseWriter, r *http.Request) {
	_ = chi.URLParam(r, "code")
	Send(w, http.StatusOK, nil)
}

func move(w http.ResponseWriter, r *http.Request) {
	_ = chi.URLParam(r, "code")
	body, err := io.ReadAll(r.Body)

	if err != nil {
		Send(w, http.StatusBadRequest, NewErrorRessponse(err))
		return
	}

	payload := Move{}
	if err := json.Unmarshal(body, &payload); err != nil {
		Send(w, http.StatusBadRequest, NewErrorRessponse(err))
		return
	}

	Send(w, http.StatusOK, nil)
}

func getBoard(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	board, err := boards.GetBoard(id)
	if err != nil {
		Send(w, http.StatusBadRequest, NewErrorRessponse(err))
		return
	}

	Send(w, http.StatusOK, board)
}
