import React, { useState } from 'react'
import { Crown, Download, TrendingUp, Star, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const PremiumFeatures = () => {
  const { user, updateUserPremiumStatus } = useAuth()
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const handlePremiumUpgrade = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:3000/purchase/premiummembership', {
        headers: { Authorization: token }
      })

      const options = {
        key: response.data.key_id,
        order_id: response.data.order.id,
        handler: async function (response) {
          try {
            const res = await axios.post(
              'http://localhost:3000/purchase/purchasetransactionstatus',
              {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
              },
              { headers: { Authorization: token } }
            )
            
            localStorage.setItem('token', res.data.token)
            updateUserPremiumStatus(true)
            alert('🎉 Welcome to Premium! You now have access to all premium features.')
          } catch (error) {
            console.error('Payment verification failed:', error)
            alert('Payment verification failed. Please contact support.')
          }
        },
        theme: {
          color: '#0ea5e9'
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

      rzp.on('payment.failed', function () {
        alert('Payment failed. Please try again.')
      })
    } catch (error) {
      console.error('Error initiating payment:', error)
      alert('Failed to initiate payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:3000/user/download', {
        headers: { Authorization: token },
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'expenses.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  if (user?.isPremium) {
    return (
      <div className="card-premium p-6 slide-up">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-warning-500 to-warning-600 rounded-xl flex items-center justify-center mr-3">
            <Crown className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Premium Features</h2>
            <p className="text-sm text-neutral-600">Exclusive tools for premium users</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center p-3 bg-success-50 border border-success-200 rounded-xl">
            <Check className="w-5 h-5 text-success-600 mr-3" />
            <span className="text-success-800 font-medium">Premium Active</span>
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="btn-primary w-full group"
          >
            {downloading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Downloading...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Download className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Download Expenses
              </div>
            )}
          </button>

          <div className="grid grid-cols-1 gap-3 mt-6">
            <div className="flex items-center p-3 bg-white/50 rounded-lg border border-neutral-200">
              <TrendingUp className="w-5 h-5 text-primary-600 mr-3" />
              <span className="text-sm text-neutral-700">Advanced Analytics</span>
            </div>
            <div className="flex items-center p-3 bg-white/50 rounded-lg border border-neutral-200">
              <Download className="w-5 h-5 text-primary-600 mr-3" />
              <span className="text-sm text-neutral-700">Export Data</span>
            </div>
            <div className="flex items-center p-3 bg-white/50 rounded-lg border border-neutral-200">
              <Star className="w-5 h-5 text-primary-600 mr-3" />
              <span className="text-sm text-neutral-700">Leaderboard Access</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6 slide-up">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-warning-500 to-warning-600 rounded-xl flex items-center justify-center mr-3">
          <Crown className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Upgrade to Premium</h2>
          <p className="text-sm text-neutral-600">Unlock powerful features</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center p-3 bg-neutral-50 rounded-lg">
          <TrendingUp className="w-5 h-5 text-neutral-400 mr-3" />
          <span className="text-sm text-neutral-600">Advanced Analytics</span>
        </div>
        <div className="flex items-center p-3 bg-neutral-50 rounded-lg">
          <Download className="w-5 h-5 text-neutral-400 mr-3" />
          <span className="text-sm text-neutral-600">Export Data to CSV</span>
        </div>
        <div className="flex items-center p-3 bg-neutral-50 rounded-lg">
          <Star className="w-5 h-5 text-neutral-400 mr-3" />
          <span className="text-sm text-neutral-600">Leaderboard Access</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-warning-50 to-warning-100 border border-warning-200 rounded-xl p-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-warning-800">₹25</div>
          <div className="text-sm text-warning-600">One-time payment</div>
        </div>
      </div>

      <button
        onClick={handlePremiumUpgrade}
        disabled={loading}
        className="btn-warning w-full group"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
            Processing...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Crown className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Upgrade Now
          </div>
        )}
      </button>

      <p className="text-xs text-neutral-500 text-center mt-3">
        Secure payment powered by Razorpay
      </p>
    </div>
  )
}

export default PremiumFeatures