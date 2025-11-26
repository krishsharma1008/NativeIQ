import { ref, computed } from "vue";
import type { User, Session } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  organization_id: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: "owner" | "admin" | "member";
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export function useAuth() {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  
  const profile = ref<Profile | null>(null);
  const organization = ref<Organization | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!user.value);
  const hasOrganization = computed(() => !!profile.value?.organization_id);

  const initials = computed(() => {
    if (!profile.value?.full_name) return "U";
    return profile.value.full_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  });

  async function fetchProfile() {
    if (!user.value) return null;

    const { data, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.value.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return null;
    }

    profile.value = data;
    return data;
  }

  async function fetchOrganization() {
    if (!profile.value?.organization_id) return null;

    const { data, error: orgError } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", profile.value.organization_id)
      .single();

    if (orgError) {
      console.error("Error fetching organization:", orgError);
      return null;
    }

    organization.value = data;
    return data;
  }

  async function signUp(email: string, password: string, fullName: string, orgName: string) {
    loading.value = true;
    error.value = null;

    try {
      // Create the user account with org name stored in metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            pending_org_name: orgName
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("User creation failed");

      // Check if email confirmation is required (no session means confirmation needed)
      const needsConfirmation = !authData.session;
      
      if (needsConfirmation) {
        // Store org name in localStorage for after confirmation
        localStorage.setItem("pending_org_name", orgName);
        return { user: authData.user, organization: null, needsConfirmation: true };
      }

      // If auto-confirmed (dev mode or magic link), create org immediately
      const orgResult = await createOrganization(orgName, authData.user.id);
      return { user: authData.user, organization: orgResult, needsConfirmation: false };
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Signup failed";
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function createOrganization(orgName: string, userId?: string) {
    const targetUserId = userId || user.value?.id;
    if (!targetUserId) throw new Error("No user ID available");

    const slug = orgName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const { data: orgData, error: orgError } = await supabase
      .from("organizations")
      .insert({ name: orgName, slug: `${slug}-${Date.now()}` })
      .select()
      .single();

    if (orgError) throw orgError;

    // Update profile with organization and role
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        organization_id: orgData.id,
        role: "owner"
      })
      .eq("id", targetUserId);

    if (profileError) throw profileError;

    await fetchProfile();
    await fetchOrganization();

    return orgData;
  }

  async function completePendingSetup() {
    if (!user.value) return null;

    const pendingOrgName = localStorage.getItem("pending_org_name");
    if (!pendingOrgName) return null;

    try {
      const org = await createOrganization(pendingOrgName);
      localStorage.removeItem("pending_org_name");
      return org;
    } catch (e) {
      console.error("Failed to complete pending setup:", e);
      return null;
    }
  }

  async function signIn(email: string, password: string) {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      await fetchProfile();
      await fetchOrganization();

      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Login failed";
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function signOut() {
    loading.value = true;
    error.value = null;

    try {
      const { error: authError } = await supabase.auth.signOut();
      if (authError) throw authError;

      profile.value = null;
      organization.value = null;

      await navigateTo("/login");
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Logout failed";
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function resetPassword(email: string) {
    loading.value = true;
    error.value = null;

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (resetError) throw resetError;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Password reset failed";
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function updateProfile(updates: Partial<Profile>) {
    if (!user.value) return;

    loading.value = true;
    error.value = null;

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.value.id);

      if (updateError) throw updateError;

      await fetchProfile();
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Profile update failed";
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function joinOrganization(inviteToken: string) {
    if (!user.value) return;

    loading.value = true;
    error.value = null;

    try {
      // Get invite details
      const { data: invite, error: inviteError } = await supabase
        .from("organization_invites")
        .select("*")
        .eq("token", inviteToken)
        .eq("status", "pending")
        .single();

      if (inviteError || !invite) throw new Error("Invalid or expired invite");

      // Check if invite is expired
      if (new Date(invite.expires_at) < new Date()) {
        throw new Error("Invite has expired");
      }

      // Update profile with organization
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          organization_id: invite.organization_id,
          role: "member"
        })
        .eq("id", user.value.id);

      if (profileError) throw profileError;

      // Mark invite as accepted
      await supabase
        .from("organization_invites")
        .update({ status: "accepted" })
        .eq("id", invite.id);

      await fetchProfile();
      await fetchOrganization();
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to join organization";
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function initialize() {
    if (user.value) {
      await fetchProfile();
      
      // Check if user has pending org setup from signup
      if (!profile.value?.organization_id) {
        await completePendingSetup();
      }
      
      if (profile.value?.organization_id) {
        await fetchOrganization();
      }
    }
  }

  return {
    user,
    profile,
    organization,
    loading,
    error,
    isAuthenticated,
    hasOrganization,
    initials,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    joinOrganization,
    createOrganization,
    completePendingSetup,
    fetchProfile,
    fetchOrganization,
    initialize
  };
}

