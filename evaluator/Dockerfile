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
RUN apt-get -qq -y install python3-pip
COPY requirements.txt .
RUN pip3 install -r requirements.txt
ENV PYTEST_TIMEOUT=5

# Build evaluator
WORKDIR /usr/src/app

COPY go.mod .
COPY go.sum .
RUN go mod download

COPY . .
RUN go build -o evaluator cmd/app.go