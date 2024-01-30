import { useRouter } from "next/router";
import { useState } from "react";
import { useCallback } from "react";
import { getAssets } from "../../models/Asset";
import { getUsers } from "../../models/User";

import { Col, Container, Row, Button } from "react-bootstrap";
import { ButtonComponents } from "../stylecomponents/Button";
import SlideExplore from "../slideExplore/SlideExplore";
import CardTrending from "../card/CardTrending";

const HomepageContent02Slider = () => {
  return (
    <>
      <section>
        <div className="container">
          <div className="row mb-3">
            <div className="col-6">
              <h1 className="ci-purple">Official Creators</h1>
            </div>
          </div>
          {assetList.length > 4 ? (
            <SlideExplore assetList={assetList} />
          ) : (
            <>
              <div className="row">
                {assetList.map((_item, index) => (
                  <div className="col-12 col-md-6 col-lg-3 px-1" key={index}>
                    <CardTrending
                      ClassTitle="text-title-slidertren mb-0"
                      img={_item.profileImage}
                      title={_item.name ?? "Unknown"}
                      userData={_item}
                      link={`Explore-collection/users/${_item.wallet}`}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default HomepageContent02Slider;
