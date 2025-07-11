export type SignInProviders = "google" | "microsoft";

export interface UserInterface {
  name: string;
  id: number;
  profilePhoto: string | null;
}

export interface LoginInterface {
  user: UserInterface;
  jwt: string;
}