import React, { useContext } from "react";
import { useState, useEffect } from "react";
import "../../Tabels/Tabels.css";
import { Link } from "react-router-dom";
import { Context } from "../../../utils/context";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faAngleLeft, fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// *******************toster****************************
import ModalSave from "../../common/ModelSave";
import { CancelButton, SaveButton } from "../../common/Button";
import { Row, Col, Form, InputGroup, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import { putData } from "../../../utils/api";
import Table from "react-bootstrap/Table";
import { useNavigate, useParams } from "react-router";
import Header from "../../Header/Header";
import {  useLoader } from "../../../utils/common";
library.add(fas);

const EditOffCanvance = (props) => {
  const navigate = useNavigate();


  // const id = props.show;
   const { id } = useParams();
  const { postData, getData, IMG_URL } = useContext(Context);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });
  const [data, setData] = useState({});

  const { loading, withLoader } = useLoader();
  const GetEditData = async () => {
    const response = await withLoader(() => getData(`/admin/customer/${id}`));
    setData(response?.data);
  };
  useEffect(() => {
    GetEditData();
  }, []);

  const formatTimeInIST = (date) => {
    const createdAt = new Date(date);
    const options = { hour: "2-digit", minute: "2-digit", hour12: true };
    const istTime = createdAt.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      ...options,
    });
    // setFormattedTime(`${istTime} IST`);
    return istTime;
  };

  const calculateTimeAgo = (date) => {
    const createdAt = new Date(date);
    const now = new Date();
    const diffInMilliseconds = now - createdAt;

    const diffInMinutes = Math.floor(diffInMilliseconds / 60000);
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    if (diffInDays >= 1) {
      return `${diffInDays} Day${diffInDays > 1 ? "s" : ""} Ago`;
    } else if (diffInHours >= 1) {
      return `${diffInHours} Hour${diffInHours > 1 ? "s" : ""} Ago`;
    } else {
      return `${diffInMinutes} Min Ago`;
    }
  };

  const calculateTotalAmount = () => {
    return data?.customer_orders
      ?.reduce((total, order) => {
        return total + parseFloat(order?.total_amount || 0);
      }, 0)
      .toFixed(2);
  };

  return (
    <>
      <Header title={"Customer List"} link={"#"} />
      <section className="Create" >
        <div className="back_btn_holder">
          <div onClick={() => navigate(`/customers`)}>
            <FontAwesomeIcon className="back-btn" icon={faAngleLeft} />
            Back
          </div>
        </div>


        <Modal.Body>
          <div className="total-amount">
            Total Spent: <strong>{calculateTotalAmount()}</strong>
          </div>

          <div className="row mt-3">
            <div className="data table-responsive">
              <Table striped bordered hover responsive center>
                <thead>
                  <tr className="">
                    <th className="sr" style={{ width: "10%" }}>
                      Sr. No.
                    </th>

                    <th className="tax-name" style={{ width: "10%" }}>
                      Order Date{" "}
                    </th>

                    <th className="tax-name" style={{ width: "10%" }}>
                      Invoice{" "}
                    </th>

                    <th className="tax-name" style={{ width: "10%" }}>
                      Products{" "}
                    </th>



                    <th className="tax-name" style={{ width: "10%" }}>
                      Amount{" "}
                    </th>

                    <th className="tax-name" style={{ width: "10%" }}>
                      Status 
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.customer_orders?.map((d, index) => {
                    return (
                      <tr className="" key={index}>
                        <td>{++index}.</td>
                        <td>
                          <div>{calculateTimeAgo(d?.createdAt)}</div>
                          <div>{formatTimeInIST(d?.createdAt)}</div>
                        </td>
                        <td>{d?.invoice_no}</td>
                        <td>
                          {d?.Product_Order_Details?.map((item, index) => (
                            <div key={index}>{item?.Product?.name}</div>
                          ))}
                        </td>

                        <td>{parseFloat(d?.total_amount).toFixed(2)}</td>
                        <td>{d?.Order_status?.name}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </div>
        </Modal.Body>
      </section>

      <ModalSave
        message={showModal.message}
        showErrorModal={showModal.code ? true : false}
      />
    </>
  );
};

export default EditOffCanvance;
