import mysql from "mysql2/promise";
import pg from "pg"; // Import as default
// import TrinoClient from "trino-client";

export async function queryMySQL(sql:any, dbConfig:any) {
  const connection = await mysql.createConnection(dbConfig);
  // console.log(connection);

  const [results] = await connection.execute(sql);

  await connection.end();
  return results;
}

// Function to handle PostgreSQL queries
export async function queryPostgres(sql:any, dbConfig:any) {
  const client = new pg.Client(dbConfig); // Using default import for pg
  await client.connect();
  const result = await client.query(sql);
  await client.end();
  return result.rows;
}

// Function to handle Trino queries
// export async function queryTrino(sql, dbConfig) {
//   const client = new TrinoClient({
//     server: `${dbConfig.host}:${dbConfig.port}`,
//     user: dbConfig.user,
//     catalog: dbConfig.catalog,
//     schema: dbConfig.schema,
//   });

//   return new Promise((resolve, reject) => {
//     const rows = [];
//     client
//       .query(sql)
//       .on("data", (row) => rows.push(row))
//       .on("end", () => resolve(rows))
//       .on("error", (error) => reject(error));
//   });
// }

// Function to handle Pinot queries (REST-based) using fetch

export async function queryPinot(sql:any, dbConfig:any) {
  const url = `${dbConfig.protocol}://${dbConfig.host}/sql`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sql,
      queryOptions: "useMultistageEngine=true",
      trace: false,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Pinot query failed: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  const columnNames = data?.resultTable?.dataSchema?.columnNames || [];
  const rows = data?.resultTable?.rows || [];

  return rows.map((item:any) => {
    // const rowData={}
    const rowData:any = {};
    columnNames.forEach((columnName:any, columnIndex:any) => {
      rowData[columnName] = item[columnIndex];
    });
    return rowData;
  });
}
 