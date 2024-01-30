import React from "react";
import { useRouter } from "next/router";
import Modal from "react-bootstrap/Modal";
import { useWalletContext } from "/context/wallet";
import ButtonState from "../buttons/ButtonLoading";
import useLoading from "../../hooks/useLoading";
import { useQRCode } from "next-qrcode";
import useEtherSWR from "ether-swr";
import { web3Provider } from "../../utils/providers/connector";
import { useEffect } from "react";
import { formatEther, formatUnits } from "ethers/lib/utils";
import useSWR from "swr";
import { useCallback } from "react";

const fetcher =
  (library) =>
  (...args) => {
    const [method, ...params] = args;
    return library[method](...params);
  };

const OmTopUP = ({ qrText, amount, onCloseModalTopup }) => {
  const { wallet } = useWalletContext();
  const { toggle, loading } = useLoading();

  const providers = web3Provider(null, true);

  const { data: newBalance, mutate } = useSWR(["getBalance", wallet], {
    fetcher: fetcher(providers),
  });

  const checkBalance = async () => {
    const prevBalance = localStorage.getItem("balance");

    if (
      typeof newBalance !== "undefined" &&
      prevBalance !== formatEther(newBalance)
    ) {
      console.log("newBalance");
      onCloseModalTopup();
    }
  };

  const fetchBalance = useCallback(async () => {
    localStorage.setItem(
      "balance",
      formatEther(await providers?.getBalance(wallet))
    );
  }, []);

  useEffect(() => {
    fetchBalance();
  }, []);

  useEffect(() => {
    checkBalance();
  }, [newBalance]);

  const { Image } = useQRCode();
  return (
    <div>
      <Modal.Header className="modal-headers" closeButton>
        <Modal.Title>
          <p align="center" className="text-makeanoff-h_ex">
            OM Top UP
          </p>
        </Modal.Title>
      </Modal.Header>
      <hr className="hr-detailpage" />
      <Modal.Body>
        <div className="row">
          <div className="col-xl-12">
            <div className="layout-deatilpage-modal">
              <p className="text-deatilpage-modal">Qr Code</p>
              <hr />
            </div>
            <div className="row modal-detail-layout">
              <div className="col-xl-12">
                <div className="div-cover-image">
                  <Image
                    alt="qr-code"
                    text={qrText}
                    className="mx-auto d-block"
                    options={{
                      type: "image/jpeg",
                      quality: 0.3,
                      level: "M",
                      margin: 3,
                      scale: 4,
                      width: 270,
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="row modal-detail-layout">
              <div className="col-xl-10 col-md-9 col-sm-8 modal-content-layout">
                <p className="modal-txt-detail">Qr Code Payment</p>
              </div>
              <div className="col-xl-2 col-md-3 col-sm-4 modal-content-layout">
                <p className="modal-txt-detail" style={{ textAlign: "right" }}>
                  {amount} THB
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      {/* <Modal.Footer align="center" style={{ display: "block" }}>
        <ButtonState
          style={"btn btn-primary mb-4"}
          disabled={loading}
          loading={loading.index === "accept" && loading.status === true}
          onFunction={() => handleSubmit()}
          text={"Confirm Payment"}
        />
      </Modal.Footer> */}
    </div>
  );
};
export default OmTopUP;
