// app/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

interface Todo {
  id: string
  title: string
  category: string
  description: string
  completed: boolean
  created_at: string
  due_date: string
}

interface Category {
  id: string
  name: string
  color: string
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "仕事", color: "#FF4444" },
    { id: "2", name: "個人", color: "#44FF44" },
    { id: "3", name: "買い物", color: "#4444FF" }
  ])
  const [newTodo, setNewTodo] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchTodos()
    fetchCategories()
  }, [])

  const fetchTodos = async () => {
    const response = await fetch('http://localhost:8080/api/todos')
    const data = await response.json()
    console.log(data)
    setTodos(data)
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/categories')
      const data = await response.json()
      if (data && data.length > 0) {
        setCategories(data)
      }
    } catch (error) {
      console.error("カテゴリーの取得に失敗:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    const todoData = {
      title: newTodo,
      category: selectedCategory,
      description: description,
      completed: false,
      due_date: dueDate ? new Date(dueDate).toISOString() : new Date().toISOString(),
    }

    if (editingTodo) {
      // 更新処理
      const response = await fetch(`http://localhost:8080/api/todos/${editingTodo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
      })

      const updatedTodo = await response.json()
      setTodos(todos.map(t => t.id === editingTodo.id ? updatedTodo : t))
    } else {
      // 新規作成処理
      const response = await fetch('http://localhost:8080/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
      })

      const data = await response.json()
      setTodos([...todos, data])
    }

    // フォームをリセット
    setNewTodo('')
    setSelectedCategory('')
    setDescription('')
    setDueDate('')
    setEditingTodo(null)
    setIsModalOpen(false)
  }

  const toggleTodo = async (todo: Todo) => {
    const response = await fetch(`http://localhost:8080/api/todos/${todo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...todo,
        completed: !todo.completed,
      }),
    })

    const updatedTodo = await response.json()
    setTodos(todos.map(t => t.id === todo.id ? updatedTodo : t))
  }

  const deleteTodo = async (id: string) => {
    console.log("deleteTodo1")
    await fetch(`http://localhost:8080/api/todos/${id}`, {
      method: 'DELETE',
    })

    console.log("deleteTodo")

    setTodos(todos.filter(todo => todo.id !== id))
  }

  const startEditing = (todo: Todo) => {
    setEditingTodo(todo)
    setNewTodo(todo.title)
    setSelectedCategory(todo.category)
    setDescription(todo.description)
    const date = new Date(todo.due_date)
    const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)
    setDueDate(localDateTime)
    setIsModalOpen(true)
  }

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.color || '#CCCCCC'
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Todo App</h1>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-8 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          新しいタスクを追加
        </button>

        {/* モーダル */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">
                {editingTodo ? 'タスクを編集' : '新しいタスク'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">タイトル</label>
                  <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    className="w-full px-4 py-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">カテゴリー</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border rounded"
                    required
                  >
                    <option value="">カテゴリーを選択...</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">説明</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border rounded"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">締切日時</label>
                  <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-2 border rounded"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false)
                      setEditingTodo(null)
                      setNewTodo('')
                      setSelectedCategory('')
                      setDescription('')
                      setDueDate('')
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    {editingTodo ? '更新' : '追加'}
                  </button>
                </div>
              </form>
            </div>
          </div>

        )}

        {/* ToDo一覧 */}
        <div className="space-y-4">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo)}
                    className="w-5 h-5"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getCategoryColor(todo.category) }}
                      />
                      <span className={todo.completed ? 'line-through text-gray-500' : 'font-medium'}>
                        {todo.title}
                      </span>
                    </div>
                    {todo.description && (
                      <p className="text-sm text-gray-600 mt-1">{todo.description}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      期限: {format(new Date(todo.due_date), 'yyyy/MM/dd HH:mm', { locale: ja })}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEditing(todo)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  編集
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}