package room

import (
	"crypto/rand"
	"errors"
	"strconv"
	"strings"
	"unicode/utf8"
)


const alphabet = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"
const code_length = 6

// normalize rooms code from " abcd " to "ABCD" and checks for misstakes in code
func NormalizeCode(s string) (string, error) {
	s = strings.Trim(s, " ")
	s = strings.ToUpper(s)

	sl := utf8.RuneCountInString(s)
	if sl != code_length {
		return "", errors.New("code length is: " + strconv.Itoa(sl) + " need to be: " + strconv.Itoa(code_length))
	}

	for i, v := range s {
		if !strings.ContainsAny(alphabet, string(v)) {
			return "", errors.New("rooms code: invalid character '" + string(v) + "' in position " + strconv.Itoa(i))
		}
	}
	return s, nil
}

// generate random code "code_length" len
func NewCode() (string, error) {
	buf := make([]byte, code_length)
	if _, err := rand.Read(buf); err != nil {
		return "", err
	}

	for i, b := range buf {
		buf[i] = alphabet[b&31]
	}

	return string(buf), nil
}
