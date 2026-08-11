import React from "react";
import { useState } from "react";
import "../Tabels/Tabels.css";
import { Link } from "react-router-dom";
import arrow from "../images/arrow.png";
import plus from "../images/PLUS.png";
import colunms from "../images/LINES.png";
import pen from "../images/pen.png";
import basket from "../images/basket.png";
import search from "../images/search.png";
import top from "../images/top.png";
import blackeye from "../images/blackeye.png";

import AddTax from "../../Add/AddTax";

const Tabels = () => {
  const [isActive, setIsActive] = useState(false);
  const handleClick = () => {
    setIsActive(!isActive);
  };

  return (
    <>
      <div className=" col-xl-9 col-lg-8  col-md-12">
        <section className="Tabels tab-radio mt-4">
          <div className="container">
            <div className="row   mt-3">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    Tax Master <img src={arrow} className="image" alt="" />
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Country
                  </li>
                </ol>
              </nav>
            </div>
            <div className="row">
              <div className="d-flex">
                <div className="add me-3">
                  <Link to="/add-tax">
                    <button type="button" className="btn btn-add pe-3">
                      {" "}
                      <img src={plus} className="plus me-2 ms-0" alt="" /> Add
                      Tax{" "}
                    </button>
                  </Link>
                </div>
                {/* </div>

              <div className="  col-xl-4  col-lg-6 col-md-6  col-sm-6 col-12"> */}
                <div className="add">
                  <div className="dropdown">
                    <button
                      className="btn btn-columns dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {" "}
                      <img src={colunms} className="columns " alt="" /> Column
                      Selection <img src={top} className="top ms-1" alt="" />{" "}
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <Link className="dropdown-item" href="#">
                          Sr. No.
                          <img src={blackeye} className="eye1 " alt="" />
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" href="#">
                          Tax Name
                          <img src={blackeye} className="eye1 " alt="" />
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" href="#">
                          Tax Rate
                          <img src={blackeye} className="eye1 " alt="" />
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" href="#">
                          Sub Tax Rate
                          <img src={blackeye} className="eye1 " alt="" />
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" href="#">
                          Include in Rate
                          <img src={blackeye} className="eye1 " alt="" />
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" href="#">
                          Status
                          <img src={blackeye} className="eye1 " alt="" />
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" href="#">
                          Active
                          <img src={blackeye} className="eye1 " alt="" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-line mt-3"></div>
            <div className="row mt-3">
              <div className="data table-responsive">
                <table className="table table-bordered  tableborder">
                  <thead>
                    <tr className="">
                      <th className="check round-check">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckChecked"
                            defaultChecked
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexCheckChecked"
                          ></label>
                          {/* <img src={check} className="check round-check" alt="" /> */}
                        </div>
                      </th>
                      <th className="sr">Sr. No.</th>
                      <th className="tax-name">Tax Name</th>
                      <th className="tax">Tax Rate</th>
                      <th className="rate">Include in Rate</th>
                      <th className="status">Status</th>
                      <th className="active">Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="">
                      <td>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexCheckDefault"
                          ></label>
                        </div>
                      </td>
                      <td>1.</td>
                      <td>Tax Name</td>
                      <td className="tax-rate">10.00</td>
                      <td className="rate">Yes</td>
                      <td>
                        <div className="d-flex">
                          <div className="circle mt-2 me-2"></div>
                          <div className="active">Active</div>
                        </div>
                      </td>
                      {/* <td>
                        <button type="button" className="btn btn-primary me-1">
                            <img src={pen} className="pen" alt="" />
                          </button>

                          <button type="button" className="btn btn-danger">
                            <img src={basket} className="pen" alt="" />
                          </button>
                      </td> */}

                      <td>
                        <button type="button" className="btn btn-primary me-1">
                          <img src={pen} className="pen" alt="" />
                        </button>

                        <button type="button" className="btn btn-danger">
                          <img src={basket} className="pen" alt="" />
                        </button>
                      </td>
                    </tr>

                    <tr className=" ">
                      <td>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexCheckDefault"
                          ></label>
                        </div>
                      </td>
                      <td>2.</td>
                      <td>Tax Name</td>
                      <td className="tax-rate">10.00</td>
                      <td className="rate">No</td>
                      <td className="status">
                        <div className="d-flex">
                          <div className="circle mt-2 me-2"></div>
                          <div className="active">Active</div>
                        </div>
                      </td>
                      <td>
                        <button type="button" className="btn btn-primary me-1">
                          <img src={pen} className="pen" alt="" />
                        </button>

                        <button type="button" className="btn btn-danger">
                          <img src={basket} className="pen" alt="" />
                        </button>
                      </td>
                    </tr>
                    <tr className="">
                      <td>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexCheckDefault"
                          ></label>
                        </div>
                      </td>
                      <td>3.</td>
                      <td>Tax Name</td>
                      <td className="tax-rate">10.00</td>
                      <td className="rate">Yes</td>
                      <td className="status">
                        <div className="d-flex">
                          <div className="circle1 mt-2 me-2"></div>
                          <div className="active">Active</div>
                        </div>
                      </td>
                      <td>
                        <button type="button" className="btn btn-primary me-1">
                          <img src={pen} className="pen" alt="" />
                        </button>

                        <button type="button" className="btn btn-danger">
                          <img src={basket} className="pen" alt="" />
                        </button>
                      </td>
                    </tr>
                    <tr className="">
                      <td>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexCheckDefault"
                          ></label>
                        </div>
                      </td>
                      <td>4.</td>
                      <td>Tax Name</td>
                      <td className="tax-rate">10.00</td>
                      <td className="rate">Yes</td>
                      <td className="status">
                        <div className="d-flex">
                          <div className="circle mt-2 me-2"></div>
                          <div className="active">Active</div>
                        </div>
                      </td>
                      <td>
                        <button type="button" className="btn btn-primary me-1">
                          <img src={pen} className="pen" alt="" />
                        </button>

                        <button type="button" className="btn btn-danger">
                          <img src={basket} className="pen" alt="" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="row mt-3">
              <div className=" col-12">
                <div className="d-flex">
                  <div className="show me-2">
                    <p className="show m-0">Show</p>
                  </div>
                  <div className="number me-2">
                    <select
                      className="form-select form-select-sm"
                      aria-label=".form-select-sm example"
                    >
                      <option selected>10</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>
                  <div className="entries">
                    <p className="show m-0">entries</p>
                  </div>
                  <div className="sowing ms-3 me-2">
                    <p className="show m-0">Showing 1 to 4 of 10 entries</p>
                  </div>
                </div>
              </div>
              <div className=" col-12">
                <div className="row align-items-start">
                  <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6  col-sm-6 col-12 mb-2">
                    <div className="num">
                      <label className="form-label"></label>
                      <input type="number" className="form-control" id="" />
                    </div>
                  </div>
                  <div className="col-xxl-1 col-xl-2  col-lg-2  col-md-2  col-sm-6 col-12 mb-2">
                    <div className="Search">
                      <label className="form-label"></label>
                      <button type="button" className="btn btn-search">
                        <img src={search} className="search" alt="" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Tabels;
