'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

// Todo の型定義
interface Todo {
  id: string
  title: string
  category: string
  description: string
  completed: boolean
  created_at: string
  due_date: string
  status: "進行中" | "待ち" | "対応完了"
}

// Category の型定義
interface Category {
  id: string
  name: string
  color: string
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetchTodos()
    fetchCategories()
  }, [])

  // タスク一覧を取得
  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/todos')
      if (!response.ok) {
        throw new Error(`Error fetching todos: ${response.statusText}`)
      }
      const data = await response.json()
      setTodos(data)
    } catch (error) {
      console.error(error)
    }
  }

  // カテゴリー一覧を取得
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/categories')
      if (!response.ok) {
        throw new Error(`Error fetching categories: ${response.statusText}`)
      }
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error(error)
    }
  }

  // タスクの完了/未完了を切り替える
  const toggleTodo = async (todo: Todo) => {
    try {
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
      if (!response.ok) {
        throw new Error(`Error updating todo: ${response.statusText}`)
      }
      const updatedTodo = await response.json()
      setTodos(todos.map(t => t.id === todo.id ? updatedTodo : t))
    } catch (error) {
      console.error(error)
    }
  }

  // タスクを削除
  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/todos/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error(`Error deleting todo: ${response.statusText}`)
      }
      setTodos(todos.filter(todo => todo.id !== id))
    } catch (error) {
      console.error(error)
    }
  }

  // カテゴリーIDから色を取得
  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.color || '#CCCCCC'
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー部分 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">タスク管理</h1>
          {/* ここで <Link> の中に <a> を入れない書き方に変更 */}
          <Link
            href="/create-task"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            タスクを作成
          </Link>
        </div>

        {/* Kanban ボード形式の ToDo一覧 */}
        <div className="flex space-x-4">
          {/* 「進行中」列 */}
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-4">進行中</h2>
            {todos
              .filter(todo => todo.status === "進行中")
              .map((todo) => (
                <div key={todo.id} className="mb-4 p-4 bg-white border rounded-lg shadow-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getCategoryColor(todo.category) }}
                    />
                    <p className="font-medium">{todo.title}</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    期限: {format(new Date(todo.due_date), 'yyyy/MM/dd HH:mm', { locale: ja })}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                      onClick={() => toggleTodo(todo)}
                    >
                      {todo.completed ? '進行中に戻す' : '完了'}
                    </button>
                    <button
                      className="px-2 py-1 bg-red-200 hover:bg-red-300 rounded"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      削除
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* 「待ち」列 */}
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-4">待ち</h2>
            {todos
              .filter(todo => todo.status === "待ち")
              .map((todo) => (
                <div key={todo.id} className="mb-4 p-4 bg-white border rounded-lg shadow-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getCategoryColor(todo.category) }}
                    />
                    <p className="font-medium">{todo.title}</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    期限: {format(new Date(todo.due_date), 'yyyy/MM/dd HH:mm', { locale: ja })}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                      onClick={() => toggleTodo(todo)}
                    >
                      {todo.completed ? '進行中に戻す' : '完了'}
                    </button>
                    <button
                      className="px-2 py-1 bg-red-200 hover:bg-red-300 rounded"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      削除
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* 「対応完了」列 */}
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-4">対応完了</h2>
            {todos
              .filter(todo => todo.status === "対応完了")
              .map((todo) => (
                <div key={todo.id} className="mb-4 p-4 bg-white border rounded-lg shadow-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getCategoryColor(todo.category) }}
                    />
                    <p className="font-medium">{todo.title}</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    期限: {format(new Date(todo.due_date), 'yyyy/MM/dd HH:mm', { locale: ja })}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                      onClick={() => toggleTodo(todo)}
                    >
                      {todo.completed ? '進行中に戻す' : '完了'}
                    </button>
                    <button
                      className="px-2 py-1 bg-red-200 hover:bg-red-300 rounded"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      削除
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </main>
  )
}
