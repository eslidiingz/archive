import { useRouter } from "next/router";
import Image from "next/image";

const LoginWithBitkubNext = () => {
  const router = useRouter();
  const authorize = async () => {
    try {
      router.push(
        `${process.env.BITKUBNEXT_API_URL}/oauth2/authorize?response_type=code&client_id=${process.env.BITKUBNEXT_CLIENT_ID}&redirect_uri=${process.env.BITKUBNEXT_REDIRECT_URL}`
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <a onClick={() => authorize()}>
      <Image src={"/assets/connect_bitkub.png"} width={"500"} height={"100"} />
    </a>
  );
};

export default LoginWithBitkubNext;
