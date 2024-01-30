import {useEffect} from "react"
import Mainlayout from "../../components/layouts/Mainlayout"
import Countdown, {
  zeroPad,
  calcTimeDelta,
  formatTimeDelta,
} from "react-countdown"
import ButtonPrimary from "../../components/button/ButtonPrimary"
import CardPack from "../../components/card/CardPack"

const Games = () => {
  const renderer = ({days, hours, minutes, seconds, completed}) => {
    if (completed) {
      // Render a completed state
      return <span>done!</span>
    } else {
      // Render a countdown
      return (
        <div className="timer">
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
      )
    }
  }
  return (
    <>
      {/* Content All*/}
      <section className="events">
        <div className="container-fluid">
          <div className="row ">
            <div className="col-12 px-0">
              <div className="header-game">
                <img src="/assets/image/asset-1.png" className="w-100" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-8 mt-5 text-center color-black mx-auto">
              <div className="d-none d-md-block">
                <h2 className="mt-2 fw-bold ">Infinity Revive Online</h2>
              </div>
              <div className="d-md-none">
                <h3 className="mt-2 fw-bold ">Infinity Revive Online</h3>
              </div>
              <h6 className="py-4 m-0">
                Games hook users right from the start, and keep them playing for
                hours on end. What lessons can we, as learning designers, borrow
                from games to improve engagement in our courses? Read on to find
                out.
              </h6>
              <h6 className="py-1 m-0">Public Sale: 02 January 17:00 AM UTC</h6>
              <div className="color-black mb-4 ">
                <Countdown date={Date.now() + 850000000} renderer={renderer} />
              </div>
            </div>
          </div>
          <div className="row my-5 ">
            <div className="col-12 col-md-10 mx-auto ">
              <div className="row">
                <div className="col-12 col-lg-5">
                  <img
                    className="diamondPack-img"
                    src="/assets/image/diamond-pack.png"
                    alt=""
                  />
                </div>
                <div className="col-12 col-lg-5 ">
                  <div className="mt-4 mt-xl-5 pt-xl-5">
                    <h2 className="m-0">Diamond Pack</h2>
                    <p className="m-0 py-2 py-lg-1 py-xl-3">
                      Sam Mitchell NFT collection, created by two artists Elixr
                      and Bloo Woods. A collection showcasing Sam’s incredible
                      career through basketball
                    </p>
                    <div className="py-3">
                      <h6 className="fw-bold mb-0">Price / 1 box</h6>
                      <div className="d-flex align-items-center pb-2">
                        <img
                          width={36}
                          src="/assets/image/IMG_5592.png"
                          alt=""
                        />
                        <h3 className="mb-0 m-r-5">999 BWC</h3>
                        <p className="mb-0 color-grey">(99.90 USD)</p>
                      </div>
                      <ButtonPrimary text="Buy Ticket" className="w-100" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-4 mt-lg-5 pt-lg-5">
                <div className="col-12 col-lg-4 mx-auto px-lg-3 px-xl-4">
                  <CardPack
                    img="/assets/image/img-game-1.png"
                    title="Gold Pack"
                    description="Sam Mitchell NFT collection, created by two artists Elixr and Bloo Woods."
                    coin="999"
                    price="99.09"
                  />
                </div>
                <div className="col-12 col-lg-4 mx-auto px-lg-3 px-xl-4">
                  <CardPack
                    img="/assets/image/img-game-2.png"
                    title="Silver Pack"
                    description="Sam Mitchell NFT collection, created by two artists Elixr and Bloo Woods."
                    coin="999"
                    price="99.09"
                  />
                </div>
                <div className="col-12 col-lg-4 mx-auto px-lg-3 px-xl-4">
                  <CardPack
                    img="/assets/image/img-game-3.png"
                    title="Bronze Pack"
                    description="Sam Mitchell NFT collection, created by two artists Elixr and Bloo Woods."
                    coin="999"
                    price="99.09"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-12 col-lg-4 mx-auto text-center mt-lg-5 px-0">
                  <div>
                    <img
                      className="profile-gacha"
                      src="/assets/image/freepack.png"
                      alt=""
                    />
                    <div className="pt-3">
                      <h3>Free Pack</h3>
                      <p>
                        Sam Mitchell NFT collection, created by two artists
                        Elixr and Bloo Woods. A collection showcasing Sam’s
                        incredible career through basketball
                      </p>
                      <ButtonPrimary
                        text="Buy Ticket"
                        className="w-fit mx-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End-Content All*/}
    </>
  )
}

export default Games
Games.layout = Mainlayout
