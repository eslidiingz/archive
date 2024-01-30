import ButtonPrimary from "../button/ButtonPrimary"
function CardPack(props) {

    return (
      <>
        <div>
          <img className="profile-gacha" src={props.img} alt=""/>
          <div className="py-3">
              <h3>{props.title}</h3>
              <p className="twoline-dot">{props.description}</p>
              <h6 className="fw-bold mb-0">Price / 1 box</h6>
              <div className="d-flex align-items-center pb-2" >
                  <img width={36} src="/assets/image/IMG_5592.png" alt="" />
                  <h3 className="mb-0 m-r-5">{props.coin} BWC</h3>
                  <p className="mb-0 color-grey ">({props.price} USD)</p>
              </div>
              <ButtonPrimary text="Buy Ticket" className="w-100" />
          </div>
        </div>
      </>
    )
  }
  export default CardPack
  