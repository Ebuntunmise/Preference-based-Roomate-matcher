<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Create Account</h1>
      <p class="subtitle">Adeleke University Hostel Allocation</p>

      <form @submit.prevent="handleSignup">
        <div class="field">
          <label for="fullName">Full Name</label>
          <input
            id="fullName"
            v-model="form.fullName"
            type="text"
            placeholder="e.g. Adeyemi Tunmise"
            required
            :disabled="loading"
          />
        </div>

        <div class="field">
          <label for="matricNumber">Matric Number</label>
          <input
            id="matricNumber"
            v-model="form.matricNumber"
            type="text"
            placeholder="e.g. AUI/2021/CSC/001"
            required
            :disabled="loading"
          />
        </div>

        <div class="field">
          <label for="gender">Gender</label>
          <select id="gender" v-model="form.gender" required :disabled="loading">
            <option value="" disabled>Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

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

        <div class="field">
          <label for="password">Password</label>
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

        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Creating account…' : 'Sign Up' }}
        </button>
      </form>

      <p class="switch">
        Already have an account? <NuxtLink to="/login">Log in</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $supabase } = useNuxtApp()
const router = useRouter()

const form = reactive({
  fullName: '',
  matricNumber: '',
  gender: '',
  email: '',
  password: '',
})

const loading = ref(false)
const errorMsg = ref('')

async function handleSignup() {
  loading.value = true
  errorMsg.value = ''

  const { error } = await $supabase.auth.signUp({
    email: form.email,
    password: form.password,
    options: {
      data: {
        full_name: form.fullName,
        matric_number: form.matricNumber,
        gender: form.gender,
      },
    },
  })

  if (error) {
    errorMsg.value = error.message
    loading.value = false
    return
  }

  // Signup succeeded — go to the intake form
  router.push('/intake')
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

input,
select {
  width: 100%;
  padding: 0.65rem 0.75rem;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
  background: #fff;
}

input:focus,
select:focus {
  outline: none;
  border-color: #3b82f6;
}

input:disabled,
select:disabled {
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

.switch {
  text-align: center;
  margin-top: 1.25rem;
  font-size: 0.875rem;
  color: #555;
}

.switch a {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
}
</style>
