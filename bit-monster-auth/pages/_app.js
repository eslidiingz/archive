import "../styles/globals.css";
import ConfigProvider from "../contexts/config";

function App({ Component, pageProps }) {
  return (
    <ConfigProvider>
      <Component {...pageProps} />
    </ConfigProvider>
  );
}

export default App;
