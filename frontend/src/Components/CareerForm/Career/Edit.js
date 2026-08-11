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
import { Controller, useForm } from "react-hook-form";
import classNames from "classnames";
import { putData } from "../../../utils/api";
import JoditEditor from "jodit-react";
import Select from "react-select";
import { formatDate } from "../../../utils/common";


library.add(fas);

const EditOffCanvance = (props) => {
  const id = props.show;
  const { postData, getData, Select2Data, IMG_URL } = useContext(Context);
  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const GetEditData = async () => {
    const response = await getData(`/admin/career/career-form/${id}`);

    console.log(response?.data, 'response?.data');

    reset(response?.data);
    setValue("deadline", formatDate(response?.data?.deadline))
  };
  useEffect(() => {
    GetEditData();
  }, []);

  const {
    control,
    trigger,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    watch,
  } = useForm();

  const [jobtype, setJobType] = useState();
  const [shifttype, setShiftType] = useState();
  const [qualification, setQualification] = useState()
  const [language, setLanguage] = useState()

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

  const imageFile = watch("image");

  const onSubmit = async (data) => {
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
      finalData.append("experience_from", data?.experience_from);
      finalData.append("experience_to", data?.experience_to);
      finalData.append("deadline", data?.deadline);
      if (data?.qualification_id) {
        finalData.append(
          "qualification_id",
          JSON.stringify(data?.qualification_id?.map((option) => option.value))
        );
      }
      if (data?.language_id) {
        finalData.append(
          "language_id",
          JSON.stringify(data?.language_id?.map((option) => option.value))
        );
      }
      const response = await putData(`/admin/career/career-form/${id}`, finalData);

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
  const [today, setToday] = useState("");

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
                          // validate: (value) =>
                          //   value.length <= 200 ||
                          //   "Data must be 200 characters or less",
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
                          required: "Skill is required",
                          // validate: (value) =>
                          //   value.length <= 200 ||
                          //   "Data must be 200 characters or less",
                        })}
                      />
                    </InputGroup>
                    {errors?.skill && (
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
                          required: "Location is required",
                          // validate: (value) =>
                          //   value.length <= 200 ||
                          //   "Data must be 200 characters or less",
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
                          required: "Hr name is required",
                          // validate: (value) =>
                          //   value.length <= 200 ||
                          //   "Data must be 200 characters or less",
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
                <div className="main-form-section mt-3">
                  <Row className="justify-content-center">
                    <Form.Label>Languages</Form.Label>
                    <Controller
                      className="select-contoller "
                      name={`language_id`} // name of the field
                      control={control}
                      rules={{
                        required: "Please select at least one language",
                      }}
                      render={({
                        field: { onChange, onBlur, value, ref },
                      }) => (
                        <Select
                          isMulti
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              borderColor: errors?.language_id
                                ? "red"
                                : baseStyles.borderColor,
                            }),
                          }}
                          // {...field}
                          options={language}
                          onChange={(selectedValue) => {
                            onChange(selectedValue);
                          }}
                          onBlur={onBlur}
                          value={value}
                          ref={ref}
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
              <Col md={6}>
                <div className="main-form-section mt-3">
                  <Row className="justify-content-center">
                    <Form.Label>Qualification</Form.Label>
                    <Controller
                      className="select-contoller "
                      name={`qualification_id`} // name of the field
                      control={control}
                      rules={{
                        required: "Please select at least one Qualification",
                      }}
                      render={({
                        field: { onChange, onBlur, value, ref },
                      }) => (
                        <Select
                          isMulti
                          styles={{
                            control: (baseStyles) => ({
                              ...baseStyles,
                              borderColor: errors?.qualification_id
                                ? "red"
                                : baseStyles.borderColor,
                            }),
                          }}
                          // {...field}
                          options={qualification}
                          onChange={(selectedValue) => {
                            onChange(selectedValue);
                          }}
                          onBlur={onBlur}
                          value={value}
                          ref={ref}
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
                        required: "Please Select Job Type",
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
                        required: "Please Select Shift Type",
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
                        {...register("recruiter_email", {
                          required: "Email is required",
                          // validate: (value) =>
                          //   value.length <= 200 ||
                          //   "Data must be 200 characters or less",
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
                          required: "recruiter contact number is required",
                          // validate: (value) =>
                          //   value.length <= 200 ||
                          //   "Data must be 200 characters or less",
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
                          required: "start_annual_package is required",
                          // validate: (value) =>
                          //   value.length <= 200 ||
                          //   "Data must be 200 characters or less",
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
                          required: "End annual package is required",
                          // validate: (value) =>
                          //   value.length <= 200 ||
                          //   "Data must be 200 characters or less",
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
                          required: "Company name is required",
                          // validate: (value) =>
                          //   value.length <= 200 ||
                          //   "Data must be 200 characters or less",
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
                          required: "vacancy is required",
                          // validate: (value) =>
                          //   value.length <= 200 ||
                          //   "Data must be 200 characters or less",
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
                        name="experience_from"
                        placeholder="Experience From"
                        className={classNames("", {
                          "is-invalid": errors?.skill,
                        })}
                        {...register("experience_from", {
                          required: "experience is required",
                          // validate: (value) =>
                          //   value.length <= 200 ||
                          //   "Data must be 200 characters or less",
                          pattern: {
                            value: /[0-9]/,
                            message: "Must be in number"
                          }
                        })}
                      />
                    </InputGroup>
                    {errors.experience_from && (
                      <span className="text-danger">{errors.experience_from.message}</span>
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
                          required: "Experience to is required",
                          // validate: (value) =>
                          //   value.length <= 200 ||
                          //   "Data must be 200 characters or less",
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
