import React, { useContext } from "react";
import { useState, useEffect } from "react";
import "../../Tabels/Tabels.css";
import { Link } from "react-router-dom";
import { Context } from "../../../utils/context";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
// *******************toster****************************
import Select from "react-select";
import ModalSave from "../../common/ModelSave";
import Validation from "../../common/FormValidation";
import { CancelButton, SaveButton } from "../../common/Button";

import { Row, Col, Form, InputGroup, Modal } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import classNames from "classnames";
import { putData } from "../../../utils/api";
import {  useLoader } from "../../../utils/common";
library.add(fas);

const EditOffCanvance = (props) => {
  const id = props.show;
  const { postData, getData, Select2Data } = useContext(Context);
  const [countries, setCountries] = useState([]);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });
const { loading, withLoader } = useLoader();
  const GetEditData = async () => {
    const response = await withLoader(() => getData(`/admin/masters/state/${id}`));
    reset(response?.data);
  };

  const GetAllCountry = async () => {
    const response = await getData("/common/masters/all-country");
    if (response?.success) {
      setCountries(await Select2Data(response?.data, "country_id"));
    }
  };

  useEffect(() => {
    GetAllCountry();
    GetEditData();
  }, []);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const DataToSend = new FormData();
      DataToSend.append("country_id", data?.country_id?.value);
      DataToSend.append("name", data?.name);
      const response = await withLoader(() => putData(`/admin/masters/state/${id}`, DataToSend));

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
            Edit State
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
            <Row>
              <Col md={6}>
                <div className="main-form-section mt-3">
                    <Form.Label>Country</Form.Label>
                    <Controller
                      name="country_id" // name of the field
                      {...register("country_id", {
                        required: "Select Country",
                      })}
                      control={control}
                      render={({ field }) => (
                        <Select
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              borderColor: errors.country_id
                                ? "red"
                                : baseStyles,
                            }),
                          }}
                          {...field}
                          options={countries}
                        />
                      )}
                    />
                    {errors.country_id && (
                      <span className="text-danger">
                        {errors.country_id.message}
                      </span>
                    )}
                </div>
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                    <Form.Label>State</Form.Label>
                    <Form.Group>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="State"
                          className={classNames("", {
                            "is-invalid": errors?.name,
                          })}
                          {...register("name", {
                            required: "State is required",
                               validate: (value) => {
                              const words = value.match(/\b\w+\b/g);
                              return (
                                !words ||
                                words.length <= 50 ||
                                "Data must be 100 words or less"
                              );
                            },
                          })}
                        />
                      </InputGroup>
                      {errors.name && (
                        <span className="text-danger">
                          {errors.name.message}
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
