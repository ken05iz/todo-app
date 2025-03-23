package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// Todoの属性を定義
type Todo struct {
	ID          string    `json:"id" gorm:"primaryKey"`
	Title       string    `json:"title"`
	Category    string    `json:"category"`
	Completed   bool      `json:"completed"`
	CreatedAt   time.Time `json:"created_at"`
	DueDate     time.Time `json:"due_date"`
	Description string    `json:"description"`
}

// カテゴリーを定義
type Category struct {
	ID    string `json:"id" gorm:"primaryKey"`
	Name  string `json:"name"`
	Color string `json:"color"`
}

var db *gorm.DB

func main() {
	var err error
	// SQLite の todos.db というファイルを使ってデータベースに接続
	db, err = gorm.Open(sqlite.Open("todos.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("データベース接続エラー: ", err)
	}

	// モデルに基づいてテーブルを自動マイグレーション
	db.AutoMigrate(&Todo{}, &Category{})

	// 初期カテゴリーを登録（既に存在する場合はスキップ）
	initCategories()

	r := mux.NewRouter()

	// Todo 関連のエンドポイント
	r.HandleFunc("/api/todos", getTodos).Methods("GET")
	r.HandleFunc("/api/todos", createTodo).Methods("POST", "OPTIONS")
	r.HandleFunc("/api/todos/{id}", updateTodo).Methods("PUT")
	r.HandleFunc("/api/todos/{id}", deleteTodo).Methods("DELETE")

	// カテゴリー関連のエンドポイント
	r.HandleFunc("/api/categories", getCategories).Methods("GET")
	r.HandleFunc("/api/categories", createCategory).Methods("POST")

	log.Printf("Server starting on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", r))
}

// initCategories は、初期カテゴリー（ここでは「個人」と「プライベート」）を追加します。
func initCategories() {
	categories := []Category{
		{ID: "1", Name: "個人", Color: "#44FF44"},
		{ID: "2", Name: "プライベート", Color: "#FF88AA"},
	}
	for _, cat := range categories {
		var existing Category
		// ID で検索し、存在しなければ作成
		if err := db.First(&existing, "id = ?", cat.ID).Error; err != nil {
			db.Create(&cat)
		}
	}
}

func getTodos(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var todos []Todo
	db.Find(&todos)
	json.NewEncoder(w).Encode(todos)
}

func createTodo(w http.ResponseWriter, r *http.Request) {
	var todo Todo
	// リクエストボディをパース
	if err := json.NewDecoder(r.Body).Decode(&todo); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// 一意の ID と作成日時を設定
	todo.ID = time.Now().Format("20060102150405")
	todo.CreatedAt = time.Now()
	if todo.DueDate.IsZero() {
		todo.DueDate = time.Now()
	}

	db.Create(&todo)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todo)
}

func updateTodo(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	var updatedTodo Todo
	if err := json.NewDecoder(r.Body).Decode(&updatedTodo); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var todo Todo
	if err := db.First(&todo, "id = ?", params["id"]).Error; err != nil {
		http.Error(w, "Todo not found", http.StatusNotFound)
		return
	}

	// ID と作成日時は元のものを維持
	updatedTodo.ID = todo.ID
	updatedTodo.CreatedAt = todo.CreatedAt
	db.Model(&todo).Updates(updatedTodo)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(updatedTodo)
}

func deleteTodo(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	db.Delete(&Todo{}, "id = ?", params["id"])
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Todo deleted"})
}

func getCategories(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var categories []Category
	db.Find(&categories)
	json.NewEncoder(w).Encode(categories)
}

func createCategory(w http.ResponseWriter, r *http.Request) {
	var category Category
	if err := json.NewDecoder(r.Body).Decode(&category); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	category.ID = time.Now().Format("20060102150405")
	db.Create(&category)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(category)
}
