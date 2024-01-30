import {useEffect} from "react"
import Mainlayout from "../components/layouts/Mainlayout"
import Countdown, {
  zeroPad,
  calcTimeDelta,
  formatTimeDelta,
} from "react-countdown"

import FeatureCollection from "../pages/featureCollection"
import FeatureCreator from "../pages/featureCreator"

const App = () => {
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
      <section>
        <div className="hilight-section">
          <div className="container">
            <div className="row ">
              <div className="col-lg-6 offset-lg-6 col-xl-5 offset-xl-7 col-xxl-4 offset-xxl-8">
                <div className="box-white text-center">
                  <h2 className="text-white">Ashcan Digital Spring</h2>
                  <p className="text-white">
                    We are committed to provide a quality education in visual
                    entertainment arts, including concept design, game design,
                    comics, and digital illustration.
                  </p>
                  {/* <h4 className="text-white">Total: 456</h4> */}
                  <h5 className="text-white">
                    {/* Public Sale: 02 January 17:00 AM UTC */}
                  </h5>
                  <div className="text-white">
                    {/* <Countdown
                      date={Date.now() + 850000000}
                      renderer={renderer}
                    /> */}
                    {/* <h2>Comming Soon !!! </h2> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row d-flex align-items-center my-lg-5 my-3 py-lg-5 py-3">
            <div className="col-md-6">
              <img src="assets/image/bwlogo.jpg" className="w-100 border-8" />
            </div>
            <div className="col-md-6">
              <h2>Infinity Revive Online</h2>
              <p>
                Games hook users right from the start, and keep them playing for
                hours on end. What lessons can we, as learning designers, borrow
                from games to improve engagement in our courses? Read on to find
                out.
              </p>
              {/* <h6>Public Sale Round 1: 02 January 17:00 AM UTC</h6> */}
              <div className="text-dark timer-left mb-4">
                {/* <Countdown date={Date.now() + 850000000} renderer={renderer} /> */}
                {/* <h2>Coming soon</h2> */}
              </div>
              {/* <button
                type="button"
                className="btn bg-primary bg-gradient btn-lg text-white"
              >
                Coming Soon
              </button> */}
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row mb-5">
            <div className="col-md-12 text-center my-5">
              <h3>Latest Collections</h3>
            </div>
            <FeatureCollection />
          </div>
        </div>

        <div className="container">
          <div className="row mb-5">
            <div className="col-md-12 text-center my-5">
              <h3>Latest Creators</h3>
            </div>
            <FeatureCreator />
          </div>
        </div>
      </section>
    </>
  )
}

export default App
App.layout = Mainlayout
