import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RecordingUI } from '../../components/audio/RecordingUI'
import { Toast } from '../../components/ui/Toast'
import { Confetti } from '../../components/gamification/Confetti'
import { useAuth } from '../../lib/AuthProvider'
import { uploadRecording, insertPracticeLog, fetchOwnLogsCount, fetchWeeklyStats } from '../../lib/data/practiceLogs'
import { isPerfectWeek } from '../../lib/game-logic'
import { detectNewUnlocks } from '../../lib/gamification/detectNewUnlocks'
import { useToast } from '../../lib/useToast'

export function Recording() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { message, show } = useToast()
  const [uploading, setUploading] = useState(false)
  const [celebrating, setCelebrating] = useState(false)

  async function handleRecorded(blob: Blob) {
    if (!profile) return
    setUploading(true)
    try {
      const audioUrl = await uploadRecording(profile.id, blob)
      await insertPracticeLog(profile.id, audioUrl)
      show('Nahrávka odeslána ke kontrole')

      const today = new Date()
      const [logsCount, weekly] = await Promise.all([
        fetchOwnLogsCount(profile.id),
        fetchWeeklyStats(profile.id, today),
      ])
      const result = detectNewUnlocks(profile.id, profile.stars, {
        stars: profile.stars,
        streak: profile.streak,
        totalRecordings: logsCount,
        perfectWeek: isPerfectWeek(weekly.dateKeys, today),
        daysPlayedThisWeek: weekly.dateKeys.length,
        weeklyCount: weekly.weeklyCount,
      })
      if (result.newLevel || result.newBadgeIds.length > 0) {
        setCelebrating(true)
        setTimeout(() => setCelebrating(false), 2500)
      }
      setTimeout(() => navigate('/student'), 1500)
    } catch (err) {
      show(err instanceof Error ? err.message : 'Nahrání se nepovedlo, zkus to znovu.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-5">
      <Confetti active={celebrating} />
      {message && <Toast message={message} />}
      <h1 className="text-xl mb-4">Nahrávání</h1>
      <RecordingUI onRecorded={handleRecorded} />
      {uploading && <p className="text-center text-text-muted text-sm">Nahrávám…</p>}
    </div>
  )
}
