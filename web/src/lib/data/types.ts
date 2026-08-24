export interface Profile {
  id: string
  full_name: string
  username: string | null
  stars: number
  streak: number
  role: 'student' | 'admin'
}

export interface PracticeLog {
  id: string
  user_id: string
  created_at: string
  audio_url: string
  teacher_comment: string | null
  rating: number | null
  feedback_good: string | null
  feedback_improve: string | null
}
