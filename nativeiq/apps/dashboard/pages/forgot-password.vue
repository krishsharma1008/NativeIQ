<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  layout: false
});

const { resetPassword, loading, error } = useAuth();

const email = ref("");
const localError = ref<string | null>(null);
const success = ref(false);

const handleSubmit = async () => {
  localError.value = null;
  
  if (!email.value) {
    localError.value = "Please enter your email";
    return;
  }

  try {
    await resetPassword(email.value);
    success.value = true;
  } catch (e) {
    localError.value = e instanceof Error ? e.message : "Failed to send reset email";
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
        <h1>Reset password</h1>
        <p class="text-muted">
          {{ success ? "Check your email for reset instructions" : "Enter your email to receive a reset link" }}
        </p>
      </header>

      <!-- Success State -->
      <div v-if="success" class="auth-success">
        <div class="success-icon">✓</div>
        <p>We've sent a password reset link to <strong>{{ email }}</strong></p>
        <p class="text-muted">Didn't receive the email? Check your spam folder or try again.</p>
        <button type="button" class="ghost-button" @click="success = false">
          Try another email
        </button>
      </div>

      <!-- Form -->
      <form v-else class="auth-form" @submit.prevent="handleSubmit">
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

        <div v-if="localError || error" class="auth-error">
          {{ localError || error }}
        </div>

        <button type="submit" :disabled="loading" class="auth-button">
          {{ loading ? "Sending..." : "Send reset link" }}
        </button>
      </form>

      <footer class="auth-footer">
        <NuxtLink to="/login" class="auth-link">
          ← Back to sign in
        </NuxtLink>
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

.auth-success {
  text-align: center;
  padding: 1.5rem 0;
}

.success-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(146, 209, 176, 0.15);
  border: 2px solid var(--color-success);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: var(--color-success);
  margin: 0 auto 1.5rem;
}

.auth-success p {
  margin-bottom: 1rem;
}

.auth-success .ghost-button {
  margin-top: 1rem;
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

