
function ButtonPrimary(props) {

    return (
      <>
        <div className={props.className}>
          <button type={props.type} className="btn bg-primary bg-gradient btn-lg text-white form-control ">
            <h5 className="mb-0">{props.text}</h5>
          </button>
        </div>
      </>
    )
  }
  export default ButtonPrimary
  