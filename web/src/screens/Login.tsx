import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { useAuth } from '../lib/AuthProvider'
import { signIn, signUpStudent } from '../lib/auth'

type Mode = 'login' | 'register'

export function Login() {
  const navigate = useNavigate()
  const { session, profile, loading: authLoading } = useAuth()
  const [mode, setMode] = useState<Mode>('login')
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string>()

  useEffect(() => {
    if (!authLoading && session && profile) {
      navigate(profile.role === 'admin' ? '/teacher' : '/student', { replace: true })
    }
  }, [authLoading, session, profile, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(undefined)
    setSubmitting(true)
    try {
      if (mode === 'login') {
        await signIn(username, password)
      } else {
        await signUpStudent(username, fullName, password)
      }
      // AuthProvider picks up the new session and the effect above redirects.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Něco se nepovedlo, zkus to prosím znovu.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto p-5 mt-16">
      <Card className="space-y-4">
        <div>
          <h1 className="text-xl">Muzio</h1>
          <p className="text-text-muted text-sm">Uč se hudbu hravě, každý den.</p>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant={mode === 'login' ? 'primary' : 'ghost'}
            className="flex-1"
            onClick={() => setMode('login')}
          >
            Jsem žák
          </Button>
          <Button
            type="button"
            variant={mode === 'login' ? 'ghost' : 'primary'}
            className="flex-1"
            onClick={() => setMode('register')}
          >
            Nový účet
          </Button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            placeholder="Uživatelské jméno (bez diakritiky)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
          {mode === 'register' && (
            <Input
              placeholder="Celé jméno"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}
          <Input
            placeholder="Heslo"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            required
          />
          {error && (
            <p role="alert" className="text-sm text-coral-dark">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={submitting}>
            {mode === 'login' ? 'Přihlásit se' : 'Zaregistrovat se'}
          </Button>
        </form>

        <p className="text-text-muted text-xs">
          Účty pro učitele zakládá administrátor ručně — registrace vytváří vždy žákovský účet.
        </p>
      </Card>
    </div>
  )
}
