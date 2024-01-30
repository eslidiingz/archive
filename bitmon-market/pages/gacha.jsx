import Link from "next/link";
import { ChevronRight } from "react-bootstrap-icons";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import CardGachaMonster from "../components/card/cardGachaMonster";
import CardGachaLand from "../components/card/cardGachaLand";
import CardGachaItem from "../components/card/cardGachaItem";

import { useEffect, useState } from "react";
import { numberComma } from "../utils/misc";

export default function Gacha() {
  const [pageLoading, setPageLoading] = useState(false);

  const [remainingLand, setRemainingLand] = useState({
    landZone: 1,
    maxSupply: 240,
  });

  const initialize = async () => {
    // await getLandTotalSupply();
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <section>
      <div className=" container ">
        <div className="row">
          <div className="col-12">
            <h1 className="text-violet text-center mb-0 font-large">Gacha</h1>
          </div>
        </div>
        <div className="row mt-4">
          <Tabs
            defaultActiveKey="first"
            className="mx-auto text-center justify-content-center d-flex z-index-0"
          >
            {/* MONSTER TAB GACHA */}
            <Tab
              eventKey="first"
              title="MONSTER"
              tabClassName="tab-first tab-opacity"
            >
              <div className=" container px-0 py-3">
                <div className="row px-4 px-lg-0">
                  <div className="col-12 set-col-lg-2 col-md-4 my-3">
                    <CardGachaMonster
                      href=""
                      src="/assets/img/eeg-1.webp"
                      classbtn="btn btn-img btn-green"
                      coin="25"
                      title="Common"
                    ></CardGachaMonster>
                  </div>
                  <div className="col-12 set-col-lg-2 col-md-4 my-3">
                    <CardGachaMonster
                      href=""
                      src="/assets/img/eeg-2.webp"
                      classbtn="btn btn-img btn-blue"
                      coin="60"
                      title="Rare"
                    ></CardGachaMonster>
                  </div>
                  <div className="col-12 set-col-lg-2 col-md-4 my-3">
                    <CardGachaMonster
                      href=""
                      src="/assets/img/eeg-3.webp"
                      classbtn="btn btn-img btn-violet"
                      coin="150"
                      title="Epic"
                    ></CardGachaMonster>
                  </div>
                  <div className="col-12 set-col-lg-2 col-md-4 my-3">
                    <CardGachaMonster
                      href=""
                      src="/assets/img/eeg-4.webp"
                      classbtn="btn btn-img btn-red"
                      coin="250"
                      title="Legendary"
                    ></CardGachaMonster>
                  </div>
                  <div className="col-12 set-col-lg-2 col-md-4 my-3">
                    <CardGachaMonster
                      href=""
                      src="/assets/img/eeg-5.webp"
                      classbtn="btn btn-img btn-yellow"
                      coin="500"
                      title="Immortal"
                    ></CardGachaMonster>
                  </div>
                </div>
              </div>
            </Tab>

            {/* LAND TAB GACHA */}
            <Tab
              eventKey="second"
              title="LAND "
              tabClassName="tab-second tab-opacity"
            >
              <div className=" container px-0 py-3">
                <div className="row px-4 px-lg-0 d-flex justify-content-center">
                  <div className="col-12 my-3">
                    <CardGachaLand
                      href=""
                      src="/assets/img/LandRandom_Static.webp"
                      classbtn="btn btn-img btn-green"
                      coin="100"
                      title="Grass, Snow, Desert, Mirror, Lava"
                    ></CardGachaLand>
                  </div>
                </div>
              </div>
            </Tab>

            {/* ITEM TAB GACHA */}
            <Tab
              eventKey="third"
              title="ITEM"
              tabClassName="tab-third tab-opacity"
            >
              <div className=" container px-0 py-3">
                <div className="row px-4 px-lg-0 d-flex justify-content-center">
                  <div className="col-lg-3 col-12  col-md-4 my-3">
                    <CardGachaItem
                      href=""
                      src="/assets/img/box-close.webp"
                      classbtn="btn btn-img btn-green"
                      coin="10"
                      title="Item (Asset)"
                    ></CardGachaItem>
                  </div>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
