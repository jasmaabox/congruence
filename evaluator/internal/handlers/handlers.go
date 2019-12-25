// Package handlers contains router handlers
package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/jasmaa/congruence/evaluator/internal/runner"
)

// RunDummyHandler serves a dummy page
func RunDummyHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "hello world")
}

// RunCodeHandler handles code submission requests
func RunCodeHandler(w http.ResponseWriter, r *http.Request) {
	runReq := runner.RunRequest{
		Lang:      r.FormValue("lang"),
		ProjectID: r.FormValue("project_id"),
	}
	resp := runReq.Run()
	json.NewEncoder(w).Encode(&resp)
}
