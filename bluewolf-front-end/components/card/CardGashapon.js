import Link from "next/link"

function CardGashapon(props) {
  return (
    <>
      <Link href={props.href}>
        <div className="profile-card card rounded-lg mb-4 text-center position-relative overflow-hidden">
          <div className="row position-relative">
            <div className="col-lg-12 col-sm-12 col-12 ">
              <img src={props.cover} className="profile-header" alt="" />
              <div className={props.soldOut}>
                <div className="cover-card">
                  <h3>SOLD OUT</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="row position-relative user-detail">
            <div className="col-lg-12 col-sm-12 col-12">
              <img
                src={props.profile}
                className="rounded-circle img-thumbnail"
                alt=""
              />
              <h5 className="texthea01 ">{props.title}</h5>
              <h6 className="textho">{props.creator}</h6>
              <p className="color-black twoline-dot mb-0">
                {props.description}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}
export default CardGashapon
