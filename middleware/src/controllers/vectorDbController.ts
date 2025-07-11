import axios from "axios";
import "dotenv/config";

export const postData = async (
  id: string | number,
  formData: any,
  tenant: string,
  collection: string
) => {
  try {
    // Generate timestamp as ID
    const url = `${process.env.HAYA_IP_ADDRESS}/doc/?id=${id}&app_id=${tenant}&collection_name=${collection}`;
    const resp = await axios.post(url, formData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const getSingleDocument = async (
  id: string,
  tenant: string,
  collection: string
) => {
  try {
    const url = `${process.env.HAYA_IP_ADDRESS}/doc/?collection_name=${collection}&app_id=${tenant}&id=${id}`;

    const resp = await axios.get(url, {
      headers: { Accept: "application/json" },
    });
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const getAllDocs = async (tenant : string,collection : string) => {
    try {
      const url = `${process.env.HAYA_IP_ADDRESS}/doc/all?app_id=${tenant}&collection_name=${collection}`;
      const resp = await axios.get(url,{headers : {"Accept" : "application/json"}});
      return resp.data;
    } catch (err) {
      throw err;
    }
  };

export const getMultipleFilters = async (
  filters: any,
  tenant: string,
  collection: string
) => {
  try {
    const url = `${process.env.HAYA_IP_ADDRESS}/knowledge-doc/filter?qdrant_collection=${collection}&app_id=${tenant}`;

    const resp = await axios.post(url, filters, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return resp.data.documents;
  } catch (error) {
    throw error;
  }
};

export const patchData = async (
  formData: any,
  id: string | number,
  tenant: string,
  collection: string
) => {
  try {
    const url = `${process.env.HAYA_IP_ADDRESS}/doc/meta?id=${id}&app_id=${tenant}&collection_name=${collection}`;
    const resp = await axios.patch(url, formData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const patchAllData = async (
  formData: any,
  id: string | number,
  tenant: string,
  collection: string
) => {
  try {
    const url = `${process.env.HAYA_IP_ADDRESS}/knowledge-management/patch?id=${id}&app_id=${tenant}&collection_name=${collection}`;
    const resp = await axios.patch(url, formData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const postIngest = async (
  id: string | number,
  formData: any,
  tenant: string,
  collection: string
) => {
  try {
    const url = `${process.env.HAYA_IP_ADDRESS}/knowledge-management/queue-doc?document_id=${id}&app_id=${tenant}&collection_name=${collection}`;

    const resp = await axios.post(url, formData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const deleteDoc = async (
  id: string | number,
  tenant: string,
  collection: string
) => {
  try {
    const url = `${process.env.HAYA_IP_ADDRESS}/doc/?id=${id}&app_id=${tenant}&collection_name=${collection}`;
    const resp = await axios.delete(url, {
      headers: { Accept: "application/json" },
    });
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const view_schema = async (ConnectionPayload: any) => {
  var url = `${process.env.HAYA_IP_ADDRESS}/db/view`;

  const response = await fetch(url, {
    method: "POST",
    cache: "no-cache",
    redirect: "follow",
    referrerPolicy: "no-referrer",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ConnectionPayload),
  });

  const data = await response.json();
  return data;
};