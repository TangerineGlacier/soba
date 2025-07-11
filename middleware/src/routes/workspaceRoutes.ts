import { Request, Response, Router } from "express";
import { authenticateToken } from "../middleware";
import { createData, findQueryUse } from "../controllers/strapiController";

const router = Router();

router.get("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const id = req.user;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const query = `filters[$or][0][admins][id][$eq]=${id}&filters[$or][1][viewers][id][$eq]=${id}&filters[$or][2][developers][id][$eq]=${id}`;
    const response = await findQueryUse(
      "organizations",
      query,
      token as string
    );
    res.json(response.data);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Something went wrong" });
  }
});

router.get(
  "/:space",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const id = req.user;
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      const spaceUrl = req.params.space;
      const query = `filters[url][$eq]=${spaceUrl}&filters[$or][0][admins][id][$eq]=${id}&filters[$or][1][viewers][id][$eq]=${id}&filters[$or][2][developers][id][$eq]=${id}`;
      const response = await findQueryUse(
        "organizations",
        query,
        token as string
      );
      if (response.data.length === 0) {
        res.status(404).json({ message: "Workspace not found" });
        return;
      }
      const finalResp = {
        id: response.data[0].id,
        documentId: response.data[0].documentId,
        name: response.data[0].name,
        url: response.data[0].url,
        createdAt: response.data[0].createdAt,
      };
      console.log("response", finalResp);
      res.json(finalResp);
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Something went wrong" });
    }
  }
);

router.post(
  "/checkvalid",
  authenticateToken,
  async (req: Request, res: Response) => {
    const spaceName = req.body.space;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    try {
      const query = `filters[url][$eq]=${spaceName}`;
      const response = await findQueryUse(
        "organizations",
        query,
        token as string
      );
      if (response.data.length === 0) {
        res.json({ isValid: true });
      } else {
        res.json({ isValid: false });
      }
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Something went wrong" });
    }
  }
);

router.post("/", authenticateToken, async (req: Request, res: Response) => {
  const spaceName = req.body.space;
  const spaceUrl = req.body.url;
  const userId = req.user;
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  try {
    const payload = {
      name: spaceName,
      url: spaceUrl,
      admins: {
        connect: [{ id: userId }],
      },
    };
    await createData("organizations", payload, token as string);
    res.json({ message: "New space created successfully" });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Something went wrong" });
  }
});

export default router;
