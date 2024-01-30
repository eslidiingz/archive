// START IMPORT CONFIG
import Config from "../configs/config";
// END IMPORT CONFIG

// START IMPORT CONTEXTS AND UTILITY FUNCTIONS
import { useWalletContext } from "../context/wallet";
import { useEffect, useState } from "react";
import { BigNumber } from "ethers";
// END IMPORT CONTEXTS AND UTILITY FUNCTIONS

// START IMPORT MODEL FUNCTIONS
import {
  getApproveForAll as getApproveForMonster,
  setApproveForAll as setApproveForAllMonster,
  getNftMonsters,
  redeemMonster,
} from "../models/Monster";
import {
  getApproveForAll as getApproveForAllLand,
  setApproveForAll as setApproveForAllLand,
} from "../models/Land";
import {
  getApproveForAll as getApproveForAllItem,
  setApproveForAll as setApproveForAllItem,
  getAmountLock,
} from "../models/Item";

import { getNftLands, redeemLand } from "../models/Land";
import { getNftAssetItems, redeemItem } from "../models/Item";
import { placeInventoryItem } from "../models/Market";
import { allowanced, approveToken } from "../models/Token";
// END IMPORT MODEL FUNCTIONS

// START IMPORT API UTILITY FUNCTIONS
import { getAllMonsters, insertMonster } from "../utils/api/monster-api";
import { insertLand } from "../utils/api/land-api";
import { getAllItems, insertItem } from "../utils/api/item-api";
// END IMPORT API UTILITY FUNCTIONS

// START IMPORT LIBRARY COMPONENTS
import { Form, Spinner, Tabs, Tab } from "react-bootstrap";
import Swal from "sweetalert2";
// END IMPORT LIBRARY COMPONENTS

// START IMPORT CUSTOM COMPONENTS
import NavbarLeft from "../components/Layouts/NavbarLeft";
import MonsterCard from "../components/card/monsterCard";
import LandCard from "../components/card/landCard";
import AssetItemCard from "../components/card/assetItemCard";
import ConfirmModal from "../components/Modal/ConfirmModal";
import SaleModal from "../components/Modal/SaleModal";
import MonsterDetailModal from "../components/Modal/MonsterDetailModal";
import LandDetailModal from "../components/Modal/LandDetailModal";
import AssetItemDetailModal from "../components/Modal/AssetItemDetailModal";
// END IMPORT CUSTOM COMPONENTS

