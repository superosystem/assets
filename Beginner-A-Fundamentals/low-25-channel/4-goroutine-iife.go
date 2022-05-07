package main

import (
	"fmt"
	"runtime"
)

func main() {
	runtime.GOMAXPROCS(2)
	var messages = make(chan string)

	go func(who string) {
		var data = fmt.Sprintf("hello %s", who)
		messages <- data
	}("man")

	var message = <-messages
	fmt.Println(message)
}
