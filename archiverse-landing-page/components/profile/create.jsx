import { Row, Col, InputGroup, FormControl, Button } from "react-bootstrap";
import Search from "../../components/form/search";
import Select from "../../components/form/select";
import CardHidden from "../../components/card/CardHidden";
import { useCallback, useState } from "react";
import { useEffect } from "react";
import { myNftList, smartContractAsset } from "../../models/Asset";
import { getLogsEvent } from "../../utils/logs/getLogs";
import Config from "../../configs/config";
import { id } from "ethers/lib/utils";

import { useWalletContext } from "/context/wallet";
import Loading from "/components/Loading";

// function SetCreate(props) {
//   const { wallet, walletAction } = useWalletContext();

//   const [isLoading, setIsLoading] = useState(true);
//   const [nftList, setNftList] = useState([]);
//   // const { wallet } = [""];

//   // const _assets = useCallback(async () => {
//   //   const fetchMyNft = async () => {
//   //     const nftContract = smartContractAsset(Config.ASSET_CA, Config.ASSET_ABI);

//   //     const topics = [id("Transfer(address,address,uint256)")];
//   //     const result = await getLogsEvent(
//   //       nftContract,
//   //       Config.ASSET_CA,
//   //       Config.ASSET_BLOCK_START,
//   //       topics
//   //     );

//   //     const args = result.map((_i) => _i.args);

//   //     const ownerList = args.filter((_i) => _i.to === wallet);

//   //     // const NFTList = await Promise.all(ownerList);
//   //     console.log(args);
//   //     setNftList(args);
//   //   };

//   //   await fetchMyNft();
//   // }, []);

//   const getMyNft = async () => {
//     setNftList(await myNftList(wallet));
//   };

//   const initialize = async () => {
//     await getMyNft();

//     setTimeout(() => {
//       setIsLoading(false);
//     }, 2000);
//   };

function SetCreate(props) {
  const [nftList, setNftList] = useState([]);
  const { wallet } = useWalletContext();
  const initialize = useCallback(async () => {
    console.log("Initialize");
    // const fetchMyNft = async () => {
    //   const nftContract = smartContractAsset(Config.ASSET_CA, Config.ASSET_ABI);

    //   const topics = [id("Transfer(address,address,uint256)")];
    //   const result = await getLogsEvent(
    //     nftContract,
    //     Config.ASSET_CA,
    //     Config.ASSET_BLOCK_START,
    //     topics
    //   );

    //   const args = result.map((_i) => _i.args);

    //   const ownerList = args.filter((_i) => _i.to === wallet);

    //   // const NFTList = await Promise.all(ownerList);
    //   console.log(args);
    //   setNftList(args);
    // };
    const getMyNft = async () => {
      let nfts = await myNftList(wallet);
      setNftList(nfts);
    };
    await getMyNft();
  }, []);
  useEffect(() => {
    if (props.isActive === "#inventory") initialize();
    // if (props.isActive === "create") initialize();
    // _assets();
  }, [props, wallet]);

  return (
    <>
      <Row className="my-4">
        <Col md={6} className="my-2">
          <Search />
        </Col>
        <Col md={3} className="my-2">
          <Select selected="Single Items" />
        </Col>
        <Col md={3} className="my-2">
          <Select selected="Price" />
        </Col>
      </Row>
      <Row>
        {nftList.map((item, index) => {
          return (
            <Col lg={4} md={4} sm={4} xs={6} className="mb-4" key={index}>
              <CardHidden
                ClassTitle="text-white mb-0"
                // img_profile="/assets/nft-image/user/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.webp"
                img="/assets/nft-image/woman-dive-underwater-see-mysterious-light-sea-digital-art-style-illustration-painting.webp"
                title="Lorem Ipsum is"
                profile="sala"
                tokenId={item.tokenId}
                data={item}
                link={`/assets/${item.nftAddress}/${item.tokenId}`}
              ></CardHidden>
            </Col>
          );
        })}
      </Row>
    </>
  );
}
export default SetCreate;
