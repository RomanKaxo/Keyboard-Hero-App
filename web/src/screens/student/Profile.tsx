import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../lib/AuthProvider'
import { useQuery } from '../../lib/data/useQuery'
import { fetchOwnLogsCount, fetchWeeklyStats } from '../../lib/data/practiceLogs'
import { computeBadges, computeLevel, computeUnlockedSkins, isPerfectWeek } from '../../lib/game-logic'
import { signOut } from '../../lib/auth'

export function Profile() {
  const navigate = useNavigate()
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

  if (!profile) return null

  const level = computeLevel(profile.stars)
  const badges = computeBadges({
    stars: profile.stars,
    streak: profile.streak,
    totalRecordings: logsCount.data ?? 0,
    perfectWeek: weekly.data ? isPerfectWeek(weekly.data.dateKeys, today) : false,
    daysPlayedThisWeek: weekly.data?.dateKeys.length ?? 0,
    weeklyCount: weekly.data?.weeklyCount ?? 0,
  })
  const skins = computeUnlockedSkins(level.level)

  async function handleLogout() {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="max-w-md mx-auto p-5 space-y-6">
      <div className="text-center">
        <h1 className="text-xl">{profile.full_name}</h1>
        <p className="text-text-muted text-sm">
          Level {level.level} · {level.title}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <StatCard value={`${profile.streak} dní`} label="Aktuální streak" />
        <StatCard value={String(profile.stars)} label="Celkem XP" />
        <StatCard value={String(logsCount.data ?? '—')} label="Dokončené nahrávky" />
        <StatCard value={String(weekly.data?.weeklyCount ?? '—')} label="Tento týden" />
      </div>

      <div>
        <h2 className="text-sm font-heading font-semibold mb-2">Maskot</h2>
        <div className="flex gap-2 flex-wrap">
          {skins.map((skin) => (
            <span key={skin.id} title={skin.label} className="text-2xl">
              {skin.icon}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-heading font-semibold mb-2">Odznaky</h2>
        <div className="flex gap-2 flex-wrap">
          {badges.map((badge) => (
            <span
              key={badge.id}
              title={`${badge.label}${badge.progressLabel ? ` (${badge.progressLabel})` : ''}`}
              className={`text-2xl ${badge.unlocked ? '' : 'grayscale opacity-40'}`}
            >
              {badge.icon}
            </span>
          ))}
        </div>
      </div>

      <Button variant="ghost" className="w-full" onClick={handleLogout}>
        Odhlásit se
      </Button>
    </div>
  )
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-bg-card p-3.5">
      <div className="font-heading font-bold text-lg mb-0.5">{value}</div>
      <div className="text-text-muted text-xs">{label}</div>
    </div>
  )
}
