include ../.env
export

dev:
	air

migrate-up:
	migrate -path migrations -database ${DATABASE_URL} up

migrate-down:
	migrate -path migrations -database ${DATABASE_URL} down

test: 
	go test ./...

full-check:
	test -z "$$(gofmt -l .)" && go vet ./... && go test -race ./...
