import {getImageGridFS} from "models/image"
import React, {useEffect, useState} from "react"
import {fetchUserData} from "utils/api/user-api"
import Card from "../components/card/CardGashapon"
import {
  fetchImageBucket,
  fetchCollectionList,
} from "../utils/api/collection-api"
import {fetchWhitelistUser, fetchWhitelist} from "../utils/api/whitelist-api"

const FeatureCollection = () => {
  const [collection, setCollection] = useState([])
  const [creator, setCreator] = useState([])

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
      const _creator = await fetchWhitelist()
      let obj = {
        title: "",
        creator: "",
        description: "",
        cover: "",
        profile: "",
        href: "",
        createAt: 0,
      }
      let creatorCollection = blankCollection
      console.log(_creator)
      setCreator(_creator)
      let col = await Promise.all(
        _creator.rows.map(async (item) => {
          const _collection = await fetchCollectionList(item.address)
          console.log(_collection)

          if (_collection.rows.length > 0) {
            console.log(333)
            const latestCollection = await _collection.rows[0]

            let user = await fetchUserData(latestCollection.owner)

            let creatorImage = await getImageUrl(latestCollection.owner)

            if (user.rows.length > 0) {
              let _user = user.rows[0]

              if (_user.profileImage) {
                creatorImage = getImageGridFS(_user.profileImage)
              }
            }

            obj = {
              title: latestCollection.title,
              creator: await getName(latestCollection.owner),
              description: latestCollection.description,
              cover: await fetchImageBucket(latestCollection.cover),
              profile: creatorImage,
              href: `/profile/${latestCollection._id}`,
              createAt: latestCollection.updatedAt,
            }

            creatorCollection.unshift(obj)
          } else {
            return
          }
        })
      )
      console.log(creatorCollection)
      const _limitCollection = await limitSize(creatorCollection)
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
      return "/assets/image/02.png"
    } else {
      const userData = await fetchWhitelistUser(owner)
      if (userData.rows.length === 0) {
        return "/assets/image/02.png"
      } else {
        const url = await getImage(userData.rows[0].image)
        return url
      }
    }
  }

  const getImage = async (id) => {
    if (typeof id === "undefined") {
      return "/assets/image/02.png"
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
