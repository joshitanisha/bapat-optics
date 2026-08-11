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
import JoditEditor from "jodit-react";
library.add(fas);

const AddOffCanvance = (props) => {
  const { postData, getData, Select2Data } = useContext(Context);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  console.log(states, 'qqqqstatesqqqq');


  const {
    control,
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm();



  const onSubmit = async (data) => {

    console.log(data, 'iiiiiiiiiiiiiiiiiiiiiiiiiiiii');

    try {
      const finalData = new FormData();
      finalData.append("name", data?.name);
      finalData.append("description", data?.description);
      finalData.append("skill", data?.skill);
      finalData.append("job_location", data?.job_location);
      finalData.append("role_permission", data?.role_permission);
      finalData.append("hr_name", data?.hr_name);
      finalData.append("recruiter_email", data?.recruiter_email);
      finalData.append("job_type_id", data?.job_type_id?.value);
      finalData.append("shift_type_id", data?.shift_type_id?.value);
      finalData.append("recruiter_contact_number", data?.recruiter_contact_number);
      finalData.append("start_annual_package", data?.start_annual_package);
      finalData.append("end_annual_package", data?.end_annual_package);
      finalData.append("company_name", data?.company_name);
      finalData.append("vacancy", data?.vacancy);
      finalData.append("image", data.image[0]);
      finalData.append("experience_from", data?.experience);
      finalData.append("experience_to", data?.experience_to);
      finalData.append("deadline", data?.deadline);
      if (data?.qualification_id && data?.qualification_id?.length > 0) {
        for (let i = 0; i < data?.qualification_id.length; i++) {
          finalData.append("qualification_id", data?.qualification_id[i]);
        }
      }
      if (data?.language_id && data?.language_id.length > 0) {
        for (let i = 0; i < data?.language_id?.length; i++) {
          finalData.append("language_id", data?.language_id[i]);
        }
      }

      // finalData.append("qualification_id", data?.qualification_id);
      // finalData.append("language_id", data?.language_id);

      const response = await postData(`/admin/career/career-form`, finalData);
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

  const [jobtype, setJobType] = useState();
  const [shifttype, setShiftType] = useState();
  const [qualification, setQualification] = useState()
  const [language, setLanguage] = useState()
  const [today, setToday] = useState();

  const GetAllJob = async () => {
    const response = await getData("/common/masters/allJobType");
    if (response?.success) {
      setJobType(await Select2Data(response?.data, "job_type_id"));
    }
  };
  const GetAllShift = async () => {
    const response = await getData("/common/masters/allShift");
    if (response?.success) {
      setShiftType(await Select2Data(response?.data, "shift_type_id"));
    }
  };
  const GetAllQualification = async () => {
    const response = await getData("/common/masters/allQualification");
    if (response?.success) {
      setQualification(await Select2Data(response?.data, "qualification_id"));
    }
  };
  const GetAllLanguage = async () => {
    const response = await getData("/common/masters/allLanguage");
    if (response?.success) {
      setLanguage(await Select2Data(response?.data, "language_id"));
    }
  };


  useEffect(() => {
    GetAllJob();
    GetAllShift();
    GetAllQualification();
    GetAllLanguage();

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    setToday(formattedDate);

  }, [])

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set image preview
      };
      reader.readAsDataURL(file);
      clearErrors("image")
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
          <Modal.Title id="contained-modal-title-vcenter">Add City</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={() => handleSubmit(onSubmit)}
            role="form"
          // className="stateclass"
          >
            <Row>
              {/* name */}
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Name</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Name"
                        className={classNames("", {
                          "is-invalid": errors?.name,
                        })}
                        {...register("name", {
                          required: "Name is required",
                          validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                        })}
                      />
                    </InputGroup>
                    {errors.name && (
                      <span className="text-danger">{errors.name.message}</span>
                    )}
                  </Form.Group>
                </div>
              </Col>
              {/* Skill */}
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Skill</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="skill"
                        placeholder="Skill"
                        className={classNames("", {
                          "is-invalid": errors?.skill,
                        })}
                        {...register("skill", {
                          // required: "Skill is required",
                          validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                        })}
                      />
                    </InputGroup>
                    {errors.skill && (
                      <span className="text-danger">{errors.skill.message}</span>
                    )}
                  </Form.Group>
                </div>
              </Col>
              {/* descr */}
              <Col md={12}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-center">
                    <Form.Label>Description</Form.Label>
                    <Form.Group>
                      <InputGroup>
                        <Controller
                          name="description"
                          control={control}
                          rules={{
                            validate: (value) => {
                              const plainText = value
                                ?.replace()
                                .trim(); // strip HTML
                              return (
                                plainText.length > 0 || "Description is required."
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
                                trigger("description");
                              }}
                              onChange={(newContent) => {
                                onChange(newContent);
                              }}
                            />
                          )}
                        />

                      </InputGroup>
                      {errors.description && (
                        <span className="text-danger">
                          {errors.description.message}
                        </span>
                      )}
                    </Form.Group>
                  </Row>
                </div>
              </Col>
              {/* Permission */}
              <Col md={12}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-center">
                    <Form.Label>Role-Permission</Form.Label>
                    <Form.Group>
                      <InputGroup>
                        <Controller
                          name="role_permission"
                          control={control}
                          rules={{
                            validate: (value) => {
                              const plainText = value
                                ?.replace()
                                .trim(); // strip HTML
                              return (
                                plainText.length > 0 || "role permission is required."
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
                                trigger("role_permission");
                              }}
                              onChange={(newContent) => {
                                onChange(newContent);
                              }}
                            />
                          )}
                        />

                      </InputGroup>
                      {errors.role_permission && (
                        <span className="text-danger">
                          {errors.role_permission.message}
                        </span>
                      )}
                    </Form.Group>
                  </Row>
                </div>
              </Col>
              {/* job_location */}
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Job Location</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="job_location"
                        placeholder="Job Location"
                        className={classNames("", {
                          "is-invalid": errors?.job_location,
                        })}
                        {...register("job_location", {
                          // required: "Location is required",
                          validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                        })}
                      />
                    </InputGroup>
                    {errors.job_location && (
                      <span className="text-danger">{errors.job_location.message}</span>
                    )}
                  </Form.Group>
                </div>
              </Col>

              {/* hr */}
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>HR Name</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="hr_name"
                        placeholder="HR Name"
                        className={classNames("", {
                          "is-invalid": errors?.hr_name,
                        })}
                        {...register("hr_name", {
                          // required: "Hr name is required",
                          validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                        })}
                      />
                    </InputGroup>
                    {errors.hr_name && (
                      <span className="text-danger">{errors.hr_name.message}</span>
                    )}
                  </Form.Group>
                </div>
              </Col>
              {/*lang  */}
              <Col md={6}>
                {/* {console.log(language, 'language') */}
                {/* } */}
                <div className="main-form-section mt-3">
                  <Row className="row justify-content-center mb-2 me-0 sm-0">
                    <Form.Label>Languages</Form.Label>
                    <Controller
                      name="language_id" // name of the field
                      {...register("language_id", {
                        required: "Please select at least one language",
                      })}
                      control={control}
                      render={({ field }) => (
                        <Select
                          isMulti
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              borderColor: errors.language_id
                                ? "red"
                                : baseStyles,
                            }),
                          }}
                          {...field}
                          onChange={(selected) => {
                            field?.onChange(selected?.map((option) => option?.value));
                          }}
                          value={language?.filter((option) => field?.value?.includes(option?.value))}
                          options={language}
                        />
                      )}
                    />
                    {errors.language_id && (
                      <span className="text-danger">
                        {errors.language_id.message}
                      </span>
                    )}
                  </Row>
                </div>
              </Col>
              {/* qualif */}
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Row className="row justify-content-center mb-2 me-0 sm-0">
                    <Form.Label>Qualification</Form.Label>

                    <Controller
                      name="qualification_id" // name of the field
                      {...register("qualification_id", {
                        required: "Please Select Qualification",
                      })}
                      control={control}
                      render={({ field }) => (
                        <Select
                          isMulti
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              borderColor: errors.qualification_id ? "red" : baseStyles,
                            }),
                          }}
                          {...field}
                          onChange={(selected) => {
                            field?.onChange(selected?.map((option) => option?.value));
                          }}
                          value={language?.filter((option) => field?.value?.includes(option?.value))}
                          options={qualification}
                        />
                      )}
                    />

                    {errors.qualification_id && (
                      <span className="text-danger">
                        {errors.qualification_id.message}
                      </span>
                    )}
                  </Row>
                </div>
              </Col>
              {/* job type */}
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Row className="row justify-content-center mb-2 me-0 sm-0">
                    <Form.Label>Job Type</Form.Label>

                    <Controller
                      name="job_type_id" // name of the field
                      {...register("job_type_id", {
                        // required: "Please Select Job Type",
                      })}
                      control={control}
                      render={({ field }) => (
                        <Select
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              borderColor: errors.job_type_id ? "red" : baseStyles,
                            }),
                          }}
                          {...field}
                          options={jobtype}
                        />
                      )}
                    />

                    {errors.job_type_id && (
                      <span className="text-danger">
                        {errors.job_type_id.message}
                      </span>
                    )}
                  </Row>
                </div>
              </Col>

              {/* shift type */}
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Row className="row justify-content-center mb-2 me-0 sm-0">
                    <Form.Label>Shift Type</Form.Label>

                    <Controller
                      name="shift_type_id" // name of the field
                      {...register("shift_type_id", {
                        // required: "Please Select Shift Type",
                      })}
                      control={control}
                      render={({ field }) => (
                        <Select
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              borderColor: errors.state_id ? "red" : baseStyles,
                            }),
                          }}
                          {...field}
                          options={shifttype}
                        />
                      )}
                    />

                    {errors.shift_type_id && (
                      <span className="text-danger">
                        {errors.shift_type_id.message}
                      </span>
                    )}
                  </Row>
                </div>
              </Col>
              {/* Recruiter email */}
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Recruiter Email</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="recruiter_email"
                        placeholder="Recruiter_email"
                        className={classNames("", {
                          "is-invalid": errors?.recruiter_email,
                        })}
                        {...register("recruiter_email", {
                          // required: "Email is required",
                          validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                          pattern: {
                            value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                            message: "Email Id Invalid",
                          },
                        })}
                      />
                    </InputGroup>
                    {errors.recruiter_email && (
                      <span className="text-danger">{errors.recruiter_email.message}</span>
                    )}
                  </Form.Group>
                </div>
              </Col>
              {/* Recruiter contact */}
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Recruiter Contact</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="recruiter_contact_number"
                        placeholder="Recruiter contact "
                        className={classNames("", {
                          "is-invalid": errors?.recruiter_contact_number,
                        })}
                        {...register("recruiter_contact_number", {
                          // required: "recruiter contact number is required",
                          validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                          pattern: {
                            value: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{4})[-. )]*(\d{4})[-. ]*(\d{2})(?: *x(\d+))?\s*$/,
                            message: "Number must be 10 digit"
                          }
                        })}
                      />
                    </InputGroup>
                    {errors.recruiter_contact_number && (
                      <span className="text-danger">{errors.recruiter_contact_number.message}</span>
                    )}
                  </Form.Group>
                </div>
              </Col>

              {/* Annual Packaget */}
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Start Annual Package</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="start_annual_package"
                        placeholder="Start Annual Package"
                        className={classNames("", {
                          "is-invalid": errors?.skill,
                        })}
                        {...register("start_annual_package", {
                          // required: "start_annual_package is required",
                          validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                          pattern: {
                            value: /[0-9]/,
                            message: "Must be in number"
                          }
                        })}
                      />
                    </InputGroup>
                    {errors.start_annual_package && (
                      <span className="text-danger">{errors.start_annual_package.message}</span>
                    )}
                  </Form.Group>
                </div>
              </Col>
              {/* End Annual Packaget */}
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>End Annual Package</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="end_annual_package"
                        placeholder="End annual package"
                        className={classNames("", {
                          "is-invalid": errors?.skill,
                        })}
                        {...register("end_annual_package", {
                          // required: "Location is required",
                          validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                          pattern: {
                            value: /[0-9]/,
                            message: "Must be in number"
                          }
                        })}
                      />
                    </InputGroup>
                    {errors.end_annual_package && (
                      <span className="text-danger">{errors.end_annual_package.message}</span>
                    )}
                  </Form.Group>
                </div>
              </Col>
              {/* Company Name */}
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Company Name</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="company_name"
                        placeholder="Company name"
                        className={classNames("", {
                          "is-invalid": errors?.company_name,
                        })}
                        {...register("company_name", {
                          // required: "Location is required",
                          validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                        })}
                      />
                    </InputGroup>
                    {errors.company_name && (
                      <span className="text-danger">{errors.company_name.message}</span>
                    )}
                  </Form.Group>
                </div>
              </Col>
              {/* Vacancy*/}
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Vacancy</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="vacancy"
                        placeholder="Vacancy"
                        className={classNames("", {
                          "is-invalid": errors?.vacancy,
                        })}
                        {...register("vacancy", {
                          // required: "Location is required",
                          validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                          pattern: {
                            value: /[0-9]/,
                            message: "Must be in number"
                          }
                        })}
                      />
                    </InputGroup>
                    {errors.vacancy && (
                      <span className="text-danger">{errors.vacancy.message}</span>
                    )}
                  </Form.Group>
                </div>
              </Col>

              {/* Experience*/}
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Experience From</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="experience"
                        placeholder="Experience From"
                        className={classNames("", {
                          "is-invalid": errors?.skill,
                        })}
                        {...register("experience", {
                          // required: "experience is required",
                          validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                          pattern: {
                            value: /[0-9]/,
                            message: "Must be in number"
                          }
                        })}
                      />
                    </InputGroup>
                    {errors.experience && (
                      <span className="text-danger">{errors.experience.message}</span>
                    )}
                  </Form.Group>
                </div>
              </Col>

              {/* Experience to*/}
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Experience to</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        name="experience_to"
                        placeholder="Experience to"
                        className={classNames("", {
                          "is-invalid": errors?.experience_to,
                        })}
                        {...register("experience_to", {
                          // required: "Location is required",
                          validate: (value) =>
                            value.length <= 200 ||
                            "Data must be 200 characters or less",
                          pattern: {
                            value: /[0-9]/,
                            message: "Must be in number"
                          }
                        })}
                      />
                    </InputGroup>
                    {errors.experience_to && (
                      <span className="text-danger">{errors.experience_to.message}</span>
                    )}
                  </Form.Group>
                </div>
              </Col>
              {/* deadline*/}
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Form.Group>
                    <div className="">
                      <Form.Label>Deadline</Form.Label>
                    </div>
                    <InputGroup>
                      <Form.Control
                        type="date"
                        name="deadline"
                        placeholder="Start Date"
                        className={classNames("", {
                          "is-invalid": errors?.deadline,
                        })}
                        min={today}
                        {...register("deadline", {
                          // required: "Start Date is required",
                          // validate: (value) => {
                          //   const startDate = new Date(value);
                          //   const todayDate = new Date(today);
                          //   return (
                          //     todayDate <= startDate ||
                          //     "Start date must be today or in the future"
                          //   );
                          // },
                        })}
                      />
                    </InputGroup>
                    {errors.deadline && (
                      <span className="text-danger">
                        {errors.deadline.message}
                      </span>
                    )}
                  </Form.Group>
                </div>
              </Col>
              {/* Image*/}
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
                          // required: "Image is required",
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
