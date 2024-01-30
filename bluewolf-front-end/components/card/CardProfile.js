


function CardProfile(props) {

    return (
      <>
        <div className="border-1 border-8 set-card">
            <div className="h-75 position-relative">
                <img
                src={props.img}
                className="w-100"
                />
                <div className={props.black}>
                    <p className="f-12 mb-0">{props.listing}</p>
                </div>
            </div>
            <div className="h-25 text-start p-3 bg-white-set">
                <div className=" d-flex justify-content-between align-items-center">
                <h5 className="mb-0 color-grey-V1 fw-bolder">{props.title}</h5>
                </div>
                <p className="color-grey twoline-dot">{props.description}</p>
                <div className="d-flex align-items-center ">
                <img
                    src={props.imguser}
                    className="w-15 radius-2"
                />
                <div className="ps-3">
                    <p className="mb-0">{props.creator}</p>
                    <h6 className="fw-bolder mb-0">{props.name}</h6>
                </div>
                </div>
            </div>
        </div>
      </>
    )
  }
  export default CardProfile
  