-include ../.env
export

dev:
	air

migrate-up:
	migrate -path migrations -database ${DATABASE_URL} up

migrate-down:
	migrate -path migrations -database ${DATABASE_URL} down

test:
	go test -race ./...

fmt:
	gofmt -s -d -e .

vet:
	go vet ./...

full-check: fmt vet test
