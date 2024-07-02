package main

import (
	"fmt"
)

func cal(x, y int) (a int, b int) {
	a = x + y
	b = x * y
	return a, b
}

func main() {
	result1, result2 := cal(10, 5)

	fmt.Println(result1)
	fmt.Println(result2)
}
