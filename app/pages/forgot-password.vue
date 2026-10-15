<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Reset Password</h1>
      <p class="subtitle">Enter your email and we'll send you a reset link.</p>

      <div v-if="sent" class="success-msg">
        Check your inbox — a password reset link has been sent to <strong>{{ form.email }}</strong>.
      </div>

      <form v-else @submit.prevent="handleReset">
        <div class="field">
          <label for="email">Email Address</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="your.email@adelekeuniversity.edu.ng"
            required
            :disabled="loading"
          />
        </div>

        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Sending…' : 'Send Reset Link' }}
        </button>
      </form>

      <p class="switch">
        <NuxtLink to="/login">Back to login</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $supabase } = useNuxtApp()

const form = reactive({ email: '' })
const loading = ref(false)
const errorMsg = ref('')
const sent = ref(false)

async function handleReset() {
  loading.value = true
  errorMsg.value = ''

  const { error } = await $supabase.auth.resetPasswordForEmail(form.email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })

  if (error) {
    errorMsg.value = error.message
    loading.value = false
    return
  }

  sent.value = true
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
  line-height: 1.5;
  margin-bottom: 1rem;
}

.switch {
  text-align: center;
  margin-top: 1.25rem;
  font-size: 0.875rem;
}

.switch a {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
}
</style>
