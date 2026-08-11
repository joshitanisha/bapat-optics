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
import Stepone from "./Stepone/Stepone";
import Steptwo from "./Steptwo/Steptwo";
import Stepfour from "./Stepfour/Stepfour";
import Stepfive from "./Stepfive/Stepfive";
import Stepsix from "./Stepsix/Stepsix";

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

  const [page, setPage] = useState(0);
  const [subPage, setSubPage] = useState(0); // State for sub-steps within Stepseven
  const [newUserContact, setNewUserContact] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page, subPage]);

  const nextStep = () => {
    if (page === 6 && subPage === 0) {
      setSubPage(1); // Move to the second form within Stepseven
    } else {
      setPage((currPage) => currPage + 1);
      setSubPage(0); // Reset subPage for the next step
    }
  };

  const prevStep = () => {
    if (page === 6 && subPage === 1) {
      setSubPage(0); // Move back to the first form within Stepseven
    } else {
      setPage((currPage) => currPage - 1);
      setSubPage(0); // Reset subPage for the previous step
    }
  };

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
                            <Stepfour
                              user_id={props?.user_id}
                              setShowModal={setShowModal}
                              showModal={showModal}
                            />
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
                            <Stepone
                              user_id={props?.user_id}
                              setShowModal={setShowModal}
                              showModal={showModal}
                            />
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
                            <Steptwo
                              user_id={props?.user_id}
                              setShowModal={setShowModal}
                              showModal={showModal}
                            />
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
                            <Stepfive
                              user_id={props?.user_id}
                              setShowModal={setShowModal}
                              showModal={showModal}
                            />
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
                            <Stepsix
                              user_id={props?.user_id}
                              setShowModal={setShowModal}
                              showModal={showModal}
                            />
                          </Row>
                        </div>
                      </div>
                    </TabPanel>
                  </TabContext>
                </Box>
              </Card.Body>
            </div>
          </Offcanvas.Body>
        </Container>
        <ModalSave
          message={showModal.message}
          showErrorModal={showModal.code ? true : false}
        />
      </Offcanvas>
    </>
  );
};

export default ViewOffCanvance;
