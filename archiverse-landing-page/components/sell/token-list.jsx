import { useState } from "react";
import { DropdownButton } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import Loading from "../Loading";
import { useTokenListStore } from "../../stores/tokenList";

const TokenListSelect = ({ onSelect }) => {
  const { tokenList } = useTokenListStore();
  const [selected, setSelected] = useState(null);

  const handleSelect = (value) => {
    const _tokenSymbol = value.split(":")[0].replace(/\s/g, "");

    const _tokens = tokenList.map((item) => {
      const { address, is_native, name, symbol } = item.attributes;
      return { address, is_native, name: name.replace(/\s/g, ""), symbol };
    });

    const _filterToken = _tokens.find((item) => item.name === _tokenSymbol);

    const _currentValue = `${_filterToken.name} : ${_filterToken.address}`;
    setSelected(value);
    onSelect(_currentValue);
  };
  return (
    <>
      <div className="modal-dropdown position-relative">
        <DropdownButton
          title={selected}
          onSelect={(value) => handleSelect(value)}
        >
          {typeof tokenList !== "undefined" &&
            tokenList.length > 0 &&
            tokenList.map((item, index) => {
              return (
                <Dropdown.Item
                  eventKey={`${item.attributes.name}
                  ${
                    item.attributes.is_native
                      ? ""
                      : `: ${item.attributes.address}`
                  }`}
                  key={index}
                >
                  {item.attributes.name}{" "}
                  {item.attributes.is_native
                    ? ""
                    : `: ${item.attributes.address}`}
                </Dropdown.Item>
              );
            })}
        </DropdownButton>
      </div>
    </>
  );
};
export default TokenListSelect;
