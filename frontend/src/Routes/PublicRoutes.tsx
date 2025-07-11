import Login from "../Pages/Login";
import { useRoutes } from "raviger";


export const routes = {
    "/" : () => <Login/>,
}

export default function PublicRouter() {
  return (
    <>
      {useRoutes(routes) || <Login/>}
    </>
  );
}