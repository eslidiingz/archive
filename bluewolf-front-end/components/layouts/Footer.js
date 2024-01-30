import Link from "next/link"

function Footer() {

    return (
      <>
        <div className="container-fluid">
          <div className="row">
              <div className="col-12 bg-footer  d-flex align-items-center">
                <div className="container my-4 d-flex flex-column flex-lg-row justify-content-between ">
                  <div className="color-grey order-b "> © 2022 bluewolfnft.com</div>
                  <div className="d-flex flex-column flex-sm-row justify-content-between justify-content-lg-end my-3 my-lg-0">
                    <Link href="#"><p className="mb-0 mx-lg-4 color-grey">About Us</p></Link>
                    <Link href="#"><p className="mb-0 mx-lg-4 color-grey">Privacy Policy</p></Link>
                    <Link href="#"><p className="mb-0 mx-lg-4 color-grey">Terms of Service</p></Link>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </>
    )
  }
  export default Footer
  