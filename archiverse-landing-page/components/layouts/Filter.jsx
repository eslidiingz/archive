import React, { useState } from 'react';
import { Accordion } from "react-bootstrap";

function Filter() {
  const [isBuynow, setBuynow] = useState(false);
  const Buynow = () => {
    setBuynow(!isBuynow);
  };

  const [isAuction, setAuction] = useState(false);
  const Auction = () => {
    setAuction(!isAuction);
  };

  const [isNew, setNew] = useState(false);
  const New = () => {
    setNew(!isNew);
  };

  const [isOffer, setOffer] = useState(false);
  const Offer = () => {
    setOffer(!isOffer);
  };

  const [isRinkeby, setRinkeby] = useState(false);
  const Rinkeby = () => {
    setRinkeby(!isRinkeby);
  };

  const [isMumbai, setMumbai] = useState(false);
  const Mumbai = () => {
    setMumbai(!isMumbai);
  };

  const [isBaobab, setBaobab] = useState(false);
  const Baobab = () => {
    setBaobab(!isBaobab);
  };

  const [isBCS, setBCS] = useState(false);
  const BCS = () => {
    setBCS(!isBCS);
  };

  const [isGoerli, setGoerli] = useState(false);
  const Goerli = () => {
    setGoerli(!isGoerli);
  };

  const [isETH, setETH] = useState(false);
  const ETH = () => {
    setETH(!isETH);
  };

  const [isWETH, setWETH] = useState(false);
  const WETH = () => {
    setWETH(!isWETH);
  };




  return (
    <>
      <div className='row layout_fitter'>
        <div className='col-4  d-none d-lg-block'>
          <div>
            <h4 className='footer-font pb-2' >Status</h4>
          </div>
          <div>
            <div className='d-flex gap-2 flex-wrap p-r-10 py-2'>
              <button className={`btn btn-secondary ${isBuynow ? "active ps-3" : ""}`} onClick={Buynow}><sapn className={isBuynow ? "W95FA_font pe-3" : "d-none"}>x</sapn> Buy now</button>
              <button className={`btn btn-secondary ${isAuction ? "active ps-3" : ""}`} onClick={Auction}><sapn className={isAuction ? "W95FA_font pe-3" : "d-none"}>x</sapn>On Auction</button>
              <button className={`btn btn-secondary ${isNew ? "active ps-3" : ""}`} onClick={New}><sapn className={isNew ? "W95FA_font pe-3" : "d-none"}>x</sapn>New</button>
              <button className={`btn btn-secondary ${isOffer ? "active ps-3" : ""}`} onClick={Offer}><sapn className={isOffer ? "W95FA_font pe-3" : "d-none"}>x</sapn>Has Offers</button>
            </div>
          </div>
        </div>

        <div className='col-5  d-none d-lg-block'>
          <div>
            <h4 className='footer-font pb-2' >Chains</h4>
          </div>
          <div>
            <div className='d-flex gap-2 flex-wrap p-r-10 py-2'>
              <button className={`btn btn-secondary ${isRinkeby ? "active ps-3" : ""}`} onClick={Rinkeby}><sapn className={isRinkeby ? "W95FA_font pe-3" : "d-none"}>x</sapn> Rinkeby</button>
              <button className={`btn btn-secondary ${isMumbai ? "active ps-3" : ""}`} onClick={Mumbai}><sapn className={isMumbai ? "W95FA_font pe-3" : "d-none"}>x</sapn> Mumbai</button>
              <button className={`btn btn-secondary ${isBaobab ? "active ps-3" : ""}`} onClick={Baobab}><sapn className={isBaobab ? "W95FA_font pe-3" : "d-none"}>x</sapn> Baobab</button>
              <button className={`btn btn-secondary ${isBCS ? "active ps-3" : ""}`} onClick={BCS}><sapn className={isBCS ? "W95FA_font pe-3" : "d-none"}>x</sapn> BCS Testnet</button>
              <button className={`btn btn-secondary ${isGoerli ? "active ps-3" : ""}`} onClick={Goerli}><sapn className={isGoerli ? "W95FA_font pe-3" : "d-none"}>x</sapn> Goerli</button>
            </div>
          </div>
        </div>

        <div className='col-3 d-none d-lg-block'>
          <div>
            <h4 className='footer-font pb-2' >On Sale in</h4>
          </div>
          <div>
            <div className='d-flex gap-2 flex-wrap p-r-10 py-2'>
              <button className={`btn btn-secondary ${isETH ? "active ps-3" : ""}`} onClick={ETH}><sapn className={isETH ? "W95FA_font pe-3" : "d-none"}>x</sapn> ETH</button>
              <button className={`btn btn-secondary ${isWETH ? "active ps-3" : ""}`} onClick={WETH}><sapn className={isWETH ? "W95FA_font pe-3" : "d-none"}>x</sapn> WETH</button>
            </div>
          </div>
        </div>
      </div>

      <div className='filter-m d-lg-none' >
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Filter</Accordion.Header>
            <Accordion.Body>
              <h6 className='footer-font' >Status</h6>
              <div>
                <div className='d-flex gap-2 flex-wrap p-r-10 pb-4'>
                  <button className={`btn btn-secondary ${isBuynow ? "active ps-3" : ""}`} onClick={Buynow} >Buy now</button>
                  <button className={`btn btn-secondary ${isAuction ? "active ps-3" : ""}`} onClick={Auction} >On Auction</button>
                  <button className={`btn btn-secondary ${isNew ? "active ps-3" : ""}`} onClick={New} >New</button>
                  <button className={`btn btn-secondary ${isOffer ? "active ps-3" : ""}`} onClick={Offer} >Has Offers</button>
                </div>
              </div>
              <h6 className='footer-font pt-4'>Chains</h6>
              <div>
                <div className='d-flex gap-2 flex-wrap p-r-10 pb-4'>
                  <button className={`btn btn-secondary ${isRinkeby ? "active ps-3" : ""}`} onClick={Rinkeby} >Rinkeby</button>
                  <button className={`btn btn-secondary ${isMumbai ? "active ps-3" : ""}`} onClick={Mumbai} >Mumbai</button>
                  <button className={`btn btn-secondary ${isBaobab ? "active ps-3" : ""}`} onClick={Baobab} >Baobab</button>
                  <button className={`btn btn-secondary ${isBCS ? "active ps-3" : ""}`} onClick={BCS} >BCS Testnet</button>
                  <button className={`btn btn-secondary ${isGoerli ? "active ps-3" : ""}`} onClick={Goerli} >Goerli</button>
                </div>
              </div>
              <h6 className='footer-font pt-4' >On Sale in</h6>
              <div className='d-flex gap-2 flex-wrap p-r-10 pb-4'>
                <button className={`btn btn-secondary ${isETH ? "active ps-3" : ""}`} onClick={ETH} >ETH</button>
                <button className={`btn btn-secondary ${isWETH ? "active ps-3" : ""}`} onClick={WETH} >WETH</button>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </>
  );
}

export default Filter;