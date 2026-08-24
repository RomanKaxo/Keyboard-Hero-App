import { supabase } from './supabase'

// The app has no real email addresses — usernames are shimmed into an
// internal fake domain, same convention the previous vanilla app used.
export function makeInternalEmail(username: string): string {
  const clean = username.trim().toLowerCase().replace(/\s+/g, '')
  return `${clean}@keyboardhero.internal`
}

export async function signIn(username: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: makeInternalEmail(username),
    password,
  })
  if (error) throw error
  return data
}

export async function signUpStudent(username: string, fullName: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email: makeInternalEmail(username),
    password,
    options: { data: { full_name: fullName, role: 'student' } },
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
