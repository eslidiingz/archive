import LoginWithBitkubNext from "../components/auth/login-bitkubnext";
import LoginWithMetamask from "../components/auth/login-metamask";
import styles from "../styles/Home.module.css";
import GamePage from "./game-page";
import { useEffect, useReducer, useCallback } from "react";
import Image from "next/image";
import axios from "axios";
import { UnityWebGlContext } from "../contexts/WebGlContext";
import { UnityContext } from "react-unity-webgl";
import { getWebGlConfig } from "../utils/api/webgl-config-api";

const initialState = {
  access: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_ACCESS_STATE":
      return {
        ...state,
        access: action.access,
      };
    default:
      throw new Error();
  }
};

const Login = ({ webGlConfig = null }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { access } = state;

  const onLoadCheckAccessToken = async () => {
    const access = JSON.parse(localStorage.getItem("bitmonster-authorize"));
    console.log(access);
    if (access?.accessToken) {
      try {
        const dataUser = await axios.get(
          `${process.env.BASE_API_URL}/users/account`,
          {
            headers: {
              "content-type": "application/json",
              Authorization: `Bearer ${access.accessToken}`,
            },
          }
        );
      } catch (e) {
        localStorage.removeItem("bitmonster-authorize");
        window.location.reload();
      }
    }
  };
  const checkAccessToken = useCallback(() => {
    const access = JSON.parse(localStorage.getItem("bitmonster-authorize"));
    dispatch({
      type: "SET_ACCESS_STATE",
      access: access,
    });
  }, []);
  useEffect(() => {
    onLoadCheckAccessToken();
  }, []);
  useEffect(() => {
    checkAccessToken();
  }, [checkAccessToken]);

  if (!access) {
    return (
      <div
        className={styles.container}
        style={{ background: "url('/Login_VDO_High_120F_Spd.mp4')" }}
      >
        <Image src={"/assets/background.png"} layout={"fill"} />
        {/* <video autoPlay muted loop>
          <source src="/Login_VDO_High_120F_Spd.mp4" />
        </video> */}
        <main className={styles.main}>
          <div className={styles.button}>
            <div className={styles.grid}>
              <LoginWithMetamask />
            </div>
          </div>
        </main>
      </div>
    );
  } else {
    // If webgl config isn't falsy
    if (webGlConfig) {
      const unityContext = new UnityContext(webGlConfig);
      return (
        <div
          className={styles.container}
          style={{ background: "url('/Login_VDO_High_120F_Spd.mp4')" }}
        >
          <GamePage unityContext={unityContext} webGlConfig={webGlConfig} />
        </div>
      );
    }

    // Return welcome page if webgl config is falsy
    return (
      <div
        className={styles.container}
        style={{ background: "url('/Login_VDO_High_120F_Spd.mp4')" }}
      >
        <Image src={"/assets/background.png"} layout={"fill"} />
      </div>
    );
  }
};

export async function getServerSideProps(context) {
  // Pre-fetching : Get webgl config
  const config = await getWebGlConfig();

  return {
    props: {
      webGlConfig: config,
    },
  };
}

export default Login;
