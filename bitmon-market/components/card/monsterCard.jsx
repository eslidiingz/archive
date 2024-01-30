import config from "../../configs/config";


const MonsterCard = ({ data = {}, onOpenModal }) => {
    const IMG_EXTENSION = '.jpg';

    return (
        <>
        <div className="col-xl-3 col-lg-4 col-md-4 col-6 my-3 my-lg-0 position-relative cursor-pointer" onClick={() => onOpenModal(data)}>
            <img
                src={`${config.INVENTORY_IMG_URL}/card/MUI${data.no}${IMG_EXTENSION}`}
                alt={`Monster - ${data.name}`}
                className="w-100 py-2 cursor-pointer p-2"
            />
            <div className="position-staking-card ">
                <img
                    src={"/assets/img/staking.webp"}
                    alt=""
                    className="w-50 cursor-pointer "
                />
            </div>
            {/* <div className="p-2 box-card">
                <p className="mb-0 text-center text-uppercase">{data.name}</p>
                <div className="d-flex justify-content-between">
                    <small className="text-zone">{monsterClass}</small>
                    <small className="text-zone" >{power ? numberComma(power) : ''}</small>
                </div>
                <div className="d-flex justify-content-between ">
                    <button className="btn btn-yellow btn-sale" onClick={() => onShowConfirmUseModal(data)}>Use</button>
                    <button className="btn btn-red text-white btn-sale" onClick={() => onShowSaleModal(data)}>Sale</button>
                </div>
            </div> */}
        </div>
       
        </>
    );
};

export default MonsterCard;