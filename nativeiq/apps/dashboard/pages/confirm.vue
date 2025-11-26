<script setup lang="ts">
definePageMeta({
  layout: false
});

// This page handles Supabase auth callbacks (email confirmation, password reset, etc.)
// The @nuxtjs/supabase module automatically handles the token exchange
const { initialize } = useAuth();

onMounted(async () => {
  await initialize();
  // Redirect to dashboard after successful confirmation
  await navigateTo("/");
});
</script>

<template>
  <div class="confirm-page">
    <div class="confirm-card card-surface">
      <div class="confirm-spinner" />
      <p>Confirming your account...</p>
    </div>
  </div>
</template>

<style scoped>
.confirm-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.confirm-card {
  padding: 3rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.confirm-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

