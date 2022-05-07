package main

import "fmt"

type person struct {
	name string
	age  int
}

func main() {
	var allStudents = []person{
		{name: "Budi", age: 23},
		{name: "cecep", age: 23},
		{name: "Eman", age: 22},
	}

	for _, student := range allStudents {
		fmt.Println(student.name, "age is", student.age)
	}
}
