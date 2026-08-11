import React, { useContext } from "react";
import { useState, useEffect } from "react";
import "../../Tabels/Tabels.css";
import { Link } from "react-router-dom";
import { Context } from "../../../utils/context";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
// *******************toster****************************
import ModalSave from "../../common/ModelSave";
import { CancelButton, SaveButton } from "../../common/Button";
import { Row, Col, Form, InputGroup, Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import classNames from "classnames";
import Select from "react-select";
import { putData } from "../../../utils/api";
import { CouponType, Select2Data } from "../../../utils/common";
import {  useLoader } from "../../../utils/common";
library.add(fas);

const EditOffCanvance = (props) => {
  const id = props.show;
  const { postData, getData, IMG_URL } = useContext(Context);
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
    setValue,
    watch,
    clearErrors,
  } = useForm();
   

  // const GetEditData = async () => {
  //   const response = await getData(`/admin/products/offered-product/${id}`);
  //   const formattedStartDate = response?.data?.s_date
  //     ? response?.data?.s_date.split(" ")[0]
  //     : "";
  //   const formattedEndDate = response?.data?.e_date
  //     ? response?.data?.e_date.split(" ")[0]
  //     : "";
  //   reset({
  //     ...response?.data,
  //     s_date: formattedStartDate,
  //     e_date: formattedEndDate,
  //   });

  //   if (response?.data?.coupon_type_id?.value === CouponType.Percentage) {
  //     setValue("discount_per", response?.data?.discount);
  //   }
  // };

  const { loading, withLoader } = useLoader();
  const GetEditData = async () => {
  try {


    const response = await withLoader(() => getData(`/admin/products/offered-product/${id}`));

    const formattedStartDate = response?.data?.s_date
      ? response?.data?.s_date.split(" ")[0]
      : "";
    const formattedEndDate = response?.data?.e_date
      ? response?.data?.e_date.split(" ")[0]
      : "";

    reset({
      ...response?.data,
      s_date: formattedStartDate,
      e_date: formattedEndDate,
    });

    if (response?.data?.coupon_type_id?.value === CouponType.Percentage) {
      setValue("discount_per", response?.data?.discount);
    }
  } catch (error) {
    console.error("Error fetching offered product data:", error);
  } 
};

  
  useEffect(() => {
    GetEditData();
  }, []);

  const imageFile = watch("image");
  const [products, setProducts] = useState([]);

  const onSubmit = async (data) => {
    try {
      const finalData = new FormData();
      finalData.append("product_id", data?.product_id?.value);
      finalData.append("offer_id", data?.offer_id?.value);
      // finalData.append("discount_type_id", data?.discount_type_id?.value);
      // finalData.append("message", data?.message);
      //  finalData.append("discount", data?.discount);
      // finalData.append(
      //   "discount",
      //   data?.discount_type_id?.value === CouponType.Percentage
      //     ? data?.discount_per
      //     : data?.discount
      // );
      // finalData.append("image", data.image[0]);
      const response = await withLoader(() => putData(
        `/admin/products/offered-product/${id}`,
        finalData
      ));

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

  const [imagePreview, setImagePreview] = useState(null); // State to store image preview

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set image preview
      };
      reader.readAsDataURL(file);
    }
  };

  const dropdownList = [
    {
      value: CouponType.Percentage,
      name: "discount_type_id",
      label: "Percentage",
    },
    {
      value: CouponType.FixedAmount,
      name: "discount_type_id",
      label: "Fixed Amount",
    },
  ];

  const getAllProducts = async () => {
    const response = await getData(`/common/masters/product`);
    if (response?.success) {
      setProducts(await Select2Data(response?.data, "product_id"));
    }
  };
  const [Offer, setOffer] = useState([]);
  const getAllOffer = async () => {
    const response = await getData(`/common/masters/all-offer`);
    if (response?.success) {
      setOffer(await Select2Data(response?.data, "offer_id"));
    }
  };

  const [today, setToday] = useState("");

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD format
    setToday(formattedDate);
    getAllProducts();
    getAllOffer();
  }, []);

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
            Edit Offered Products
          </Modal.Title>
        </Modal.Header>
         
        <Modal.Body>
          <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
            <Row className="">
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Product</Form.Label>
                    </div>
                    <InputGroup>
                      <Controller
                        name="product_id" // name of the field
                        {...register("product_id", {
                          required: "Select Product",
                        })}
                        control={control}
                        render={({ field }) => (
                          <Select
                            defaultValue={dropdownList[0]}
                            styles={{
                              control: (baseStyles) => ({
                                ...baseStyles,
                                borderColor: errors.product_id
                                  ? "red"
                                  : baseStyles,
                              }),
                            }}
                            {...field}
                            options={products}
                          />
                        )}
                      />
                    </InputGroup>
                    {errors.product_id && (
                      <span className="text-danger">
                        {errors.product_id.message}
                      </span>
                    )}
                  </Form.Group>
                </div>
              </Col>
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <Form.Label>Offer</Form.Label>
                    <InputGroup>
                      <Controller
                        name="offer_id"
                        control={control}
                        rules={{ required: "Offer is required" }}
                        render={({ field }) => (
                          <Select
                            styles={{
                              control: (baseStyles) => ({
                                ...baseStyles,
                                borderColor: errors.offer_id
                                  ? "red"
                                  : baseStyles.borderColor,
                              }),
                            }}
                            {...field}
                            options={Offer}
                            onChange={(selectedOption) => {
                              field.onChange(selectedOption);
                              clearErrors("offer_id");
                            }}
                          />
                        )}
                      />
                    </InputGroup>
                    {errors.offer_id && (
                      <span className="text-danger">
                        {errors.offer_id.message}
                      </span>
                    )}
                  </Form.Group>
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

export default EditOffCanvance;
