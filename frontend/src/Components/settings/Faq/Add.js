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
import { CancelButton, SaveButton } from "../../common/Button";
import { Row, Col, Form, InputGroup, Modal } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import classNames from "classnames";
import { Country } from "../../../utils/apis/master/Master";
import JoditEditor from "jodit-react";
import {  useLoader } from "../../../utils/common";
library.add(fas);

const AddOffCanvance = (props) => {
  const { postData, getData, Select2Data } = useContext(Context);

  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const [categories, setCategories] = useState([]);

  const GetAllFaqCategory = async () => {
    const response = await getData("/common/masters/faq-categories");
    if (response?.success) {
      setCategories(await Select2Data(response?.data, "faq_category_id"));
    }
  };
  useEffect(() => {
    GetAllFaqCategory();
  }, []);

  const {
    control,
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm();
  const { loading, withLoader } = useLoader();

  const onSubmit = async (data) => {
    try {
      const DataToSend = new FormData();
      // DataToSend.append("faq_category_id", data?.faq_category_id?.value);
      DataToSend.append("question", data?.question);
      DataToSend.append("answer", data?.answer);
      const response = await withLoader(() => postData(`/admin/setting/faq`, DataToSend));

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
          <Modal.Title id="contained-modal-title-vcenter">Add FAQ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={() => handleSubmit(onSubmit)}
            role="form"
            // className="stateclass"
          >
            <Row>
              {/* <Col md={12}>
                <div className="main-form-section mt-3">
                  <Row className="row justify-content-center mb-2 me-0 sm-0">
                    <Form.Label>FAQ Category</Form.Label>
                    <Controller
                      name="faq_category_id" // name of the field
                      {...register("faq_category_id", {
                        required: "Select Category",
                      })}
                      control={control}
                      render={({ field }) => (
                        <Select
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              borderColor: errors.faq_category_id
                                ? "red"
                                : baseStyles,
                            }),
                          }}
                          {...field}
                          options={categories}
                        />
                      )}
                    />
                    {errors.faq_category_id && (
                      <span className="text-danger">
                        {errors.faq_category_id.message}
                      </span>
                    )}
                  </Row>
                </div>
              </Col> */}

              <Col md={12}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-center">
                    <Form.Label>Question</Form.Label>
                    <Form.Group>
                      <InputGroup>
                        <Form.Control
                          as="textarea"
                          type="text"
                          name="question"
                          placeholder="Question"
                          className={classNames("", {
                            "is-invalid": errors?.question,
                          })}
                          {...register("question", {
                            required: "Question is required",
                                validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                          })}
                        />
                      </InputGroup>
                      {errors.question && (
                        <span className="text-danger">
                          {errors.question.message}
                        </span>
                      )}
                    </Form.Group>
                  </Row>
                </div>
              </Col>

              <Col md={12}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-center">
                    <Form.Label>Answer</Form.Label>
                    <Form.Group>
                      <InputGroup>
                        <Controller
                          name="answer"
                          control={control}
                          rules={{
                            validate: (value) => {
                              const plainText = value
                                ?.replace(/<[^>]*>/g, "")
                                .trim(); // strip HTML
                              return (
                                plainText.length > 0 || "Answer is required."
                              );
                            },
                          }}
                          render={({
                            field: { onChange, onBlur, value, ref },
                          }) => (
                            <JoditEditor
                              value={value}
                              ref={ref}
                              onBlur={() => {
                                onBlur();
                                trigger("answer");
                              }}
                              onChange={(newContent) => {
                                onChange(newContent);
                              }}
                            />
                          )}
                        />
                       
                      </InputGroup>
                      {errors.answer && (
                        <span className="text-danger">
                          {errors.answer.message}
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

export default AddOffCanvance;
