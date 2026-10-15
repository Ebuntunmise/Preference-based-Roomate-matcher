<template>
  <div class="intake-wrapper">
    <header class="intake-header">
      <h1>Hostel Preference Form</h1>
      <p>Your answers help us match you with a compatible roommate. All responses are confidential.</p>
    </header>

    <!-- Already submitted state -->
    <div v-if="alreadySubmitted" class="submitted-card">
      <h2>You've already submitted your preferences</h2>
      <p>Your responses have been saved for the <strong>{{ currentYear }}</strong> allocation. Results will be announced after the intake window closes.</p>
    </div>

    <!-- Intake closed state -->
    <div v-else-if="intakeClosed" class="closed-card">
      <h2>Intake is currently closed</h2>
      <p>The hostel allocation window is not open yet. Check back when your hostel admin announces it.</p>
    </div>

    <!-- The form -->
    <form v-else @submit.prevent="handleSubmit">

      <!-- Dimension sections -->
      <div
        v-for="dim in dimensions"
        :key="dim.id"
        class="dimension-card"
      >
        <h2>{{ dim.label }}</h2>

        <div
          v-for="item in itemsByDimension[dim.id]"
          :key="item.id"
          class="question-block"
        >
          <p class="question-prompt">{{ item.prompt }}</p>

          <div class="options">
            <label
              v-for="opt in item.options"
              :key="String(opt.value)"
              class="option-label"
            >
              <input
                type="radio"
                :name="item.id"
                :value="opt.value"
                v-model="answers[item.id]"
                required
              />
              {{ opt.label }}
            </label>

            <label v-if="item.allowNoPreference" class="option-label no-pref">
              <input
                type="radio"
                :name="item.id"
                value="__none__"
                v-model="answers[item.id]"
              />
              No preference
            </label>
          </div>
        </div>

        <!-- Importance rating for this dimension -->
        <div class="importance-row">
          <p class="importance-label">How important is this to you?</p>
          <div class="importance-options">
            <label v-for="level in importanceLevels" :key="level.value" class="imp-label">
              <input
                type="radio"
                :name="dim.importanceKey"
                :value="level.value"
                v-model="importance[dim.importanceKey]"
                required
              />
              {{ level.label }}
            </label>
          </div>
        </div>
      </div>

      <!-- Dealbreakers -->
      <div class="dimension-card dealbreaker-card">
        <h2>Dealbreakers</h2>
        <p class="db-instruction">
          Select <strong>up to 2</strong> things you absolutely cannot live with in a roommate.
          These act as hard vetoes during matching — if a potential roommate triggers one of your
          dealbreakers, they will not be placed with you regardless of overall compatibility.
        </p>

        <div
          v-for="db in dealbreakers"
          :key="db.id"
          class="db-option"
        >
          <label class="db-label">
            <input
              type="checkbox"
              :value="db.id"
              v-model="selectedDealbreakers"
              :disabled="selectedDealbreakers.length >= 2 && !selectedDealbreakers.includes(db.id)"
            />
            {{ db.label }}
          </label>
        </div>

        <p v-if="selectedDealbreakers.length === 2" class="db-max-note">
          Maximum reached. Uncheck one to select a different dealbreaker.
        </p>
      </div>

      <p v-if="submitError" class="submit-error">{{ submitError }}</p>

      <button type="submit" class="submit-btn" :disabled="submitting">
        {{ submitting ? 'Saving your responses…' : 'Submit Preferences' }}
      </button>
    </form>

    <!-- Success screen -->
    <div v-if="submitSuccess" class="success-overlay">
      <div class="success-card">
        <div class="success-icon">✓</div>
        <h2>Preferences Saved</h2>
        <p>Your responses have been recorded for the <strong>{{ currentYear }}</strong> allocation. You'll be notified once roommate assignments are ready.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { dimensions, items, dealbreakers } from '~/data/instrument'
import type { DimensionId } from '~/types/instrument'

const { $supabase } = useNuxtApp()
const router = useRouter()

// ── State ──────────────────────────────────────────────────────────────────────
const answers = reactive<Record<string, number | string>>({})
const importance = reactive<Record<string, number>>({})
const selectedDealbreakers = ref<string[]>([])

const submitting = ref(false)
const submitError = ref('')
const submitSuccess = ref(false)
const alreadySubmitted = ref(false)
const intakeClosed = ref(false)
const currentYear = ref('')

const importanceLevels = [
  { value: 1, label: 'Low' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'High' },
]

