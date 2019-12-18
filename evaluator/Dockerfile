FROM ubuntu:18.04

RUN apt-get update
RUN apt-get -qq -y install wget

# Install Go
RUN wget https://dl.google.com/go/go1.13.3.linux-amd64.tar.gz
RUN tar -xvf go1.13.3.linux-amd64.tar.gz
RUN mv go /usr/local
ENV GOPATH=/go
ENV PATH=$GOPATH/bin:/usr/local/go/bin:$PATH

# Install Python 3
RUN apt-get -qq -y install python3

# Build evaluator
WORKDIR /app
ENV SRC_DIR=/go/src/github.com/jasmaa/submit-server/evaluator
ADD . $SRC_DIR
RUN cd $SRC_DIR; go build -o evaluator cmd/app.go; cp evaluator /app/

# TEMP: Copy dummy project for now
COPY runtime /app/runtime