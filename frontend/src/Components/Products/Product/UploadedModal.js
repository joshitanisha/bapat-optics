import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../../utils/context";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

// *******************toster****************************
import ModalSave from "../../common/ModelSave";
import { CancelButton, SaveButton } from "../../common/Button";
import Select from "react-select";
import {
  Row,
  Col,
  Form,
  InputGroup,
  Modal,
  Table,
  Button,
} from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import classNames from "classnames";
import { RoleId } from "../../../utils/common";
import OffcanvasCon from "../../OffcanvasCon/OffcanvasCon";
library.add(fas);

const UploadedModal = (props) => {
  const id = props.show;
  const { postData, getData, IMG_URL, Select2Data, editStatusData } =
    useContext(Context);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    watch,
    setValue,
  } = useForm();

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [showoff, setShowoff] = useState(false);

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

  return (
    <>
      <Modal
        {...props}
        onHide={props.onHide}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Bulk Upload Report
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4 className="mt-3 mb-2">
            ✅ Added Products ({props?.uploadedData?.data?.added_count || 0})
          </h4>
          <div className="order-table-wrapper">
            <Table striped bordered hover className="order-table" responsive>
              <thead>
                <tr>
                  <th>Product details</th>
                  {/* <th>Store details</th> */}
                  <th>Image</th>
                  {/* <th>Sort Order</th> */}
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {props?.uploadedData?.data?.added?.map((item, index) => (
                  <tr key={index}>
                    {/* Owner Details */}
                    <td className="order-details">
                      <div className="order-info">
                        <span className="text-highlight">{item?.name}</span>
                      </div>

                      {/* <div className="order-info">
                        <div className="order-id">Manufacturer</div>
                        <span>{item?.manufacturer} </span>
                      </div> */}
                    </td>

                    <td>
                      <img
                        src={IMG_URL + item?.image}
                        alt="Product"
                        className="product-image"
                      />
                    </td>

                    {/* <td>{item?.sort_order}</td> */}

                    <td>
                      <div className="order-info">
                        <span>{item?.description} </span>
                        {item?.tax_percentage && (
                          <>
                            <div className="order-id">Tax</div>
                            <span>{item?.tax_percentage} % </span>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <hr />
          <h4 className="mt-3 mb-2">
            ❌ Not Added Products (
            {props?.uploadedData?.data?.not_added_count || 0})
          </h4>
          <div className="order-table-wrapper">
            <Table striped bordered hover className="order-table" responsive>
              <thead>
                <tr>
                  <th>Product details</th>
                  <th>Image</th>
                  <th>Description</th>
                  <th>Reason</th>
                </tr>
              </thead>

              <tbody>
                {props?.uploadedData?.data?.not_added?.map((item, index) => (
                  <tr key={index}>
                    <td className="order-details">
                      <div className="order-info">
                        <span className="text-highlight">{item?.name}</span>
                      </div>
                    </td>

                    <td>
                      <img
                        src={IMG_URL + item?.image}
                        alt="Product"
                        className="product-image"
                      />
                    </td>

                    <td>
                      <div className="order-info">
                        <span>{item?.description}</span>
                        {item?.tax_percentage && (
                          <>
                            <div className="order-id">Tax</div>
                            <span>{item?.tax_percentage} %</span>
                          </>
                        )}
                      </div>
                    </td>

                    <td>{item?.reason}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
      </Modal>

      <ModalSave
        message={showModal.message}
        showErrorModal={showModal.code ? true : false}
      />

      <OffcanvasCon show={showoff} handleClose={() => setShowoff(false)} />
    </>
  );
};

export default UploadedModal;
