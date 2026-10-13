export type DimensionId =
  | 'sleep'
  | 'schedule'
  | 'personalClean'
  | 'sharedClean'
  | 'noise'
  | 'study'
  | 'visitors'
  | 'quietHours'
  | 'belongings'

export type ItemType = 'scaled' | 'forced' | 'choice'

export interface Option {
  value: number | string
  label: string
}

export interface Item {
  id: string
  dimension: DimensionId
  type: ItemType
  prompt: string
  options: Option[]
  allowNoPreference?: boolean
  /** importance weight this student assigns to this dimension */
  importanceKey?: string
}

export interface Dimension {
  id: DimensionId
  label: string
  importanceKey: string
}

export type DealbreakerKey = 'D1' | 'D2' | 'D3' | 'D4' | 'D5'
// D1: Very late hours | D2: Late/overnight guests | D3: Loud media | D4: Messy | D5: Uses things without asking

export interface Dealbreaker {
  id: DealbreakerKey
  label: string
  /** item ids that collectively define this dealbreaker */
  itemIds: string[]
}
