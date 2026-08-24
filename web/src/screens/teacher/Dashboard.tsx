import { useNavigate } from 'react-router-dom'
import { Badge } from '../../components/ui/Badge'
import { Avatar } from '../../components/ui/Avatar'
import { useQuery } from '../../lib/data/useQuery'
import { fetchPendingReview } from '../../lib/data/practiceLogs'
import { fetchStudents } from '../../lib/data/profiles'

export function TeacherDashboard() {
  const navigate = useNavigate()
  const pending = useQuery(() => fetchPendingReview(), [])
  const students = useQuery(() => fetchStudents(), [])

  function nameFor(userId: string): string {
    return students.data?.find((s) => s.id === userId)?.full_name ?? 'Žák'
  }

  return (
    <div className="max-w-md mx-auto p-5 space-y-5">
      <h1 className="text-xl">Přehled žáků</h1>

      <div>
        <h2 className="text-sm font-heading font-semibold text-text-muted mb-2">
          Ke kontrole ({pending.data?.length ?? 0})
        </h2>
        {pending.loading && <p className="text-text-muted text-sm">Načítám…</p>}
        {pending.data?.length === 0 && <p className="text-text-muted text-sm">Vše zkontrolováno 🎉</p>}
        <div className="space-y-2">
          {pending.data?.map((log) => (
            <button
              key={log.id}
              className="w-full flex items-center justify-between rounded-2xl bg-bg-card p-3.5 text-left"
              onClick={() => navigate('/teacher/grading', { state: { studentId: log.user_id } })}
            >
              <div className="flex items-center gap-2.5">
                <Avatar name={nameFor(log.user_id)} size={38} />
                <div>
                  <div className="font-heading font-semibold text-sm">{nameFor(log.user_id)}</div>
                  <div className="text-text-muted text-xs">
                    {new Date(log.created_at).toLocaleDateString('cs-CZ')}
                  </div>
                </div>
              </div>
              <Badge tone="pending">Nové</Badge>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-heading font-semibold text-text-muted mb-2">Žáci</h2>
        <div className="space-y-2">
          {students.data?.map((student) => (
            <button
              key={student.id}
              className="w-full flex items-center justify-between rounded-2xl bg-bg-card p-3.5 text-left"
              onClick={() => navigate('/teacher/grading', { state: { studentId: student.id } })}
            >
              <div className="flex items-center gap-2.5">
                <Avatar name={student.full_name} size={38} />
                <div>
                  <div className="font-heading font-semibold text-sm">{student.full_name}</div>
                  <div className="text-text-muted text-xs">Streak {student.streak} dní</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
