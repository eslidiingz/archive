import Link from "next/link";

function CardDrops(props) {
  return (
    <>
      <div className="card">
        <img
          className="card-img-top img-card"
          src={props.img || "/assets/image/archiverse/default_img.png"}
          alt="Card image"
          onError={(e) => {
            e.target.src = "/assets/image/archiverse/default_img.png";
            e.target.onError = null;
          }}
        />
        <div>
          <p className="text05 mt-1">{props.title}</p>
          <p className="text06 mt-3 twoline-dot3">{props.description}</p>
          <Link href={props.href}>
            <a className="btn btn03 btn-primary">{props.button}</a>
          </Link>
        </div>
      </div>
    </>
  );
}
export default CardDrops;
