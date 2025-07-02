import React, { useState } from 'react'
import { Plus, DollarSign, FileText, Tag } from 'lucide-react'
import axios from 'axios'
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ExpenseForm = ({ onExpenseAdded }) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: 'food'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const categories = [
    { value: 'food', label: 'Food', icon: '🍕', color: 'orange' },
    { value: 'movies', label: 'Movies', icon: '🎬', color: 'purple' },
    { value: 'adventure', label: 'Adventure', icon: '🏔️', color: 'green' },
    { value: 'shopping', label: 'Shopping', icon: '🛍️', color: 'blue' }
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      await axios.post(`${BASE_URL}/user/addexpense`, formData, {
        headers: { Authorization: token }
      })
      
      setFormData({
        amount: '',
        description: '',
        category: 'food'
      })
      
      onExpenseAdded()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-6 slide-up">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-success-500 to-success-600 rounded-xl flex items-center justify-center mr-3">
          <Plus className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Add New Expense</h2>
          <p className="text-sm text-neutral-600">Track your spending efficiently</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-danger-50 border border-danger-200 rounded-xl text-danger-700 text-sm mb-6 animate-slide-down">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Amount Input */}
          <div className="form-group">
            <label htmlFor="amount" className="form-label">
              Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="input pl-11"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Category Select */}
          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input pl-11 appearance-none"
                required
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.icon} {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Description Input */}
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input pl-11 min-h-[80px] resize-none"
              placeholder="What did you spend on?"
              required
            />
          </div>
        </div>

        {/* Category Preview */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-neutral-600">Selected category:</span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium expense-category-${formData.category}`}>
            {categories.find(cat => cat.value === formData.category)?.icon}
            <span className="ml-1">{categories.find(cat => cat.value === formData.category)?.label}</span>
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn-success w-full group"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              Adding expense...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Plus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Add Expense
            </div>
          )}
        </button>
      </form>
    </div>
  )
}

export default ExpenseForm