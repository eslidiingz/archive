import axios from "axios";
import {
  createContext,
  useEffect,
  useContext,
  useCallback,
  useReducer,
} from "react";

const Context = createContext();

const initialState = {
  config: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_CONFIG":
      return {
        ...state,
        config: action.config,
      };
    default:
      throw new Error();
  }
};

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { config } = state;
  const fetchConfig = useCallback(async () => {
    const env = await axios.get(`${process.env.BASE_API_URL}/config?type=env`);

    const _env = env.data.rows[0];

    const { data } = await axios.get(
      `${process.env.BASE_API_URL}/config?type=${_env.value}`
    );
    const { rows } = data;

    dispatch({
      type: "SET_CONFIG",
      config: rows,
    });
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const exposed = {
    config,
  };

  return <Context.Provider value={exposed}>{children}</Context.Provider>;
};

export const useConfig = () => useContext(Context);
export default Provider;
