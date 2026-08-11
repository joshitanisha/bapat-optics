import React, { useContext } from "react";
import { useState } from "react";
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
import { ClipLoader } from "react-spinners";
import JoditEditor from "jodit-react";
library.add(fas);

const AddOffCanvance = (props) => {
  const { postData } = useContext(Context);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    clearErrors,
    trigger,
    control,
    formState: { errors },
  } = useForm();
  const [loader, setLoder] = useState(false);
  const onSubmit = async (data) => {
    try {
      setLoder(true);
      const finalData = new FormData();

      finalData.append("message", data?.message);
      finalData.append("image", data.image[0]);
      const response = await postData(`/admin/notification`, finalData);

      if (response?.success) {
        setLoder(false);
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
      clearErrors("image");
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
            Add Notification
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
            <Row className="">
              <Col md={12}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-center">
                    <Form.Label>Description</Form.Label>
                    <Form.Group>
                      <InputGroup>
                        <Controller
                          name="message"
                          control={control}
                          rules={{
                            validate: (value) => {
                              const plainText = value?.replace().trim();
                              return (
                                plainText.length > 0 ||
                                "Description is required."
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
                                trigger("message");
                              }}
                              onChange={(newContent) => {
                                onChange(newContent);
                              }}
                            />
                          )}
                        />
                      </InputGroup>
                      {errors.message && (
                        <span className="text-danger">
                          {errors.message.message}
                        </span>
                      )}
                    </Form.Group>
                  </Row>
                </div>
              </Col>

              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Image</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="file"
                        name="image"
                        placeholder="Image"
                        className={classNames("", {
                          "is-invalid": errors?.image,
                        })}
                        {...register("image", {
                          required: "Image is required",
                        })}
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </InputGroup>
                    {errors.image && (
                      <span className="text-danger">
                        {errors.image.message}
                      </span>
                    )}
                  </Form.Group>
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Category Preview"
                        style={{ maxWidth: "100px" }}
                      />
                    </div>
                  )}
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
                  {loader ? (
                    <>
                      <div className="text-center">
                        <ClipLoader />
                      </div>
                    </>
                  ) : (
                    <SaveButton
                      name={"Save"}
                      handleSubmit={handleSubmit(onSubmit)}
                    />
                  )}
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
