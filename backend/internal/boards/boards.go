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
	ID   string
	Name string
	Grid Grid
}

// временная структура что бы корректо загрузить Grid
type tempBoard struct {
	ID   string   `json:"id"`
	Name string   `json:"name"`
	Grid []string `json:"grid"`
}

var boards = make(map[string]Board, 2)

//go:embed *.json
var jsonFiles embed.FS

// TODO: передавать filename и читать по filename
// TODO: добавлять board в map(boards)
// TODO: добавить проверку на fileame == board.ID
func Load(filename string) error {
	var tempboard tempBoard

	data, err := jsonFiles.ReadFile("wildlands.json")
	if err != nil {
		return errors.New("failed to open json file: " + err.Error())
	}

	if err := json.Unmarshal(data, &tempboard); err != nil {
		return err
	}

	return nil
}

// TODO: проходит циклом по всем файлам json и вызывать Load()
func LoadAll() error {
	return nil
}

func parseBoard(tempboard tempBoard) (Board, error) {
	board := Board{
		ID:   tempboard.ID,
		Name: tempboard.Name,
	}

	if len(tempboard.Grid) != 11 {
		return board, errors.New("board loaded incorrect, incorrect number of rows")
	}

	for x, i := range tempboard.Grid {
		if utf8.RuneCountInString(i) != 11 {
			return board, errors.New("board loaded incorrect, incorrect number of symbols")
		}
		for y, j := range i {
			switch {
			case j == '.':
				board.Grid[x][y] = CellPlain
			case j == 'M':
				board.Grid[x][y] = CellMountain
			case j == 'R':
				board.Grid[x][y] = CellRuins
			case j == 'C':
				board.Grid[x][y] = CellChasm
			default:
				return board, errors.New(board.ID + ".json:" + " row " + strconv.Itoa(x) + " symbol " + strconv.Itoa(y) + " : unknown symbol " + string(j))
			}
		}
	}
	return board, nil
}
