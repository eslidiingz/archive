import { useState } from "react";
import { useEffect } from "react";
import { useTokenListStore } from "../stores/tokenList";

export const useQueryToken = (address) => {
  const { tokenList } = useTokenListStore();
  const [token, setToken] = useState({});

  useEffect(() => {
    if(!address) return;
    const { attributes } = tokenList.find(
      (item) => item.attributes.address === address
    );
    setToken(attributes);
  }, [address]);

  return { token };
};
