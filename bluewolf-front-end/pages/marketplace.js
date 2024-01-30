import {useEffect, useState} from "react"
import Card from "../components/card/CardGashapon"
import Mainlayout from "../components/layouts/Mainlayout"
import {Tabs, Tab} from "react-bootstrap"
import {fetchWhitelistUser, fetchWhitelist} from "../utils/api/whitelist-api"
import Spinner from "react-bootstrap/Spinner"
import {
  fetchImageBucket,
  fetchAllCollection,
  fetchCollectionList,
} from "../utils/api/collection-api"
import {fetchUserData} from "utils/api/user-api"
import {getImageGridFS} from "models/image"

const Marketplace = () => {
  const [collection, setCollection] = useState([])
  const [activeTab, setActiveTab] = useState("collections")
  const [creator, setCreator] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCreator = async () => {
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
      let creatorCollection = []

      await Promise.all(
        _creator.rows.map(async (item) => {
          const _collection = await fetchCollectionList(item.address)

          if (_collection.rows.length > 0) {
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
            creatorCollection.push(obj)
          } else {
            return
          }
        })
      )
      setCreator(creatorCollection)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchColletion = async () => {
    try {
      const _collection = await fetchAllCollection()

      let _collectionObj = {
        creatorName: "",
        profileImage: "",
        collectionId: "",
        collectionTitle: "",
        collectionDescription: "",
        coverImage: "",
      }

      const collectionList = await Promise.all(
        _collection.rows.map(async (item) => {
          let user = await fetchUserData(item.owner)
          let creatorImage = await getImageUrl(item.owner)

          if (user.rows.length > 0) {
            let _user = user.rows[0]

            if (_user.profileImage) {
              creatorImage = getImageGridFS(_user.profileImage)
            }
          }

          _collectionObj = {
            creatorName: await getName(item.owner),
            profileImage: creatorImage,
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

  const getName = async (owner) => {
    if (typeof owner === "undefined") {
      return "Guest"
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

  const handleChangeTab = (tab) => {
    setActiveTab(tab)
  }

  const fetchTabContent = async () => {
    console.log(activeTab)
    if (activeTab === "collections") {
      await fetchColletion()
    } else if (activeTab === "creators") {
      await fetchCreator()
    }
    setLoading(false)
  }

  useEffect(() => {
    let isMounted = true
    if (isMounted) fetchTabContent()

    return () => {
      isMounted = false
    }
  }, [activeTab])

  return (
    <>
      {/* Content All*/}
      <div className="events">
        <div className="container my-4">
          <div className="row ">
            <div className="col-12 layout-margin_top" align="MIDDLE">
              <h2 className="my-4 my-md-5">Marketplace</h2>
            </div>
          </div>
          {/* Content */}
          <div className="container mt-3 mt-3-bo">
            <Tabs
              defaultActiveKey={activeTab}
              activeKey={activeTab}
              id="uncontrolled-tab-example"
              className="mb-3 flex-scroll "
              onSelect={handleChangeTab}
            >
              <Tab
                eventKey="collections"
                title="Collections"
                tabClassName="w-170-tab"
              >
                <div className="row">
                  <div align="right" className="hide-mobile">
                    <button className="btnm">
                      <i
                        className="fas fa-grip-lines icon-navmobile"
                        data-bs-toggle="collapse"
                        data-bs-target="#Games-m01"
                        aria-expanded="false"
                        aria-controls="Games-m01"
                      ></i>
                    </button>
                    <button className="btnm">
                      <i
                        className="fas fa-th-large icon-navmobile"
                        data-bs-toggle="collapse"
                        data-bs-target="#Games-m02"
                        aria-expanded="false"
                        aria-controls="Games-m02"
                      ></i>
                    </button>
                  </div>
                  {loading === true ? (
                    <>
                      <div className="d-flex justify-content-center">
                        <Spinner
                          animation="border"
                          variant="primary"
                          role="status"
                          style={{width: "2rem", height: "2rem"}}
                        >
                          <span className="visually-hidden ">Loading...</span>
                        </Spinner>
                      </div>
                    </>
                  ) : collection.length > 0 ? (
                    collection.map((item, key) => {
                      return (
                        item && (
                          <div
                            key={key}
                            className="col-12 col-md-6 col-lg-4 cursor-pointer"
                          >
                            <Card
                              title={item.collectionTitle}
                              creator={item.creatorName}
                              description={item.collectionDescription}
                              cover={item.coverImage}
                              profile={item.profileImage}
                              href={`/profile/${item.collectionId}`}
                            ></Card>
                          </div>
                        )
                      )
                    })
                  ) : (
                    <p>No data</p>
                  )}
                </div>
              </Tab>

              <Tab eventKey="games" disabled title="Games">
                <div className="row">
                  <div align="right" className="hide-mobile">
                    <button className="btnm">
                      <i
                        className="fas fa-grip-lines icon-navmobile"
                        data-bs-toggle="collapse"
                        data-bs-target="#Games-m01"
                        aria-expanded="false"
                        aria-controls="Games-m01"
                      ></i>
                    </button>
                    <button className="btnm">
                      <i
                        className="fas fa-th-large icon-navmobile"
                        data-bs-toggle="collapse"
                        data-bs-target="#Games-m02"
                        aria-expanded="false"
                        aria-controls="Games-m02"
                      ></i>
                    </button>
                  </div>
                  <h2> Coming Soon !! </h2>
                  {/* {cardGames.map((item, key) => {
                    return (
                      item && (
                        <div key={key} className="col-lg-4">
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
                    )
                  })} */}
                </div>
              </Tab>
              <Tab eventKey="creators" title="Creators">
                <div className="row">
                  <div align="right" className="hide-mobile">
                    <button className="btnm">
                      <i
                        className="fas fa-grip-lines icon-navmobile"
                        data-bs-toggle="collapse"
                        data-bs-target="#Games-m01"
                        aria-expanded="false"
                        aria-controls="Games-m01"
                      ></i>
                    </button>
                    <button className="btnm">
                      <i
                        className="fas fa-th-large icon-navmobile"
                        data-bs-toggle="collapse"
                        data-bs-target="#Games-m02"
                        aria-expanded="false"
                        aria-controls="Games-m02"
                      ></i>
                    </button>
                  </div>
                  {loading === true ? (
                    <>
                      <div className="d-flex justify-content-center">
                        <Spinner
                          animation="border"
                          variant="primary"
                          role="status"
                          style={{width: "2rem", height: "2rem"}}
                        >
                          <span className="visually-hidden ">Loading...</span>
                        </Spinner>
                      </div>
                    </>
                  ) : creator.length > 0 ? (
                    creator.map((item, key) => {
                      return (
                        item && (
                          <div key={key} className="col-lg-4 cursor-pointer">
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
                      )
                    })
                  ) : (
                    <p>No data</p>
                  )}
                </div>
              </Tab>
            </Tabs>
          </div>
          {/* End-Contant */}
        </div>
      </div>
      {/* End-Content All*/}
    </>
  )
}

export default Marketplace
Marketplace.layout = Mainlayout
