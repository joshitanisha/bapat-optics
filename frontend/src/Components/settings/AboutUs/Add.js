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
      DataToSend.append("content", data?.content);
      const response = await withLoader(() => postData(`/admin/setting/about-us`, DataToSend));

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
            Add About Us
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={() => handleSubmit(onSubmit)}
            role="form"
          // className="stateclass"
          >
            <Row>
              <Col md={12}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-center">
                    <Form.Label>Content</Form.Label>
                    <Form.Group>
                      <InputGroup>
                        <Controller
                          name="content"
                          control={control}
                          rules={{
                            required: "Content is required.",
                            // maxLength: {
                            //   value: 600,
                            //   message:
                            //     "content must be at most 600 characters long.",
                            // },
                          }} // Correct the maxLength rule
                          render={({ field: { onChange, onBlur, value } }) => (
                            <JoditEditor
                              value={value}
                              onBlur={() => {
                                onBlur();
                                trigger("content");
                              }}
                              onChange={onChange}
                            />
                          )}
                        />
                      </InputGroup>
                      {errors.content && (
                        <span className="text-danger">
                          {errors.content.message}
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
