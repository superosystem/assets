package main

import "fmt"

type student struct {
	name  string
	grade int
}

func main() {
	var s1 = student{}
	s1.name = "man"
	s1.grade = 2

	var s2 = student{"cecep", 2}

	var s3 = student{name: "eman"}

	fmt.Println("student 1 :", s1.name)
	fmt.Println("student 2 :", s2.name)
	fmt.Println("student 3 :", s3.name)
}
