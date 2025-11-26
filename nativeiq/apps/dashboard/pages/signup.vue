<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  layout: false
});

const { signUp, loading, error } = useAuth();

const fullName = ref("");
const email = ref("");
const password = ref("");
const orgName = ref("");
const localError = ref<string | null>(null);
const step = ref<"details" | "organization" | "confirmation">("details");

const goToOrgStep = () => {
  if (!fullName.value || !email.value || !password.value) {
    localError.value = "Please fill in all fields";
    return;
  }
  if (password.value.length < 6) {
    localError.value = "Password must be at least 6 characters";
    return;
  }
  localError.value = null;
  step.value = "organization";
};

const handleSubmit = async () => {
  localError.value = null;
  
  if (!orgName.value) {
    localError.value = "Please enter your organization name";
    return;
  }

  try {
    const result = await signUp(email.value, password.value, fullName.value, orgName.value);
    
    if (result?.needsConfirmation) {
      // Show email confirmation step
      step.value = "confirmation";
    } else {
      // Auto-confirmed, go to dashboard
      await navigateTo("/");
    }
  } catch (e) {
    localError.value = e instanceof Error ? e.message : "Signup failed";
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
        <h1>Create your account</h1>
        <p class="text-muted">
          {{ step === "details" ? "Enter your details to get started" : "Set up your organization" }}
        </p>
      </header>

      <!-- Step indicator -->
      <div class="step-indicator">
        <div class="step" :class="{ active: step === 'details', completed: step === 'organization' }">
          <span class="step__number">1</span>
          <span class="step__label">Details</span>
        </div>
        <div class="step__line" :class="{ active: step === 'organization' }" />
        <div class="step" :class="{ active: step === 'organization' }">
          <span class="step__number">2</span>
          <span class="step__label">Organization</span>
        </div>
      </div>

      <!-- Step 1: User Details -->
      <form v-if="step === 'details'" class="auth-form" @submit.prevent="goToOrgStep">
        <div class="form-group">
          <label for="fullName">Full name</label>
          <input
            id="fullName"
            v-model="fullName"
            type="text"
            placeholder="John Doe"
            autocomplete="name"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">Work email</label>
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
            placeholder="At least 6 characters"
            autocomplete="new-password"
            required
          />
        </div>

        <div v-if="localError" class="auth-error">
          {{ localError }}
        </div>

        <button type="submit" class="auth-button">
          Continue
        </button>
      </form>

      <!-- Step 3: Email Confirmation -->
      <div v-else-if="step === 'confirmation'" class="auth-success">
        <div class="success-icon">✉️</div>
        <h3>Check your email</h3>
        <p>We've sent a confirmation link to <strong>{{ email }}</strong></p>
        <p class="text-muted">Click the link in the email to verify your account and complete setup.</p>
        <div class="auth-success__actions">
          <NuxtLink to="/login" class="auth-button">Go to login</NuxtLink>
        </div>
      </div>

      <!-- Step 2: Organization -->
      <form v-else-if="step === 'organization'" class="auth-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="orgName">Organization name</label>
          <input
            id="orgName"
            v-model="orgName"
            type="text"
            placeholder="Acme Inc."
            required
          />
          <span class="form-hint">This is your team's workspace name</span>
        </div>

        <div v-if="localError || error" class="auth-error">
          {{ localError || error }}
        </div>

        <div class="auth-form__actions">
          <button type="button" class="ghost-button" @click="step = 'details'">
            Back
          </button>
          <button type="submit" :disabled="loading" class="auth-button">
            {{ loading ? "Creating..." : "Create account" }}
          </button>
        </div>
      </form>

      <footer class="auth-footer">
        <p>
          Already have an account?
          <NuxtLink to="/login" class="auth-link">Sign in</NuxtLink>
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
  right: -100px;
}

.auth-glow--2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(118, 136, 99, 0.2), transparent 70%);
  bottom: -150px;
  left: -100px;
}

.auth-card {
  width: 100%;
  max-width: 460px;
  padding: 2.5rem;
  position: relative;
  z-index: 1;
}

.auth-header {
  text-align: center;
  margin-bottom: 1.5rem;
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

.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.step.active,
.step.completed {
  opacity: 1;
}

.step__number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 600;
}

.step.active .step__number {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: #0f1514;
}

.step.completed .step__number {
  background: var(--color-success);
  border-color: var(--color-success);
  color: #0f1514;
}

.step__label {
  font-size: 0.85rem;
  font-weight: 500;
}

.step__line {
  width: 40px;
  height: 2px;
  background: rgba(255, 255, 255, 0.15);
  transition: background 0.2s;
}

.step__line.active {
  background: var(--color-accent);
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

.form-hint {
  font-size: 0.8rem;
  color: var(--color-muted);
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
  flex: 1;
}

.auth-form__actions {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.auth-form__actions .ghost-button {
  padding: 1rem 1.5rem;
}

.auth-footer {
  margin-top: 2rem;
  text-align: center;
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

.auth-success {
  text-align: center;
  padding: 1rem 0 2rem;
}

.success-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(147, 182, 180, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0 auto 1.5rem;
}

.auth-success h3 {
  margin: 0 0 1rem;
  font-size: 1.35rem;
}

.auth-success p {
  margin-bottom: 0.75rem;
}

.auth-success__actions {
  margin-top: 2rem;
}

.auth-success__actions .auth-button {
  display: inline-block;
  text-decoration: none;
  padding: 1rem 2rem;
  background: var(--color-accent);
  color: #0f1514;
  border-radius: 0.9rem;
  font-weight: 600;
}
</style>

