import React, { useState, useEffect } from 'react'
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react'
import axios from 'axios'

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:3000/purchase/premiumFeature', {
        headers: { Authorization: token }
      })
      setLeaderboard(response.data)
    } catch (err) {
      setError('Failed to load leaderboard')
      console.error('Error fetching leaderboard:', err)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-warning-500" />
      case 1:
        return <Medal className="w-6 h-6 text-neutral-400" />
      case 2:
        return <Award className="w-6 h-6 text-warning-600" />
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-neutral-500">#{index + 1}</span>
    }
  }

  const getRankBadge = (index) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-warning-400 to-warning-500 text-white'
      case 1:
        return 'bg-gradient-to-r from-neutral-300 to-neutral-400 text-white'
      case 2:
        return 'bg-gradient-to-r from-warning-500 to-warning-600 text-white'
      default:
        return 'bg-neutral-100 text-neutral-700'
    }
  }

  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-warning-500 to-warning-600 rounded-xl flex items-center justify-center mr-3">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Leaderboard</h2>
            <p className="text-sm text-neutral-600">Top spenders this month</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="loading-skeleton h-16 rounded-xl"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-6">
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <p className="text-neutral-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6 slide-up">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-warning-500 to-warning-600 rounded-xl flex items-center justify-center mr-3">
          <Trophy className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Leaderboard</h2>
          <p className="text-sm text-neutral-600">Top spenders this month</p>
        </div>
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center py-8">
          <Trophy className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <p className="text-neutral-600">No data available yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.slice(0, 10).map((user, index) => (
            <div
              key={user._id}
              className={`leaderboard-item ${index < 3 ? 'top-3' : ''}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getRankBadge(index)}`}>
                  {index < 3 ? (
                    getRankIcon(index)
                  ) : (
                    <span className="text-sm font-bold">#{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-neutral-900">{user.name}</div>
                  <div className="text-sm text-neutral-600">
                    ₹{user.total?.toLocaleString() || '0'}
                  </div>
                </div>
              </div>
              
              {index < 3 && (
                <div className="flex items-center">
                  {getRankIcon(index)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-200">
        <div className="flex items-center justify-center text-sm text-primary-700">
          <TrendingUp className="w-4 h-4 mr-2" />
          Rankings update in real-time
        </div>
      </div>
    </div>
  )
}

export default Leaderboard