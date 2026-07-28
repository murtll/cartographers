# Build stage: full Go toolchain, discarded afterwards.
FROM golang:1-alpine AS build

WORKDIR /src
COPY go.mod go.sum* ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 go build -trimpath -o /out/server ./cmd/server

# Runtime stage: only the static binary ships.
FROM alpine:3

RUN adduser -D -u 10001 app
COPY --from=build /out/server /usr/local/bin/server

USER app
EXPOSE 8080
ENTRYPOINT ["/usr/local/bin/server"]
