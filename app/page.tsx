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
  const [categories, setCategories] = useState<Category[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const todosRes = await fetch('http://localhost:8080/api/todos')
        const todosData = await todosRes.json()
        setTodos(todosData || [])

        const categoriesRes = await fetch('http://localhost:8080/api/categories')
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData || [])
      } catch (error) {
        console.error('Error:', error)
        setTodos([])
        setCategories([])
      }
    }

    fetchData()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/todos')
      const data = await response.json()
      setTodos(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching todos:', error)
      setTodos([])
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/categories')
      const data = await response.json()
      setCategories(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
    }
  }

  if (!todos) return <div>Loading...</div>

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

        {/* ToDo一覧 */}
        <div className="space-y-4">
          {todos && todos.length > 0 ? (
            todos.map((todo) => (
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
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">タスクがありません</p>
          )}
        </div>

        {/* ... rest of the component ... */}
      </div>
    </main>
  )
} 