import { Request, Response, Router } from "express";
import { convertKeysToLowercase } from "../utils/helper";
import {
  queryMySQL,
  queryPinot,
  queryPostgres,
} from "../controllers/widgetController";
import { authenticateToken } from "../middleware";
import { getMultipleFilters } from "../controllers/vectorDbController";
import axios from "axios";
import { supportedDataProducts } from "./sourceRouter";

const router = Router();
router.post(
  "/query",
  authenticateToken,
  async (req: Request, res: Response) => {
    console.log("reached");
    let { sql, dbType, dbConfig } = req.body;
    dbConfig = convertKeysToLowercase(dbConfig);

    dbConfig = {
      user: dbConfig?.user || dbConfig?.username,
      ...dbConfig,
    };
    console.log("config", dbConfig);
    // Validate the request body
    dbConfig.port = Number(dbConfig.port);
    if (!sql || !dbType || !dbConfig) {
      res.status(400).json({
        error:
          "SQL query, dbType, and dbConfig are required in the request body",
      });
      return;
    }

    try {
      let result: any;
      switch (dbType.toLowerCase()) {
        case "mysql":
          result = await queryMySQL(sql, dbConfig);
          break;
        case "postgres":
          result = await queryPostgres(sql, dbConfig);
          break;
        case "pinot":
          result = await queryPinot(sql, dbConfig);
          break;
        default:
          res.status(400).json({ error: "Unsupported database type" });
          return;
      }

      res.json(result);
    } catch (e: any) {
      console.log(e);
      res.status(400).json({
        error: e.sqlMessage,
      });
    }
  }
);

router.get(
  "/datasources/:space",
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
      const dataProducts = await axios.get(
        `${process.env.HAYA_STRAPI_IP_ADDRESS}/api/data-products?filters[$or][0][Name][$eq]=${supportedDataProducts.mySql}&filters[$or][1][Name][$eq]=${supportedDataProducts.pinot}&filters[$or][2][Name][$eq]=${supportedDataProducts.postgres}`
      );
      res.json(
        resp.map((a: any) => ({
          data_product: a.payload.data_product,
          name: a.payload.name,
          description: a.payload.description,
          tags: a.payload.tags,
          user_id: a.payload.user_id,
          id: a.payload.id,
          config: a.payload.config,
          image:
            dataProducts.data.data.find(
              (im: any) => im.attributes.Name === a.payload.data_product
            )?.attributes?.Image ?? null,
        }))
      );
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Something went wrong" });
    }
  }
);

export default router;
