function CardCollections(props) {
  return (
    <>
      <div className="row box layout02">
        <div className="col-1">
          <p className="text09" align="center">
            {props.number}
          </p>
        </div>
        <div className="col-2">
          <img
            src={props.img || "/assets/image/archiverse/default_img.png"}
            className="img01-1"
            onError={(e) => {
              e.target.src = "/assets/image/archiverse/default_img.png";
              e.target.onError = null;
            }}
          />
        </div>
        <div className="col-6">
          <p className="text09 twoline-dot">{props.title}</p>
          <p className="text09-2">
            Floor price: <img src="/assets/swaple/icon-omcoin.webp" />
            &nbsp;<span className="text10">{props.price}</span>
          </p>
        </div>
        <div className="col-3">
          <p className="text11" align="right">
            {props.percent}
          </p>
          <p className="text10" align="right">
            <img src="/assets/swaple/icon-omcoin.webp" />
            &nbsp;&nbsp;{props.diamond_number}
          </p>
        </div>
      </div>
    </>
  );
}
export default CardCollections;
