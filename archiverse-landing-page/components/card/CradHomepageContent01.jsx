import { useState } from "react";
import Link from "next/link";
import { shortWallet } from "../../utils/misc";
import { Button, Col } from "react-bootstrap";

function CardHomepageContent01(props) {
  const ContentCard = [
    {
      id: "1",
      icon: "/assets/image/archiverse/icon/icon-wallet.svg",
      title: "Set up your wallet",
      detail:
        " Once you’ve set up your wallet of choice, connect it to OpenSea by clicking the wallet icon in the top.",
      detail02: "",
      detail03: "",
    },
    {
      id: "2",
      icon: "/assets/image/archiverse/icon/icon-create.svg",
      title: " Create your collection",
      detail: "Click",
      detail02: "My Collections",
      detail03:
        "and set up your collection. Add social links, a description, profile & banner images, and set a secondary sales fee.",
    },
    {
      id: "3",
      icon: "/assets/image/archiverse/icon/icon-image.svg",
      title: "Add your NFTs",
      detail:
        " Upload your work (image, video, audio, or 3D art), add a title and description, and customize your NFTs with properties, stats, and unlockable content.",
      detail02: "",
      detail03: "",
    },
    {
      id: "4",
      icon: "/assets/image/archiverse/icon/icon-notes.svg",
      title: " Set up your wallet",
      detail:
        " Choose between auctions, fixed-price listings, and declining-price listings. You choose how you want to sell your NFTs, and we help you sell them!",
      detail02: "",
      detail03: "",
    },
  ];
  return (
    <>
      {ContentCard.map((item, id) => (
        <Col md={6} key={id} className="mb-3">
          <div className="card-homapage-content01-layout">
            <img
              src={item.icon}
              className="card-homapage-content01-icon-size"
            />
            <h3 className="mb-3 ci-purplepink">{item.title}</h3>
            <p className="fw-semibold twoline-dot2">
              {item.detail}
              <span className="ci-purplepink mx-1">{item.detail02}</span>
              {item.detail03}
            </p>
          </div>
        </Col>
      ))}
    </>
  );
}
export default CardHomepageContent01;
