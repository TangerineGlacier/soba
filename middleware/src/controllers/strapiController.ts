import axios from "axios";
import { FilterAPI, generateURLString } from "../utils/helper";
import "dotenv/config";

export const getOneData = async (
  id: string,
  metricName: string,
  jwt: string,
  fields?: string[],
  populate?: string[]
) => {
  const fieldStr = generateURLString({ fields, populate });
  const resp = await axios.get(
    `${process.env.STRAPI_IP_ADDRESS}/api/${metricName}/${id}?${fieldStr}`,
    { headers: { Authorization: `Bearer ${jwt}` } }
  );
  return resp.data;
};

export const getFilteredData = async (
  metricName: string,
  jwt: string,
  relation?: FilterAPI[],
  data?: FilterAPI[],
  fields?: string[],
  populate?: string[]
) => {
  const filterStr = generateURLString({
    fields,
    populate,
    relationFilter: relation,
    dataFilter: data,
  });
  const resp = await axios.get(
    `${process.env.STRAPI_IP_ADDRESS}/api/${metricName}?${filterStr}`,
    { headers: { Authorization: `Bearer ${jwt}` } }
  );
  return resp.data;
};

export const updateData = async (
  metricName: string,
  id: string,
  formData: any,
  jwt: string,
  fields?: string[],
  populate?: string[]
) => {
  const payload = metricName === "users" ? formData : { data: formData };
  const fieldStr = generateURLString({ fields, populate });
  const resp = await axios.put(
    `${process.env.STRAPI_IP_ADDRESS}/api/${metricName}/${id}?${fieldStr}`,
    payload,
    { headers: { Authorization: `Bearer ${jwt}` } }
  );
  return resp.data;
};

export const createData = async (
  metricName: string,
  formData: any,
  jwt: string,
  fields?: string[],
  populate?: string[]
) => {
  const fieldStr = generateURLString({ fields, populate });
  const resp = await axios.post(
    `${process.env.STRAPI_IP_ADDRESS}/api/${metricName}?${fieldStr}`,
    { data: formData },
    { headers: { Authorization: `Bearer ${jwt}` } }
  );
  return resp.data;
};

export const deleteData = async (
  metricName: string,
  id: string,
  jwt: string
) => {
  const resp = await axios.delete(
    `${process.env.STRAPI_IP_ADDRESS}/api/${metricName}/${id}`,
    { headers: { Authorization: `Bearer ${jwt}` } }
  );
  return resp.data;
};

export const findQueryUse = async (
  metric: string,
  query: string,
  jwt: string
) => {
  const response = await fetch(
    `${process.env.STRAPI_IP_ADDRESS}/api/${metric}?${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.log("error--->", errorData);
    throw new Error(errorData?.message || "Request failed");
  }

  const respData = await response.json();
  return respData;
};
