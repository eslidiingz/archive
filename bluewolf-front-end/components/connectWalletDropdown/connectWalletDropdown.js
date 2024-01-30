import {useRouter} from "next/router"
import {Dropdown} from "react-bootstrap"
import Link from "next/link"

const ConnectWalletDropdown = ({wallet, activeTab, setActiveTab = null}) => {
  const dropdownItems = [
    {
      title: "My Collection",
      id: "my-collection",
    },
    {
      title: "My NFTs",
      id: "my-nft",
    },
    {
      title: "Favorites",
      id: "favorites",
    },
    {
      title: "Watchlist",
      id: "watchlist",
    },
    {
      title: "History",
      id: "history",
    },
    // {
    //   title: "User Information",
    //   id: "user-information",
    // },
    {
      title: "Logout",
      id: "logout",
    },
  ]

  const dropdownUserItems = [
    {
      title: "Admin Page",
      id: "adminpage",
    },
    {
      title: "Logout",
      id: "logout",
    },
  ]

  const router = useRouter()

  const handleChangeActiveTab = (selectedTab) => {
    if (typeof setActiveTab === "function") {
      setActiveTab(selectedTab)
    } else {
      router.push(`/profile?tab=${selectedTab}`)
    }
  }

  return (
    <Dropdown>
      <Dropdown.Toggle id="dropdown-basic" className="btn-res btn-lg">
        {wallet}
      </Dropdown.Toggle>

      <Dropdown.Menu className="w-100 p-2">
        {/* <Dropdown.Item className="active">
          <Link href="/register">Register</Link>
        </Dropdown.Item> */}
        {dropdownItems.map(({id, title}, index) => (
          <Dropdown.Item
            className={`${activeTab === id ? "active" : ""}`}
            onClick={() => handleChangeActiveTab(id)}
            key={`${title}_${id}_${index}`}
          >
            {title}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default ConnectWalletDropdown
