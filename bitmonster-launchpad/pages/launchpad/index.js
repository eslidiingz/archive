const LaunchpadPage = () => {
  return (
    <main className="main-container">
      <div className="container">
        <h2 className="h2-title mx-auto text-center">
          Private<span>Sale</span>
        </h2>
        <div className="card-privatesale">
          <div className="tooltip-box">
            <p className="text-tooltile">
              $Dragon Moon Stone(DMS) Token Private Sale Round DMS-locked for 2
              months. Starting the day the game is launched.
            </p>
            <p className="text-tooldesc">
              The item, land, will be received immediately when the game opens.{" "}
            </p>
          </div>
          <div className="pack-list">
            <ul className="choose-pack">
              <li>
                <div className="item-info immortal-pack">
                  <div className="item-info-name">IMMORTAL PACK</div>
                  <div className="item-info-desc">
                    150,000 DMS Monster Crystal x 1 Land Crystal x1 Item x6
                    (Special)
                  </div>
                </div>
                <div className="item-radio">
                  <input
                    id="immortal-pack"
                    value="immortalpack"
                    name="pack"
                    type="radio"
                  />
                  <label htmlFor="immortal-pack">9,000 BUSD</label>
                </div>
              </li>
              <li>
                <div className="item-info lengendary-pack">
                  <div className="item-info-name">LENGENDARY PACK</div>
                  <div className="item-info-desc">
                    100,000 DMS Monster Immortal x 1 Land Crystal x1 Item x6
                    (Special)
                  </div>
                </div>
                <div className="item-radio">
                  <input
                    id="lengendary-pack"
                    value="lengendarypack"
                    name="pack"
                    type="radio"
                  />
                  <label htmlFor="lengendary-pack">4,500 BUSD</label>
                </div>
              </li>
              <li className="disable">
                <div className="item-info epic-pack">
                  <div className="item-info-name">EPIC PACK</div>
                  <div className="item-info-desc">
                    50,000 DMS Monster Lengendary x 1 Land Random x 1 Item x 5
                  </div>
                </div>
                <div className="item-radio">
                  <input
                    id="epic-pack"
                    value="epicpack"
                    name="pack"
                    type="radio"
                  />
                  <label htmlFor="epic-pack">3,000 BUSD</label>
                </div>
              </li>
              <li>
                <div className="item-info rare-pack">
                  <div className="item-info-name">RARE PACK</div>
                  <div className="item-info-desc">
                    25,000 DMS Monster Epic x 1 Land Random x 1 Item x 4
                  </div>
                </div>
                <div className="item-radio">
                  <input
                    id="rare-pack"
                    value="rarepack"
                    name="pack"
                    type="radio"
                  />
                  <label htmlFor="rare-pack">1,500 BUSD</label>
                </div>
              </li>
              <li>
                <div className="item-info common-pack">
                  <div className="item-info-name">COMMON PACK</div>
                  <div className="item-info-desc">
                    10,000 DMS Monster Rare x 1 Landrandom x 1 Item x 3
                  </div>
                </div>
                <div className="item-radio">
                  <input
                    id="common-pack"
                    value="commonpack"
                    name="pack"
                    type="radio"
                  />
                  <label htmlFor="common-pack">600 BUSD</label>
                </div>
              </li>
              <li>
                <div className="item-info starter-pack">
                  <div className="item-info-name">STARTER PACK</div>
                  <div className="item-info-desc">
                    5,000 DMS Monster Common x 1 Land Random x 1 Item x 3
                  </div>
                </div>
                <div className="item-radio">
                  <input
                    id="starter-pack"
                    value="starterpack"
                    name="pack"
                    type="radio"
                  />
                  <label htmlFor="starter-pack">300 BUSD</label>
                </div>
              </li>
              <li className="cf-buy">
                <div className="item-info confirm-order">
                  <button type="button" className="btn-confirm-buy">
                    Buy
                  </button>
                </div>
              </li>
            </ul>
          </div>
          <div className="logo-ps">
            <img className="w-100" src="logo.webp" />
          </div>
          <div className="char-guild">
            <img className="w-100" src="char-guild.webp" />
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Modal title
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">...</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
export default LaunchpadPage
