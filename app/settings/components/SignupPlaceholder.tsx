import Image from "next/image";
import RegisterHero from "@/assets/images/register.png";
import Google from "@/assets/icons/google.png";

import { signIn } from "next-auth/react";

const SignupPlaceholder = () => {
  const handleLogin = () => {
    signIn("google");
  };

  return (
    <section className="w-[80%] bg-(--secondary-background) rounded-3xl grid justify-center gap-12 sm:gap-0 justify-items-center mt-12">
      <Image src={RegisterHero} alt="Register" />
      <h1 className="text-(--accent) text-2xl text-center sm:w-125">
        Go an ahead and Sign up with your Google Account to sync your data.
      </h1>

      <button
        onClick={handleLogin}
        className="flex gap-4 items-center sm:w-2/3 bg-(--accent) my-14 sm:mx-0 mx-2 rounded-xl p-2 cursor-pointer hover:bg-(--accent)/90 active:bg-(--accent)/50 transition-all duration-200"
      >
        <Image
          src={Google}
          alt="Google"
          className="p-4 bg-white rounded-xl h-16 w-16"
        />

        <h1 className="text-white font-semibold text-[18px]">
          Sign in with Google
        </h1>
      </button>
    </section>
  );
};

export default SignupPlaceholder;
