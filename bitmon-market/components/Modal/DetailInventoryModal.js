import Modal from "react-bootstrap/Modal";
import config from "../../configs/config";
import { numberComma } from "../../utils/misc";

const DetailInventoryModal = ({ data = {}, onShowConfirmUseModal, onShowSaleModal, onClose, show = false, disableButton = false }) => {
  const SKILLS = ["SK1", "SK2", "SK3", "SK4"];
  const STATS = [
    { key: "power", name: "POW BLUE", class: "powblue" },
    { key: "powerRed", name: "POW RED", class: "powred" },
    { key: "hp", name: "HP", class: "hp" },
    { key: "POW", name: "POW", class: "pow" },
    { key: "DEF", name: "DEF", class: "def" },
    { key: "ACC", name: "ACC", class: "acc" },
    { key: "SPD", name: "SPD", class: "spd" },
    { key: "CRI", name: "CRI", class: "cri" },
  ];
  const IMG_EXTENSION = ".jpg";
  const SKILL_IMG_EXTENSION = ".webp";

  // console.log(data, "eieieie");

  return (
    <Modal show={show} onHide={onClose} className="Inventory-set" size="lg" centered>
      <Modal.Header closeButton={!disableButton}>
        <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
      </Modal.Header>
      <Modal.Body className="grid-modal mb-5 px-4">
        <div className="display-set-flex w-100 align-items-center">
          <div className="d-flex  justify-content-center w-50-card">
            <img src={`${config.INVENTORY_IMG_URL}/card/MUI${data?.no}${IMG_EXTENSION}`} className="w-100 p-2" />
          </div>
          <div className=" px-3 text-center ">
            <h3>MONSTER ID# {data?.no?.toString?.()?.padStart?.(7, "0")}</h3>
            <div className="row">
              {SKILLS.map((skill, index) => (
                <div className="col-md-3 col-6" key={`${data?.[skill]?.name || ""}_${index}`}>
                  <img
                    src={`${config.INVENTORY_IMG_URL}/skill/${data?.[skill]?._id}${SKILL_IMG_EXTENSION}`}
                    className="w-100"
                    alt={`Skill image - ${data?.[skill]?._id || index}`}
                  />
                  <p className="text-skill">{data?.[skill]?.name}</p>
                </div>
              ))}
            </div>
            <div className="row mb-2">
              {STATS.map((stat, index) => (
                <div className="col-md-3 col-6 p-2" key={`${stat.key}_${index}`}>
                  <div className={`bg-stat-${stat.class}`}>
                    <div className="p-2">
                      <p className="mb-0 text-stat">{stat.name}</p>
                      <h4 className="mb-0">{typeof +data?.[stat.key] === "number" ? numberComma(data?.[stat.key]) : ""}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="row text-center">
              <div className="col-6">
                <button className="btn btn-green btn-img text-white" onClick={() => onShowSaleModal(data || {})}>
                  SELL
                </button>
              </div>
              <div className="col-6">
                <button className="btn btn-yellow text-white btn-img" onClick={() => onShowConfirmUseModal(data || {})}>
                  SYNC
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DetailInventoryModal;
