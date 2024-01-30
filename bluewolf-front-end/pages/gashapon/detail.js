import { useEffect } from "react";
import Mainlayout from "../../components/layouts/Mainlayout";
import Countdown, { zeroPad, calcTimeDelta, formatTimeDelta } from 'react-countdown';
import ButtonPrimary from "../../components/button/ButtonPrimary";

const GashaponDetail= () => {
    const renderer = ({days, hours, minutes, seconds, completed }) => {
        if (completed) {
          // Render a completed state
          return <span>done!</span>;
        } else {
          // Render a countdown
          return <div className="timer">
          <div className="timer-block">
            <div className="time-count">{zeroPad(days)}</div>
            <div className="time-name">Days</div>
          </div>
          <div className="time-separate">:</div>
          <div className="timer-block">
            <div className="time-count">{zeroPad(hours)}</div>
            <div className="time-name">Hours</div>
          </div>
          <div className="time-separate">:</div>
          <div className="timer-block">
            <div className="time-count">{zeroPad(minutes)}</div>
            <div className="time-name">Minutes</div>
          </div>
          <div className="time-separate">:</div>
          <div className="timer-block">
            <div className="time-count">{zeroPad(seconds)}</div>
            <div className="time-name">Seconds</div>
          </div>
        </div>
        }
      };
    return (
        <>
            {/* Content All*/}
            <section className="events">
                <div className="container-fluid">
                    <div className="row ">
                        <div className="col-12 px-0">
                            <div className="header-profile">
                                <img src="/assets/image/a0ae78720331c3ebe76118d6d91f8f43.png"className="w-100" alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-12 d-flex justify-content-center position-relative">
                            <div className="img-prifile position-absolute"> 
                                <img src="/assets/image/9b81c9ed3c365716330d8622f3069961.png" alt=""/>
                            </div>
                        </div>
                        <div className="col-12 col-lg-8 top-50-100 text-center color-black mx-auto">
                            <h6 className="mt-2 font-openSans profile-name">@Cristhian Ramírez</h6>
                            <h3 className="py-2 m-0">Try.Out.Illustration.</h3>
                            <h6 className="py-3 m-0">Virtue Poker will host a Celebrity Charity Poker tournament. The participants will include Hall of Fame (HOF) player, Phil Ivey, HOF NBA player Paul Pierce, YouTube phenom Mr. Beast, Hollywood star Vince Vaughn, Polygon Co-Founder Sandeep Nailwal, and Ethereum</h6>
                            <h6 className="py-2 m-0">Probability: SSR - 0.02%, SR - 2.48%, R - 17.66%, N - 79.84%</h6>
                            <h4 className="font-light py-3 m-0">Total: 0/127</h4>
                            <h6 className="py-1 m-0">Public Sale: 02 January 17:00 AM UTC</h6>
                            <div className="color-black mb-4 ">
                                <Countdown date={Date.now() + 850000000}renderer={renderer}/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-4 mx-auto">
                            <img className="profile-gacha" src="/assets/image/image-1.png" alt=""/>
                            <div className="py-3">
                                <h6 className="fw-bold mb-0">Price / 1 box</h6>
                                <div className="d-flex align-items-center pb-2" >
                                    <img width={36} src="/assets/image/IMG_5592.png" alt=""/>
                                    <h3 className="mb-0 m-r-5">999 BWC</h3>
                                    <p className="mb-0 color-grey">(99.90 USD)</p>
                                </div>
                                <ButtonPrimary text="Buy Now" className="w-100" />
                            </div>
                        </div>
                    </div>
                    <div className="row mb-5 ">
                        <div className="col-12 col-md-10 col-lg-8 col-xl-6 mx-auto text-center">
                            <h6 className=" fw-bold py-3 m-0">About Creator</h6>
                            <h6 className="m-0">Welcome to the new playground for NFTs. RARA, built on Binance Smart Chain, is Latin for rare, a fitting moniker for a platform that serves as the global gateway to the most creative, luxurious, and valuable</h6>
                        </div>
                    </div>
                </div>
            </section>
            {/* End-Content All*/}
        </>
    );
};

export default GashaponDetail;
GashaponDetail.layout = Mainlayout;
