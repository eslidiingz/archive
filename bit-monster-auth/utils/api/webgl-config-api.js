export const getWebGlConfig = async () => {
  const CONFIG_KEY = {
    UNITY_LOADER_URL: { propKey: "loaderUrl" },
    UNITY_DATA_URL: { propKey: "dataUrl" },
    UNITY_FRAMEWORK_URL: { propKey: "frameworkUrl" },
    UNITY_CODE_URL: { propKey: "codeUrl" },
  };

  const config = {
    loaderUrl: "",
    dataUrl: "",
    frameworkUrl: "",
    codeUrl: "",
  };

  try {
    const responseEnv = await fetch(`${process.env.BASE_API_URL}/config?type=env`);

    const _env = await responseEnv.json();

    const responseConfig = await fetch(`${process.env.BASE_API_URL}/config?type=${_env.rows[0].value}`);

    const { rows: configDetail } = await responseConfig.json();

    if (Array.isArray(configDetail)) {
      for await (const webGlConfig of configDetail) {
        const configDetail = CONFIG_KEY[webGlConfig?.key] ? { key: CONFIG_KEY[webGlConfig.key].propKey, value: webGlConfig.value } : null;
        if (configDetail) config[configDetail.key] = configDetail.value;
      }
    }
  } catch (err) {
    console.log("ERROR ON GET WEBGL CONFIG : ", err.message);
  }

  return config || null;
};
