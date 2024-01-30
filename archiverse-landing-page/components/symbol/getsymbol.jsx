import { useTokenListStore } from "../../stores/tokenList";

const GetSymbol = ({ address }) => {
    const { tokenList } = useTokenListStore();
    const symbol = tokenList.find(item => item.attributes.address == address);
    return symbol?.attributes?.symbol ?? "-";
}

export default GetSymbol;