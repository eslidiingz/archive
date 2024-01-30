import { numberComma } from "../../utils/misc";
import config from "../../configs/config";

const AssetItemCard = ({ data = {}, onOpenModal, onShowConfirmUseModal, onShowSaleModal }) => {
    const IMG_EXTENSION = '.png';

    return (
        <div className="col-xl-3 col-lg-4 col-md-4 col-6 my-3 my-lg-0 position-relative text-center cursor-pointer" onClick={() => onOpenModal(data)}>
            <img
                src={`${config.INVENTORY_IMG_URL}/items/${data.no}${IMG_EXTENSION}`}
                alt={`Asset - ${data.name}`}
                className="w-100 py-2 w-h-fixitem"
            />
            <div className="p-2 box-card">
                <p className="mb-0 text-center text-uppercase">{data.name}</p>
                <div className="d-flex justify-content-between">
                    <small className="text-zone">Amount</small>
                    <small className="text-zone">x{numberComma(data?.balance || 0)}</small>
                </div>
                {/* <div className="d-flex justify-content-between ">
                    <button className="btn btn-yellow btn-sale" onClick={() => onShowConfirmUseModal(data)}>Use</button>
                    <button className="btn btn-red text-white btn-sale" onClick={() => onShowSaleModal(data)}>Sale</button>
                </div> */}
            </div>
        </div>
    )
};

export default AssetItemCard;