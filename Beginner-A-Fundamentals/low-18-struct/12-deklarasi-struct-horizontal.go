package main

import "fmt"

func main() {
	type person struct {
		name    string
		age     int
		hobbies []string
	}

	var p1 = struct {
		name string
		age  int
	}{age: 22, name: "man"}
	var p2 = struct {
		name string
		age  int
	}{"cecep", 23}

	fmt.Println(p1)
	fmt.Println(p2)
}
