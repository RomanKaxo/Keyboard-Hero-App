import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '../../components/ui/Input'
import { Avatar } from '../../components/ui/Avatar'
import { useQuery } from '../../lib/data/useQuery'
import { fetchStudents } from '../../lib/data/profiles'

export function Students() {
  const navigate = useNavigate()
  const students = useQuery(() => fetchStudents(), [])
  const [search, setSearch] = useState('')

  const filtered = (students.data ?? []).filter((s) =>
    s.full_name.toLowerCase().includes(search.trim().toLowerCase()),
  )

  return (
    <div className="max-w-md mx-auto p-5 space-y-4">
      <h1 className="text-xl">Žáci</h1>
      <Input
        placeholder="Hledat žáka"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {students.loading && <p className="text-text-muted text-sm">Načítám…</p>}
      <div className="space-y-2">
        {filtered.map((student) => (
          <button
            key={student.id}
            className="w-full flex items-center gap-2.5 rounded-2xl bg-bg-card p-3.5 text-left"
            onClick={() => navigate('/teacher/grading', { state: { studentId: student.id } })}
          >
            <Avatar name={student.full_name} size={38} />
            <div>
              <div className="font-heading font-semibold text-sm">{student.full_name}</div>
              <div className="text-text-muted text-xs">
                Streak {student.streak} dní · {student.stars} XP
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
