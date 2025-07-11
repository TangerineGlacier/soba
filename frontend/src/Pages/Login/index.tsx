import { GoogleSolid } from "@/assets/Google";
import Microsoft from "@/assets/Microsoft";
import { Meteors } from "@/components/ui/meteors";
import { useUserAuth } from "@/Hooks/useUserAuth";
import { Button } from "@heroui/react";
import { loginWithLamauth } from "llamauth";

const Login = () => {
  const { signIn } = useUserAuth();
  return (
    <div className="h-screen w-screen relative bg-white overflow-hidden">
      <div className="h-full w-full dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center">
        <Meteors number={50} />
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="w-full h-full z-10 flex">
          <div className="w-full flex gap-16 flex-col items-center justify-center">
            <div className="text-xl mb-4">
              {/* TODO: REPLACE APP NAME */}
              Welcome to Visualization
            </div>
            <div className="flex flex-col gap-4">
              <Button
                onPress={() =>
                  loginWithLamauth({
                    key: "pcGUWBQ5hvg9xx1uzgq4GH93DqSv84J4",
                    callback: async (token: any) => {
                      console.log("token", token);
                      await signIn(token.access_token, "google");
                    },
                    uuid: "e61b2ff1-e721-4551-8203-f2b75f99a78c",
                  })
                }
                variant="flat"
              >
                <div className="flex items-center gap-2">
                  {/* <Github /> */}
                  <GoogleSolid />
                  <div>Continue with Google</div>
                </div>
              </Button>
              <Button
                onPress={() =>
                  loginWithLamauth({
                    key: "pcGUWBQ5hvg9xx1uzgq4GH93DqSv84J4",
                    callback: async (token: any) => {
                      console.log("token", token);
                      await signIn(token.access_token, "microsoft");
                    },
                    uuid: "17b357ed-3cee-4c1d-af1e-ddfabf563852",
                  })
                }
                variant="flat"
              >
                <div className="flex items-center gap-2">
                  <Microsoft />
                  <div>Continue with Microsoft</div>
                </div>
              </Button>
            </div>

            <div className="text-xs flex justify-center text-center">
              By continuing, you agree to Haya's Terms of Service And Privacy
              Policy and
              <br></br> to receiving email communication.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
