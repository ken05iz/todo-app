package main

import "fmt"

func gcd(a, b int) int {
	if b == 0 {
		return a
	} else {
		return gcd(b, a%b)
	}
}

func lcm(a, b int) int {
	return a * b / gcd(a, b)
}

func main() {
	fmt.Println(gcd(42, 30))
	fmt.Println(gcd(15, 70))
	fmt.Println(lcm(5, 7))
	fmt.Println(lcm(14, 35))
}
