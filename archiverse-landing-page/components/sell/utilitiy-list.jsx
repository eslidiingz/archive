import { useCallback, useEffect, useReducer, useState } from "react";
import { DropdownButton } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import Select from "react-select";
import { getPoliciesList } from "../../models/Covest";
import { getVouchers } from "../../models/Voucher";
import Loading from "../Loading";

const UtilitiesListSelect = ({
  onSelect,
  price = null,
  percent = null,
  poolList,
  selectList = [],
  getAll = false,
}) => {
  const [pool, setPool] = useState([]);
  const [select, setSelect] = useState(null);

  const initize = useCallback(() => {
    let filterPoolList = poolList;

    if (!getAll) {
      const amount = price * (percent / 100);

      filterPoolList = poolList.map((_l) => ({
        ..._l,
        disabled:
          amount < _l.value.premiumAmount && _l.value.from === "voucher",
      }));
    }

    const selectedList = filterPoolList.find(
      ({ value }) => value.poolId === selectList.poolId
    );
    setSelect(selectedList);

    setPool(filterPoolList);
  }, [price, percent, poolList, selectList]);
  useEffect(() => {
    initize();
  }, [poolList]);

  const handleChange = (selected) => {
    onSelect(selected);
    setSelect(selected);
  };

  return (
    <>
      <div className="modal-dropdown position-relative">
        <Select
          value={select}
          // isOptionDisabled={(option) => option.disabled}
          name="utilities"
          options={pool}
          className="text-black"
          classNamePrefix="select"
          onChange={handleChange}
        />
      </div>
    </>
  );
};
export default UtilitiesListSelect;
