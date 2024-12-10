package main

import "fmt"

func quicksort(low, high int, buff []int) {
	pivot := buff[low+(high-low)/2]
	i, j := low, high
	for {
		for pivot > buff[i] {
			i++
		}
		for pivot < buff[j] {
			j--
		}
		if i >= j {
			break
		}
		buff[i], buff[j] = buff[j], buff[i]
		i++
		j--
	}
	if low < i-1 {
		quicksort(low, i-1, buff)
	}
	if high > j+1 {
		quicksort(j+1, high, buff)
	}
}

func main() {
	a := []int{5, 6, 4, 7, 3, 8, 2, 9, 1, 0}
	quicksort(0, 9, a)
	fmt.Println(a)
}
