import { useState } from "react";
import Link from "next/link";
import { shortWallet } from "../../utils/misc";
import { Button, Col } from "react-bootstrap";
import { ButtonComponents } from "../stylecomponents/Button";

function CardSwap(props) {
  const ContentCard = [
    {
      id: "1",
      icon: "/assets/image/archiverse/icon/icon-launcpads.svg",
      title: "Launchpads",
      detail:
        "Launch your Token With Your Community. End-to-End Solutions For Your Token",
      detail02: "",
      detail03: "",
      carddisabled: "",
      href: "/Launchpad/bsc",
      txthref: "Launchpads",
      btndisabled: false ,
    },
    {
      id: "2",
      icon: "/assets/image/archiverse/icon/icon-bridgeswap.svg",
      title: "Bridge Swap",
      detail: "Bridge your Token",
      detail02: "",
      detail03: "",
      carddisabled: "card-swaple-disabled",
      href: "/bridge",
      txthref: "Bridge Swap",
      btndisabled: true ,
    },
    {
      id: "3",
      icon: "/assets/image/archiverse/icon/icon-dexswap.svg",
      title: "Dex Swap",
      detail:
        "  Decentralized trading protocol, automated trading of decentralized finance (DeFi) and automated market maker with free liquidity pool.",
      detail02: "",
      detail03: "",
      carddisabled: "card-swaple-disabled",
      href: "",
      txthref: "Dex Swap",
      btndisabled: true ,
    },
    {
      id: "4",
      icon: "/assets/image/archiverse/icon/icon-p2p.svg",
      title: " P2P Bulitinboard",
      detail: "Peer to Peer Bulitinboard Solutions For Your freedom",
      detail02: "",
      detail03: "",
      carddisabled: "card-swaple-disabled",
      href: "",
      txthref: "P2P",
      btndisabled: true ,
    },
  ];
  return (
    <>
      {ContentCard.map((item, id) => (
        <Col md={6} key={id} className="mb-3">
          <div
            className={`card-homapage-content01-layout ${item.carddisabled}`}
          >
            <div className="card-swaple-layput-detail">
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

            <Link href={item.href}>
              <ButtonComponents color="info" size="size_140" disabled={item.btndisabled}>
                <p>{item.txthref}</p>
              </ButtonComponents>
            </Link>
          </div>
        </Col>
      ))}
    </>
  );
}
export default CardSwap;
