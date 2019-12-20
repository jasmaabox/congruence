package runner

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os/exec"
)

// RunRequest represents code submission input
type RunRequest struct {
	ID        string
	Lang      string
	ProjectID string
}

// RunResponse represents code submission output
type RunResponse struct {
	ID       string          `json:"id,omitempty"`
	Content  string          `json:"content,omitempty"`
	AllTests []string        `json:"all_tests,omitempty"`
	Scores   map[string]bool `json:"scores,omitempty"`
}

// Run runs code request
func (r *RunRequest) Run() RunResponse {
	var resp string
	var allTests []string
	var scores map[string]bool

	switch r.Lang {
	case "python":
		resp, allTests, scores = scorePython(r.ProjectID)
	default:
		resp = "Language not found"
	}

	return RunResponse{
		ID:       r.ID,
		Content:  resp,
		AllTests: allTests,
		Scores:   scores,
	}
}

// Scores python unittest
func scorePython(projectID string) (string, []string, map[string]bool) {

	// Run test
	cmd := exec.Command("pytest", "-q", "public.py")
	cmd.Dir = fmt.Sprintf("./runtime/%v", projectID)
	out, err := cmd.CombinedOutput()

	// Read test list
	allTestsJSON, err := ioutil.ReadFile(fmt.Sprintf("./runtime/%v/.pytest_cache/v/cache/nodeids", projectID))
	if err != nil {
		log.Fatal(err)
	}
	var allTests []string
	json.Unmarshal([]byte(allTestsJSON), &allTests)

	// Read scores
	failedJSON, err := ioutil.ReadFile(fmt.Sprintf("./runtime/%v/.pytest_cache/v/cache/lastfailed", projectID))
	if err != nil {
		log.Fatal(err)
	}
	var scores map[string]bool
	json.Unmarshal([]byte(failedJSON), &scores)

	for _, k := range allTests {
		if _, ok := scores[k]; ok {
			scores[k] = false
		} else {
			scores[k] = true
		}
	}

	return string(out), allTests, scores
}
