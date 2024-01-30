import Link from "next/link";
import { Container, Form, FormControl, Nav, Navbar, NavDropdown, Button, Dropdown, DropdownButton } from "react-bootstrap";
import Search from "../form/search";
import { useState } from "react";

function TopbarItem() {
  const [isActive, setActive] = useState(false);

  const toggleMode = () => {
    setActive(!isActive);
  };
  return (
    <>
      <Navbar className="fixed-top-menuitem  topbar" expand="lg">
        <Container className="justify-content-between py-1" >
          <Link href="/">
            <a className=" navbar-brand">
              <img height={50} alt="" src="/assets/nft-image/icon-passionworld.svg" />
            </a>
          </Link>
          <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll" className="topbar-right">
              <Nav className="nav-menucustom w-full" navbarScroll >
                <Link href="/Explore-collection/">
                  <p className="nav-link text-menu text">
                    Explore
                  </p>
                </Link>
                <Link href="/Stats">
                  <a className="nav-link text">
                    Stats
                  </a>
                </Link>
                <Link href="/Create">
                  <a className="nav-link text-black">
                    Create
                  </a>
                </Link>
                <div className="d-lg-none" >
                  <Button className="btn-hover color-1 w-full" >Connect Wallet</Button>

                  {/* Login */}
                  <Nav.Link className="w-300">
                    Your Wallet
                    <div className="one-line-dot">0x8AfCa4EC80B712a1691d4eE593a8B6eaa93b39570x8AfCa4EC80B712a1691d4eE593a8B6eaa93b3957</div>
                  </Nav.Link>
                  <Nav.Link href="/Profile">Profile</Nav.Link>
                  {/* <Nav.Link href="#">Setting</Nav.Link> */}
                </div>
              </Nav>
            </Navbar.Collapse>
            <div className="d-none d-lg-block" >
              <div className="d-flex align-items-center ">
                <div className="d-flex gap-2 mx-3">
                  <DropdownButton className="navbar-user-btn" variant="outline-secondary" id="input-group-dropdown-1" align="end" >
                    <Dropdown.Item className="w-300" >
                      <p className="mb-0">Your Wallet</p>
                      <div className="one-line-dot">0x8AfCa4EC80B712a1691d4eE593a8B6eaa93b39570x8AfCa4EC80B712a1691d4eE593a8B6eaa93b3957</div>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item href="/Profile">Profile</Dropdown.Item>
                    {/* <Dropdown.Item href="#">Setting</Dropdown.Item> */}
                  </DropdownButton>
                </div>
                <div className="ms-4 ms-xxl-0 w-100">
                  <button className="btn btn-menu-wallet_main w-fit" >Connect Wallet</button>
                </div>
              </div>
            </div>
        </Container>
      </Navbar>
    </>
  )
}
export default TopbarItem