// main.go
package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

type Todo struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Category    string    `json:"category"`
	Completed   bool      `json:"completed"`
	CreatedAt   time.Time `json:"created_at"`
	DueDate     time.Time `json:"due_date"`
	Description string    `json:"description"`
}

type Category struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Color string `json:"color"`
}

var todos = []Todo{
	{ID: "1", Title: "タスク1", Category: "仕事", Completed: false, CreatedAt: time.Now(), DueDate: time.Now(), Description: "タスク1の説明"},
	{ID: "2", Title: "タスク2", Category: "個人", Completed: false, CreatedAt: time.Now(), DueDate: time.Now(), Description: "タスク2の説明"},
	{ID: "3", Title: "タスク3", Category: "買い物", Completed: false, CreatedAt: time.Now(), DueDate: time.Now(), Description: "タスク3の説明"},
}
var categories []Category

func enableCORS(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Method", "GET, POST, PUT, DELETE, OPTUINS")
	w.Header().Set("Acsess-Control-Allow-Headers", "Content-Type, Authorization")
}

func handlePreflight(w http.ResponseWriter, r *http.Request) {
	enableCORS(w, r)
	w.WriteHeader(http.StatusOK)
}

func main() {
	// デフォルトカテゴリーの初期化
	categories = []Category{
		{ID: "1", Name: "仕事", Color: "#FF4444"},
		{ID: "2", Name: "個人", Color: "#44FF44"},
		{ID: "3", Name: "買い物", Color: "#4444FF"},
	}

	r := mux.NewRouter()

	r.HandleFunc("/api/todos/{id}", deleteTodo).Methods("DELETE", "OPTIONS")

	// CORSミドルウェア設定
	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*") // より緩和的な設定
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}

			next.ServeHTTP(w, r)
		})
	})

	// Todo関連のエンドポイント
	r.HandleFunc("/api/todos", getTodos).Methods("GET")
	r.HandleFunc("/api/todos", createTodo).Methods("POST")
	r.HandleFunc("/api/todos/{id}", updateTodo).Methods("PUT")
	r.HandleFunc("/api/todos/{id}", deleteTodo).Methods("DELETE")

	// カテゴリー関連のエンドポイント
	r.HandleFunc("/api/categories", getCategories).Methods("GET")
	r.HandleFunc("/api/categories", createCategory).Methods("POST")

	log.Printf("Server starting on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", r))
}

func getTodos(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todos)
}

func createTodo(w http.ResponseWriter, r *http.Request) {
	var todo Todo
	// リクエストボディをデコード
	if err := json.NewDecoder(r.Body).Decode(&todo); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	todo.ID = time.Now().Format("20060102150405")
	todo.CreatedAt = time.Now()

	// DueDateの変換
	if todo.DueDate.IsZero() {
		todo.DueDate = time.Now() // デフォルト値を設定
	}

	todos = append(todos, todo)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(todo)
}

func updateTodo(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	var updatedTodo Todo
	json.NewDecoder(r.Body).Decode(&updatedTodo)

	for i, todo := range todos {
		if todo.ID == params["id"] {
			updatedTodo.ID = todo.ID
			updatedTodo.CreatedAt = todo.CreatedAt
			todos[i] = updatedTodo
			break
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(updatedTodo)
}

func deleteTodo(w http.ResponseWriter, r *http.Request) {
	enableCORS(w, r)
	if r.Method == "OPTIONS" {
		handlePreflight(w, r)
		return
	}
	params := mux.Vars(r)

	for i, todo := range todos {
		if todo.ID == params["id"] {
			todos = append(todos[:i], todos[i+1:]...)
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]string{"message": "Todo delete"})
			return
		}
	}
	http.Error(w, "Todo not found", http.StatusNotFound)
}

func getCategories(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(categories)
}

func createCategory(w http.ResponseWriter, r *http.Request) {
	var category Category
	json.NewDecoder(r.Body).Decode(&category)

	category.ID = time.Now().Format("20060102150405")
	categories = append(categories, category)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(category)
}
