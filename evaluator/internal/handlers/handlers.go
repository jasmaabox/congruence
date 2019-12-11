package handlers

import (
	"encoding/json"
	"net/http"
)

type dummy struct {
	Foo string `json:"foo,omitempty"`
	Bar string `json:"bar,omitempty"`
}

func GetDummy(w http.ResponseWriter, req *http.Request) {
	//test := [5]int{1, 2, 3, 4, 5}
	d := dummy{"foo", "bar"}
	json.NewEncoder(w).Encode(&d)
}
