import Image from "next/image";
import styles from "../../styles/Home.module.css";
import ProgressBar from "@ramonak/react-progress-bar";

const LoadingPage = ({ progression }) => {
  return (
    <>
      <Image src={"/assets/background.png"} layout={"fill"} />
      <main className={styles.main_loading}>
        <div className={styles.grid_loading}>
          <ProgressBar
            completed={progression}
            borderRadius={"0px"}
            height={"30px"}
            bgColor={"#00000033"}
            baseBgColor={"#00000033"}
            labelClassName={"loading_bar"}
            ariaValuemax={100}
          />
        </div>
      </main>
    </>
  );
};

export default LoadingPage;
