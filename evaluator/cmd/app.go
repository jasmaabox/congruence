package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jasmaa/submit-server/evaluator/internal/handlers"
)

func main() {
	router := mux.NewRouter()

	router.HandleFunc("/dummy", handlers.RunDummyHandler).Methods("GET")
	router.HandleFunc("/runCode", handlers.RunCodeHandler).Methods("POST")

	fmt.Println("Starting server at 8000...")
	log.Fatal(http.ListenAndServe(":8000", router))
}
