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
	CellChasm    Cell = 3 // нельзя; есть не на всех планшетах
)

const (
	BoardSize = 11
)

type Grid [BoardSize][BoardSize]Cell // [строка][столбец], с нуля, строка 0 — верхняя

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
	var gs []string
	err := json.Unmarshal(data, &gs)
	if err != nil {
		return err
	}

	if len(gs) != BoardSize {
		return errors.New("board loaded incorrect, incorrect number of rows " + strconv.Itoa(len(gs)))
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

	if filename != tempBoard.ID+".json" {
		return errors.New("file name does not match its ID: filename = " + filename + ", board.ID = " + tempBoard.ID)
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

func parseBoard(gs []string) (Grid, error) {
	var grid Grid

	for x, i := range gs {
		if sl := utf8.RuneCountInString(i); sl != BoardSize {
			return grid, errors.New("board loaded incorrect, incorrect number of symbols " + strconv.Itoa(sl) + " in row: " + strconv.Itoa(x))
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

func GetBoard(id string) (Board, error) {
	board, ok := boards[id]
	if ok {
		return board, nil
	}
	return board, errors.New("unknown boards ID")
}
