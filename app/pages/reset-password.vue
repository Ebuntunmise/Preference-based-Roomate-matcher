<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Set New Password</h1>
      <p class="subtitle">Choose a new password for your account.</p>

      <div v-if="done" class="success-msg">
        Password updated. <NuxtLink to="/login">Log in</NuxtLink>
      </div>

      <form v-else @submit.prevent="handleUpdate">
        <div class="field">
          <label for="password">New Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="At least 8 characters"
            minlength="8"
            required
            :disabled="loading"
          />
        </div>

        <div class="field">
          <label for="confirm">Confirm Password</label>
          <input
            id="confirm"
            v-model="form.confirm"
            type="password"
            placeholder="Repeat your new password"
            minlength="8"
            required
            :disabled="loading"
          />
        </div>

        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Updating…' : 'Update Password' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $supabase } = useNuxtApp()

const form = reactive({ password: '', confirm: '' })
const loading = ref(false)
const errorMsg = ref('')
const done = ref(false)

async function handleUpdate() {
  if (form.password !== form.confirm) {
    errorMsg.value = 'Passwords do not match.'
    return
  }

  loading.value = true
  errorMsg.value = ''

  const { error } = await $supabase.auth.updateUser({ password: form.password })

  if (error) {
    errorMsg.value = error.message
    loading.value = false
    return
  }

  done.value = true
  loading.value = false
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  padding: 1rem;
}

.auth-card {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
}

h1 {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 0.25rem;
  color: #1a1a1a;
}

.subtitle {
  color: #666;
  margin: 0 0 1.5rem;
  font-size: 0.9rem;
}

.field {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.35rem;
}

input {
  width: 100%;
  padding: 0.65rem 0.75rem;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #3b82f6;
}

input:disabled {
  background: #f9f9f9;
  color: #999;
}

button {
  width: 100%;
  padding: 0.75rem;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s;
}

button:hover:not(:disabled) {
  background: #2563eb;
}

button:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}

.error {
  color: #dc2626;
  font-size: 0.875rem;
  margin: 0.5rem 0;
}

.success-msg {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 1rem;
  color: #166534;
  font-size: 0.9rem;
}

.success-msg a {
  color: #166534;
  font-weight: 600;
}
</style>
