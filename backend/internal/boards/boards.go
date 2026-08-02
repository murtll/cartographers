package boards

import (
	"embed"
	"encoding/json"
	"log/slog"
)

// .  обычная клетка, рисовать можно
// M  гора      (mountain)
// R  руины     (ruins)
// C  ущелье    (chasm)

type Cell uint8

type Grid [11][11]Cell

const (
	CellPlain Cell = 0
	CellMountain Cell = 1
	CellRuins Cell = 2
	CellChasm Cell = 3
)

type Board struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Grid Grid `json:"grid"`
}

func (g *Grid) UnmarshalJSON(data []byte) error {
	var gs [11]string
	err := json.Unmarshal(data, &gs)
	if err != nil {
		return err
	}
	grid, err := parseBoard(gs)
	if err != nil {
		return err
	}
	*g = grid
	return nil
}

var boards = make(map[string]Board, 2)

//go:embed *.json
var jsonFiles embed.FS

func Load(log *slog.Logger) error {
	log.Info("loading boards")
	files, err := jsonFiles.ReadDir(".")
	if err != nil {
		log.Error("failed to read boards directory", "error", err)
		return err
	}

	for _, file := range files {
		log.Info("loading board", "name", file.Name())
		var board Board
		data, err := jsonFiles.ReadFile(file.Name())
		if err != nil {
			log.Error("failed to read board file", "error", err)
			return err
		}
		err = json.Unmarshal(data, &board)
		if err != nil {
			log.Error("failed to unmarshal board", "error", err)
			return err
		}
		boards[board.ID] = board
	}

	return nil
}

func parseBoard(gs [11]string) (Grid, error) {
	var grid Grid
	for i, row := range gs {
		for j, cell := range row {
			switch cell {
			case '.':
				grid[i][j] = CellPlain
			case 'M':
				grid[i][j] = CellMountain
			case 'R':
				grid[i][j] = CellRuins
			case 'C':
				grid[i][j] = CellChasm
			}
		}
	}
	return grid, nil
}