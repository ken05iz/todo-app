'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'

interface TodoFormData {
  title: string
  category: string
  description: string
  due_date: string
}

export default function CreateTask() {
  const router = useRouter()
  const [formData, setFormData] = useState<TodoFormData>({
    title: '',
    category: '',
    description: '',
    due_date: format(new Date(), "yyyy-MM-dd'T'00:00")
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // フォームから受け取った日付文字列を Date に変換
    const dateObj = new Date(formData.due_date)
    // RFC3339 形式（例: 2025-03-27T00:00:00.000Z）に変換
    const dueDateISO = dateObj.toISOString()
    // 新規タスク作成APIへのPOSTリクエスト
    const response = await fetch('http://localhost:8080/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    if (response.ok) {
      router.push('/') // 作成後に管理画面に遷移
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">タスク作成</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">タイトル</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">カテゴリー</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
              required
            >
              <option value="">カテゴリーを選択...</option>
              <option value="1">個人</option>
              <option value="2">プライベート</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">説明</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
              rows={3} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">締切日時</label>
            <input 
              type="datetime-local" 
              name="due_date" 
              value={formData.due_date} 
              onChange={handleChange} 
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" 
              required 
            />
          </div>
          <div className="flex justify-end gap-2">
            {/*　キャンセルボタンを追加 */}
            <button
              type="button"
              onClick={() => router.push('/')}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
            >
                キャンセル
            </button>
            <button 
              type="submit" 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              作成
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
