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
import { Row, Col, Form, InputGroup, Modal, Table, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import classNames from "classnames";
import { RoleId } from "../../../utils/common";
import OffcanvasCon from "../../OffcanvasCon/OffcanvasCon";
library.add(fas);

const BulkUploadModel = (props) => {
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
    setValue,
  } = useForm();

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [showoff, setShowoff] = useState(false);


  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("p_category_id", data?.p_category_id?.value);
      formData.append("p_sub_category_id", data?.p_sub_category_id?.value);
      formData.append("file", data?.file[0]);

      const response = await postData("/admin/products/bulk", formData);

      if (response?.success) {
        reset();
        setShowModal({ code: response.code, message: response.message });
      } else {
        setShowModal({ code: response.code, message: response.message });
      }
      setTimeout(() => {
        setShowModal(0);
        setShowoff(response?.data);
        props.getDataAll()
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllCategories = async () => {
    const response = await getData("/common/masters/all-vendor-p-categories");
    if (response?.success) {
      setCategories(await Select2Data(response?.data, "p_category_id"));
    }
  };

  const getSubCategorries = async (id) => {
    const response = await getData(
      `/common/masters/all-vendor-p-sub-categories/${id}`
    );
    if (response?.success) {
      setSubCategories(await Select2Data(response?.data, "p_sub_category_id"));
    }
  };

  useEffect(() => {
    getAllCategories();
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
            Bulk Upload Products
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
            <Row className="justify-content-center">
              <Col md={6}>

                <Form.Label>Category</Form.Label>
                <Controller
                  className="select-contoller"
                  name={`p_category_id`} // name of the field
                  control={control}
                  rules={{
                    required: "Select Category",
                  }}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <Select
                      styles={{
                        control: (baseStyles) => ({
                          ...baseStyles,
                          borderColor: errors?.p_category_id
                            ? "red"
                            : baseStyles.borderColor,
                        }),
                      }}
                      // {...field}
                      options={categories}
                      onChange={(selectedValue) => {
                        onChange(selectedValue);
                        getSubCategorries(selectedValue?.value);
                        setValue("p_sub_category_id", "");
                      }}
                      onBlur={onBlur}
                      value={value}
                      ref={ref}
                    />
                  )}
                />
                {errors.p_category_id && (
                  <span className="text-danger">
                    {errors.p_category_id.message}
                  </span>
                )}
              </Col>
              <Col md={6}>
                <Form.Label>Sub Category</Form.Label>
                <Controller
                  className="select-contoller"
                  name={`p_sub_category_id`} // name of the field
                  control={control}
                  rules={{
                    required: "Select Sub Category",
                  }}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <Select
                      styles={{
                        control: (baseStyles) => ({
                          ...baseStyles,
                          borderColor: errors?.p_sub_category_id
                            ? "red"
                            : baseStyles.borderColor,
                        }),
                      }}
                      // {...field}
                      options={subCategories}
                      onChange={(selectedValue) => {
                        onChange(selectedValue);
                      }}
                      onBlur={onBlur}
                      value={value}
                      ref={ref}
                    />
                  )}
                />
                {errors.p_sub_category_id && (
                  <span className="text-danger">
                    {errors.p_sub_category_id.message}
                  </span>
                )}

              </Col>

              {/* <Button
                className="quick-filters__tab quick-filters__tab--active ms-3"
                onClick={() => document.getElementById("ProductFile").click()}
              >
                Bulk Upload
              </Button> */}

              <Col md={6}>
                <Form.Label>File</Form.Label>
                <Form.Control
                  type="file"
                  name="file"
                  placeholder="File"
                  className={classNames("", {
                    "is-invalid": errors?.file,
                  })}
                  {...register("file", {
                    required: "file is required",
                  })}
                  accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                />
              </Col>

              {/* <input
                type="file"
                id="ProductFile"
                onChange={(e) => {
                  setFile(e);
                }}
                accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                style={{ display: "none" }}
              /> */}



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

      </Modal >

      <ModalSave
        message={showModal.message}
        showErrorModal={showModal.code ? true : false}
      />

      <OffcanvasCon show={showoff} handleClose={() => setShowoff(false)} />
    </>
  );
};

export default BulkUploadModel;
