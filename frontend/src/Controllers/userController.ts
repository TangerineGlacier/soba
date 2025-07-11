import axios from "axios";
import { setBaseUrl } from "../Utils/helper";
import toast from "react-hot-toast";
import type {
  LoginInterface,
  SignInProviders,
  UserInterface,
} from "../Models/userModel";

export const fetchUserDetails = async (
  token: string
): Promise<UserInterface> => {
  try {
    const url = setBaseUrl("/auth");
    const data = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.data;
  } catch (e) {
    console.log(e);
    toast.error("Failed to fetch user");
    throw new Error("Failed to fetch user");
  }
};

export const authLogin = async (
  access_token: string,
  provider: SignInProviders
): Promise<LoginInterface> => {
  // Handle access token
  try {
    const url = setBaseUrl(`/auth/sign-in/${provider}`);
    const resp = await axios.post(
      url,
      { token: access_token },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return resp.data;
  } catch (e) {
    console.log(e);
    toast.error("Error logging in user");
    throw new Error("Error logging in user");
  }
};
