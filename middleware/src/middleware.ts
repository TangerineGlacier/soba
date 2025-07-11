import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import "dotenv/config";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("token", process.env.JWT_SECRET);
  if (token == null) {
    res.sendStatus(401); // If there's no token, respond with 401 (Unauthorized)
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user: any) => {
    if (err) {
      console.log("error", err);
      res.sendStatus(403);
      return; // If the token is invalid, respond with 403 (Forbidden)
    }
    req.user = user?.id; // Attach the decoded user information to the request object
    next(); // Pass control to the next handler
  });
};
