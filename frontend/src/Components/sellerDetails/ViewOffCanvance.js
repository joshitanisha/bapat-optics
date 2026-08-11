import React, { useContext } from "react";
import { useState, useEffect } from "react";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Offcanvas from "react-bootstrap/Offcanvas";
import "./ViewOffCanvance.css";
import { Context } from "../../utils/context";
import { useForm, Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import "react-phone-input-2/lib/bootstrap.css";
import Select from "react-select";
import { CancelButton, SaveButton } from "../common/Button";
import ModalSave from "../common/ModelSave";

library.add(fas);

const ViewOffCanvance = (props) => {
  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
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
    watch,
    getValues,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const dataToSend = new FormData();
      dataToSend.append("stage", data?.stage?.value);
      dataToSend.append("email", data?.email);
      const response = await postData(
        `/employee/seller/request/${props.id}`,
        dataToSend
      );

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

  const [data, setData] = useState();
  const getSellerData = async () => {
    const res = await getData(
      `/employee/seller-details/s-personal-details/${props.id}`
    );
    setData(res.data);
  };

  useEffect(() => {
    getSellerData();
  }, [props.id]);

  return (
    <>
      <Offcanvas
        show={props.show}
        style={{ width: "80%", height: "auto" }}
        placement={"end"}
        onHide={props.handleClose}
        className="offcan"
      >
        <Container className="tabss-main">
          <Offcanvas.Header closeButton></Offcanvas.Header>
          <Offcanvas.Body>
            <div className="shadow-lg p-3 mb-5  rounded">
              <Card.Body>
                <Card.Title>
                  <h3>Seller Details </h3>
                </Card.Title>

                <Box sx={{ width: "100%", typography: "body1" }}>
                  <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <TabList
                        onChange={handleChange}
                        aria-label="lab API tabs example"
                      >
                        <Tab label="Personal Details" value="1" />
                        <Tab label="Store Details" value="2" />
                        <Tab label="Cirtification Details" value="3" />
                        <Tab label="Documents Details" value="4" />
                        <Tab label="Bank Details" value="5" />
                      </TabList>
                    </Box>
                    <TabPanel value="1">
                      <div>
                        <div>
                          <h3>Personal Details</h3>
                        </div>

                        <div>
                          <Row>
                            <Col lg={4}>
                              <div className="main-form-section mt-4">
                                <Row className="justify-content-center">
                                  <Form.Label>First Name</Form.Label>
                                  <Form.Group>
                                    <InputGroup>
                                      <Form.Control
                                        type="text"
                                        value={data?.first_name}
                                        disabled
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </Row>
                              </div>
                            </Col>

                            {/* <Col lg={4}>
                              <div className="main-form-section mt-4">
                                <Row className="justify-content-center">
                                  <Form.Label>Roll in store</Form.Label>
                                  <Form.Group>
                                    <InputGroup>
                                      <Form.Control
                                        type="text"
                                        value={data?.role_in_store}
                                        disabled
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </Row>
                              </div>
                            </Col> */}

                            <Col lg={4}>
                              <div className="main-form-section mt-4">
                                <Row className="justify-content-center">
                                  <Form.Label>Contact Number</Form.Label>
                                  <Form.Group>
                                    <InputGroup>
                                      <Form.Control
                                        type="text"
                                        value={data?.contact_no}
                                        disabled
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </Row>
                              </div>
                            </Col>

                            <Col lg={4}>
                              <div className="main-form-section mt-4">
                                <Row className="justify-content-center">
                                  <Form.Label>Email</Form.Label>
                                  <Form.Group>
                                    <InputGroup>
                                      <Form.Control
                                        type="text"
                                        value={data?.email}
                                        disabled
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </Row>
                              </div>
                            </Col>

                            <Col lg={4}>
                              <div className="main-form-section mt-4">
                                <Row className="justify-content-center">
                                  <Form.Label>Designation</Form.Label>
                                  <Form.Group>
                                    <InputGroup>
                                      <Form.Control
                                        type="text"
                                        value={data?.role_in_store}
                                        disabled
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </Row>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </TabPanel>
                    <TabPanel value="2">
                      <div>
                        <div>
                          <h3>Store Details</h3>
                        </div>

                        <div>
                          <Row>
                            <Col md={4}>
                              <div className="main-form-section mt-4">
                                <Row className="justify-content-center">
                                  <Form.Label>Store Name</Form.Label>
                                  <Form.Group>
                                    <InputGroup>
                                      <Form.Control
                                        type="text"
                                        value={data?.store_detail?.store_name}
                                        disabled
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </Row>
                              </div>
                            </Col>
                            <Col md={4}>
                              <div className="main-form-section mt-4">
                                <Row className="justify-content-center">
                                  <Form.Label>Store Contact</Form.Label>
                                  <Form.Group>
                                    <InputGroup>
                                      <Form.Control
                                        type="text"
                                        value={data?.store_detail?.contact_no}
                                        disabled
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </Row>
                              </div>
                            </Col>
                            <Col md={4}>
                              <div className="main-form-section mt-4">
                                <Row className="justify-content-center">
                                  <Form.Label>Whatsapp No.</Form.Label>
                                  <Form.Group>
                                    <InputGroup>
                                      <Form.Control
                                        type="text"
                                        value={
                                          data?.store_detail?.wa_contact_no
                                        }
                                        disabled
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </Row>
                              </div>
                            </Col>
                          </Row>
                          <hr></hr>
                          <div>
                            <h4>Address</h4>
                          </div>
                          <Row>
                            <Col md={4}>
                              <div className="main-form-section mt-4">
                                <Row className="justify-content-center">
                                  <Form.Label>Address</Form.Label>
                                  <Form.Group>
                                    <InputGroup>
                                      <Form.Control
                                        type="text"
                                        value={
                                          data?.store_detail?.store_address
                                        }
                                        disabled
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </Row>
                              </div>
                            </Col>
                            <Col md={4}>
                              <div className="main-form-section mt-4">
                                <Row className="justify-content-center">
                                  <Form.Label>Area</Form.Label>
                                  <Form.Group>
                                    <InputGroup>
                                      <Form.Control
                                        type="text"
                                        value={data?.store_detail?.area}
                                        disabled
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </Row>
                              </div>
                            </Col>
                            <Col md={4}>
                              <div className="main-form-section mt-4">
                                <Row className="justify-content-center">
                                  <Form.Label>City</Form.Label>
                                  <Form.Group>
                                    <InputGroup>
                                      <Form.Control
                                        type="text"
                                        value={data?.store_detail?.city?.name}
                                        disabled
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </Row>
                              </div>
                            </Col>
                            <Col md={4}>
                              <div className="main-form-section mt-4">
                                <Row className="justify-content-center">
                                  <Form.Label>Pincode</Form.Label>
                                  <Form.Group>
                                    <InputGroup>
                                      <Form.Control
                                        type="text"
                                        value={
                                          data?.store_detail?.pincode?.name
                                        }
                                        disabled
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </Row>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </TabPanel>
                    <TabPanel value="3">
                      <div>
                        <div>
                          <h3>Cirtification Details</h3>
                        </div>
                        <div>
                          <Row>
                            <Col lg={4}>
                              <div className="main-form-section mt-4">
                                <Row className="justify-content-center">
                                  <Form.Label>Cirtification Name</Form.Label>
                                  <Form.Group>
                                    <InputGroup>
                                      <Form.Control
                                        type="text"
                                        value={data?.cirtification_detail?.name}
                                        disabled
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </Row>
                              </div>
                            </Col>

                            <Col lg={4}>
                              <div className="main-form-section mt-4">
                                <Row className="justify-content-center">
                                  <Form.Label>License</Form.Label>
                                  <Form.Group>
                                    <InputGroup>
                                      <Form.Control
                                        type="text"
                                        value={
                                          data?.cirtification_detail?.license
                                        }
                                        disabled
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </Row>
                              </div>
                            </Col>

                            <Col lg={4}>
                              <div className="main-form-section mt-4">
                                <Row className="justify-content-center">
                                  <Form.Label>License Type</Form.Label>
                                  <Form.Group>
                                    <InputGroup>
                                      <Form.Control
                                        type="text"
                                        value={
                                          data?.cirtification_detail
                                            ?.license_type
                                        }
                                        disabled
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </Row>
                              </div>
                            </Col>

                            <Col lg={4}>
                              <div className="main-form-section mt-4">
                                <Row className="justify-content-center">
                                  <Form.Label>License</Form.Label>
                                  <Form.Group>
                                    <InputGroup>
                                      <Form.Control
                                        type="text"
                                        value={data?.cirtification_detail?.name}
                                        disabled
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </Row>
                              </div>
                            </Col>
                            <Col lg={8}>
                              <div className="main-form-section mt-4">
                                <Row className="justify-content-center">
                                  <Form.Label>Address in License</Form.Label>
                                  <Form.Group>
                                    <InputGroup>
                                      <Form.Control
                                        type="text"
                                        value={
                                          data?.cirtification_detail
                                            ?.add_in_license
                                        }
                                        disabled
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </Row>
                              </div>
                            </Col>

                            <Col lg={4}>
                              <div className="main-form-section mt-4">
                                <Row className="justify-content-center">
                                  <Form.Label>Registration No. </Form.Label>
                                  <Form.Group>
                                    <InputGroup>
                                      <Form.Control
                                        type="text"
                                        value={
                                          data?.cirtification_detail?.reg_no
                                        }
                                        disabled
                                      /> 
                                    </InputGroup>
                                  </Form.Group>
                                </Row>
                              </div>
                            </Col>

                            <Col lg={4}>
                              <div className="main-form-section mt-4">
                                <Row className="justify-content-center">
                                  <Form.Label>Expiry Date</Form.Label>
                                  <Form.Group>
                                    <InputGroup>
                                      <Form.Control
                                        type="text"
                                        value={
                                          data?.cirtification_detail?.e_date
                                        }
                                        disabled
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </Row>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </TabPanel>
                    <TabPanel value="4">
                      <div>
                        <div>
                          <h3>Documents Details</h3>
                        </div>

                        <div>
                          <Row>
                            <Col lg={4}>
                              <div className="main-form-section mt-4">
                                <Row className="justify-content-center">
                                  <Form.Label>GST Number</Form.Label>
                                  <Form.Group>
                                    <InputGroup>
                                      <Form.Control
                                        type="text"
                                        value={data?.document?.gst_no}
                                        disabled
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </Row>
                              </div>
                            </Col>

                            <Col lg={4}>
                              <div className="main-form-section mt-4">
                                <Row className="justify-content-center">
                                  <Form.Label>PAN Number</Form.Label>
                                  <Form.Group>
                                    <InputGroup>
                                      <Form.Control
                                        type="text"
                                        value={data?.document?.pan_no}
                                        disabled
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </Row>
                              </div>
                            </Col>

                            <Col lg={4} className=""></Col>

                            <Col lg={4} className="">
                              <div className="main-form-section mt-4">
                                <Row className="justify-content-center">
                                  <Form.Label>Uploaded GST Document</Form.Label>
                                  {/* <Form.Group>
                                <InputGroup>
                                  <Form.Control
                                    type="text"
                                    value={data?.start_date}
                                    disabled
                                  />
                                </InputGroup>
                              </Form.Group> */}
                                  <div className="image-boxes-main">
                                    <img
                                      className="image-boxes"
                                      src={IMG_URL + data?.document?.gst_image}
                                    ></img>
                                  </div>
                                </Row>
                              </div>
                            </Col>

                            <Col lg={4} className="">
                              <div className="main-form-section mt-4">
                                <Row className="justify-content-center">
                                  <Form.Label>Uploaded PAN Document</Form.Label>
                                  {/* <Form.Group>
                                <InputGroup>
                                  <Form.Control
                                    type="text"
                                    value={data?.start_date}
                                    disabled
                                  />
                                </InputGroup>
                              </Form.Group> */}
                                  <div className="image-boxes-main">
                                    <img
                                      className="image-boxes"
                                      src={IMG_URL + data?.document?.pan_image}
                                    ></img>
                                  </div>
                                </Row>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </TabPanel>
                    <TabPanel value="5">
                      <div>
                        <div>
                          <h3>Bank Details</h3>
                        </div>
                        <div>
                          <Row>
                            <Col lg={4}>
                              <div className="main-form-section mt-4">
                                <Row className="justify-content-center">
                                  <Form.Label>Bank Name</Form.Label>
                                  <Form.Group>
                                    <InputGroup>
                                      <Form.Control
                                        type="text"
                                        value={data?.bank_detail?.bank_name}
                                        disabled
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </Row>
                              </div>
                            </Col>

                            <Col lg={4}>
                              <div className="main-form-section mt-4">
                                <Row className="justify-content-center">
                                  <Form.Label>Bank Account Number</Form.Label>
                                  <Form.Group>
                                    <InputGroup>
                                      <Form.Control
                                        type="text"
                                        value={data?.bank_detail?.acc_no}
                                        disabled
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </Row>
                              </div>
                            </Col>

                            <Col lg={4}>
                              <div className="main-form-section mt-4">
                                <Row className="justify-content-center">
                                  <Form.Label>IFSC Code</Form.Label>
                                  <Form.Group>
                                    <InputGroup>
                                      <Form.Control
                                        type="text"
                                        value={data?.bank_detail?.ifsc_code}
                                        disabled
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </Row>
                              </div>
                            </Col>

                            <Col lg={4}>
                              <div className="main-form-section mt-4">
                                <Row className="justify-content-center">
                                  <Form.Label>Branch Name</Form.Label>
                                  <Form.Group>
                                    <InputGroup>
                                      <Form.Control
                                        type="text"
                                        value={data?.bank_detail?.branch_name}
                                        disabled
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </Row>
                              </div>
                            </Col>

                            <Col lg={4}>
                              <div className="main-form-section mt-4">
                                <Row className="justify-content-center">
                                  <Form.Label>Beneficiary Name</Form.Label>
                                  <Form.Group>
                                    <InputGroup>
                                      <Form.Control
                                        type="text"
                                        value={
                                          data?.bank_detail?.beneficiary_name
                                        }
                                        disabled
                                      />
                                    </InputGroup>
                                  </Form.Group>
                                </Row>
                              </div>
                            </Col>

                            <Col lg={4} className=""></Col>

                            <Col lg={4} className="">
                              <div className="main-form-section mt-4">
                                <Row className="justify-content-center">
                                  <Form.Label>Uploaded Passbook</Form.Label>
                                  <div className="image-boxes-main">
                                    <img
                                      className="image-boxes"
                                      src={
                                        IMG_URL + data?.bank_detail?.passbook
                                      }
                                    ></img>
                                  </div>
                                </Row>
                              </div>
                            </Col>

                            <Col lg={4} className="">
                              <div className="main-form-section mt-4">
                                <Row className="justify-content-center">
                                  <Form.Label>Uploaded KYC</Form.Label>
                                  <div className="image-boxes-main">
                                    <img
                                      className="image-boxes"
                                      src={IMG_URL + data?.bank_detail?.kyc}
                                    ></img>
                                  </div>
                                </Row>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </TabPanel>
                  </TabContext>
                </Box>
              </Card.Body>
            </div>
          </Offcanvas.Body>
          {/* <Col md={4}>
            <div className="main-form-section mt-3">
              <Form.Group>
                <Form.Label>Take an action</Form.Label>
                <InputGroup>
                  <Controller
                    name="stage" // name of the field
                    control={control}
                    rules={{ required: "Take an Action" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        styles={{
                          control: (baseStyles) => ({
                            ...baseStyles,
                            borderColor: errors.stage ? "red" : baseStyles.borderColor,
                          }),
                        }}
                        options={[
                          { value: "Approved", name: "option", label: "Approve" },
                          { value: "Rejected", name: "option", label: "Reject" },
                        ]}
                      />
                    )}
                  />
                </InputGroup>
                {errors.stage && <p style={{ color: "red" }}>{errors.stage.message}</p>}
              </Form.Group>
            </div>
          </Col>

          <Row className="mt-5 pb-3">
            <div className="d-flex justify-content-center">

              <CancelButton
                name={"Back"}
                handleClose={props.handleClose}
              />


              <SaveButton
                name={"Save"}
                handleSubmit={handleSubmit(onSubmit)}
              />
            </div>
          </Row> */}
        </Container>
      </Offcanvas>
      <ModalSave
        message={showModal.message}
        showErrorModal={showModal.code ? true : false}
      />
    </>
  );
};

export default ViewOffCanvance;
