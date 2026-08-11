import React, { useContext, useEffect } from "react";
import { useState } from "react";
import "../../Tabels/Tabels.css";
import { Link } from "react-router-dom";
import { Context } from "../../../utils/context";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
// *******************toster****************************
import ModalSave from "../../common/ModelSave";

import { Modal, Row, Table } from "react-bootstrap";
import { CancelButton } from "../../common/Button";
library.add(fas);

const ProductReturnModal = (props) => {
  console.log("props?.data", props?.data);

  const data = props?.data;

  return (
    <>
      <Modal
        {...props}
        onHide={props.handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Product Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover responsive center className="tab-radio ">
            <thead>
              <tr className="">
                <th className="sr">Sr. No.</th>
                <th className="tax-name">Products </th>
                <th className="tax-name">Category </th>
                <th className="tax-name">Sub Category </th>
                <th className="tax-name">Child category</th>
                <th className="tax-name">Quantity </th>
                <th className="tax-name">Sub Total </th>

                <th className="tax-name">Shipping Charges </th>

                <th className="tax-name">Offer Discount </th>
                <th className="tax-name">Coupon Discount </th>
                <th className="tax-name">Total Tax </th>
                <th className="tax-name">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data?.length > 0 &&
                data?.map((item, index) => (
                  <tr className="" key={index}>
                    <td>{++index}</td>
                    <td>{item?.Product_Order_Detail?.Product?.name}</td>
                    <td>
                      {item?.Product_Order_Detail?.Product?.p_category?.name}
                    </td>
                    <td>
                      {
                        item?.Product_Order_Detail?.Product?.p_sub_category
                          ?.name
                      }
                    </td>
                    <td>
                      {
                        item?.Product_Order_Detail?.Product?.p_child_category
                          ?.name
                      }
                    </td>
                    <td>{item?.Product_Order_Detail?.quantity}</td>
                    <td>{item?.Product_Order_Detail?.total_selling_price}</td>

                    <td>{item?.Product_Order_Detail?.delivery_charges}</td>

                    <td>{item?.Product_Order_Detail?.offer_discount}</td>

                    <td>{item?.Product_Order_Detail?.coupon_discount}</td>
                    <td>{item?.Product_Order_Detail?.total_tax}</td>
                    <td>{item?.Product_Order_Detail?.total_amount}</td>

                    {/* <td>
                      {item?.Order_Add_Ons &&
                        item?.Order_Add_Ons?.map((d, i) => (
                          <div key={i}>
                            {++i}. {d?.Food_Add_On?.name}
                          </div>
                        ))}
                    </td> */}
                  </tr>
                ))}
            </tbody>
          </Table>
          <Row className="mt-5 pb-3">
            <div className="d-flex justify-content-center">
              <Link>
                <CancelButton name={"Close"} handleClose={props.handleClose} />
              </Link>
            </div>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProductReturnModal;