export default function Inventory() {
  const REGEX_ONLY_NUMBER = /^[0-9\b]+$/;
  const TIERS = ["Immortal", "Legendary", "Epic", "Rare", "Common", "Crystal"];
  const IMG_EXTENSION = ".jpg";

  const { wallet } = useWalletContext();

  const [monsterCards, setMonsterCards] = useState([]);
  const [landCards, setLandCards] = useState([]);
  const [assetItems, setAssetItems] = useState([]);

  const [formInvalid, setFormInvalid] = useState({
    price: false,
    amount: false,
  });
  const [loading, setLoading] = useState(false);
  const [disableActionButton, setDisableActionButton] = useState(false);
  const [disableApproveButton, setDisableApproveButton] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("monster");
  const [monsterFilterBy, setMonsterFilterBy] = useState(null);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);
  const [salePrice, setSalePrice] = useState("");
  const [isApprovedInventoryItem, setIsApprovedInventoryItem] = useState({
    token: false,
    item: false,
  });
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDetailInventoryModal, setShowDetailInventoryModal] = useState({
    monster: false,
    land: false,
    item: false,
  });
  const [infoInputConfirmModal, setInfoInputConfirmModal] = useState({
    show: false,
    value: "",
  });

  useEffect(() => {
    let mounted = true;

    if (mounted) initialize();

    return () => {
      mounted = false;
    };
  }, []);

  const initialize = async () => {
    try {
      setLoading(true);

      if (activeTab === "monster") {
        const masterMonster = await getAllMonsters();
        const allMonsterCards = await handleFetchMonster(masterMonster);
        setMonsterCards(allMonsterCards);
      }
    } catch (err) {
      console.log(err.message);
      clearAllInventoryItem();
    }
    setLoading(false);
  };

  // START HANDLE FETCH INVENTORY ITEM
  const handleFetchMonster = async (masterMonsters = []) => {
    try {
      let foundMonsters = [];
      const monsters = await getNftMonsters(wallet);
      for await (const monster of monsters) {
        const { monsterId, tokenId } = monster;
        const idLeadingZero = monsterId?.toString?.()?.padStart(3, "0");
        const monsterNo = `Mon${idLeadingZero}`;
        const monsterData = {
          ...masterMonsters.find(
            (masterMonster) => masterMonster.no === monsterNo
          ),
        };

        if (monsterData) {
          monsterData.tokenId = tokenId;
          monsterData.no = idLeadingZero;
          monsterData.image = `${Config.INVENTORY_IMG_URL}/card/MUI${idLeadingZero}${IMG_EXTENSION}`;
          foundMonsters.push(monsterData);
        }
      }

      return foundMonsters;
    } catch {
      return [];
    }
  };

  const handleFetchLand = async () => {
    setLoading(true);
    return getNftLands(wallet);
  };

  const handleFetchAssetItem = async (masterAssets = []) => {
    try {
      let foundAssets = [];
      const assets = await getNftAssetItems(wallet);

      for await (const asset of assets) {
        const tempAsset = { ...asset };
        const assetData = {
          ...masterAssets.find((masterAsset) => masterAsset.no === asset.no),
        };

        if (assetData && asset.balance > 0) {
          tempAsset.id = assetData.id;
          foundAssets.push(tempAsset);
        }
      }

      return foundAssets;
    } catch {
      return [];
    }
  };
  // END FETCH INVENTORY ITEM

  const handleChangeInventoryTab = async (tab) => {
    const isSameTab = activeTab === tab;
    if (!isSameTab) {
      setLoading(true);
      clearAllInventoryItem();
      setActiveTab(tab);
      if (tab === "monster") {
        const masterMonster = await getAllMonsters();
        const allMonsterCards = await handleFetchMonster(masterMonster);
        setMonsterCards(allMonsterCards);
      } else if (tab === "land") {
        const allLandCards = await handleFetchLand();
        setLandCards(allLandCards);
      } else if (tab === "item") {
        const masterItems = await getAllItems();
        const allAssetItems = await handleFetchAssetItem(masterItems);
        setAssetItems(allAssetItems);
      }
      setLoading(false);
    }
  };

  const handleChangeMonsterFilter = (e) => {
    const selectedMonsterFilter = e.target.value?.toLowerCase();
    setMonsterFilterBy(selectedMonsterFilter);
    if (e.target.checked) {
      if (Array.isArray(monsterCards)) {
        if (selectedMonsterFilter === "power") {
          const sortedMonsterCards = [
            ...monsterCards.sort(
              (a, b) => parseFloat(a.power) - parseFloat(b.power)
            ),
          ];
          setMonsterCards(sortedMonsterCards);
        } else if (selectedMonsterFilter === "class") {
          const tempMonsterCards = [...monsterCards];
          for (let i = 0; i < tempMonsterCards.length; i++) {
            const classIndex = TIERS.findIndex(
              (tier) => tier === tempMonsterCards[i].class
            );
            tempMonsterCards[i].classIndex = classIndex;
          }
          const sortedMonsterCards = [
            ...tempMonsterCards.sort(
              (a, b) => parseFloat(a.classIndex) - parseFloat(b.classIndex)
            ),
          ];
          setMonsterCards(sortedMonsterCards);
        }
      }
    } else {
      setMonsterFilterBy(null);
    }
  };

  const validateSalePrice = async () => {
    let validated = true;
    try {
      const enteredSalePrice = parseInt(salePrice);

      if (isNaN(enteredSalePrice) || enteredSalePrice < 0) {
        validated = false;
      } else {
        validated = true;
      }
    } catch {
      validated = false;
    }

    setFormInvalid((prevState) => ({ ...prevState, price: !validated }));

    return validated;
  };

  const validateUseAssetAmount = async () => {
    let validated = true;
    try {
      const enteredAssetAmount = parseInt(infoInputConfirmModal.value);

      if (isNaN(enteredAssetAmount) || enteredAssetAmount < 1)
        validated = false;

      if (activeTab === "item") {
        if (enteredAssetAmount > selectedInventoryItem.balance)
          validated = false;
      } else {
        validated = true;
      }
    } catch {
      validated = false;
    }

    setFormInvalid((prevState) => ({ ...prevState, amount: !validated }));

    return validated;
  };

  const handleUseInventoryItem = async () => {
    try {
      console.log("ON BUY", selectedInventoryItem);
      setDisableActionButton(true);

      let redeemResult = false;
      let responseInsertInventory = false;

      if (activeTab === "monster") {
        redeemResult = await redeemMonster(
          selectedInventoryItem.tokenId,
          wallet
        );
        if (redeemResult.status == 1) {
          responseInsertInventory = await insertMonster(
            wallet,
            selectedInventoryItem.id,
            redeemResult.transactionHash
          );
        }
      } else if (activeTab === "land") {
        redeemResult = await redeemLand(selectedInventoryItem.tokenId, wallet);
        if (redeemResult) {
          const reqLandData = {
            walletAddress: wallet,
            landCode: selectedInventoryItem.codeInt,
            zone: selectedInventoryItem.zone,
            index: selectedInventoryItem.index,
            default: false,
            hash: redeemResult.transactionHash,
          };

          responseInsertInventory = await insertLand(reqLandData);
        }
      } else if (activeTab === "item") {
        const validated = await validateUseAssetAmount();

        if (!validated) {
          Swal.fire(
            "Warning",
            "Amount is nout enough or amount less than 1 unit.",
            "warning"
          );
          setDisableActionButton(false);
          setLoading(false);
          return;
        }

        const balance = infoInputConfirmModal.value;
        // const balance = selectedInventoryItem.balance;

        const item = { ...selectedInventoryItem };

        redeemResult = await redeemItem(item.tokenId, balance, wallet);
        if (redeemResult) {
          const reqItemData = {
            walletAddress: wallet,
            assetId: item.id,
            assetAmount: parseInt(balance),
            assetTypeAmount: false,
            hash: redeemResult.transactionHash,
          };
          responseInsertInventory = await insertItem(reqItemData);
        }
      }

      if (responseInsertInventory) {
        setShowDetailInventoryModal({
          monster: false,
          land: false,
          item: false,
        });
        setShowConfirmModal(false);
        setSelectedInventoryItem(null);
        setLoading(false);

        Swal.fire("Success", "Used inventory item successfully.", "success");

        refreshInventoryItem();
      } else {
        Swal.fire("Warning", "Failed to use inventory item.", "warning");
      }
    } catch (err) {
      console.error(err.message);
      Swal.fire("Warning", "Failed to use inventory item.", "warning");
    }

    setDisableActionButton(false);
    setLoading(false);
  };

  const handleChangeSalePrice = (e) => {
    let enteredSalePrice;
    try {
      enteredSalePrice = e.target.value?.trim?.();
      enteredSalePrice =
        enteredSalePrice === "" || REGEX_ONLY_NUMBER.test(enteredSalePrice)
          ? enteredSalePrice
          : salePrice;
    } catch {
      enteredSalePrice = salePrice;
    }
    setSalePrice(enteredSalePrice);
  };

  const handleChangeUseBalance = (e) => {
    let enteredBalance;
    try {
      enteredBalance = e.target.value?.trim?.();
      enteredBalance =
        enteredBalance === "" || REGEX_ONLY_NUMBER.test(enteredBalance)
          ? enteredBalance
          : infoInputConfirmModal.value;
    } catch {
      enteredBalance = infoInputConfirmModal.value;
    }
    setInfoInputConfirmModal((prevState) => ({
      ...prevState,
      value: enteredBalance,
    }));
  };

  const handleOpenInventoryItemDetail = async (inventoryItem) => {
    console.log("ON VIEW DETAIL", inventoryItem);
    setSelectedInventoryItem(inventoryItem);
    setShowDetailInventoryModal({
      monster: activeTab === "monster",
      land: activeTab === "land",
      item: activeTab === "item",
    });
  };

  const handleOpenConfirmModal = async (inventoryItem) => {
    setSelectedInventoryItem(inventoryItem);
    setInfoInputConfirmModal({
      show: activeTab === "item" ? true : false,
      value: "",
    });
    setShowConfirmModal(true);
    setDisableApproveButton(false);
    setFormInvalid({ price: false, amount: false });
  };

  const handleOpenSaleModal = async (inventoryItem) => {
    setModalLoading(true);
    setSelectedInventoryItem(inventoryItem);
    setSalePrice("");
    setShowDepositModal(true);
    setDisableActionButton(false);
    setFormInvalid({ price: false, amount: false });
    setInfoInputConfirmModal({ show: false, value: "" });

    let isApprovedInventory = false;
    const isApprovedToken = await allowanced(
      wallet,
      Config.MARKET_CA,
      Config.BUSD_CA,
      true
    );
    if (activeTab === "monster" || activeTab === "land")
      setInfoInputConfirmModal({ show: false, value: "" });

    if (activeTab === "monster") {
      isApprovedInventory = await getApproveForMonster();
      console.log(
        "APP",
        isApprovedInventory,
        parseInt(BigNumber.from(isApprovedToken)._hex, 16)
      );
    } else if (activeTab === "land") {
      isApprovedInventory = await getApproveForAllLand();
    } else if (activeTab === "item") {
      isApprovedInventory = await getApproveForAllItem();
      if (isApprovedInventory) {
        setInfoInputConfirmModal({ show: true, value: "" });
      }
    }

    setIsApprovedInventoryItem({
      token: parseInt(BigNumber.from(isApprovedToken)._hex, 16) > 0,
      item: isApprovedInventory,
    });

    setModalLoading(false);
  };

  const handleApproveInventoryItem = async () => {
    setDisableApproveButton(true);
    let isApproveSuccess = true;
    try {
      if (activeTab === "monster") {
        isApproveSuccess = await getApproveForMonster();
        if (!isApproveSuccess)
          isApproveSuccess = await setApproveForAllMonster();
      } else if (activeTab === "land") {
        isApproveSuccess = await getApproveForAllLand();
        if (!isApproveSuccess) isApproveSuccess = await setApproveForAllLand();
      } else if (activeTab === "item") {
        isApproveSuccess = await getApproveForAllItem();
        if (!isApproveSuccess) isApproveSuccess = await setApproveForAllItem();
      }
    } catch (err) {
      console.error(err.message);
      isApproveSuccess = false;
    }

    setIsApprovedInventoryItem((prevState) => ({
      ...prevState,
      item: isApproveSuccess,
    }));
    setDisableApproveButton(false);
  };

  const handleApproveToken = async () => {
    setDisableApproveButton(true);
    let isApproveSuccess = true;
    try {
      const isApprovedToken = await allowanced(
        wallet,
        Config.MARKET_CA,
        Config.BUSD_CA,
        true
      );
      if (parseInt(BigNumber.from(isApprovedToken)._hex, 16) < 1) {
        const isApproveToken = await approveToken(Config.MARKET_CA);
        isApproveSuccess = isApproveToken ? true : false;
      }
    } catch {
      isApproveSuccess = false;
    }

    setIsApprovedInventoryItem((prevState) => ({
      ...prevState,
      token: isApproveSuccess,
    }));
    setDisableApproveButton(false);
  };

  const handlePlaceInventoryItem = async () => {
    try {
      setDisableActionButton(true);
      const validatedSalePrice = await validateSalePrice();

      // if (activeTab === "item") {
      //   const validatedAmount = await validateUseAssetAmount();
      //   if (!validatedAmount) {
      //     setDisableActionButton(false);
      //     return Swal.fire("Warning", "Please check your amount.", "warning");
      //   }
      // }
      // PRODUCTION
      if (activeTab === "item") {
        const validatedAmount = await validateUseAssetAmount();
        if (!validatedAmount) {
          setDisableActionButton(false);
          return Swal.fire("Warning", "Please check your amount.", "warning");
        }
      }

      if (!validatedSalePrice) {
        setDisableActionButton(false);
        return Swal.fire("Warning", "Please enter sale price.", "warning");
      }

      const amount = activeTab === "item" ? infoInputConfirmModal.value : 1;

      const result = await placeInventoryItem(
        selectedInventoryItem.tokenId,
        amount,
        salePrice,
        null,
        null,
        activeTab
      );

      if (result && result?.status === 1) {
        setShowDetailInventoryModal({
          monster: !activeTab === "monster",
          land: !activeTab === "land",
          item: !activeTab === "item",
        });
        setShowDepositModal(false);
        setSelectedInventoryItem(null);
        setSalePrice("");
        setDisableActionButton(false);

        Swal.fire("Success", "Place item successfully.", "success");

        refreshInventoryItem();

        return;
      } else {
        setDisableActionButton(false);
        return Swal.fire(
          "Error",
          "Transaction Failed, Please try again.",
          "error"
        );
      }
    } catch (e) {
      setDisableActionButton(false);
      Swal.fire("Error", "Transaction Failed, Please try again.", "error");
    }
  };

  const refreshInventoryItem = async () => {
    try {
      setLoading(true);
      if (activeTab === "monster") {
        const masterMonster = await getAllMonsters();
        const allMonsterCards = await handleFetchMonster(masterMonster);
        setMonsterCards(allMonsterCards);
      } else if (activeTab === "land") {
        const allLandCards = await handleFetchLand();
        setLandCards(allLandCards);
      } else if (activeTab === "item") {
        const masterItems = await getAllItems();
        const allAssetItems = await handleFetchAssetItem(masterItems);
        setAssetItems(allAssetItems);
      }
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  const clearAllInventoryItem = () => {
    setMonsterCards([]);
    setLandCards([]);
    setAssetItems([]);
    setSalePrice("");
    setMonsterFilterBy(null);
    setDisableActionButton(false);
    setDisableApproveButton(false);
    setFormInvalid({ price: false, amount: false });
    setInfoInputConfirmModal({ show: false, value: "" });
  };

  const handleCloseDepositModal = () => setShowDepositModal(false);

  const handleCloseConfirmModal = () => setShowConfirmModal(false);

  const handleCloseDetailInventoryModal = () => {
    setShowDetailInventoryModal({
      monster: !activeTab === "monster",
      land: !activeTab === "land",
      item: !activeTab === "item",
    });
  };

  return (
    <div className="container">
      <h1 className="text-center text-blue font-large">Inventory</h1>
      <div className="index-layout">
        <NavbarLeft />
        <div className="content">
          <div className="row">
            <div className="col-xxl-12 display-grid">
              <Tabs
                defaultActiveKey="monster"
                className=" z-index-0"
                activeKey={activeTab}
                onSelect={handleChangeInventoryTab}
              >
                <Tab
                  eventKey="monster"
                  title="MONSTER"
                  tabClassName="tab-first tab-opacity"
                  disabled={loading}
                >
                  <div className="bg-primary  p-4 p-lg-2 container mt-3">
                    {!loading && (
                      <div className="d-flex justify-content-between">
                        <Form className="display-flex">
                          <Form.Group
                            className="mx-3 cursor"
                            controlId="formBasicCheckbox1"
                          >
                            <Form.Check
                              type="checkbox"
                              label="CLASS"
                              value="class"
                              checked={monsterFilterBy === "class"}
                              onChange={handleChangeMonsterFilter}
                            />
                          </Form.Group>
                          <Form.Group
                            className="mx-3 cursor"
                            controlId="formBasicCheckbox2"
                          >
                            <Form.Check
                              type="checkbox"
                              label="POWER"
                              value="power"
                              checked={monsterFilterBy === "power"}
                              onChange={handleChangeMonsterFilter}
                            />
                          </Form.Group>
                        </Form>
                      </div>
                    )}
                    <div className=" py-2 row">
                      {loading && (
                        <div className="text-center d-flex justify-content-center">
                          <span className="me-2 my-auto">Loading</span>{" "}
                          <Spinner animation="border" role="status" />
                        </div>
                      )}
                      {!loading && monsterCards?.length <= 0 && (
                        <h4 className="text-center my-4">Monster not found</h4>
                      )}
                      {!loading &&
                        Array.isArray(monsterCards) &&
                        monsterCards.length > 0 &&
                        monsterCards.map((monster, index) => (
                          <MonsterCard
                            data={monster}
                            onShowConfirmUseModal={handleOpenConfirmModal}
                            onShowSaleModal={handleOpenSaleModal}
                            onOpenModal={handleOpenInventoryItemDetail}
                            key={`${monster?.name}_${index}`}
                          />
                        ))}
                    </div>
                  </div>
                </Tab>
                <Tab
                  eventKey="land"
                  title="LAND "
                  tabClassName="tab-second tab-opacity"
                  disabled={loading}
                >
                  <div className="bg-primary  p-4 p-lg-2 container mt-3">
                    <div className=" py-2 row">
                      {loading && (
                        <div className="text-center d-flex justify-content-center">
                          <span className="me-2 my-auto">Loading</span>{" "}
                          <Spinner animation="border" role="status" />
                        </div>
                      )}
                      {!loading && landCards?.length <= 0 && (
                        <h4 className="text-center my-4">Land not found.</h4>
                      )}
                      {!loading &&
                        Array.isArray(landCards) &&
                        landCards.length > 0 &&
                        landCards.map((land, index) => (
                          <LandCard
                            data={land}
                            onShowConfirmUseModal={handleOpenConfirmModal}
                            onShowSaleModal={handleOpenSaleModal}
                            onOpenModal={handleOpenInventoryItemDetail}
                            key={`${land?.name}_${index}`}
                          />
                        ))}
                    </div>
                  </div>
                </Tab>
                <Tab
                  eventKey="item"
                  title="ITEM"
                  tabClassName="tab-third tab-opacity"
                  disabled={loading}
                >
                  <div className="bg-primary  p-4 p-lg-2 container mt-3">
                    <div className=" py-2 row">
                      {loading && (
                        <div className="text-center d-flex justify-content-center">
                          <span className="me-2 my-auto">Loading</span>{" "}
                          <Spinner animation="border" role="status" />
                        </div>
                      )}
                      {!loading && assetItems?.length <= 0 && (
                        <h4 className="text-center my-4">Item not found.</h4>
                      )}
                      {!loading &&
                        Array.isArray(assetItems) &&
                        assetItems.length > 0 &&
                        assetItems.map((asset, index) => (
                          <AssetItemCard
                            data={asset}
                            onShowConfirmUseModal={handleOpenConfirmModal}
                            onShowSaleModal={handleOpenSaleModal}
                            onOpenModal={handleOpenInventoryItemDetail}
                            key={`${asset?.name}_${index}`}
                          />
                        ))}
                    </div>
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* START MODAL SECTION */}
      <MonsterDetailModal
        data={selectedInventoryItem}
        onClose={handleCloseDetailInventoryModal}
        show={showDetailInventoryModal.monster}
        disableButton={disableActionButton}
        onShowConfirmUseModal={handleOpenConfirmModal}
        onShowSaleModal={handleOpenSaleModal}
      />
      <LandDetailModal
        data={selectedInventoryItem}
        onClose={handleCloseDetailInventoryModal}
        show={showDetailInventoryModal.land}
        disableButton={disableActionButton}
        onShowConfirmUseModal={handleOpenConfirmModal}
        onShowSaleModal={handleOpenSaleModal}
      />
      <AssetItemDetailModal
        data={selectedInventoryItem}
        onClose={handleCloseDetailInventoryModal}
        show={showDetailInventoryModal.item}
        disableButton={disableActionButton}
        onShowConfirmUseModal={handleOpenConfirmModal}
        onShowSaleModal={handleOpenSaleModal}
      />
      <SaleModal
        onClose={handleCloseDepositModal}
        show={showDepositModal}
        data={selectedInventoryItem}
        onChangeSalePrice={handleChangeSalePrice}
        salePrice={salePrice}
        onConfirm={handlePlaceInventoryItem}
        onApproveToken={handleApproveToken}
        onApproveItem={handleApproveInventoryItem}
        isApprovedInventoryItem={isApprovedInventoryItem}
        activeTab={activeTab}
        loading={modalLoading}
        disableApproveButton={disableApproveButton}
        balanceInputInfo={infoInputConfirmModal}
        onChangeBalance={handleChangeUseBalance}
        formInvalid={formInvalid}
        disableButton={disableActionButton}
      />
      <ConfirmModal
        onClose={handleCloseConfirmModal}
        show={showConfirmModal}
        onConfirm={handleUseInventoryItem}
        balanceInputInfo={infoInputConfirmModal}
        onChangeBalance={handleChangeUseBalance}
        disableButton={disableActionButton}
        formInvalid={formInvalid}
      />
      {/* END MODAL SECTION */}
    </div>
  );
}
