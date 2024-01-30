import Mainlayout from "../../components/layouts/Mainlayout";
import Dropdown from 'react-bootstrap/Dropdown'


const CollectionDetail = () => {
    return (
        <>
            {/* Content All*/}
            <section className="events">
                <div className="container">
                    <div className="row mt-3-bos">
                        {/* Content left*/}
                        <div className="col-lg-5" ALIGN="MIDDLE">
                            <img src="/assets/image/a729a9625439f5eb206548e3853aace1.png" className="img-radius" width="100%" />
                        </div>
                        {/* End-Content left*/}
                        {/* Content right*/}
                        <div className="col-lg-6" ALIGN="left">
                            {/* heart + share */}
                            <div className="heartbox dropdown d-flex justify-content-end align-items-center" ALIGN="right">
                                <i className="fas fa-heart icon-bar icon-heart me-2"></i>
                                {/* share */}
                                
                                <Dropdown>
                                    <Dropdown.Toggle  id="dropdown-share" className="btn-res btn-lg dropdown-share">
                                    <i className="fas fa-share-alt iconsh" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"></i>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className=" p-2">
                                        <Dropdown.Item ><i className="fab fa-twitter"></i> Twitter</Dropdown.Item>
                                        <Dropdown.Item ><i className="fas fa-link"></i>Copy Link</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            <div className="ml-5" ALIGN="right">
                                <p className="ui basic label " disabled>11</p>
                            </div>
                            
                            
                            {/* End-heart + share */}
                            {/* Detail */}
                            <div className="text-detail">
                                <p className="text02">Emily Red #1</p>
                                <p className="textcd">Try.Out.Illustration</p>
                                <p className="text08">
                                    As everything becomes more digital, there &quot; s a need to
                                    replicate the properties of physical items like scarcity,
                                    uniqueness, and proof of ownership. Not to mention that
                                    digital items often only work in the context of their product
                                </p>
                            </div>
                            {/* End-Detail */}
                            {/* Profile */}
                            <div className="text-detail textprofile">
                                <img src="/assets/image/asset-3.png" className="img-radius img-ma" width="45px" />
                                <p valign="middle" className="text03">Creator</p>
                                <p valign="middle" className="text04">Cristhian Ramírez</p>
                            </div>
                            {/* End-Profile */}
                            {/* Buy-Sell-Price */}
                            <div className="text-detail textprofile">
                                <p valign="middle" className="text04">Price</p>
                                <div className="box">
                                    <img src="/assets/image/IMG_5592.png"width="36px" className="img-radius"/>
                                    <p valign="middle" className="text05 center-text">1,900 BWC </p>
                                    <p valign="middle" className="text06 center-text">(329.90 USD)</p>
                                </div>
                                <button type="button" className="btn bg-primary bg-gradient btn-lg text-white btn-mar">Buy Now</button>
                            </div>
                            <div className="text-detail textprofile">
                                <img src="/assets/image/9ff91a6b06a35604af1de2b16bf56c8f.png" className="img-radius img-ma" width="40px" />
                                <p valign="middle" className="text03">Owner</p>
                                <p valign="middle" className="text04">Peter Chan</p>
                            </div>
                            {/* Buy-Sell-Price */}
                        </div>
                        {/* End-Content right*/}
                    </div>
                    {/* Content Tag*/}
                    <p valign="middle" className="text07 center-text">Tags</p>
                    <div className="layouttag">
                        <p className="texttag">Digital</p>
                        <p className="texttag">Physical</p>
                        <p className="texttag">Ramírez</p>
                        <p className="texttag">Illustration</p>
                        <p className="texttag">Supermodel</p>
                    </div>
                    {/* End-Content Tag*/}
                    {/* Content History*/}
                    <p valign="middle" className="text07 center-text">History</p>

                    <div className="card-body layouthis">
                            <div className="table-responsive">
                            <table className="table" id="dataTable" cellSpacing="0">
                            <tbody>
                                <tr>
                                <th width="27%">
                                    <div className="text-detail">
                                        <img src="/assets/image/9ff91a6b06a35604af1de2b16bf56c8f.png" className="img-radius img-ma" width="40px" />
                                        <p valign="middle" className="text03">Listed by</p>
                                        <p valign="middle" className="text04">Peter Chan</p>
                                    </div>
                                </th>
                                <td valign="middle" width="20%"><p valign="middle" className="text04 center-text">March 24, 2022 at 5:19am</p></td>
                                <td valign="middle">
                                    <div className="box">
                                        {/* <img src="assets/image/IMG_5592.png"width="36px" className="img-radius"/> */}
                                        <p valign="middle" className="text04 center-text">1,900 BWC </p>
                                        <p valign="middle" className="text06 center-text">(329.90 USD)</p>
                                    </div>
                                </td>
                                <td valign="middle"><a href="#"><i className="fas fa-external-link-alt co-gray"></i></a></td>
                                </tr>
                                <tr>
                                <th width="27%">
                                    <div className="text-detail">
                                        <img src="/assets/image/9ff91a6b06a35604af1de2b16bf56c8f.png" className="img-radius img-ma" width="40px" />
                                        <p valign="middle" className="text03">Buy by</p>
                                        <p valign="middle" className="text04">Peter Chan</p>
                                    </div>
                                </th>
                                <td valign="middle" width="20%"><p valign="middle" className="text04 center-text">March 22, 2022 at 4:09am</p></td>
                                <td valign="middle">
                                    <div className="box">
                                        <p valign="middle" className="text04 center-text">999 BWC </p>
                                        <p valign="middle" className="text06 center-text">(99.90 USD)</p>
                                    </div>
                                </td>
                                <td valign="middle"><a href="#"><i className="fas fa-external-link-alt co-gray"></i></a></td>
                                </tr>
                                <tr>
                                <th width="27%">
                                    <div className="text-detail">
                                        <img src="/assets/image/asset-3.png" className="img-radius img-ma" width="40px" />
                                        <p valign="middle" className="text03">Minted by</p>
                                        <p valign="middle" className="text04">Cristhian Ramírez</p>
                                    </div>
                                </th>
                                <td valign="middle" width="20%"><p valign="middle" className="text04 center-text">March 20, 2022 at 2:16am</p></td>
                                <td valign="middle">
                                    {/* <div className="box">
                                        <p valign="middle" className="text04 center-text">1,900 BWC </p>
                                        <p valign="middle" className="text06 center-text">(329.90 USD)</p>
                                    </div> */}
                                </td>
                                <td valign="middle"><a href="#"><i className="fas fa-external-link-alt co-gray"></i></a></td>
                                </tr>

                            </tbody>
                            </table>
                        </div>
                    </div>
                    {/* End-Content History*/}
                </div>
            </section>
            {/* End-Content All*/}
        </>
    );
};

export default CollectionDetail;
CollectionDetail.layout = Mainlayout;
