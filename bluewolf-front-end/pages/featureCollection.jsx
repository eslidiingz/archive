import {getImageGridFS} from "models/image"
import React, {useEffect, useState} from "react"
import {fetchUserData} from "utils/api/user-api"
import Card from "../components/card/CardGashapon"
import {fetchImageBucket, fetchAllCollection} from "../utils/api/collection-api"
import {fetchWhitelistUser} from "../utils/api/whitelist-api"

const FeatureCollection = () => {
  const [collection, setCollection] = useState([])

  const blankCollection = [
    {
      title: "BlueWolf NFT",
      creator: "BlueWolf",
      description: "",
      cover: "/assets/image/nodata.png",
      profile: "/assets/image/E138F93A.png",
      href: "",
      createAt: 0,
    },
    {
      title: "BlueWolf NFT",
      creator: "BlueWolf",
      description: "",
      cover: "/assets/image/nodata.png",
      profile: "/assets/image/E138F93A.png",
      href: "",
      createAt: 0,
    },
    {
      title: "BlueWolf NFT",
      creator: "BlueWolf",
      description: "",
      cover: "/assets/image/nodata.png",
      profile: "/assets/image/E138F93A.png",
      href: "",
      createAt: 0,
    },
  ]

  const fetchCollection = async () => {
    try {
      const _collection = await fetchAllCollection()
      let obj = {
        title: "",
        creator: "",
        description: "",
        cover: "",
        profile: "",
        href: "",
        createAt: 0,
      }

      let collectionCollection = blankCollection
      console.log(_collection)

      let col = await Promise.all(
        _collection.rows.map(async (item) => {
          let user = await fetchUserData(item.owner)

          let creatorImage = await getImageUrl(item.owner)

          if (user.rows.length > 0) {
            let _user = user.rows[0]

            if (_user.profileImage) {
              creatorImage = getImageGridFS(_user.profileImage)
            }
          }

          obj = {
            title: item.title,
            creator: await getName(item.owner),
            description: item.description,
            cover: await fetchImageBucket(item.cover),
            profile: creatorImage,
            href: `/profile/${item._id}`,
            createAt: item.updatedAt,
          }
          return obj
        })
      )

      // console.log(col.concat(collectionCollection))
      const _limitCollection = await limitSize(col.concat(collectionCollection))
      setCollection(_limitCollection)
    } catch (error) {
      console.log(error)
    }
  }

  const getName = async (owner) => {
    if (typeof owner === "undefined") {
      return "none"
    } else {
      const userData = await fetchWhitelistUser(owner)

      if (userData.rows.length === 0) {
        return "Guest"
      }
      const _name = userData.rows[0].register.userName
      if (typeof _name === "undefined") {
        return "Guest"
      } else {
        return _name
      }
    }
  }

  const getImageUrl = async (owner) => {
    if (typeof owner === "undefined") {
      return "/assets/image/E138F93A.png"
    } else {
      const userData = await fetchWhitelistUser(owner)
      if (userData.rows.length === 0) {
        return "/assets/image/E138F93A.png"
      } else {
        const url = await getImage(userData.rows[0].image)
        return url
      }
    }
  }

  const getImage = async (id) => {
    if (typeof id === "undefined") {
      return "/assets/image/E138F93A.png"
    } else {
      const url = await fetchImageBucket(id)
      return url
    }
  }

  const limitSize = async (collectionList) => {
    let _collection = []

    if (collectionList.length <= 3) {
      return collectionList
    } else {
      for (let i = 0; i < 3; i++) {
        _collection.push(collectionList[i])
      }
      return _collection
    }
  }

  useEffect(() => {
    let isMounted = true

    if (isMounted) fetchCollection()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <>
      {collection.length > 0
        ? collection.map((item, key) => {
            return (
              <div
                div
                key={key}
                className="col-lg-4 col-12 my-2 cursor-pointer"
              >
                <Card
                  title={item.title}
                  creator={item.creator}
                  description={item.description}
                  cover={item.cover}
                  profile={item.profile}
                  href={item.href}
                ></Card>
              </div>
            )
          })
        : blankCollection.map((item, key) => {
            return (
              <div
                div
                key={key}
                className="col-lg-4 col-12 my-2 cursor-pointer"
              >
                <Card
                  title={item.title}
                  creator={item.creator}
                  description={item.description}
                  cover={item.cover}
                  profile={item.profile}
                  href={item.href}
                ></Card>
              </div>
            )
          })}
    </>
  )
}

export default FeatureCollection
