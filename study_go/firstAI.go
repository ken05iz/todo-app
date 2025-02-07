package main

import (
	"fmt"
	"strconv"
)

type Task struct {
	ID      int
	Content string
	Done    bool
}

type TodoList struct {
	tasks  []Task
	nextID int
}

func NewTodoList() *TodoList {
	return &TodoList{
		tasks:  make([]Task, 0),
		nextID: 1,
	}
}

func (t *TodoList) AddTask(content string) {
	task := Task{
		ID:      t.nextID,
		Content: content,
		Done:    false,
	}
	t.tasks = append(t.tasks, task)
	t.nextID++
}

func (t *TodoList) CompleteTask(id int) bool {
	for i := range t.tasks {
		if t.tasks[i].ID == id {
			t.tasks[i].Done = true
			return true
		}
	}
	return false
}

func (t *TodoList) ListTasks() {
	if len(t.tasks) == 0 {
		fmt.Println("タスクはありません")
		return
	}

	for _, task := range t.tasks {
		status := "[ ]"
		if task.Done {
			status = "[✓]"
		}
		fmt.Printf("%s %d: %s\n", status, task.ID, task.Content)
	}
}

func main() {
	todo := NewTodoList()

	for {
		fmt.Println("\n1: タスクを追加")
		fmt.Println("2: タスクを完了")
		fmt.Println("3: タスク一覧")
		fmt.Println("4: 終了")

		var choice string
		fmt.Print("選択してください: ")
		fmt.Scanln(&choice)

		switch choice {
		case "1":
			fmt.Print("タスクを入力: ")
			var content string
			fmt.Scanln(&content)
			todo.AddTask(content)
			fmt.Println("タスクを追加しました")

		case "2":
			fmt.Print("完了するタスクのIDを入力: ")
			var id string
			fmt.Scanln(&id)
			taskID, err := strconv.Atoi(id)
			if err != nil {
				fmt.Println("無効なIDです")
				continue
			}
			if todo.CompleteTask(taskID) {
				fmt.Println("タスクを完了しました")
			} else {
				fmt.Println("タスクが見つかりません")
			}

		case "3":
			todo.ListTasks()

		case "4":
			fmt.Println("終了します")
			return

		default:
			fmt.Println("無効な選択です")
		}
	}
}
