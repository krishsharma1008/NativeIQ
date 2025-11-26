<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  layout: false
});

const { signIn, loading, error } = useAuth();

const email = ref("");
const password = ref("");
const localError = ref<string | null>(null);

const handleSubmit = async () => {
  localError.value = null;
  
  if (!email.value || !password.value) {
    localError.value = "Please fill in all fields";
    return;
  }

  try {
    await signIn(email.value, password.value);
    await navigateTo("/");
  } catch (e) {
    localError.value = e instanceof Error ? e.message : "Login failed";
  }
};
</script>

<template>
  <div class="auth-page">
    <div class="auth-glow auth-glow--1" />
    <div class="auth-glow auth-glow--2" />
    
    <div class="auth-card card-surface">
      <header class="auth-header">
        <div class="auth-logo">
          <span class="auth-logo__icon">N</span>
          <span class="auth-logo__text">NativeIQ</span>
        </div>
        <h1>Welcome back</h1>
        <p class="text-muted">Sign in to your account to continue</p>
      </header>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="you@company.com"
            autocomplete="email"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            autocomplete="current-password"
            required
          />
        </div>

        <div v-if="localError || error" class="auth-error">
          {{ localError || error }}
        </div>

        <button type="submit" :disabled="loading" class="auth-button">
          {{ loading ? "Signing in..." : "Sign in" }}
        </button>
      </form>

      <footer class="auth-footer">
        <NuxtLink to="/forgot-password" class="auth-link">
          Forgot your password?
        </NuxtLink>
        <p>
          Don't have an account?
          <NuxtLink to="/signup" class="auth-link">Sign up</NuxtLink>
        </p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.auth-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  pointer-events: none;
}

.auth-glow--1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(147, 182, 180, 0.25), transparent 70%);
  top: -200px;
  left: -100px;
}

.auth-glow--2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(118, 136, 99, 0.2), transparent 70%);
  bottom: -150px;
  right: -100px;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  padding: 2.5rem;
  position: relative;
  z-index: 1;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.auth-logo__icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.5rem;
  color: #0f1514;
}

.auth-logo__text {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.auth-header h1 {
  margin: 0 0 0.5rem;
  font-size: 1.75rem;
  font-weight: 600;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-muted);
}

.form-group input {
  padding: 0.875rem 1rem;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(147, 182, 180, 0.15);
}

.auth-error {
  padding: 0.875rem 1rem;
  background: rgba(255, 138, 138, 0.1);
  border: 1px solid rgba(255, 138, 138, 0.3);
  border-radius: 0.75rem;
  color: var(--color-danger);
  font-size: 0.9rem;
}

.auth-button {
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 0.5rem;
}

.auth-footer {
  margin-top: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.auth-footer p {
  color: var(--color-muted);
}

.auth-link {
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.auth-link:hover {
  color: var(--color-highlight);
}
</style>

