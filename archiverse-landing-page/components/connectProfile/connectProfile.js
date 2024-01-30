import { useRouter } from "next/router";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";

const ConnectProfile = ({ activeTab, setActiveTab = null }) => {
  console.log(activeTab);
  const dropdownItems = [
    {
      title: "profile",
      id: "profile",
      img: "assets/rsu-image/icons/profile.svg",
    },
    {
      title: "vertify",
      id: "vertify",
      img: "assets/rsu-image/icons/verify.svg",
    },
    {
      title: "create",
      id: "create",
      img: "assets/rsu-image/icons/create.svg",
    },
    {
      title: "activity",
      id: "activity",
      img: "assets/rsu-image/icons/create.svg",
    },
    {
      title: "favorites",
      id: "favorites",
      img: "assets/rsu-image/icons/favorites.svg",
    },
    {
      title: "hidden",
      id: "hidden",
      img: "assets/rsu-image/icons/hidden.svg",
    },
    {
      title: "collection",
      id: "collection",
      img: "assets/rsu-image/icons/collection.svg",
    },
    {
      title: "offer",
      id: "offer",
      img: "assets/rsu-image/icons/offer.svg",
    },
    {
      title: "settings",
      id: "settings",
      img: "assets/rsu-image/icons/setting.svg",
    },
    {
      title: "placement",
      id: "placement",
      img: "assets/rsu-image/icons/placement-list.svg",
    },
    {
      title: "biding",
      id: "biding",
      img: "assets/rsu-image/icons//bidding.svg",
    },
  ];

  const router = useRouter();

  const handleChangeActiveTab = (selectedTab) => {
    if (typeof setActiveTab === "function") {
      setActiveTab(selectedTab);
    } else {
      router.push(`/Profile?tab=${selectedTab}`);
    }
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        variant="primary"
        onClick={handleShow}
        className="me-2 absolute-right-icon d-block d-lg-none"
      >
        <i className="fas fa-user"></i>
      </Button>
      <Offcanvas placement="end" show={show} onHide={handleClose}>
        <Offcanvas.Header className="set-btn-ConnectProfile" closeButton>
          <Offcanvas.Title>
            <h3 className="ci-green pt-3">My Profile</h3>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className="li-Offcanvas">
            {dropdownItems.map(({ id, title, img }, index) => (
              <li
                className={`${activeTab === id ? "active" : ""}`}
                onClick={() => handleChangeActiveTab(id)}
                key={`${img}_${title}_${id}_${index}`}
              >
                <img
                  src={img || "/assets/image/archiverse/default_img.png"}
                  className="mx-3"
                />
                {title}
              </li>
            ))}
          </ul>
        </Offcanvas.Body>
      </Offcanvas>

      {/* <Dropdown>
            <Dropdown.Toggle id="dropdown-basic" className="btn-res btn-lg">
                Connect Wallet
            </Dropdown.Toggle>

      <Dropdown.Menu className="w-100 p-2">
        {dropdownItems.map(({ id, title }, index) => (
          <Dropdown.Item
          className={`${activeTab === id ? 'active' : ''}`}
            onClick={() => handleChangeActiveTab(id)}
            key={`${title}_${id}_${index}`}
          >
            {title}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown> */}
    </>
  );
};

export default ConnectProfile;
