import { createContext, useContext } from "react";
import type {
  LoginInterface,
  SignInProviders,
  UserInterface,
} from "../Models/userModel";

interface AuthProviderInterface {
  user: UserInterface | undefined;
  jwt: string | null;
  signIn: (
    access_token: string,
    provider: SignInProviders
  ) => Promise<LoginInterface>;
  signOut: () => void;
  isAuthenticating: boolean;
}

export const AuthProviderContext = createContext<AuthProviderInterface | null>(
  null
);

export const useUserAuth = () => {
  const ctx = useContext(AuthProviderContext);
  if (!ctx) {
    throw new Error("useUserAuth should be used inside AuthProvider only");
  }
  return ctx;
};
