import {useEffect, useState} from "react"
import Mainlayout from "../../components/layouts/Mainlayout"
import Card from "../../components/card/CardGashapon"
import {fetchWhitelistUser} from "../../utils/api/whitelist-api"
import {
  fetchImageBucket,
  fetchAllCollection,
} from "../../utils/api/collection-api"

const CollectionList = () => {
  const [collection, setCollection] = useState([])

  const fetchColletion = async () => {
    try {
      const _collection = await fetchAllCollection()

      let _collectionObj = {
        creatorName: "",
        collectionId: "",
        collectionTitle: "",
        collectionDescription: "",
        coverImage: "",
      }

      const collectionList = await Promise.all(
        _collection.rows.map(async (item) => {
          _collectionObj = {
            creatorName: await getName(item.owner),
            collectionId: item._id,
            collectionTitle: item.title,
            collectionDescription: item.description,
            coverImage: await fetchImageBucket(item.cover),
          }
          return _collectionObj
        })
      )
      setCollection(collectionList)
    } catch (error) {
      console.log(error)
    }
  }

  const getName = async (owner) => {
    if (typeof owner === "undefined") {
      return "none"
    } else if (
      owner === "6278e34e152ae7001b82adb8" ||
      owner === "6278de2f152ae7001b82ad9b"
    ) {
      return "none"
    } else {
      const userData = await fetchWhitelistUser(owner)

      return userData.rows[0].register.firstName
    }
  }

  useEffect(() => {
    let timerId = setTimeout(() => {
      fetchColletion()

      timerId = null
    }, 500)
    return () => clearTimeout(timerId)
  }, [collection])

  return (
    <>
      {/* Content All*/}
      <section className="events">
        <div className="container">
          <div className="row my-4">
            <div className="col-12 text-center">
              <h2 className=" my-4 my-md-5">Collection</h2>
            </div>
            {collection.map((item, key) => {
              return (
                item && (
                  <div key={key} className="col-12 col-md-6 col-lg-4">
                    <Card
                      title={item.collectionTitle}
                      creator={item.creatorName}
                      description={item.collectionDescription}
                      cover={item.coverImage}
                      profile={`assets/image/01.png`}
                      href={`/profile/${item.collectionId}`}
                    ></Card>
                  </div>
                )
              )
            })}
          </div>
        </div>
      </section>
      {/* End-Content All*/}
    </>
  )
}

export default CollectionList
CollectionList.layout = Mainlayout
