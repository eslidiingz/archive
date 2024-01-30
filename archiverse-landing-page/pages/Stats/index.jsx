import { useEffect } from "react";
import Link from "next/link";
import Mainlayout from "../../components/layouts/Mainlayout";
import React from "react";
import Select from "../../components/form/select";
import { Table, Tabs, Tab } from "react-bootstrap";

const Stats = () => {
  return (
    <>
      <section className="">
        <div className="container pd-top-bottom-section">
          <div className="row d-flex align-items-center">
            <div className="col-12">
              <h1 className="ci-white">TOP NFTs</h1>
              <h6 className="ci-white">
                Lorem Ipsum is simply dummy text of the printing and typesetting
              </h6>
            </div>
          </div>
        </div>
      </section>
      <section className="">
        <div className="container py-4">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-3 mb-2">
              <Select
                selected="Last 7 days"
                value1="value1"
                value2="value2"
                value3="value3"
              />
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <Select
                selected="All Categories"
                value1="value1"
                value2="value2"
                value3="value3"
              />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-12 exp-table">
              <Table borderless responsive hover>
                <thead>
                  <tr className="bd-bottom">
                    <th className="py-3 ps-3 ">
                      <p className="mb-0">Collection</p>
                    </th>
                    <th className="py-3">
                      <p className="mb-0">Volumn</p>
                    </th>
                    <th className="py-3">
                      <p className="mb-0">24h</p>
                    </th>
                    <th className="py-3">
                      <p className="mb-0">7 days</p>
                    </th>
                    <th className="py-3">
                      <p className="mb-0">Floor price</p>
                    </th>
                    <th className="py-3">
                      <p className="mb-0">Owner</p>
                    </th>
                    <th className="py-3">
                      <p className="mb-0">Items</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="pt-4 pb-3">
                      <div className=" d-flex gap-2 align-items-start ps-2">
                        <div className="st-table-img">
                          <img
                            alt=""
                            src="/assets/rsu-image/user/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.webp"
                          />
                        </div>
                        <p className="mb-0 exp-table-textdot">
                          to ensure consistent ids are generated between the
                        </p>
                      </div>
                    </td>
                    <td className="pt-4 pb-3 ps-2">
                      <p className="mb-0">500</p>
                    </td>
                    <td className="pt-4 pb-3">
                      <div className="d-flex gap-1">
                        <img
                          alt=""
                          width={14}
                          src="/assets/rsu-image/icons/down-red.svg"
                        />
                        <p className="mb-0 text-red">1.25%</p>
                      </div>
                    </td>
                    <td className="pt-4 pb-3 ps-2">
                      <p className="mb-0">-</p>
                    </td>
                    <td className="pt-4 pb-3 ps-2">
                      <p className="mb-0">45</p>
                    </td>
                    <td className="pt-4 pb-3 ps-2">
                      <p className="mb-0">1</p>
                    </td>
                    <td className="pt-4 pb-3 ps-2">
                      <p className="mb-0">3</p>
                    </td>
                  </tr>
                  <tr>
                    <td className="pt-4 pb-3">
                      <div className=" d-flex gap-2 align-items-start ps-2">
                        <div className="st-table-img">
                          <img
                            alt=""
                            src="/assets/rsu-image/user/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.webp"
                          />
                        </div>
                        <p className="mb-0 exp-table-textdot">
                          to ensure consistent ids are generated between the
                        </p>
                      </div>
                    </td>
                    <td className="pt-4 pb-3 ps-2">
                      <p className="mb-0">500</p>
                    </td>
                    <td className="pt-4 pb-3">
                      <div className="d-flex gap-1">
                        <img
                          alt=""
                          width={14}
                          src="/assets/rsu-image/icons/up-green.svg"
                        />
                        <p className="mb-0 text-green">1.25%</p>
                      </div>
                    </td>
                    <td className="pt-4 pb-3 ps-2">
                      <p className="mb-0">-</p>
                    </td>
                    <td className="pt-4 pb-3 ps-2">
                      <p className="mb-0">45</p>
                    </td>
                    <td className="pt-4 pb-3 ps-2">
                      <p className="mb-0">1</p>
                    </td>
                    <td className="pt-4 pb-3 ps-2">
                      <p className="mb-0">3</p>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Stats;
Stats.layout = Mainlayout;
