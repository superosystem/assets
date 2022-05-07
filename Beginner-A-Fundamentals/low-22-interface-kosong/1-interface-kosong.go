package main

import "fmt"

func main() {
	var secret interface{}

	secret = "cecep man"
	fmt.Println(secret)

	secret = []string{"apple", "manggo", "banana"}
	fmt.Println(secret)

	secret = 12.4
	fmt.Println(secret)
}
