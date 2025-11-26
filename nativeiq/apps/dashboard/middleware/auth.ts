export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser();
  
  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/signup", "/forgot-password", "/confirm"];
  
  if (publicRoutes.includes(to.path)) {
    // If user is already logged in and tries to access auth pages, redirect to dashboard
    if (user.value) {
      return navigateTo("/");
    }
    return;
  }
  
  // Protected routes require authentication
  if (!user.value) {
    return navigateTo("/login");
  }
});

