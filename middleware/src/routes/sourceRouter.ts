import { Request, Response, Router } from "express";
import { authenticateToken } from "../middleware";
import axios from "axios";
import {
  deleteDoc,
  getMultipleFilters,
  getSingleDocument,
  patchData,
  postData,
  view_schema,
} from "../controllers/vectorDbController";
import { convertKeysToLowercase } from "../utils/helper";

const router = Router();

export const supportedDataProducts = {
  mySql: "MySQL",
  pinot: "Pinot",
  postgres: "Postgres",
};

router.get(
  "/sourcelist",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const dataProducts = await axios.get(
        `${process.env.HAYA_STRAPI_IP_ADDRESS}/api/data-products?filters[$or][0][Name][$eq]=${supportedDataProducts.mySql}&filters[$or][1][Name][$eq]=${supportedDataProducts.pinot}&filters[$or][2][Name][$eq]=${supportedDataProducts.postgres}`
      );
      const finalResp = dataProducts.data.data.map((a: any) => ({
        name: a.attributes.Name,
        description: a.attributes.Description,
        schema: a.attributes.Schema,
        image: a.attributes.Image,
      }));
      res.json(finalResp);
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Something went wrong" });
    }
  }
);

router.post("/", authenticateToken, async (req: Request, res: Response) => {
  const userId = req.user;
  const payload = req.body;
  try {
    const id = Date.now();
    const finalPayload = {
      ...payload,
      user_id: String(userId),
      public: true,
      type: "connectors",
    };
    await postData(
      id,
      finalPayload,
      process.env.HAYA_APP_ID ?? "Visualization",
      "data-products"
    );
    res.json({ message: "Submitted Successfully" });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Something went wrong" });
  }
});

router.get(
  "/list/:space",
  authenticateToken,
  async (req: Request, res: Response) => {
    const spaceId = req.params.space;
    try {
      const filters = {
        filters: [{ key: "visualization_space", value: String(spaceId) }],
      };
      const resp = await getMultipleFilters(
        filters,
        process.env.HAYA_APP_ID ?? "Visualization",
        "data-products"
      );
      res.json(
        resp.map((a: any) => ({
          data_product: a.payload.data_product,
          name: a.payload.name,
          description: a.payload.description,
          tags: a.payload.tags,
          user_id: a.payload.user_id,
          id: a.payload.id,
        }))
      );
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Something went wrong" });
    }
  }
);

router.get(
  "/getone/:space/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const spaceId = req.params.space;
      const docId = req.params.id;
      const response = await getSingleDocument(
        docId,
        process.env.HAYA_APP_ID ?? "Visualization",
        "data-products"
      );
      if (
        response.length > 0 &&
        response[0].payload.visualization_space === spaceId
      ) {
        const a = response[0];
        const schema = await view_schema(
          convertKeysToLowercase({
            ...a.payload.config,
            source: a.payload.data_product,
          })
        );
        const finalResp = {
          data_product: a.payload.data_product,
          name: a.payload.name,
          description: a.payload.description,
          tags: a.payload.tags,
          user_id: a.payload.user_id,
          id: a.payload.id,
          metadata: a.payload.metadata,
          redaction: a.payload.redaction,
          additional_context: a.payload.additional_context,
          config: a.payload.config,
          schema: schema.tables,
        };
        res.json(finalResp);
      } else {
        res.status(404).json({ message: "Invalid request" });
      }
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Something went wrong" });
    }
  }
);

router.put(
  "/:space/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const spaceId = req.params.space;
    const id = req.params.id;
    const body = req.body;
    try {
      const response = await getSingleDocument(
        id,
        process.env.HAYA_APP_ID ?? "Visualization",
        "data-products"
      );
      if (
        response.length > 0 &&
        response[0].payload.visualization_space === spaceId
      ) {
        await patchData(
          body,
          id,
          process.env.HAYA_APP_ID ?? "Visualization",
          "data-products"
        );
        res.json({ message: "Source has been updated successfully" });
      } else {
        res.status(404).json({ message: "Invalid request" });
      }
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Something went wrong" });
    }
  }
);

router.delete(
  "/:space/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const spaceId = req.params.space;
      const id = req.params.id;
      const response = await getSingleDocument(
        id,
        process.env.HAYA_APP_ID ?? "Visualization",
        "data-products"
      );
      if (
        response.length > 0 &&
        response[0].payload.visualization_space === spaceId
      ) {
        await deleteDoc(
          id,
          process.env.HAYA_APP_ID ?? "Visualization",
          "data-products"
        );
        res.json({ message: "Source has been deleted successfully" });
      } else {
        res.status(404).json({ message: "Invalid request" });
      }
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Something went wrong" });
    }
  }
);

export default router;
