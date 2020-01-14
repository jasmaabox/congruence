package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/jasmaa/congruence/evaluator/internal/handlers"
	_ "github.com/lib/pq"
)

func main() {

	// Connect to db
	pgUser := os.Getenv("POSTGRES_USER")
	pgPassword := os.Getenv("POSTGRES_PASSWORD")
	pgHost := os.Getenv("POSTGRES_HOST")
	pgPort := os.Getenv("POSTGRES_PORT")
	pgDB := os.Getenv("POSTGRES_DB")

	connStr := fmt.Sprintf(
		"postgresql://%s:%s@%s:%s/%s?sslmode=disable",
		pgUser, pgPassword, pgHost, pgPort, pgDB,
	)
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	// Routes
	router := mux.NewRouter()
	router.HandleFunc("/dummy", handlers.RunDummyHandler).Methods("GET")
	router.Handle("/dummy2", handlers.RunDummy2Handler(db)).Methods("GET")

	router.Handle("/runCode", handlers.RunCodeHandler(db)).Methods("POST")

	fmt.Println("Starting evaluator on 8000...")
	log.Fatal(http.ListenAndServe(":8000", router))
}
