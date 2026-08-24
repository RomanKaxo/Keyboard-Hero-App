import { useEffect, useRef, useState } from 'react'
import { Card } from '../../components/ui/Card'
import { Toast } from '../../components/ui/Toast'
import { Streak } from '../../components/gamification/Streak'
import { XPDisplay } from '../../components/gamification/XPDisplay'
import { LevelProgress } from '../../components/gamification/LevelProgress'
import { DailyReminderBanner } from '../../components/gamification/DailyReminderBanner'
import { Confetti } from '../../components/gamification/Confetti'
import { useAuth } from '../../lib/AuthProvider'
import { useQuery } from '../../lib/data/useQuery'
import { fetchOwnLogsCount, fetchWeeklyStats } from '../../lib/data/practiceLogs'
import { isPerfectWeek, hasPlayedToday } from '../../lib/game-logic'
import { detectNewUnlocks } from '../../lib/gamification/detectNewUnlocks'
import { useToast } from '../../lib/useToast'

export function StudentDashboard() {
  const { profile } = useAuth()
  const userId = profile?.id
  const [today] = useState(() => new Date())

  const logsCount = useQuery(
    () => (userId ? fetchOwnLogsCount(userId) : Promise.resolve(0)),
    [userId],
  )
  const weekly = useQuery(
    () => (userId ? fetchWeeklyStats(userId, today) : Promise.resolve({ dateKeys: [], weeklyCount: 0 })),
    [userId],
  )

  const { message, show } = useToast()
  const [celebrating, setCelebrating] = useState(false)
  const celebratedRef = useRef(false)

  useEffect(() => {
    if (!userId || !profile || logsCount.data === undefined || !weekly.data) return
    if (celebratedRef.current) return
    celebratedRef.current = true

    const dateKeys = weekly.data.dateKeys
    const result = detectNewUnlocks(userId, profile.stars, {
      stars: profile.stars,
      streak: profile.streak,
      totalRecordings: logsCount.data,
      perfectWeek: isPerfectWeek(dateKeys, today),
      daysPlayedThisWeek: dateKeys.length,
      weeklyCount: weekly.data.weeklyCount,
    })

    if (result.newLevel) {
      setCelebrating(true)
      show(`LEVEL UP! Teď jsi level ${result.level} 🎉`)
      setTimeout(() => setCelebrating(false), 2500)
    } else if (result.newBadgeIds.length > 0) {
      setCelebrating(true)
      show('Nový odznak! 🏅')
      setTimeout(() => setCelebrating(false), 2500)
    }
  }, [userId, profile, logsCount.data, weekly.data, today, show])

  if (!profile) return null

  const playedToday = weekly.data ? hasPlayedToday(weekly.data.dateKeys, today) : false
  const firstName = profile.full_name?.split(' ')[0] || 'žáku'

  return (
    <div className="max-w-md mx-auto p-5 space-y-5">
      <Confetti active={celebrating} />
      {message && <Toast message={message} />}
      <div className="flex items-center justify-between">
        <h1 className="text-xl">Ahoj, {firstName}! 👋</h1>
        <div className="flex items-center gap-2">
          <Streak count={profile.streak} />
          <XPDisplay xp={profile.stars} />
        </div>
      </div>
      <DailyReminderBanner playedToday={playedToday} />
      <Card>
        <LevelProgress stars={profile.stars} />
      </Card>
    </div>
  )
}
