package boards

import (
	"embed"
	"encoding/json"
	"errors"
	"strconv"
	"unicode/utf8"
)

type Cell uint8

const (
	CellPlain    Cell = 0 // рисовать можно
	CellMountain Cell = 1 // нельзя, но даёт монету когда окружена
	CellRuins    Cell = 2 // рисовать можно; до этого считается незаполненной
	CellChasm    Cell = 3 // нельзя, только на стороне Б
)

type Grid [11][11]Cell // [строка][столбец], с нуля, строка 0 — верхняя

type Board struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Grid Grid   `json:"grid"`
}

// мапа для сохранения распаршенных board
var boards = make(map[string]Board, 2)

//go:embed *.json
var jsonFiles embed.FS

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

func Load(filename string) error {
	var tempBoard Board
	data, err := jsonFiles.ReadFile(filename)
	if err != nil {
		return errors.New("failed to open json file: " + err.Error())
	}

	if err := json.Unmarshal(data, &tempBoard); err != nil {
		return errors.New(filename + ": " + err.Error())
	}

	if filename != tempBoard.ID {
		return errors.New("File name does not match with his ID")
	}

	boards[tempBoard.ID] = tempBoard

	return nil
}

func LoadAll() error {
	files, err := jsonFiles.ReadDir(".")
	if err != nil {
		return err
	}

	for _, file := range files {
		if err := Load(file.Name()); err != nil {
			return err
		}
	}

	return nil
}

func parseBoard(gs [11]string) (Grid, error) {
	var grid Grid

	if len(gs) != 11 {
		return grid, errors.New("board loaded incorrect, incorrect number of rows")
	}

	for x, i := range gs {
		if utf8.RuneCountInString(i) != 11 {
			return grid, errors.New("board loaded incorrect, incorrect number of symbols")
		}
		for y, j := range i {
			switch {
			case j == '.':
				grid[x][y] = CellPlain
			case j == 'M':
				grid[x][y] = CellMountain
			case j == 'R':
				grid[x][y] = CellRuins
			case j == 'C':
				grid[x][y] = CellChasm
			default:
				return grid, errors.New("row " + strconv.Itoa(x) + " symbol " + strconv.Itoa(y) + " : unknown symbol " + string(j))
			}
		}
	}
	return grid, nil
}
