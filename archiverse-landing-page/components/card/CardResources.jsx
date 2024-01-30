function CardResources(props) {
  return (
    <>
      <div className="card">
        <img
          className="card-img-top img-card"
          src={props.img || "/assets/image/archiverse/default_img.png"}
          alt="Card image"
        />
        onError=
        {(e) => {
          e.target.src = "/assets/image/archiverse/default_img.png";
          e.target.onError = null;
        }}
        <div>
          <p className="text05 mt-2">{props.title}</p>
        </div>
      </div>
    </>
  );
}
export default CardResources;
