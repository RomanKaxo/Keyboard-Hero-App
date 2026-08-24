import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AudioPlayer } from '../../components/audio/AudioPlayer'
import { Button } from '../../components/ui/Button'
import { Toast } from '../../components/ui/Toast'
import { useQuery } from '../../lib/data/useQuery'
import { fetchPendingReview, fetchStudentLogs, submitGrading } from '../../lib/data/practiceLogs'
import { fetchStudents } from '../../lib/data/profiles'
import { useToast } from '../../lib/useToast'
import type { PracticeLog } from '../../lib/data/types'

interface LocationState {
  studentId?: string
}

export function Grading() {
  const location = useLocation()
  const state = (location.state ?? {}) as LocationState

  const students = useQuery(() => fetchStudents(), [])
  const logs = useQuery(
    () => (state.studentId ? fetchStudentLogs(state.studentId) : fetchPendingReview()),
    [state.studentId],
  )

  const [selectedLog, setSelectedLog] = useState<PracticeLog>()
  const [rating, setRating] = useState(0)
  const [feedbackGood, setFeedbackGood] = useState('')
  const [feedbackImprove, setFeedbackImprove] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { message, show } = useToast()

  function nameFor(userId: string): string {
    return students.data?.find((s) => s.id === userId)?.full_name ?? 'Žák'
  }

  function selectLog(log: PracticeLog) {
    setSelectedLog(log)
    setRating(log.rating ?? 0)
    setFeedbackGood(log.feedback_good ?? '')
    setFeedbackImprove(log.feedback_improve ?? '')
  }

  async function handleSubmit() {
    if (!selectedLog) return
    setSubmitting(true)
    try {
      await submitGrading(selectedLog.id, {
        rating,
        feedback_good: feedbackGood,
        feedback_improve: feedbackImprove,
      })
      show('Hodnocení odesláno žákovi')
      setSelectedLog(undefined)
      logs.refetch()
    } catch (err) {
      show(err instanceof Error ? err.message : 'Odeslání se nepovedlo, zkus to znovu.')
    } finally {
      setSubmitting(false)
    }
  }

  if (selectedLog) {
    return (
      <div className="max-w-md mx-auto p-5 space-y-4">
        {message && <Toast message={message} />}
        <button className="text-sm text-text-muted" onClick={() => setSelectedLog(undefined)}>
          ← Zpět na seznam
        </button>
        <div>
          <h1 className="text-xl">Hodnocení nahrávky</h1>
          <p className="text-text-muted text-sm">{nameFor(selectedLog.user_id)}</p>
        </div>
        <AudioPlayer src={selectedLog.audio_url} />
        <div>
          <label className="text-sm font-heading font-semibold block mb-1.5">Co se povedlo</label>
          <textarea
            className="w-full rounded-xl bg-bg-card-alt border border-border px-4 py-3 text-sm text-text-primary outline-none focus:border-coral"
            value={feedbackGood}
            onChange={(e) => setFeedbackGood(e.target.value)}
            rows={2}
          />
        </div>
        <div>
          <label className="text-sm font-heading font-semibold block mb-1.5">Co zlepšit</label>
          <textarea
            className="w-full rounded-xl bg-bg-card-alt border border-border px-4 py-3 text-sm text-text-primary outline-none focus:border-coral"
            value={feedbackImprove}
            onChange={(e) => setFeedbackImprove(e.target.value)}
            rows={2}
          />
        </div>
        <div>
          <label className="text-sm font-heading font-semibold block mb-1.5">Hodnocení</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setRating(n)} aria-label={`${n} hvězdiček`}>
                <span className={n <= rating ? 'text-coral' : 'text-bg-card'}>★</span>
              </button>
            ))}
          </div>
        </div>
        <Button className="w-full" disabled={submitting} onClick={handleSubmit}>
          Odeslat hodnocení
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-5 space-y-4">
      <h1 className="text-xl">
        {state.studentId ? `Nahrávky — ${nameFor(state.studentId)}` : 'Ke kontrole'}
      </h1>
      {logs.loading && <p className="text-text-muted text-sm">Načítám…</p>}
      {logs.data?.length === 0 && <p className="text-text-muted text-sm">Žádné nahrávky ke zobrazení.</p>}
      <div className="space-y-2">
        {logs.data?.map((log) => (
          <button
            key={log.id}
            className="w-full text-left rounded-2xl bg-bg-card p-3.5"
            onClick={() => selectLog(log)}
          >
            <div className="font-heading font-semibold text-sm">{nameFor(log.user_id)}</div>
            <div className="text-text-muted text-xs">
              {new Date(log.created_at).toLocaleString('cs-CZ')}
              {log.teacher_comment ? ' · ohodnoceno' : ' · čeká na hodnocení'}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
