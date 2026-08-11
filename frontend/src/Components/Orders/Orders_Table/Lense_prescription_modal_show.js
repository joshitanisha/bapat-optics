import React, { useEffect, useRef, useState } from "react";
// import "./want-by-modal.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { FormGroup } from "react-bootstrap";
// import Success_Modal from "../success_modal/Success_Modal";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import { getData } from "../../../utils/api";
import {  useLoader } from "../../../utils/common";
// import { appSetup } from "../../../../features/master/masterSlice";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getSinglePrescription,
//   postPrescription,
// } from "../../../../features/prescription/prescriptionSlice";
const Lense_prescription_modal_show = ({ id, ...props }) => {
  const [type, setType] = useState(1);

  const labels = [
    { id: 1, name: "Distance Vision (DV)" },
    { id: 2, name: "Near Vision (NV)" },
    { id: 3, name: "Addition (ADD)" },
    { id: 4, name: "Pupillary Distance (PD)" },
  ];

  // Eyes and their headers
  const eyes = [
    {
      id: 1,
      name: "RIGHT EYE (OD)",
      headers: [
        { id: 1, name: "R-SPH" },
        { id: 2, name: "R-CYL" },
        { id: 3, name: "R-AXIS" },
        { id: 4, name: "R-VA" },
      ],
    },
    {
      id: 2,
      name: "LEFT EYE (OS)",
      headers: [
        { id: 5, name: "L-SPH" },
        { id: 6, name: "L-CYL" },
        { id: 7, name: "L-AXIS" },
        { id: 8, name: "L-VA" },
      ],
    },
  ];

  const methods = useForm({
    defaultValues: {
      pdf: "",
      vision: {
        1: {
          // Right eye
          1: {}, // Distance Vision
          2: {}, // Near Vision
          3: {}, // Addition
        },
        2: {
          // Left eye
          1: {},
          2: {},
          3: {},
        },
      },
    },
  });
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const [prescription, setPrescription] = useState([]);
  const { loading, withLoader } = useLoader();
  const GetAllPrescription = async (id) => {
    const response = await withLoader(() => getData(`/admin/orders/prescription/${id}`));
    if (response?.success) {
      setPrescription(response?.data);
    }
  };

  useEffect(() => {
    GetAllPrescription(id);
  }, [id]);

  // const prescription = useSelector(
  //   (state) => state.prescription.singlePrescription
  // );
  // useEffect(() => {
  //   dispatch(getSinglePrescription({ id: id }));
  // }, [id]);

  useEffect(() => {
    if (prescription) {
      /* ---------------- VISION ---------------- */
      if (prescription.Prescription_Details) {
        const newVision = {
          1: { 1: {}, 2: {}, 3: {}, 4: {} },
          2: { 1: {}, 2: {}, 3: {}, 4: {} },
        };

        prescription.Prescription_Details.forEach((item) => {
          const eyeId = item.eye_type_id;
          const visionTypeId = item.vission_type_id;
          const unitId = item.eye_unit_id;
          const name = item.name ?? "";

          if (!newVision[eyeId]) newVision[eyeId] = {};
          if (!newVision[eyeId][visionTypeId]) {
            newVision[eyeId][visionTypeId] = {};
          }

          newVision[eyeId][visionTypeId][unitId] = name;
        });

        setValue("vision", newVision, {
          shouldDirty: false,
          shouldValidate: false,
        });
      }

      /* ---------------- MEASUREMENTS ---------------- */
      if (prescription) {
        setValue("fh", prescription.fh ?? "", {
          shouldDirty: false,
        });

        setValue("a_size", prescription.a_size ?? "", {
          shouldDirty: false,
        });

        setValue("b_size", prescription.b_size ?? "", {
          shouldDirty: false,
        });

        setValue("dbl", prescription.dbl ?? "", {
          shouldDirty: false,
        });
      }
    }
  }, [prescription, setValue]);

  return (
    <>
      <Modal
        {...props}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="want_modal"
      >
        <Modal.Body>
          <div className="modal_sec">
            <div className="title_div">
              <h4 className="h4title">Lens Prescription</h4>
            </div>

            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
              <Nav variant="pills" className="row-column">
                {/* <Nav.Item>
                  <Nav.Link eventKey="first" onClick={() => setType(1)}>
                    Prescription Details
                  </Nav.Link>
                </Nav.Item> */}
                {/* <Nav.Item>
                  <Nav.Link eventKey="second" onClick={() => setType(2)}>
                    Upload Prescription
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="third" onClick={() => setType(3)}>
                    Not sure?
                  </Nav.Link>
                </Nav.Item> */}
              </Nav>
              <Form>
                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    {type === 1 && (
                      <div className="tabdata">
                        <div className="bottom">
                          <div className="row">
                            {eyes.map((eye) => (
                              <div className="col-lg-6" key={eye.id}>
                                <div className="eye_section">
                                  {/* Header Row */}
                                  <div className="row table_header">
                                    <div className="col-sm-4 col-4">
                                      <p className="eye_spec_title">
                                        {eye.name}
                                      </p>
                                    </div>
                                    {eye.headers.map((head) => (
                                      <div
                                        className="col-2 p-1 text-center header_cell"
                                        key={head.id}
                                      >
                                        <p className="top_text">{head.name}</p>
                                      </div>
                                    ))}
                                  </div>

                                  {labels.map((label) => (
                                    <div
                                      className="row align-items-center table_row"
                                      key={label.id}
                                    >
                                      <div className="col-lg-4 col-md-4 col-sm-4 col-4 label_col">
                                        <p className="left_text prescription_left_text">
                                          {label.name}
                                        </p>
                                      </div>

                                      {eye.headers.map((head, headIndex) => {
                                        // Near Vision: only show first header
                                        if (label.id === 3 && headIndex > 0)
                                          return (
                                            <div
                                              className="col-lg p-1 col-md col-sm-2 col-2 input_col"
                                              key={`${eye.id}-${label.id}-${head.id}`}
                                            />
                                          );
                                        if (label.id === 4 && headIndex > 0)
                                          return (
                                            <div
                                              className="col-lg p-1 col-md col-sm-2 col-2 input_col"
                                              key={`${eye.id}-${label.id}-${head.id}`}
                                            />
                                          );

                                        const hasError =
                                          errors?.vision?.[eye.id]?.[
                                            label.id
                                          ]?.[head.id];

                                        return (
                                          <div
                                            className="col-lg p-1 col-md col-sm-2 col-2 input_col"
                                            key={`${eye.id}-${label.id}-${head.id}`}
                                          >
                                            <FormGroup className="input_group">
                                              <Form.Control
                                                type="text"
                                                style={{
                                                  border: "1px solid",
                                                  borderColor: hasError
                                                    ? "red"
                                                    : "#ced4da",
                                                }}
                                                {...register(
                                                  `vision.${eye.id}.${label.id}.${head.id}`,
                                                  {
                                                    required: true,
                                                  }
                                                )}
                                              />
                                            </FormGroup>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}

                            <hr className="mt-3" />
                            <div className="row ">
                           

                              <div className="col-md-3 col-sm-3 col-6 mb-3">
                                <div className="eye_section ">
                                  <div className="d-flex  align-items-center table_row gap-3">
                                    <div className="label_col">
                                      <p className="left_text prescription_left_text no_wrap_text">A Size</p>
                                    </div>
                                    <div className=" input_col">
                                      <FormGroup className="input_group">
                                        <Form.Control
                                          type="text"
                                          placeholder={"A Size"}
                                          style={{
                                            border: "1px solid",
                                          }}
                                          {...register("a_size", {
                                            required: false,
                                          })}
                                        />
                                      </FormGroup>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="col-md-3 col-sm-3 col-6 mb-3">
                                <div className="eye_section ">
                                  <div className="d-flex  align-items-center table_row gap-3">
                                    <div className="label_col">
                                      <p className="left_text prescription_left_text no_wrap_text">B Size</p>
                                    </div>
                                    <div className=" input_col">
                                      <FormGroup className="input_group">
                                        <Form.Control
                                          type="text"
                                          placeholder={"B Size"}
                                          style={{
                                            border: "1px solid",
                                          }}
                                          {...register("b_size", {
                                            required: false,
                                          })}
                                        />
                                      </FormGroup>
                                    </div>
                                  </div>
                                </div>
                              </div>
                                 <div className="col-md-3 col-sm-3 col-6 mb-3">
                                <div className="eye_section ">
                                  <div className="d-flex  align-items-center table_row gap-3">
                                    <div className="label_col">
                                      <p className="left_text prescription_left_text no_wrap_text">FH</p>
                                    </div>
                                    <div className=" input_col">
                                      <FormGroup className="input_group">
                                        <Form.Control
                                          type="text"
                                          placeholder={"FH"}
                                          style={{
                                            border: "1px solid",
                                          }}
                                          {...register("fh", {
                                            required: false,
                                          })}
                                        />
                                      </FormGroup>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="col-md-3 col-sm-3 col-6 mb-3">
                                <div className="eye_section ">
                                  <div className="d-flex  align-items-center table_row gap-3">
                                    <div className="label_col">
                                      <p className="left_text prescription_left_text no_wrap_text">DBL</p>
                                    </div>
                                    <div className=" input_col">
                                      <FormGroup className="input_group">
                                        <Form.Control
                                          type="text"
                                          placeholder={"DBL"}
                                          style={{
                                            border: "1px solid",
                                          }}
                                          {...register("dbl", {
                                            required: false,
                                          })}
                                        />
                                      </FormGroup>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Tab.Pane>
                </Tab.Content>

                {/* <button type="submit" className="btn btn-primary mt-3">
                  Submit
                </button> */}
              </Form>
            </Tab.Container>

            <div className="form-group text-center mt-3">
              <button
                className="continue-btn"
                type="button"
                onClick={() => {
                  props.onHide();
                }}
              >
                Close
              </button>

              {/* <button
                className="continue-btn"
                type="button"
                onClick={() => {
                  handleSubmit(onSubmit);
                    // props.onHide();
                    // setSuccessmodal(true);
                }}
              >
                Continue
              </button> */}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Lense_prescription_modal_show;
