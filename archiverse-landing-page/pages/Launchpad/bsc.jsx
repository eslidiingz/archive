import Mainlayout from "../../components/layouts/Mainlayout";
import React from "react";
import BridgeSwapCard from "../../components/launchpad/BridgeSwap";
import SwapType from "../../components/launchpad/SwapType";

const Launchpad = () => {
  return (
    <>
      <SwapType>
        <BridgeSwapCard />
      </SwapType>
    </>
  );
};

export default Launchpad;
Launchpad.layout = Mainlayout;
