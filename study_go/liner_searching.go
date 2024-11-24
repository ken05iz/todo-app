package main

import "fmt"

// nの位置を求める
func find(n int, ary []int) bool {
	for _, v := range ary {
		if n == v {
			return true
		}
	}
	return false
}

// nの位置を決める
func position(n int, ary []int) int {
	for i, v := range ary {
		if n == v {
			return i
		}
	}
	return -1
}

// nの個数を決める
func count(n int, ary []int) int {
	c := 0
	for _, v := range ary {
		if n == v {
			c++
		}
	}
	return c
}

func main() {
	a := []int{1, 2, 3, 1, 2, 3, 4, 5}
	fmt.Println(find(4, a))
	fmt.Println(find(6, a))
	fmt.Println(position(7, a))
	fmt.Println(position(5, a))
	fmt.Println(count(3, a))
	fmt.Println(count(8, a))
}
