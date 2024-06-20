package main

import "fmt"

// Student 構造体
type Student struct {
	Name string // フィールド名を大文字で始める
}

// calAvg はデータの平均を計算します
func (s Student) calAvg(data []float64) (avgResult float64) {
	sum := 0.0
	for i := 0; i < len(data); i++ {
		sum += data[i]
	}
	avgResult = sum / float64(len(data))
	return
}

// judge は平均に基づいて合格/不合格を判断します
func (s Student) judge(avg float64) (judgeResult string) {
	if avg >= 60 {
		judgeResult = "passed"
	} else {
		judgeResult = "failed"
	}
	return
}

func main() {
	// Student インスタンスを作成
	a001 := Student{Name: "Ken"}
	data := []float64{70, 65, 50, 90, 30}

	// 平均を計算
	var avg float64 = a001.calAvg(data)
	// 合格/不合格を判断
	result := a001.judge(avg)

	// 結果を出力
	fmt.Printf("Average: %.2f\n", avg)
	fmt.Println(a001.Name + " " + result)
}
