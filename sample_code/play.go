package main

import "fmt"

func main() {
	var perm [4]int
	var used [5]bool
	// 一つ目の数字を選ぶ
	for n1 := 1; n1 <= 4; n1++ {
		if used[n1] {
			continue
		}
		perm[0] = n1
		used[n1] = true
		// 二つ目の数字を選ぶ
		for n2 := 1; n2 <= 4; n2++ {
			if used[n2] {
				continue
			}
			perm[1] = n2
			used[n2] = true
			// 三つ目の数字を選ぶ
			for n3 := 1; n3 <= 4; n3++ {
				if used[n3] {
					continue
				}
				perm[2] = n3
				used[n3] = true
				// 四つ目の数字を選ぶ
				for n4 := 1; n4 <= 4; n4++ {
					if used[n4] {
						continue
					}
					perm[3] = n4
					used[n4] = true
					// 順列を出力
					fmt.Println(perm)
					used[n4] = false
				}
				used[n3] = false
			}
			used[n2] = false
		}
		used[n1] = false
	}
}
