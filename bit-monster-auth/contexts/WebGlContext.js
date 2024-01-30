import { createContext, useContext } from "react";
import { UnityContext } from "react-unity-webgl";

export const UnityWebGlContext = createContext();

export const UnityWrapper = ({ children }) => {
  const unityContext = new UnityContext({
    loaderUrl: "https://testapi.bitmonsternft.com/api/v1/file/62960bc073430000ec004df5",
    dataUrl: "https://testapi.bitmonsternft.com/api/v1/file/62960bbf73430000ec004df3",
    frameworkUrl: "https://testapi.bitmonsternft.com/api/v1/file/62960bbf73430000ec004df4",
    codeUrl: "https://testapi.bitmonsternft.com/api/v1/file/62960bc073430000ec004df6",
  });

  return <UnityWebGlContext.Provider value={{ unityContext }}>{children}</UnityWebGlContext.Provider>;
};

export const webGlContext = () => useContext(UnityWebGlContext);
