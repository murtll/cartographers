package api

type ErrorResponse struct {
	Message string `json:"message"`
	Error   bool   `json:"error"`
}

func NewErrorRessponse(message error) ErrorResponse {
	return ErrorResponse{
		Message: message.Error(),
		Error:   true,
	}
}

type Move struct {
	X   int    `json:"x"`
	Y   int    `json:"y"`
	Val string `json:"val"`
}