// ── Group items by dimension ───────────────────────────────────────────────────
const itemsByDimension = computed(() => {
  const map: Record<string, typeof items> = {}
  for (const dim of dimensions) {
    map[dim.id] = items.filter(i => i.dimension === dim.id)
  }
  return map
})

// ── On mount: check auth, intake status, prior submission ─────────────────────
onMounted(async () => {
  // Make sure user is logged in
  const { data: { user } } = await $supabase.auth.getUser()
  if (!user) {
    router.push('/login')
    return
  }

  // Check intake open/closed and get academic year
  const { data: settings } = await $supabase
    .from('allocation_settings')
    .select('intake_open, academic_year')
    .eq('id', 1)
    .single()

  if (!settings?.intake_open) {
    intakeClosed.value = true
    return
  }

  currentYear.value = settings.academic_year

  // Check if student already submitted for this year
  const { data: existing } = await $supabase
    .from('preference_responses')
    .select('id')
    .eq('user_id', user.id)
    .eq('academic_year', settings.academic_year)
    .maybeSingle()

  if (existing) {
    alreadySubmitted.value = true
  }
})

// ── Submit ────────────────────────────────────────────────────────────────────
async function handleSubmit() {
  submitting.value = true
  submitError.value = ''

  const { data: { user } } = await $supabase.auth.getUser()
  if (!user) {
    router.push('/login')
    return
  }

  // Build clean answers object (replace __none__ with null)
  const cleanAnswers: Record<string, number | string | null> = {}
  for (const [key, val] of Object.entries(answers)) {
    cleanAnswers[key] = val === '__none__' ? null : val
  }

  const { error } = await $supabase
    .from('preference_responses')
    .insert({
      user_id: user.id,
      academic_year: currentYear.value,
      answers: cleanAnswers,
      importance: { ...importance },
      dealbreakers: selectedDealbreakers.value,
    })

  if (error) {
    submitError.value = error.message
    submitting.value = false
    return
  }

  submitting.value = false
  submitSuccess.value = true
}
</script>

<style scoped>
.intake-wrapper {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1rem 4rem;
  font-family: system-ui, sans-serif;
}

.intake-header {
  margin-bottom: 2rem;
}

.intake-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111;
  margin: 0 0 0.4rem;
}

.intake-header p {
  color: #555;
  margin: 0;
}

.dimension-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.dimension-card h2 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #111;
  margin: 0 0 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f3f4f6;
}

.question-block {
  margin-bottom: 1.25rem;
}

.question-prompt {
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.6rem;
  line-height: 1.4;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.option-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.925rem;
  color: #333;
  cursor: pointer;
  line-height: 1.4;
}

.option-label input[type="radio"] {
  margin-top: 2px;
  flex-shrink: 0;
  accent-color: #3b82f6;
}

.no-pref {
  color: #888;
  font-style: italic;
}

.importance-row {
  margin-top: 1rem;
  padding-top: 0.875rem;
  border-top: 1px solid #f3f4f6;
}

.importance-label {
  font-size: 0.825rem;
  color: #777;
  margin: 0 0 0.5rem;
}

.importance-options {
  display: flex;
  gap: 1.5rem;
}

.imp-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  color: #444;
  cursor: pointer;
}

.imp-label input[type="radio"] {
  accent-color: #3b82f6;
}

/* Dealbreakers */
.dealbreaker-card h2 {
  color: #b91c1c;
  border-bottom-color: #fee2e2;
}

.db-instruction {
  font-size: 0.9rem;
  color: #555;
  margin: 0 0 1rem;
  line-height: 1.5;
}

.db-option {
  margin-bottom: 0.6rem;
}

.db-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.925rem;
  color: #333;
  cursor: pointer;
  line-height: 1.4;
}

.db-label input[type="checkbox"] {
  margin-top: 2px;
  flex-shrink: 0;
  accent-color: #dc2626;
}

.db-label input:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.db-max-note {
  font-size: 0.8rem;
  color: #b91c1c;
  margin-top: 0.5rem;
}

/* Submit */
.submit-error {
  color: #dc2626;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
}

.submit-btn {
  width: 100%;
  padding: 0.875rem;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #2563eb;
}

.submit-btn:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}

/* Closed / already submitted */
.submitted-card,
.closed-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
}

.submitted-card h2,
.closed-card h2 {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
}

/* Success overlay */
.success-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.success-card {
  background: #fff;
  border-radius: 16px;
  padding: 2.5rem;
  max-width: 380px;
  text-align: center;
}

.success-icon {
  font-size: 2.5rem;
  color: #16a34a;
  margin-bottom: 1rem;
}

.success-card h2 {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
}

.success-card p {
  color: #555;
  line-height: 1.5;
}
</style>
