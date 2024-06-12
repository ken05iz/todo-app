package main

import "fmt"

type User struct {
	gender string
	age    float64
}

func main() {
	/*var u User

	u.gender = "male"
	u.age = 20 */
	u := User{gender: "male", age: 20}

	fmt.Println(u)
}
