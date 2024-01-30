import create from "zustand";

export const useTokenListStore = create((set) => ({
  tokenList: [],
  setTokenList: (tokenList) =>
    set((state) => ({ tokenList: (state.tokenList = tokenList) })),
}));
