import Footer from "./Footer";
import Navbar from "./Navbar";
import MessengerCustomerChat from 'react-messenger-customer-chat';


const Layout = ({ children }) => {
  return (
    <>
    <Navbar />
    {children}
    <MessengerCustomerChat
    pageId="109317624924756"
    appId="3112530142298203"
    />,
    </>
  );
};

export default Layout;
