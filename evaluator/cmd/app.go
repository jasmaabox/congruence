package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jasmaa/congruence/evaluator/internal/handlers"
)

func main() {
	router := mux.NewRouter()

	router.HandleFunc("/dummy", handlers.RunDummyHandler).Methods("GET")

	router.HandleFunc("/runCode", handlers.RunCodeHandler).Methods("POST")

	fmt.Println("Starting evaluator on 8000...")
	log.Fatal(http.ListenAndServe(":8000", router))
}
