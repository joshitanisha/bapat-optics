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
import { useForm } from "react-hook-form";
import classNames from "classnames";
import { putData } from "../../../utils/api";
import { IDS,  useLoader } from "../../../utils/common";
library.add(fas);

const EditOffCanvance = (props) => {
  const id = props.show;
  const { postData, getData, IMG_URL } = useContext(Context);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });
  const { loading, withLoader } = useLoader();

  const GetEditData = async () => {
    const response = await withLoader(() =>
      getData(`/admin/setting/social-link/${id}`)
    );
    reset(response?.data);
  };
  useEffect(() => {
    GetEditData();
  }, []);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    watch,
  } = useForm();

  const imageFile = watch("image");

  const onSubmit = async (data) => {
    try {
      const finalData = new FormData();
      finalData.append("name", data?.name);
      finalData.append("url", data.url);
      finalData.append("image", data.image[0]);
      const response = await withLoader(() => putData(
        `/admin/setting/social-link/${id}`,
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
            Edit Social Link
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
            <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
              <Row className="">
                <Col md={6}>
                  <div className="main-form-section mt-3">
                    <Row className="justify-content-center">
                      <Form.Group>
                        <Form.Label>Social Link Name</Form.Label>

                        <InputGroup>
                          <Form.Control
                            type="text"
                            name="name"
                            placeholder="Social Link Name"
                            className={classNames("", {
                              "is-invalid": errors?.name,
                            })}
                            {...register("name", {
                              required: "Social Link Name Is Required",
                              validate: (value) =>
                                value.length <= 200 ||
                                "Data must be 200 characters or less",
                            })}
                          />
                        </InputGroup>
                        {errors.name && (
                          <span className="text-danger">
                            {errors.name.message}
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
                        <Form.Label>URL</Form.Label>
                      </div>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          name="url"
                          placeholder="URL"
                          className={classNames("", {
                            "is-invalid": errors?.url,
                          })}
                          {...register("url", {
                            required: "URL is required",
                          })}
                        />
                      </InputGroup>
                      {errors.url && (
                        <span className="text-danger">
                          {errors.url.message}
                        </span>
                      )}
                    </Form.Group>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="main-form-section mt-3">
                    <Row className="justify-content-start">
                      <Form.Label className="text-left">Image</Form.Label>

                      <Form.Group>
                        <Form.Control
                          className={classNames("", {
                            "is-invalid": errors?.image,
                          })}
                          type="file"
                          {...register("image", {
                            // validate: async (value) => {
                            //   if (typeof value !== "string") {
                            //     const fileTypes = ["jpg", "png", "jpeg"];
                            //     const fileType = value[0].name?.split(".")[1];
                            //     if (!fileTypes.includes(fileType)) {
                            //       return `please upload a valid file format. (${fileTypes})`;
                            //     }
                            //     const sizes = await getDimension(value[0]);
                            //     if (
                            //       sizes.width !== 420 &&
                            //       sizes.height !== 520
                            //     ) {
                            //       return "Image width and height must be 420 px and 520 px";
                            //     }
                            //     const fileSize = Math.round(
                            //       value[0].size / 1024
                            //     );
                            //     if (fileSize > 500) {
                            //       return "file size must be lower than 500kb";
                            //     }
                            //   }
                            // },
                          })}
                          accept=".jpg, .jpeg, .png"
                        />
                      </Form.Group>
                      {errors.image && (
                        <span className="text-danger">
                          {errors.image.message}
                        </span>
                      )}
                    </Row>
                  </div>
                </Col>

                <Col lg={6}>
                  <div className="main-form-section mt-3">
                    <Form.Label>Image Preview</Form.Label>

                    {typeof getValues("image") == "string" ? (
                      <div className="image-preview-container">
                        <img
                          src={IMG_URL + getValues("image")}
                          alt="Preview"
                          className="image-preview"
                        />
                      </div>
                    ) : (
                      imageFile &&
                      imageFile?.length > 0 && (
                        <div className="image-preview-container">
                          <img
                            // src={URL.createObjectURL(getValues("image")[0])}
                            src={URL?.createObjectURL(imageFile[0])}
                            alt="Preview"
                            className="image-preview"
                          />
                        </div>
                      )
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
