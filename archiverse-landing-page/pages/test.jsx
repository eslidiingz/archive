import React from "react";
import Config from "../configs/config";
import { gqlQuery } from "../models/GraphQL";
import { createUser, getUsers } from "../models/User";

const action = async () => {
  let minted = [
    {
      id: 14,
      collectionId: 5,
      creator: "0xE40845297c6693863Ab3E10560C97AACb32cbc6C",
      metadata: {
        name: "Monkey D Tottee",
        tags: ["bbb"],
        image: "https://fileserver.merx.studio/file-1655801420446.jpeg",
        amount: "4",
        description: "Monkey D Tottee desc",
        externalLink: "https://audioplayer.madza.dev/Madza-Chords_of_Life.mp3",
        collectionName: "Animal Collection",
        collectionOption: "collectionExisting",
      },
      nftAddress: "0x8e840fa8d00d37Baae800432988Af74F83932821",
      orderId: null,
      owner: "0xE40845297c6693863Ab3E10560C97AACb32cbc6C",
      owner_address: {
        id: 4,
        bio: null,
        createdAt: "2022-06-21T07:33:11.329049+00:00",
        isActive: true,
        isBanned: false,
        isVerified: false,
        name: null,
        profileImage: null,
        updatedAt: "2022-06-21T07:33:11.329049+00:00",
        wallet: "0xE40845297c6693863Ab3E10560C97AACb32cbc6C",
      },
      tags: [
        {
          id: 7,
          name: "bbb",
        },
      ],
      tokenId: 0,
      view: 0,
      createdAt: "2022-06-21T08:50:45.698019+00:00",
      updatedAt: "2022-06-21T08:50:45.698019+00:00",
      collection: {
        id: 5,
        name: "Animal Collection",
        coverUrl: null,
        backgroundUrl: null,
        creatorWallet: "0xE40845297c6693863Ab3E10560C97AACb32cbc6C",
        description: null,
        createdAt: "2022-06-21T07:33:11.076688+00:00",
        updatedAt: "2022-06-21T07:33:11.076688+00:00",
      },
    },
    {
      id: 15,
      collectionId: 5,
      creator: "0xE40845297c6693863Ab3E10560C97AACb32cbc6C",
      metadata: {
        name: "Monkey D Tottee",
        tags: ["bbb"],
        image: "https://fileserver.merx.studio/file-1655801420446.jpeg",
        amount: "4",
        description: "Monkey D Tottee desc",
        externalLink: "https://audioplayer.madza.dev/Madza-Chords_of_Life.mp3",
        collectionName: "Animal Collection",
        collectionOption: "collectionExisting",
      },
      nftAddress: "0x8e840fa8d00d37Baae800432988Af74F83932821",
      orderId: null,
      owner: "0xE40845297c6693863Ab3E10560C97AACb32cbc6C",
      owner_address: {
        id: 4,
        bio: null,
        createdAt: "2022-06-21T07:33:11.329049+00:00",
        isActive: true,
        isBanned: false,
        isVerified: false,
        name: null,
        profileImage: null,
        updatedAt: "2022-06-21T07:33:11.329049+00:00",
        wallet: "0xE40845297c6693863Ab3E10560C97AACb32cbc6C",
      },
      tags: [
        {
          id: 7,
          name: "bbb",
        },
      ],
      tokenId: 1,
      view: 0,
      createdAt: "2022-06-21T08:50:45.698019+00:00",
      updatedAt: "2022-06-21T08:50:45.698019+00:00",
      collection: {
        id: 5,
        name: "Animal Collection",
        coverUrl: null,
        backgroundUrl: null,
        creatorWallet: "0xE40845297c6693863Ab3E10560C97AACb32cbc6C",
        description: null,
        createdAt: "2022-06-21T07:33:11.076688+00:00",
        updatedAt: "2022-06-21T07:33:11.076688+00:00",
      },
    },
    {
      id: 16,
      collectionId: 5,
      creator: "0xE40845297c6693863Ab3E10560C97AACb32cbc6C",
      metadata: {
        name: "Monkey D Tottee",
        tags: ["bbb"],
        image: "https://fileserver.merx.studio/file-1655801420446.jpeg",
        amount: "4",
        description: "Monkey D Tottee desc",
        externalLink: "https://audioplayer.madza.dev/Madza-Chords_of_Life.mp3",
        collectionName: "Animal Collection",
        collectionOption: "collectionExisting",
      },
      nftAddress: "0x8e840fa8d00d37Baae800432988Af74F83932821",
      orderId: null,
      owner: "0xE40845297c6693863Ab3E10560C97AACb32cbc6C",
      owner_address: {
        id: 4,
        bio: null,
        createdAt: "2022-06-21T07:33:11.329049+00:00",
        isActive: true,
        isBanned: false,
        isVerified: false,
        name: null,
        profileImage: null,
        updatedAt: "2022-06-21T07:33:11.329049+00:00",
        wallet: "0xE40845297c6693863Ab3E10560C97AACb32cbc6C",
      },
      tags: [
        {
          id: 7,
          name: "bbb",
        },
      ],
      tokenId: 2,
      view: 0,
      createdAt: "2022-06-21T08:50:45.698019+00:00",
      updatedAt: "2022-06-21T08:50:45.698019+00:00",
      collection: {
        id: 5,
        name: "Animal Collection",
        coverUrl: null,
        backgroundUrl: null,
        creatorWallet: "0xE40845297c6693863Ab3E10560C97AACb32cbc6C",
        description: null,
        createdAt: "2022-06-21T07:33:11.076688+00:00",
        updatedAt: "2022-06-21T07:33:11.076688+00:00",
      },
    },
    {
      id: 17,
      collectionId: 5,
      creator: "0xE40845297c6693863Ab3E10560C97AACb32cbc6C",
      metadata: {
        name: "Monkey D Tottee",
        tags: ["bbb"],
        image: "https://fileserver.merx.studio/file-1655801420446.jpeg",
        amount: "4",
        description: "Monkey D Tottee desc",
        externalLink: "https://audioplayer.madza.dev/Madza-Chords_of_Life.mp3",
        collectionName: "Animal Collection",
        collectionOption: "collectionExisting",
      },
      nftAddress: "0x8e840fa8d00d37Baae800432988Af74F83932821",
      orderId: null,
      owner: "0xE40845297c6693863Ab3E10560C97AACb32cbc6C",
      owner_address: {
        id: 4,
        bio: null,
        createdAt: "2022-06-21T07:33:11.329049+00:00",
        isActive: true,
        isBanned: false,
        isVerified: false,
        name: null,
        profileImage: null,
        updatedAt: "2022-06-21T07:33:11.329049+00:00",
        wallet: "0xE40845297c6693863Ab3E10560C97AACb32cbc6C",
      },
      tags: [
        {
          id: 7,
          name: "bbb",
        },
      ],
      tokenId: 3,
      view: 0,
      createdAt: "2022-06-21T08:50:45.698019+00:00",
      updatedAt: "2022-06-21T08:50:45.698019+00:00",
      collection: {
        id: 5,
        name: "Animal Collection",
        coverUrl: null,
        backgroundUrl: null,
        creatorWallet: "0xE40845297c6693863Ab3E10560C97AACb32cbc6C",
        description: null,
        createdAt: "2022-06-21T07:33:11.076688+00:00",
        updatedAt: "2022-06-21T07:33:11.076688+00:00",
      },
    },
  ];

  const tokenIdIn = minted.map((obj) => {
    if (typeof obj.tokenId !== "undefined") return obj.tokenId;
  });

  const assetsQuery = (
    await gqlQuery(`
    assets(
      where: {
        nftAddress: {_eq: "${Config.ASSET_CA}"}, 
        tokenId: {_in: [${tokenIdIn}]}
      }, 
      order_by: {tokenId: asc}) {
      id
    }
  `)
  ).data;

  const assetIds = assetsQuery.map((a) => {
    if (typeof a.id !== "undefined") return a.id;
  });

  console.log(tokenIdIn, assetIds);

  // let _wallet = "0xE40845297c6693863Ab3E10560C97AACb32cbc6C";

  // let user = (await getUsers(`{wallet: {_eq: "${_wallet}"}}`)).data;

  // console.log(user.length, user);

  // if (user.length == 0) {
  //   let res = await createUser(_wallet);

  //   console.log("res", res);
  // }
};

function test() {
  return <button onClick={action}>Action</button>;
}

export default test;
