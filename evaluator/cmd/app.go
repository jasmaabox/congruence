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

	router.HandleFunc("/dummy", handlers.GetDummy).Methods("GET")

	fmt.Println("Starting server...")
	log.Fatal(http.ListenAndServe(":12345", router))
}
