import React from 'react'
import { Trash2, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ExpenseList = ({ expenses, pagination, currentPage, onPageChange, onExpenseDeleted, loading }) => {
  const handleDelete = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${BASE_URL}/user/deleteexpense/${expenseId}`, {
        headers: { Authorization: token }
      })
      onExpenseDeleted()
    } catch (error) {
      console.error('Error deleting expense:', error)
      alert('Failed to delete expense. Please try again.')
    }
  }

  const getCategoryIcon = (category) => {
    const icons = {
      food: '🍕',
      movies: '🎬',
      adventure: '🏔️',
      shopping: '🛍️'
    }
    return icons[category] || '💰'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-3">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Recent Expenses</h2>
            <p className="text-sm text-neutral-600">Your spending history</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="loading-skeleton h-20 rounded-xl"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6 slide-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-3">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Recent Expenses</h2>
            <p className="text-sm text-neutral-600">Your spending history</p>
          </div>
        </div>
        
        {expenses.length > 0 && (
          <div className="text-sm text-neutral-500">
            Page {currentPage} of {pagination.lastPage || 1}
          </div>
        )}
      </div>

      {expenses.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No expenses yet</h3>
          <p className="text-neutral-600">Start tracking your expenses by adding your first entry above.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {expenses.map((expense) => (
              <div key={expense._id} className="expense-item">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center expense-category-${expense.category}`}>
                      <span className="text-xl">{getCategoryIcon(expense.category)}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-neutral-900 group-hover:text-primary-600 transition-colors">
                        {expense.description}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium expense-category-${expense.category}`}>
                          {expense.category}
                        </span>
                        <span className="text-sm text-neutral-500">
                          {formatDate(expense.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-lg font-bold text-neutral-900">
                        ₹{expense.amount.toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(expense._id)}
                      className="p-2 text-neutral-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-all duration-200 group"
                    >
                      <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.lastPage > 1 && (
            <div className="flex items-center justify-between border-t border-neutral-200 pt-6">
              <div className="text-sm text-neutral-600">
                Showing page {currentPage} of {pagination.lastPage}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onPageChange(pagination.previousPage)}
                  disabled={!pagination.hasPreviousPage}
                  className="pagination-button"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <button
                  className="pagination-button active"
                >
                  {currentPage}
                </button>
                
                <button
                  onClick={() => onPageChange(pagination.nextPage)}
                  disabled={!pagination.hasNextPage}
                  className="pagination-button"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ExpenseList