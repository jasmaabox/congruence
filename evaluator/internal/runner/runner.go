package runner

import (
	"fmt"
	"os/exec"
)

// RunRequest represents code submission input
type RunRequest struct {
	ID      string
	Lang    string
	Content string
}

// RunResponse represents code submission output
type RunResponse struct {
	Content string `json:"content,omitempty"`
}

// Run runs code request
func (r *RunRequest) Run() RunResponse {
	var resp string
	switch r.Lang {
	case "python":
		resp = ExecutePython(r.Content)
	default:
		resp = "Language not found"
	}

	return RunResponse{
		Content: resp,
	}
}

// ExecutePython executes arbitrary Python code for now
// TMP
func ExecutePython(content string) string {
	cmd := exec.Command("python", "-c", content)
	fmt.Println(cmd.Args)
	out, err := cmd.CombinedOutput()
	if err != nil {
		return "Error"
	}
	return string(out)
}
