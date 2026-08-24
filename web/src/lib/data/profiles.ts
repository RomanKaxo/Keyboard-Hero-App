import { supabase } from '../supabase'
import type { Profile } from './types'

export async function fetchOwnProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (error) throw error
  return data as Profile
}

export async function fetchStudents(): Promise<Profile[]> {
  const { data, error } = await supabase.from('profiles').select('*').eq('role', 'student')
  if (error) throw error
  return (data ?? []) as Profile[]
}
