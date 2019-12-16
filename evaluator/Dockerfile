FROM golang:alpine

WORKDIR /app

ENV SRC_DIR=/go/src/github.com/jasmaa/submit-server/evaluator
ADD . $SRC_DIR
RUN cd $SRC_DIR; go build -o evaluator cmd/app.go; cp evaluator /app/