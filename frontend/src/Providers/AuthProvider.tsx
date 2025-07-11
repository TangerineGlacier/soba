import React, { useCallback, useState } from "react";
import { AuthProviderContext } from "../Hooks/useUserAuth";
import type { SignInProviders, UserInterface } from "../Models/userModel";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authLogin, fetchUserDetails } from "../Controllers/userController";
import { navigate } from "raviger";

const fetchCurrentUser = async (token: string): Promise<UserInterface> => {
  try {
    const data = await fetchUserDetails(token);
    return data;
  } catch (e) {
    console.log(e);
    throw new Error("Error fetching user");
  }
};

const AuthProvider = ({
  PublicRoutes,
  children,
}: {
  PublicRoutes: React.ReactNode;
  children: React.ReactNode;
}) => {
  const queryClient = useQueryClient();
  const [jwt, setJwt] = useState(sessionStorage.getItem(`jwt`));
  const [loading, setLoading] = useState(false);
  const {
    data: user,
    refetch,
    isFetching,
  } = useQuery<UserInterface>({
    queryKey: ["currentUser"],
    queryFn: () => fetchCurrentUser(sessionStorage.getItem("jwt")!),
    enabled: !!sessionStorage.getItem("jwt"),
    retry: false,
  });
  const signIn = useCallback(
    async (access_token: string, provider: SignInProviders) => {
      setLoading(true);
      const res = await authLogin(access_token, provider);

      const data = res as { user: UserInterface; jwt: string };

      localStorage.setItem("accessjwt", data.jwt);
      setJwt(data.jwt);
      await refetch(); // Refetch user after login
      setLoading(false);
      navigate("/");
      return data;
    },
    [refetch]
  );

  const signOut = useCallback(async () => {
    localStorage.removeItem("accessjwt");
    setJwt(null);
    queryClient.clear(); // Clear cache
  }, [queryClient]);

  if (isFetching && jwt)
    return (
      <div className=" flex flex-col h-full w-full items-center justify-center">
        Loading...
      </div>
    );
  return (
    <AuthProviderContext.Provider
      value={{ user, jwt, signOut, isAuthenticating: loading, signIn }}
    >
      {user ? children : PublicRoutes}
    </AuthProviderContext.Provider>
  );
};

export default AuthProvider;
