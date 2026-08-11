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
library.add(fas);

const EditOffCanvance = (props) => {
  const id = props.show;
  const { postData, getData } = useContext(Context);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const [data, setData] = useState({});

  const GetEditData = async () => {
    const response = await getData(`/vender/${id}`);
    reset(response?.data);
    setData(response?.data);
  };
 

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,setValue,
  } = useForm();
   useEffect(() => {
    setValue('commission',props.doctorCommission)
  }, [props.doctorCommission]);

  const onSubmit = async (data) => {
    try {
      const d = new FormData();
      d.append("commission", data?.commission);
      const response = await putData(`/admin/employee-management/doctor-commission/${id}`, d);

      if (response?.success) {
        await setShowModal({ code: response.code, message: response.message });
      } else {
        await setShowModal({ code: response.code, message: response.message });
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
        className="edit-modal-holder"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit {data?.first_name}'s Commission
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={() => handleSubmit(onSubmit)} role="form">
            <Row className="justify-content-center">
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-center">
                    <Form.Group>
                      <div className="text-center">
                        <Form.Label>Commission</Form.Label>
                      </div>
                      <InputGroup>
                        <Form.Control
                          type="Number"
                          min={0}
                          max={70}
                          name="commission"
                          placeholder="Commission"
                          className={classNames("", {
                            "is-invalid": errors?.commission,
                          })}
                          {...register("commission", {
                            required: "Commission is required",
                            validate: (value) => {
                              if (!value) return "Commission is required";
                              // Validate percentage discount
                              if (parseFloat(value) < 1) {
                                return "Commission should not be less then 1";
                              }
                              if (parseFloat(value) > 100) {
                                return "Commission should not be Greater then 100";
                              }
                              return true; // Return true for valid input
                            },
                          })}
                        />
                      </InputGroup>
                      {errors.commission && (
                        <span className="text-danger">
                          {errors.commission.message}
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

export default EditOffCanvance;
