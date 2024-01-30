import Table from "react-bootstrap/Table";

function TableCollection() {
  return (
    <Table borderless hover responsive>
      <thead>
        <tr className="table-hr-bottom">
          <th>Event type</th>
          <th>Item</th>
          <th>
            <h5 className="fw-semibold text-center mb-0">Price</h5>
          </th>
          <th>
            <h5 className="fw-semibold text-center mb-0">Quantity</h5>
          </th>
          <th>From</th>
          <th>To</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <p className="fw-semibold">Transfer</p>
          </td>
          <td>
            <div className="d-flex align-items-center">
              <div className="table-img-layout me-2">
                <img
                  alt=""
                  src="/assets/rsu-image/user/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.png"
                  className="table-img-size"
                />
              </div>
              <p className="fw-semibold table-txt-detail">
                to ensure consistent ids
              </p>
            </div>
          </td>
          <td>
            <div className="d-flex align-items-start justify-content-center gap-2 ">
              <img width={10} alt="" src="/assets/rsu-image/icons/coin.svg" />
              <div>
                <h5 className="fw-semibold mb-0">500</h5>
                <div className="table-txt-coin">(1,234.65)</div>
              </div>
            </div>
          </td>
          <td align="center">
            <h5 className="fw-semibold">1</h5>
          </td>
          <td>
            <div className=" d-flex gap-2 align-items-start ">
              <p className="mb-0 table-txt-detail ci-purplepink">
                to ensure consistent ids are generated between the
              </p>
              <img
                width={15}
                alt=""
                src="/assets/image/archiverse/icon/verified-user.svg"
              />
              <p className="ci-purplepink mb-0 table-txt-size-10">Verified</p>
            </div>
          </td>
          <td>
            {" "}
            <p className="fw-semibold ci-purplepink">7868SD78</p>
          </td>
          <td>
            <div className=" d-flex gap-2 align-items-start c-pointer ">
              <p className="mb-0 ci-purplepink">6 Hours ago</p>
              <img width={15} alt="" src="/assets/image/archiverse/icon/report.svg" />
            </div>
          </td>
        </tr>
      </tbody>
    </Table>
  );
}

export default TableCollection;
