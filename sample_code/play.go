package main

import "fmt"

func pow(x int, n int) int {
	v := 1
	for i := 0; i < n; i++ {
		v *= x
	}
	return v
}

func main() {
	fmt.Println(pow(2, 8))
	fmt.Println(pow(2, 16))
}
