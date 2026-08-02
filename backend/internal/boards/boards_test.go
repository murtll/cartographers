package boards

import (
	"log/slog"
	"os"
	"testing"
)

func TestLoad(t *testing.T) {
	log := slog.New(slog.NewTextHandler(os.Stdout, nil))
	err := Load(log)
	if err != nil {
		t.Fatalf("Failed to load boards: %v", err)
	}
	if boards["wildlands"].Grid[1][4] != CellMountain {
		t.Fatalf("Wildlands board is not loaded correctly")
	}
	if boards["wasteland"].Grid[2][2] != CellRuins {
		t.Fatalf("Wasteland board is not loaded correctly")
	}
}