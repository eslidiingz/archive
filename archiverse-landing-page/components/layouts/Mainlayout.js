import Link from "next/link";
import Footer from "./Footer";
import Search from "../form/search";
import { useState } from "react";
import {
  Navbar,
  Container,
  Form,
  FormControl,
  Nav,
  NavDropdown,
} from "react-bootstrap";

import Topbar from "./Topbar";

function Mainlayout({ children }) {
  const [toggleViewMode, setToggleViewMode] = useState(false);
  return (
    <>
      <div className="main-layout position-relative ">
        <Topbar />
        {children}
        <Footer />
      </div>
    </>
  );
}

export default Mainlayout;
