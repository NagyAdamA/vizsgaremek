import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Target,
  BarChart3,
  Plus,
  TrendingUp,
} from 'lucide-react'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const features = [
    {
      icon: <Target className="w-12 h-12 text-cyan-400" />,
      title: 'Track Your Sessions',
      description:
        'Create and manage your archery practice sessions. Record distance, target size, and other session details.',
    },
    {
      icon: <Plus className="w-12 h-12 text-cyan-400" />,
      title: 'Score Entry',
      description:
        'Easily enter your arrow scores with a simple interface. Track individual arrows and ends with X marks for perfect shots.',
    },
    {
      icon: <BarChart3 className="w-12 h-12 text-cyan-400" />,
      title: 'Performance Statistics',
      description:
        'View detailed statistics about your performance. Track averages, X percentages, and progress over time.',
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-cyan-400" />,
      title: 'Progress Tracking',
      description:
        'Monitor your improvement over time with comprehensive session history and performance metrics.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10"></div>
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-6 mb-6">
            <Target className="w-24 h-24 md:w-32 md:h-32 text-cyan-400" />
            <h1 className="text-6xl md:text-7xl font-black text-white [letter-spacing:-0.08em]">
              <span className="text-gray-300">ARCHERY</span>{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                TRACKER
              </span>
            </h1>
          </div>
          <p className="text-2xl md:text-3xl text-gray-300 mb-4 font-light">
            Track your scores, analyze your performance, and improve your archery skills
          </p>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
            A comprehensive archery score-keeping and statistics application.
            Record your practice sessions, track your progress, and analyze your performance.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Link
              to="/sessions/create"
              className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50"
            >
              Start New Session
            </Link>
            <div className="flex gap-4">
              <Link
                to="/sessions"
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
              >
                View Sessions
              </Link>
              <Link
                to="/statistics"
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
              >
                View Statistics
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
