package main

import (
	"fmt"
)

func cal(x, y int) (a int) {
	a = x + y
	return
}

func main() {
	result := cal(10, 5)
	fmt.Println(result)
}
