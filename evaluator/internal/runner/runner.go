package runner

import (
	"errors"
	"fmt"
	"os/exec"
	"regexp"
	"strings"
)

// RunRequest represents code submission input
type RunRequest struct {
	ID        string
	Lang      string
	ProjectID string
}

// RunResponse represents code submission output
type RunResponse struct {
	ID      string `json:"id,omitempty"`
	Score   []bool `json:"score,omitempty"`
	Content string `json:"content,omitempty"`
}

// Run runs code request
func (r *RunRequest) Run() RunResponse {
	var resp string
	var score []bool
	switch r.Lang {
	case "python":
		resp, score = scorePython(r.ProjectID)
	default:
		resp = "Language not found"
	}

	return RunResponse{
		ID:      r.ID,
		Content: resp,
		Score:   score,
	}
}

// Parse score array from test results
func parseScore(result string) ([]bool, error) {
	re := regexp.MustCompile(`^(F|\.)+$`)
	if re.MatchString(result) {
		q := re.FindString(result)
		score := make([]bool, len(q))
		for i, c := range q {
			score[i] = c == '.'
		}

		return score, nil
	}

	return nil, errors.New("Could not parse score")
}

// Scores python unittest
func scorePython(projectID string) (string, []bool) {

	// Run unittest
	cmd := exec.Command("python3", fmt.Sprintf("./runtime/%v/public.py", projectID))
	out, _ := cmd.CombinedOutput()

	// Parse score
	q := string(out)
	lines := strings.Split(q, "\n")
	score, err := parseScore(lines[0])
	if err != nil {
		return "Error", nil
	}

	return q, score
}
