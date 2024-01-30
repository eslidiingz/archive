import { useEffect, useState } from "react";
import Marketplace from "./marketplace";

export default function Index() {
  const initialize = async () => { };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <>
      <Marketplace />
    </>
  );
}
