package main

import (
	"fmt"
)

func main() {
	var primeTable [100]int
	primeTable[0] = 2
	primeSize := 1
	for n := 3; n < len(primeTable); n += 2 {
		isPrime := true
		for i := 1; i < primeSize; i++ {
			p := primeTable[i]
			if p*p > n {
				break
			}
			if n%p == 0 {
				isPrime = false
			}
		}
		if isPrime {
			primeTable[primeSize] = n
			primeSize++
		}
	}
	for i := 0; i < primeSize; i++ {
		fmt.Print(primeTable[i], " ")
	}
	fmt.Print("\n")
}
