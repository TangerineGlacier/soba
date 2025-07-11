import { Request, Response, Router } from "express";
import {
  getGoogleEmail,
  getMicrosoftEmail,
  LoginUserGrabJwt,
  RegisterUserGrabJwt,
} from "../controllers/loginController";
import { getFilteredData, getOneData } from "../controllers/strapiController";
import { authenticateToken } from "../middleware";

const router = Router();

router.post("/signin/:provider", async (req: Request, res: Response) => {
  const provider = req.params.provider;
  const access_token = req.body.access_token;
  if (!access_token) {
    res.status(401).json({ message: "Access token is required" });
    return;
  }
  try {
    const { email, firstName, lastName } =
      provider === "google"
        ? await getGoogleEmail(access_token)
        : await getMicrosoftEmail(access_token);
    const resp = await getFilteredData(
      "users",
      process.env.STRAPI_API_KEY ?? "",
      [],
      [{ filterKey: "email", filterValue: email.toLowerCase() }],
      [],
      []
    );
    if (resp.length === 0) {
      const data = await RegisterUserGrabJwt(
        email.toLowerCase(),
        firstName,
        lastName
      );
      res.status(200).json(data);
      return;
    }
    if (resp.length === 1) {
      const data = await LoginUserGrabJwt(email.toLowerCase());
      res.status(200).json(data);
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Something went wrong" });
  }
});

router.get("/", authenticateToken, async (req: Request, res: Response) => {
  const id = req.user;
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  try {
    const data = await getOneData(
      id as string,
      "users",
      token as string,
      [],
      []
    );
    const response = {
      id: data.id,
      username: data.username,
      email: data.email,
      profilePhoto: null,
      createdAt: data.createdAt,
      firstName: data.FirstName,
      lastName: data.LastName,
    };
    res.json(response);
  } catch (e) {
    console.log(e);
    res.status(401).json({ message: "Invalid request" });
  }
});

export default router;
