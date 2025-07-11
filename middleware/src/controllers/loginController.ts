import axios from "axios";
import { GOOGLE_URL, MICROSOFT_GRAPH_URL } from "../utils/constants";
import { UserResponse } from "../models/apiModel";
import { getOneData, updateData } from "./strapiController";

const DEFAULT_PASSWORD = "default";

export const LoginUserGrabJwt = async (email: string) => {
  const Payload = {
    identifier: email,
    username: email,
    email: email,
    password: `${DEFAULT_PASSWORD}`,
  };

  const URL = `${process.env.STRAPI_IP_ADDRESS}/api/auth/local?populate=*`;

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_API_KEY || ""}`,
      },
      body: JSON.stringify(Payload),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return {
      jwt: data.jwt,
      user: {
        id: data.user.id,
        profilePhoto: null,
        email: data.user.email,
        username: data.user.username,
        createdAt: data.user.createdAt,
        lastName: data.user.LastName,
        firstName: data.user.FirstName,
      },
    };
  } catch (error) {
    console.error("Error logging in user:", error);
    return null;
  }
};

export const RegisterUserGrabJwt = async (
  email: string,
  firstName = "",
  lastName = ""
) => {
  try {
    const URL = `${process.env.STRAPI_IP_ADDRESS}/api/auth/local/register?populate=*`;
    const payload = {
      email: email,
      password: `${DEFAULT_PASSWORD}`,
      username: email,
    };

    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.STRAPI_API_KEY || ""}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const id = data.user.id;
    const patchPayload = {
      FirstName: firstName,
      LastName: lastName,
    };
    await updateData(
      "users",
      id,
      patchPayload,
      process.env.STRAPI_API_KEY ?? "",
      [],
      []
    );
    return {
      jwt: data.jwt,
      user: {
        firstName,
        lastName,
        id: data.user.id,
        profilePhoto: null,
        email: data.user.email,
        username: data.user.username,
        createdAt: data.user.createdAt,
      },
    };
  } catch (error) {
    console.error("Error registering user:", error);
    return null;
  }
};

export const getGoogleEmail = async (token: string): Promise<UserResponse> => {
  try {
    const resp = await axios.get(GOOGLE_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("dataResp", resp.data);
    if (resp?.data?.email) {
      return {
        email: resp.data.email,
        firstName: resp.data.given_name ?? "",
        lastName: resp.data.family_name ?? "",
      };
    } else {
      throw new Error("Access token invalid or email not found");
    }
  } catch (e) {
    throw new Error("Access token invalid " + e);
  }
};

export const getMicrosoftEmail = async (
  token: string
): Promise<UserResponse> => {
  try {
    const resp = await axios.get(MICROSOFT_GRAPH_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (resp?.data?.mail) {
      return {
        email: resp.data.mail,
        firstName: resp.data.givenName ?? "",
        lastName: resp.data.surname ?? "",
      };
    } else {
      console.log("here????");
      throw new Error(`Access token invalid`);
    }
  } catch (e) {
    throw new Error(`Access token invalid: ${e}`);
  }
};
