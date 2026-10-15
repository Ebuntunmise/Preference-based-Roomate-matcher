import type { Dimension, Item, Dealbreaker } from '~/types/instrument'

// ─── Dimensions ───────────────────────────────────────────────────────────────
// Each dimension has a human label and a key used to store the student's
// importance rating (Low = 1 / Medium = 2 / High = 3) alongside their answers.

export const dimensions: Dimension[] = [
  { id: 'sleep',        label: 'Sleep Schedule',         importanceKey: 'imp_sleep' },
  { id: 'schedule',     label: 'Daily Schedule',         importanceKey: 'imp_schedule' },
  { id: 'personalClean',label: 'Personal Space Tidiness',importanceKey: 'imp_personalClean' },
  { id: 'sharedClean',  label: 'Shared Space Tidiness',  importanceKey: 'imp_sharedClean' },
  { id: 'noise',        label: 'Noise Tolerance',        importanceKey: 'imp_noise' },
  { id: 'study',        label: 'Study Habits',           importanceKey: 'imp_study' },
  { id: 'visitors',     label: 'Visitors & Guests',      importanceKey: 'imp_visitors' },
  { id: 'quietHours',   label: 'Quiet Hours',            importanceKey: 'imp_quietHours' },
  { id: 'belongings',   label: 'Personal Belongings',    importanceKey: 'imp_belongings' },
]

// ─── Items ────────────────────────────────────────────────────────────────────
// Scoring note (for the matching engine):
//   scaled  → numeric option values (0–4). Similarity = 1 − |a − b| / 4
//   forced  → binary option values (0 or 1). Similarity = 1 if equal, 0 if not
//   choice  → categorical string values. Similarity = 1 if equal, 0 if not

