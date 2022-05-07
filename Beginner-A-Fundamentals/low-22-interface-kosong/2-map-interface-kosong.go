package main

import "fmt"

func main() {
	var data map[string]interface{}

	data = map[string]interface{}{
		"name":      "cecep man",
		"grade":     2,
		"breakfast": []string{"apple", "manggo", "banana"},
	}

	fmt.Println(data)
}
