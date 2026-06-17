import { trpc } from "@/providers/trpc";
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { LOGIN_PATH } from "@/const";
import { getAdminSession, clearAdminSession } from "./adminAuth";
import { getMarketerSession, clearMarketerSession } from "./marketerAuth";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = LOGIN_PATH } =
    options ?? {};

  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const {
    data: serverUser,
    isLoading: serverLoading,
    error,
    refetch,
  } = trpc.auth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  // Check for admin password session (for static deployment)
  const adminSession = getAdminSession()
  // Check for marketer password session
  const marketerSession = getMarketerSession()

  // Build unified user object
  const user = serverUser ?? adminSession?.user ?? (marketerSession ? {
    id: 0,
    name: marketerSession.name,
    username: marketerSession.username,
    email: '',
    avatar: '',
    role: 'marketer',
    rank: marketerSession.rank,
    referralCode: marketerSession.referralCode,
    balance: '0',
    rankId: 1,
    parentId: null,
    createdAt: new Date(),
    lastSignInAt: new Date(),
  } : null)

  const isLoading = serverLoading && !adminSession && !marketerSession
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin'

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
      navigate(redirectPath);
    },
  });

  const logout = useCallback(() => {
    // Always clear all sessions
    clearAdminSession()
    clearMarketerSession()
    // Also clear any old demo data
    localStorage.removeItem('nxv-auth-token')
    localStorage.removeItem('nxv-user')
    // Also call server logout if available
    logoutMutation.mutate()
    window.location.reload()
  }, [logoutMutation]);

  useEffect(() => {
    if (redirectOnUnauthenticated && !isLoading && !user) {
      const currentPath = window.location.pathname;
      if (currentPath !== redirectPath) {
        navigate(redirectPath);
      }
    }
  }, [redirectOnUnauthenticated, isLoading, user, navigate, redirectPath]);

  return useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin,
      isLoading: isLoading || logoutMutation.isPending,
      error,
      logout,
      refresh: refetch,
    }),
    [user, isAdmin, isLoading, logoutMutation.isPending, error, logout, refetch],
  );
}
