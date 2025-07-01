import React, { useState, useEffect } from 'react'
import Header from './Header'
import ExpenseForm from './ExpenseForm'
import ExpenseList from './ExpenseList'
import PremiumFeatures from './PremiumFeatures'
import Leaderboard from './Leaderboard'
import { useAuth } from '../context/AuthContext'
import { TrendingUp, IndianRupee , Calendar, Target } from 'lucide-react'
import axios from 'axios'

const Dashboard = () => {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({})
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalExpenses: 0,
    monthlyExpenses: 0,
    expenseCount: 0
  })

  const fetchExpenses = async (page = 1) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`http://localhost:3000/user/getexpense?page=${page}`, {
        headers: { Authorization: token }
      })
      
      setExpenses(response.data.expenses)
      setPagination(response.data)
      setCurrentPage(page)
      
      // Calculate stats
      const totalAmount = response.data.expenses.reduce((sum, expense) => sum + expense.amount, 0)
      setStats(prev => ({
        ...prev,
        totalExpenses: totalAmount,
        expenseCount: response.data.expenses.length
      }))
    } catch (error) {
      console.error('Error fetching expenses:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  const handleExpenseAdded = () => {
    fetchExpenses(currentPage)
  }

  const handleExpenseDeleted = () => {
    fetchExpenses(currentPage)
  }

  const handlePageChange = (page) => {
    fetchExpenses(page)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/30">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-neutral-600 mt-1">
                Track your expenses and manage your finances smartly
              </p>
            </div>
            {user?.isPremium && (
              <div className="premium-badge">
                ✨ Premium User
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="stats-card">
              <div className="flex items-center justify-between mb-2">
                <IndianRupee  className="w-8 h-8 text-primary-600" />
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900">
                ₹{stats.totalExpenses.toLocaleString()}
              </h3>
              <p className="text-sm text-neutral-600">Total Expenses</p>
            </div>

            <div className="stats-card">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-8 h-8 text-success-600" />
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900">
                {stats.expenseCount}
              </h3>
              <p className="text-sm text-neutral-600">This Page</p>
            </div>

            <div className="stats-card">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-warning-600" />
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900">
                ₹{Math.round(stats.totalExpenses / Math.max(stats.expenseCount, 1)).toLocaleString()}
              </h3>
              <p className="text-sm text-neutral-600">Avg. Expense</p>
            </div>

            <div className="stats-card">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-8 h-8 text-secondary-600" />
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900">
                {user?.isPremium ? 'Premium' : 'Basic'}
              </h3>
              <p className="text-sm text-neutral-600">Account Type</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Expense Form and List */}
          <div className="lg:col-span-2 space-y-8">
            <ExpenseForm onExpenseAdded={handleExpenseAdded} />
            <ExpenseList 
              expenses={expenses}
              pagination={pagination}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onExpenseDeleted={handleExpenseDeleted}
              loading={loading}
            />
          </div>

          {/* Right Column - Premium Features and Leaderboard */}
          <div className="space-y-8">
            <PremiumFeatures />
            {user?.isPremium && <Leaderboard />}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard