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
	data := []byte(`{
  "id": "testboard",
  "name": "TestBoard",
  "grid": [
    "......R.M..",
    "..RM.......",
    ".....C.....",
    "....CCR....",
    "....CCC....",
    ".R...C.....",
    "........R..",
    ".........M.",
    "..MR.......",
    "..........."
  ]
}`)

	if _, err := parseBoardData(data, "TestBoard"); !strings.Contains(err.Error(), "incorrect number of rows") {
		t.Errorf("should produse an error")
	}
}

func TestSymbolsLength(t *testing.T) {
	data := []byte(`{
  "id": "testboard",
  "name": "TestBoard",
  "grid": [
  	"............",
    "......R.M..",
    "..RM.......",
    ".....C.....",
    "....CCR....",
    "....CCC....",
    ".R...C.....",
    "........R..",
    ".........M.",
    "..MR.......",
    "..........."
  ]
}`)

	if _, err := parseBoardData(data, "TestBoard"); !strings.Contains(err.Error(), "incorrect number of symbols") {
		t.Errorf("should produse an error")
	}
}

func TestUnknownSymbol(t *testing.T) {
	data := []byte(`{
  "id": "testboard",
  "name": "TestBoard",
  "grid": [
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
    "..........."
  ]
}`)

	if _, err := parseBoardData(data, "TestBoard"); !strings.Contains(err.Error(), "unknown symbol") {
		t.Errorf("should produse an error")
	}
}

func TestUnmatchedID(t *testing.T) {
	data := []byte(`{
  "id": "test",
  "name": "TestBoard",
  "grid": [
  	"...........",
    "......R.M..",
    "..RM.......",
    ".....C.....",
    "....CCR....",
    "....CCC....",
    ".R...C.....",
    "........R..",
    ".........M.",
    "..MR.......",
    "..........."
  ]
}`)

	if _, err := parseBoardData(data, "TestBoard"); !strings.Contains(err.Error(), "file name does not match its ID") {
		t.Errorf("should produse an error")
	}
}
