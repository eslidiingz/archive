import { ChevronRight } from "react-bootstrap-icons";
export default function monsterLand() {
  return (
    <section>
      <div className=" container ">
        <div className="row">
          <div className="col-12">
            <h1 className="text-violet text-center mb-0 font-large">MONSTER</h1>
          </div>
          <div>
            <ul className="set-ul">
              <li>
                <a href="/monster">
                  <div className="text-green">
                    EGG
                    <img
                      src={"/assets/img/Layer-egg-small.webp"}
                      alt=""
                      className=" px-2 pb-1"
                    />
                  </div>
                </a>
              </li>
              <li className="no-pd">
                <ChevronRight />
              </li>
              <li>
                <div className="text-orange">
                  LAND
                  <img
                    src={"/assets/img/Layer-land.webp"}
                    alt=""
                    className=" px-2 pb-1"
                  />
                </div>
              </li>
              {/* <li className="no-pd">
                <ChevronRight/>
              </li> */}
              <li>
                <div className="text-red">
                  ITEM
                  <img
                    src={"/assets/img/Layer-ITEM.webp"}
                    alt=""
                    className=" px-2 pb-1"
                  />
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="row d-flex justify-content-center">
          <div className="col-12 col-md-4 text-center  ">
            <img src={"/assets/img/L1.webp"} alt="" className="w-100" />
            <div className="mt-3 text-center">
              <button className="btn btn-img btn-green w-50 mx-auto mb-2">
                <img
                  src={"/assets/img/icon-1.webp"}
                  alt=""
                  className="w-35 px-2"
                />
                3500
              </button>
              <small className="">Remaining Land : 1200</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
