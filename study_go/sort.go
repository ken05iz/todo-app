package main

import "fmt"

func insertSort(ary []int) {
	for i := 1; i < len(ary); i++ {
		tmp := ary[i]
		j := i - 1
		for ; j >= 0 && tmp < ary[j]; j-- {
			ary[j+1] = ary[j]
		}
		ary[j+1] = tmp
	}
}

func main() {
	a := []int{5, 6, 4, 7, 3, 8, 9, 1, 0}
	b := []int{1, 0, 6, 5, 4, 2, 8, 9, 3}

	insertSort(a)
	insertSort(b)

	fmt.Println(a)
	fmt.Println(b)
}
