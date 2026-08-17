package room_test

import (
	"testing"

	"github.com/murtll/cartographers/backend/internal/room"
)

func TestNormalizationCode(t *testing.T) {
	tests := map[string]string{
		"FGH56T":   "FGH56T", // must been converted
		" Ghjt76 ": "GHJT76", // must been converted
		"GHH":      "",       // must been drop with error
		"FGH56Т":   "",       // must been drop with error
	}

	for k, v := range tests {
		actual, err := room.NormalizeCode(k)
		if v == "" {
			if err == nil {
				t.Errorf("should produce an error")
			}
		} else {
			if err != nil {
				t.Errorf("should not produce an error")
			}
		}
		if v != actual {
			t.Errorf("result was incorrect, got: %s, expected %s", actual, v)
		}
	}
}

func TestNewCode(t *testing.T) {
	tests := make(map[string]string)
	for i := 1; i <= 3; i++ {
		if actual, err := room.NewCode(); err == nil {
			if _, ok := tests[actual]; !ok {
				tests[actual] = ""
			} else {
				t.Errorf("the room codes are repeated")
			}
			if normalise_actual, err := room.NormalizeCode(actual); err != nil {
				t.Errorf("should not produce an error")
			} else if normalise_actual != actual {
				t.Errorf("result was incorrect, got: %s, expected %s", actual, normalise_actual)
			}
		}
	}
}