export const items: Item[] = [

  // ── Sleep Schedule ──────────────────────────────────────────────────────────
  {
    id: 'sleep_1',
    dimension: 'sleep',
    type: 'scaled',
    prompt: 'What time do you usually go to bed on weeknights?',
    options: [
      { value: 0, label: 'Before 10 pm' },
      { value: 1, label: '10 pm – 11 pm' },
      { value: 2, label: '11 pm – midnight' },
      { value: 3, label: 'Midnight – 1 am' },
      { value: 4, label: 'After 1 am' },
    ],
    allowNoPreference: false,
  },
  {
    id: 'sleep_2',
    dimension: 'sleep',
    type: 'scaled',
    prompt: 'What time do you usually wake up on weekdays?',
    options: [
      { value: 0, label: 'Before 5 am' },
      { value: 1, label: '5 am – 6 am' },
      { value: 2, label: '6 am – 7 am' },
      { value: 3, label: '7 am – 8 am' },
      { value: 4, label: 'After 8 am' },
    ],
    allowNoPreference: false,
  },
  {
    id: 'sleep_3',
    dimension: 'sleep',
    type: 'forced',
    prompt: 'Do you need the room to be completely dark and quiet to fall asleep?',
    options: [
      { value: 1, label: 'Yes, always' },
      { value: 0, label: 'No, I can sleep through light and noise' },
    ],
    allowNoPreference: false,
  },

  // ── Daily Schedule ──────────────────────────────────────────────────────────
  {
    id: 'schedule_1',
    dimension: 'schedule',
    type: 'choice',
    prompt: 'Which best describes your daily routine?',
    options: [
      { value: 'early', label: 'Early bird — most of my day happens before noon' },
      { value: 'mid',   label: 'Midday — I peak in the afternoon' },
      { value: 'night', label: 'Night owl — I do most things in the evening or at night' },
    ],
    allowNoPreference: false,
  },
  {
    id: 'schedule_2',
    dimension: 'schedule',
    type: 'scaled',
    prompt: 'How often are you in the room during the day (outside of sleeping hours)?',
    options: [
      { value: 0, label: 'Rarely — I am almost never in the room during the day' },
      { value: 1, label: 'Sometimes — I pop in and out' },
      { value: 2, label: 'Often — I spend a fair amount of time in the room during the day' },
      { value: 3, label: 'Almost always — the room is basically my base' },
    ],
    allowNoPreference: false,
  },

  // ── Personal Space Tidiness ─────────────────────────────────────────────────
  {
    id: 'personalClean_1',
    dimension: 'personalClean',
    type: 'scaled',
    prompt: 'How would you describe your side of the room?',
    options: [
      { value: 0, label: 'Very messy — I know where everything is but it looks chaotic' },
      { value: 1, label: 'A bit untidy — things pile up but I tidy occasionally' },
      { value: 2, label: 'Fairly neat — I keep things orderly most of the time' },
      { value: 3, label: 'Very neat — my side is always tidy' },
    ],
    allowNoPreference: false,
  },
  {
    id: 'personalClean_2',
    dimension: 'personalClean',
    type: 'scaled',
    prompt: 'How bothered are you when your roommate\'s personal space is messy?',
    options: [
      { value: 0, label: 'Not bothered at all' },
      { value: 1, label: 'Slightly bothered but I say nothing' },
      { value: 2, label: 'Bothered enough that I would bring it up' },
      { value: 3, label: 'Very bothered — a messy roommate would be a serious problem' },
    ],
    allowNoPreference: false,
  },

  // ── Shared Space Tidiness ───────────────────────────────────────────────────
  {
    id: 'sharedClean_1',
    dimension: 'sharedClean',
    type: 'scaled',
    prompt: 'How do you handle shared areas (floor space, shared desk, bathroom if shared)?',
    options: [
      { value: 0, label: 'I clean up when I remember or when it gets really bad' },
      { value: 1, label: 'I try to clean up after myself but I am not strict about it' },
      { value: 2, label: 'I clean up promptly after myself and expect others to do the same' },
      { value: 3, label: 'I clean up after myself and also do general tidying regularly' },
    ],
    allowNoPreference: false,
  },
  {
    id: 'sharedClean_2',
    dimension: 'sharedClean',
    type: 'scaled',
    prompt: 'How quickly do you expect shared dishes or common items to be cleaned after use?',
    options: [
      { value: 0, label: 'Whenever — no rush' },
      { value: 1, label: 'Within a day or two' },
      { value: 2, label: 'The same day' },
      { value: 3, label: 'Immediately after use' },
    ],
    allowNoPreference: true,
  },

  // ── Noise Tolerance ─────────────────────────────────────────────────────────
  {
    id: 'noise_1',
    dimension: 'noise',
    type: 'scaled',
    prompt: 'How sensitive are you to noise in the room?',
    options: [
      { value: 0, label: 'Not sensitive at all — noise does not affect me' },
      { value: 1, label: 'Slightly sensitive — very loud noise bothers me' },
      { value: 2, label: 'Moderately sensitive — I prefer a generally quiet room' },
      { value: 3, label: 'Very sensitive — even moderate noise is a problem for me' },
    ],
    allowNoPreference: false,
  },
  {
    id: 'noise_2',
    dimension: 'noise',
    type: 'scaled',
    prompt: 'How often do you play music, videos, or calls out loud (without headphones)?',
    options: [
      { value: 0, label: 'Never — I always use headphones' },
      { value: 1, label: 'Occasionally and at low volume' },
      { value: 2, label: 'Often, at moderate volume' },
      { value: 3, label: 'Frequently and sometimes loudly' },
    ],
    allowNoPreference: false,
  },
  {
    id: 'noise_3',
    dimension: 'noise',
    type: 'forced',
    prompt: 'Do you talk loudly on phone calls inside the room?',
    options: [
      { value: 1, label: 'Yes, I talk at a normal-to-loud volume' },
      { value: 0, label: 'No, I keep my voice down or step outside' },
    ],
    allowNoPreference: false,
  },

  // ── Study Habits ────────────────────────────────────────────────────────────
  {
    id: 'study_1',
    dimension: 'study',
    type: 'choice',
    prompt: 'Where do you prefer to study?',
    options: [
      { value: 'room',    label: 'In the room' },
      { value: 'library', label: 'In the library or a study space outside the room' },
      { value: 'both',    label: 'Both — it depends on the day' },
    ],
    allowNoPreference: false,
  },
  {
    id: 'study_2',
    dimension: 'study',
    type: 'scaled',
    prompt: 'When you study in the room, how much silence do you need?',
    options: [
      { value: 0, label: 'I can study fine with background noise or conversation' },
      { value: 1, label: 'I prefer it to be quieter but it is not essential' },
      { value: 2, label: 'I need it to be fairly quiet to concentrate' },
      { value: 3, label: 'I need complete silence — any noise breaks my focus' },
    ],
    allowNoPreference: true,
  },
  {
    id: 'study_3',
    dimension: 'study',
    type: 'scaled',
    prompt: 'How late into the night do you typically study?',
    options: [
      { value: 0, label: 'I do not study at night' },
      { value: 1, label: 'Until about 10 pm' },
      { value: 2, label: 'Until midnight' },
      { value: 3, label: 'Past midnight' },
    ],
    allowNoPreference: false,
  },

  // ── Visitors & Guests ───────────────────────────────────────────────────────
  {
    id: 'visitors_1',
    dimension: 'visitors',
    type: 'scaled',
    prompt: 'How often do you have friends or guests come to the room?',
    options: [
      { value: 0, label: 'Rarely or never' },
      { value: 1, label: 'Once or twice a week' },
      { value: 2, label: 'Most days' },
      { value: 3, label: 'Daily or almost daily' },
    ],
    allowNoPreference: false,
  },
  {
    id: 'visitors_2',
    dimension: 'visitors',
    type: 'scaled',
    prompt: 'How late do guests typically stay when they visit you?',
    options: [
      { value: 0, label: 'They do not visit or always leave by 8 pm' },
      { value: 1, label: 'They usually leave by 10 pm' },
      { value: 2, label: 'They sometimes stay past 10 pm' },
      { value: 3, label: 'They regularly stay very late or occasionally overnight' },
    ],
    allowNoPreference: true,
  },
  {
    id: 'visitors_3',
    dimension: 'visitors',
    type: 'scaled',
    prompt: 'How bothered are you by your roommate having frequent guests?',
    options: [
      { value: 0, label: 'Not bothered at all — the more the merrier' },
      { value: 1, label: 'Slightly bothered but manageable' },
      { value: 2, label: 'Bothered — I would need us to set some ground rules' },
      { value: 3, label: 'Very bothered — I strongly prefer minimal guests' },
    ],
    allowNoPreference: false,
  },

  // ── Quiet Hours ─────────────────────────────────────────────────────────────
  {
    id: 'quietHours_1',
    dimension: 'quietHours',
    type: 'scaled',
    prompt: 'What time should quiet hours in the room start on weeknights?',
    options: [
      { value: 0, label: '9 pm' },
      { value: 1, label: '10 pm' },
      { value: 2, label: '11 pm' },
      { value: 3, label: 'Midnight or later' },
      { value: 4, label: 'I do not need fixed quiet hours' },
    ],
    allowNoPreference: false,
  },
  {
    id: 'quietHours_2',
    dimension: 'quietHours',
    type: 'forced',
    prompt: 'Do you expect your roommate to be quiet in the morning before you wake up?',
    options: [
      { value: 1, label: 'Yes — I sleep light and morning noise wakes me up' },
      { value: 0, label: 'No — I can sleep through normal morning activity' },
    ],
    allowNoPreference: false,
  },

  // ── Personal Belongings ─────────────────────────────────────────────────────
  {
    id: 'belongings_1',
    dimension: 'belongings',
    type: 'forced',
    prompt: 'Are you comfortable with a roommate borrowing your things (food, chargers, toiletries) without asking first?',
    options: [
      { value: 0, label: 'No — please always ask before using my things' },
      { value: 1, label: 'Yes — small everyday items are fine to share' },
    ],
    allowNoPreference: false,
  },
  {
    id: 'belongings_2',
    dimension: 'belongings',
    type: 'scaled',
    prompt: 'How do you feel about sharing things with your roommate (chargers, appliances, stationery, etc.)?',
    options: [
      { value: 0, label: 'I prefer to keep everything separate — ask me first for anything' },
      { value: 1, label: 'Small everyday items are fine to share without asking' },
      { value: 2, label: 'I am happy to share most things freely' },
    ],
    allowNoPreference: false,
  },
]

// ─── Dealbreakers ─────────────────────────────────────────────────────────────
// Students may select at most 2 from this list.
// A dealbreaker is a hard veto: if the candidate violates it, they cannot be
// placed in that room regardless of overall compatibility score.

export const dealbreakers: Dealbreaker[] = [
  {
    id: 'D1',
    label: 'I cannot share a room with someone who keeps very late hours (past 1 am regularly)',
    itemIds: ['sleep_1'],
  },
  {
    id: 'D2',
    label: 'I cannot share a room with someone who frequently has overnight or very late guests',
    itemIds: ['visitors_2'],
  },
  {
    id: 'D3',
    label: 'I cannot share a room with someone who plays loud music or media without headphones',
    itemIds: ['noise_2'],
  },
  {
    id: 'D4',
    label: 'I cannot share a room with someone who is generally very messy',
    itemIds: ['personalClean_1', 'sharedClean_1'],
  },
  {
    id: 'D5',
    label: 'I cannot share a room with someone who uses my things without asking',
    itemIds: ['belongings_1'],
  },
]
