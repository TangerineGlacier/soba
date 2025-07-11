import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./Providers/AuthProvider";
import PublicRouter from "./Routes/PublicRoutes";
import { Button } from "@heroui/react";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider PublicRoutes={<PublicRouter/>}>
        <></>
      </AuthProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: "",
          duration: 3000,
          removeDelay: 1000,
        }}
      />
    </QueryClientProvider>
    // <div className=" text-red-400 ">
    //   <Button variant="solid" >Hello</Button>
    // </div>
  );
}

export default App;
