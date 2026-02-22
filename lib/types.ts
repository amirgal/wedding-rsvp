export type InviteStatus = 'pending' | 'opened' | 'submitted' | 'edited'

export interface Invite {
  id: string
  token: string
  name: string
  phone: string | null
  status: InviteStatus
  created_at: string
}

export interface Response {
  id: string
  invite_id: string
  attending: boolean
  adult_count: number
  kid_count: number
  submitted_at: string
  updated_at: string
}

export interface ResponseHistory {
  id: string
  invite_id: string
  attending: boolean
  adult_count: number
  kid_count: number
  submitted_at: string
}

export interface InviteWithResponse extends Invite {
  responses: Response | null
}

export interface InviteWithHistory extends Invite {
  responses: Response | null
  response_history: ResponseHistory[]
}

export interface ImportRow {
  name: string
  phone?: string
}

export interface ApiSuccess<T = undefined> {
  success: true
  data?: T
}

export interface ApiError {
  success: false
  error: string
}

export type ApiResponse<T = undefined> = ApiSuccess<T> | ApiError

export interface Stats {
  pending: number
  opened: number
  submitted: number
  edited: number
  totalAdults: number
  totalKids: number
  totalNotAttending: number
  totalInvited: number
}
