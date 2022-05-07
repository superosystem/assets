package main

import "fmt"

func main() {
	type person struct {
		name string
		age  int
	}

	var secret interface{} = &person{name: "man", age: 27}
	var name = secret.(*person).name
	fmt.Println(name)
}
