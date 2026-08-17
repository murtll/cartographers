package room_test

import (
	"testing"

	"github.com/murtll/cartographers/backend/internal/room"
)

func TestCode(t *testing.T) {
	s1 := "FGH56T"
	expected_s1 := "FGH56T"

	s2 := " Ghjt76 "
	expected_s2 := "GHJT76"

	s3 := "GHH"
	expected_s3 := ""

	s4 := "FGH56Т"
	expected_s4 := ""

	actual, err := room.NormalizeCode(s1)
	if err != nil {
		t.Errorf("Should not produce an error")
	}
	if expected_s1 != actual {
		t.Errorf("Result was incorrect, got: %s, expected %s", actual, expected_s1)
	}

	actual, err = room.NormalizeCode(s2)
	if err != nil {
		t.Errorf("Should not produce an error")
	}
	if expected_s2 != actual {
		t.Errorf("Result was incorrect, got: %s, expected %s", actual, expected_s2)
	}

	actual, err = room.NormalizeCode(s3)
	if err == nil {
		t.Errorf("Should not produce an error")
	}
	if expected_s3 != actual {
		t.Errorf("Result was incorrect, got: %s, expected %s", actual, expected_s3)
	}

	actual, err = room.NormalizeCode(s4)
	if err == nil {
		t.Errorf("Should not produce an error")
	}
	if expected_s4 != actual {
		t.Errorf("Result was incorrect, got: %s, expected %s", actual, expected_s4)
	}

	if new_actual, err := room.NewCode(); err == nil {
		t.Log("code:", new_actual)
		if normalise_actual, err := room.NormalizeCode(new_actual); err != nil {
			t.Errorf("Should not produce an error")
		} else if normalise_actual != new_actual {
			t.Errorf("Result was incorrect, got: %s, expected %s", actual, expected_s3)
		}
	}

	if new_actual, err := room.NewCode(); err == nil {
		t.Log("code:", new_actual)
		if normalise_actual, err := room.NormalizeCode(new_actual); err != nil {
			t.Errorf("Should not produce an error")
		} else if normalise_actual != new_actual {
			t.Errorf("Result was incorrect, got: %s, expected %s", actual, expected_s3)
		}
	}

	if new_actual, err := room.NewCode(); err == nil {
		t.Log("code:", new_actual)
		if normalise_actual, err := room.NormalizeCode(new_actual); err != nil {
			t.Errorf("Should not produce an error")
		} else if normalise_actual != new_actual {
			t.Errorf("Result was incorrect, got: %s, expected %s", actual, expected_s3)
		}
	}
}
