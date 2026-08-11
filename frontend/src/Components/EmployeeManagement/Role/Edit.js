
import React, { useContext } from "react";
import { useState, useEffect } from "react";
import "../../Tabels/Tabels.css";
import plus from "../../../Components/assets/icons/a1.png";
import colunms from "../../../Components/assets/icons/LINES.png";
import pen from "../../../Components/assets/icons/pen.png";
import basket from "../../../Components/assets/icons/basket.png";
import search1 from "../../../Components/assets/icons/search.png";
import top from "../../../Components/assets/icons/top.png";
import Table from "react-bootstrap/Table";
import circle from "../../assets/icons/circle.png";
import rigth from "../../assets/icons/rigth.png";
import save from "../../assets/icons/save.png";
import cancel from "../../assets/icons/cross.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../Header/Header";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Offcanvas from "react-bootstrap/Offcanvas";

import toast, { Toaster } from "react-hot-toast";
import Card from "react-bootstrap/Card";

import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import { Context } from "../../../utils/context";

import { IDS } from "../../../utils/common";

import "../../Masters/datatable.css";
import Pagination_Holder from "../../common/Pagination_Holder/Pagination_Holder";
import Pagination from "react-bootstrap/Pagination";
import { putData } from "../../../utils/api";


const EditOffCanvance = (props) => {
    const { postData, getData, RequiredIs } = useContext(Context);

    const id = props.show;
    const [data, setData] = useState();

    const [formData, setFormData] = useState({
        role_id: "",
        name: "",
        permission_id: [],
    });

    const [permissions, setPermissions] = useState([]);
    const [errors, setErrors] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [allChecked, setAllChecked] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState(false);

    const validateForm = () => {
        let errors = {};

        const regex = /^[A-Za-z0-9]+(\s[A-Za-z0-9]+)*$/;

        if (!formData?.name.trim()) {
            errors.name = "Role Name is required";
        } else if (!regex.test(formData?.name.trim())) {
            errors.name = "Enter Valid Role ";
        }

        if (selectedPermissions?.length == 0) {
            errors.permission_id = "Select Min 1 Permission is required";
        }

        return errors;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target?.name]: e.target.value });
    };

    const handleSelectAll = async () => {
        setSelectedPermissions(allChecked);
        await setFormData({ ...formData, permission_id: allChecked });
    };

    const handleCheckboxChange = async (
        permissionId,
        value = null,
        checked = null
    ) => {
        if (value === "selectAll") {
            if (checked) {
                handleSelectAll();
            } else {
                await setFormData({ ...formData, permission_id: [] });
                setSelectedPermissions([]);
            }
        } else {
            const isSelected = selectedPermissions.includes(permissionId);

            if (isSelected) {
                const updatedSelectedPermissions = selectedPermissions.filter(
                    (id) => id !== permissionId
                );
                setSelectedPermissions(updatedSelectedPermissions);
                setFormData({ ...formData, permission_id: updatedSelectedPermissions });
            } else {
                const updatedSelectedPermissions = [
                    ...selectedPermissions,
                    permissionId,
                ];
                setSelectedPermissions(updatedSelectedPermissions);
            }
        }
    };

    


    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            try {
                formData.permission_id = selectedPermissions;

                const response = await putData(`/admin/employee-management/role/${id}`, formData);

                if (response.success) {
                    setShowModal(true);
                    setTimeout(() => {
                        setShowModal(false);
                        props.handleClose();
                    }, 1000);
                } else {
                    setShowErrorModal(true);
                    setTimeout(() => {
                        setShowErrorModal(false);
                        props.handleClose();
                    }, 1000);
                }
            } catch (error) {
                console.error("Error submitting form:", error);
            }
        }
    };

    const GetEditData = async () => {
        const response = await getData(`/admin/employee-management/role/${id}`);
        const roleData = response?.data;

        // Check if response contains the Roles_Permissions array and map to get the permission_id
        const selectedPermissionIds = Array.isArray(roleData?.Roles_Permissions)
            ? roleData.Roles_Permissions.map(permission => permission.permission_id) // or use `id` depending on your structure
            : [];

        // Set the full Roles_Permissions data if you want to keep it in state
        setData(roleData?.Roles_Permissions);

        // Store only the permission_ids in selectedPermissions
        setSelectedPermissions(selectedPermissionIds);

        // Store the full role data
        setFormData(roleData);
    };

    useEffect(() => {
        GetEditData();
    }, []);

    const getPermissions = async () => {
        try {
            const permissionResponse = await getData(
                "/common/masters/all-permissions"
            );
            setPermissions(permissionResponse.data);
            const newData = permissionResponse.data;
            if (newData) {
                const newIds = newData.map((d) => d?.id);
                setAllChecked(newIds);
            }
        } catch (error) {
            console.error("Error fetching permissions:", error);
        }
    };

    useEffect(() => {
        getPermissions();
    }, []);

    const errorStyle = {
        color: "red",
        marginLeft: "5px",
    };

    return (
        <>
            <Offcanvas
                show={props.show}
                style={{ width: "80%", height: "100%" }}
                placement={"end"}
                onHide={props.handleClose}
            >
                <Offcanvas.Header closeButton></Offcanvas.Header>
                <Offcanvas.Body>
                    <div className="shadow-lg p-3 mb-5  rounded">
                        <Card.Body>
                            <Card.Title>Edit Role</Card.Title>
                            <hr />
                            <Row>
                                <Col md={12}>
                                    <Row className="">
                                        <Col xxl={12} xl={12} >
                                            <Form onSubmit={handleSubmit} role="form">
                                                <Row>
                                                    <Col lg={12} md={12} className=" mx-auto Add-content">
                                                        <Row>
                                                            <Col md={12}>
                                                                <div className="main-form-section ">
                                                                    <Row className="">
                                                                        <Col sm={6}>
                                                                            <Form.Group>
                                                                                <Form.Control
                                                                                    type="text"
                                                                                    name="name"
                                                                                    value={formData.name}
                                                                                    onChange={handleChange}
                                                                                    placeholder="Enter Role Name"
                                                                                    id="inputEmail3"
                                                                                />
                                                                                {errors.name && (
                                                                                    <span style={errorStyle}>
                                                                                        {errors.name}
                                                                                    </span>
                                                                                )}
                                                                            </Form.Group>
                                                                        </Col>

                                                                        <Col md={6}>
                                                                            <div className="main-form-section ">
                                                                                <Row className="">
                                                                                    <Form.Group>
                                                                                        <Form.Check
                                                                                            label=" Permissions Select All"
                                                                                            type="checkbox"
                                                                                            value="selectAll"
                                                                                            onChange={(e) =>
                                                                                                handleCheckboxChange(
                                                                                                    e,
                                                                                                    "selectAll",
                                                                                                    e.target.checked
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                        {errors.permission_id && (
                                                                                            <span style={errorStyle}>
                                                                                                {errors.permission_id}
                                                                                            </span>
                                                                                        )}
                                                                                    </Form.Group>
                                                                                </Row>
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                            </Col>

                                                            <Col md={12}>
                                                                <div className="main-form-section allpermissionscroll mt-5">
                                                                    <div className="row">
                                                                        {Array.isArray(permissions) &&
                                                                            permissions.map((data, index) => (
                                                                                <div className="col-md-3" key={data.id}>
                                                                                    <Form.Group>
                                                                                        <Form.Check
                                                                                            type="checkbox"
                                                                                            label={data.name}
                                                                                            onChange={() =>
                                                                                                handleCheckboxChange(data.id)
                                                                                            }
                                                                                            checked={
                                                                                                selectedPermissions &&
                                                                                                selectedPermissions?.includes(
                                                                                                    data?.id
                                                                                                )
                                                                                            }
                                                                                            id={`checkbox-${data.id}`}
                                                                                        />
                                                                                    </Form.Group>
                                                                                </div>
                                                                            ))}
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        </Row>

                                                        <Row className=" pb-3 cancelsavestic" >
                                                            <div className="d-flex justify-content-center" >
                                                                <Button
                                                                    type="button"
                                                                    variant="danger"
                                                                    onClick={() => props.handleClose()}
                                                                    className="btn btn-cancel me-2"
                                                                >
                                                                    <img
                                                                        src={cancel}
                                                                        className="cancel-img"
                                                                        alt=""
                                                                    />{" "}
                                                                    Cancel
                                                                </Button>

                                                                <Button
                                                                    variant="success"
                                                                    type="submit"
                                                                    onClick={handleSubmit}
                                                                    className="btn btn-save"
                                                                >
                                                                    <img
                                                                        src={save}
                                                                        className="save-img me-2"
                                                                        alt=""
                                                                    />{" "}
                                                                    Save
                                                                </Button>
                                                            </div>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </div>
                </Offcanvas.Body>
            </Offcanvas>

            {/* <!-- Modal --> */}
            <div className="save-modal">
                <div
                    className={`modal fade ${showModal ? "show" : ""}`}
                    style={{ display: showModal ? "block" : "none" }}
                    id="exampleModal1"
                    tabIndex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog  modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="circle justify-content-end">
                                    <img src={circle} className="circle-img mb-2" alt="" />
                                </div>
                                <h1 className="add-success text-center">
                                    Role Updated Successfully
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Modal --> */}
            <div className="save-modal">
                <div
                    className={`modal fade ${showErrorModal ? "show" : ""}`}
                    style={{ display: showErrorModal ? "block" : "none" }}
                    id="exampleModal1"
                    tabIndex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog  modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="circle justify-content-end">
                                    <img src={circle} className="circle-img mb-2" alt="" />
                                </div>
                                <h1 className="add-success text-center">Role Already Exits</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditOffCanvance;