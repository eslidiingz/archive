import config from "../../configs/config";

const LandCard = ({ data = {}, onOpenModal, onShowConfirmUseModal, onShowSaleModal }) => {
    // onClick={() => onOpenModal(data)}
    const IMG_EXTENSION = '.png';


    console.log('land card', data)
    return (
        <div className="col-xl-3 col-lg-4 col-md-4 col-6 my-3 my-lg-0 position-relative text-center cursor-pointer" onClick={() => onOpenModal(data)}>
            <img
                src={`${config.INVENTORY_IMG_URL}/lands/${data.category}${IMG_EXTENSION}`}
                alt={`Land - ${data.name}`}
                className="w-100 p-2"
            />
            <div className="p-2 box-card">
                <p className="mb-0 text-center text-uppercase">{data.name}</p>
                <div className="d-flex justify-content-between">
                    <small className="text-zone">ZONE {data.zone}</small>
                    <small className="text-zone">INDEX {data.index}</small>
                </div>
                {/* <div className="d-flex justify-content-between ">
                    <button className="btn btn-yellow btn-sale" onClick={() => onShowConfirmUseModal(data)}>Use</button>
                    <button className="btn btn-red text-white btn-sale" onClick={() => onShowSaleModal(data)}>Sale</button>
                </div> */}
            </div>
        </div>
    )
};

export default LandCard;