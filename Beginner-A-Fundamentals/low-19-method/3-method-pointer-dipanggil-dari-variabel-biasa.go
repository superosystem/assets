package main

import "fmt"

type student struct {
	name  string
	grade int
}

func (s *student) sayHello() {
	fmt.Println("halo", s.name)
}

func main() {
	var s1 = student{"budi man", 21}
	s1.sayHello()

	var s2 = &student{"cecep man", 22}
	s2.sayHello()
}
