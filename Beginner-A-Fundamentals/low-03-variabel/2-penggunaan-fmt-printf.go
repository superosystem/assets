package main

import "fmt"

func main() {
	var firstName string = "budi"

	var lastName string
	lastName = "man"

	fmt.Printf("halo budi man!\n")
	fmt.Printf("halo %s %s!\n", firstName, lastName)
	fmt.Println("halo", firstName, lastName+"!")
}
