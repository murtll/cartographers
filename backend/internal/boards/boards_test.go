package boards

import (
	"strings"
	"testing"
)

func TestDefault(t *testing.T) {
	if err := Load("wasteland.json"); err != nil {
		t.Errorf("should not produse an error")
	}

	if err := Load("wildlands.json"); err != nil {
		t.Errorf("should not produse an error")
	}
}

func TestBoardsLength(t *testing.T) {
	data := []string{
		"......R.M..", // 1
		"..RM.......", // 2
		".....C.....", // 3
		"....CCR....", // 4
		"....CCC....", // 5
		".R...C.....", // 6
		"........R..", // 7
		".........M.", // 8
		"..MR.......", // 9
		"...........", // 10
	}

	if _, err := parseBoard(data); err == nil || !strings.Contains(err.Error(), "incorrect number of rows 10") {
		t.Errorf("should produse an error")
	}

	data = []string{
		"......R.M..", // 1
		"..RM.......", // 2
		".....C.....", // 3
		"....CCR....", // 4
		"....CCC....", // 5
		".R...C.....", // 6
		"........R..", // 7
		".........M.", // 8
		"..MR.......", // 9
		"...........", // 10
		"...........", // 11
		"...........", // 12
	}

	if _, err := parseBoard(data); err == nil || !strings.Contains(err.Error(), "incorrect number of rows 12") {
		t.Errorf("should produse an error")
	}
}

func TestSymbolsLength(t *testing.T) {
	data := []string{
		"............", // 12 symbols
		"......R.M..",
		"..RM.......",
		".....C.....",
		"....CCR....",
		"....CCC....",
		".R...C.....",
		"........R..",
		".........M.",
		"..MR.......",
		"...........",
	}

	if _, err := parseBoard(data); err == nil || !strings.Contains(err.Error(), "incorrect number of symbols 12") {
		t.Errorf("should produse an error")
	}

	data = []string{
		"..........", // 10 symbols
		"......R.M..",
		"..RM.......",
		".....C.....",
		"....CCR....",
		"....CCC....",
		".R...C.....",
		"........R..",
		".........M.",
		"..MR.......",
		"...........",
	}

	if _, err := parseBoard(data); err == nil || !strings.Contains(err.Error(), "incorrect number of symbols 10") {
		t.Errorf("should produse an error")
	}
}

func TestUnknownSymbol(t *testing.T) {
	data := []string{
		"...........",
		"......R.M..",
		"..RM.......",
		".....C...Д.",
		"....CCR....",
		"....CCC....",
		".R...C.....",
		"........R..",
		".........M.",
		"..MR.......",
		"...........",
	}

	if _, err := parseBoard(data); err == nil || !strings.Contains(err.Error(), "unknown symbol") {
		t.Errorf("should produse an error")
	}
}
