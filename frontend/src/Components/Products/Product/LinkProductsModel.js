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
import { Row, Col, Form, InputGroup, Modal, Table } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import classNames from "classnames";
import { RoleId } from "../../../utils/common";
library.add(fas);

const LinkProductsModel = (props) => {
  const id = props.show;
  const { postData, getData, IMG_URL, Select2Data, editStatusData } = useContext(Context);
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
  } = useForm();

  const [products, setProducts] = useState([])
  const [changeStatus, setChangeStatus] = useState();

  const onSubmit = async (data) => {
    try {
      const DataToSend = new FormData();
      if (Array.isArray(data?.linked_product_id)) {

        data.linked_product_id.forEach((item) => {
          DataToSend.append(`linked_product_id`, item?.value);
        });
      }
      const response = await postData(`/admin/products/link-product/${id}`, DataToSend);

      if (response?.success) {
        await setShowModal({ code: response.code, message: response.message });
      } else {
        await setShowModal({ code: response?.code, message: response?.errors });
      }
      setTimeout(() => {
        setShowModal(0);
        props.handleClose();
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const GetEditData = async () => {
    if (id && id > 0) {
      const response = await getData(`/admin/products/${id}`);
      if (response?.success) {
        reset(response?.data);
      }
    }
  };

  const GetAllProducts = async () => {
    const response = await getData(`/common/masters/vendor-product-except/${id}`);
    if (response?.success) {
      setProducts(await Select2Data(response?.data, "linked_product_id"));
    }
  };

  useEffect(() => {
    if (props?.user && props?.user?.role_id === RoleId.Vendor) {
      GetAllProducts();
    }
    GetEditData();
  }, [props.show]);


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
            Delivery Boys
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <div className="package-details-section">
            <Table striped bordered hover responsive center>
              <thead>
                <tr className="">
                  <th className="sr">Sr. No.</th>
                  <th className="tax-name">Delivery Boys </th>
                </tr>
              </thead>
              <tbody>

              </tbody>
            </Table>


          </div> */}


          <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
            <Row className="justify-content-center">
              <Col md={12}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-center">
                    <Form.Group>
                      <Form.Label>Link Other Products</Form.Label>

                      <Controller
                        className="select-contoller"
                        name={`linked_product_id`} // name of the field
                        control={control}
                        rules={{
                          // required: "Select Products",
                        }}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                          <Select
                            isMulti
                            styles={{
                              control: (baseStyles) => ({
                                ...baseStyles,
                                borderColor: errors?.linked_product_id
                                  ? "red"
                                  : baseStyles.borderColor,
                              }),
                            }}
                            // {...field}
                            options={products}
                            onChange={(selectedValue) => {
                              onChange(selectedValue);
                            }}
                            onBlur={onBlur}
                            value={value}
                            ref={ref}
                          />
                        )}
                      />
                      {errors.linked_product_id && (
                        <span className="text-danger">
                          {errors.linked_product_id.message}
                        </span>
                      )}
                    </Form.Group>
                  </Row>
                </div>

              </Col>



              <Row className="mt-5 pb-3">
                <div className="d-flex justify-content-center">
                  <Link>
                    <CancelButton
                      name={"Cancel"}
                      handleClose={props.handleClose}
                    />
                  </Link>

                  <SaveButton
                    name={"Save"}
                    handleSubmit={handleSubmit(onSubmit)}
                  />
                </div>
              </Row>
            </Row>
          </Form>

        </Modal.Body>

      </Modal>

      <ModalSave
        message={showModal.message}
        showErrorModal={showModal.code ? true : false}
      />
    </>
  );
};

export default LinkProductsModel;
