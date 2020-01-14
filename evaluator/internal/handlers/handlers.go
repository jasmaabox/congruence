// Package handlers contains router handlers
package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/jasmaa/congruence/evaluator/internal/runner"
)

// RunDummyHandler serves a dummy page
func RunDummyHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "hello world")
}

// RunDummy2Handler does a dummy db query
func RunDummy2Handler(db *sql.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT username FROM users")
		if err != nil {
			log.Fatal(err)
		}
		defer rows.Close()

		var username string
		for rows.Next() {
			err := rows.Scan(&username)
			if err != nil {
				log.Fatal(err)
			}
			fmt.Fprintf(w, "%s\n", username)
		}
	})
}

// RunCodeHandler handles code submission requests
func RunCodeHandler(db *sql.DB) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		runReq := runner.RunRequest{
			Lang:      r.FormValue("lang"),
			ProjectID: r.FormValue("project_id"),
		}
		resp := runReq.Run()
		json.NewEncoder(w).Encode(&resp)
	})
}
