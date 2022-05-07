package main

import "fmt"

type person struct {
	name string
	age  int
}

func main() {
	var allStudents = []struct {
		person
		grade int
	}{
		{person: person{"budi", 21}, grade: 2},
		{person: person{"cecep", 22}, grade: 3},
		{person: person{"eman", 21}, grade: 3},
	}

	for _, student := range allStudents {
		fmt.Println(student)
	}
}
