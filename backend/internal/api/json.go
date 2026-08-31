package api

import (
	"encoding/json"
	"net/http"
)

func Send(w http.ResponseWriter, status int, payload any) error {
	body, err := json.Marshal(payload)
	if err != nil {
		return err
	}
	w.WriteHeader(status)
	if payload != nil {
		w.Write(body)
	}
	return nil
}
