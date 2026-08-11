import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMobileAlt,
  faUser,
  faEnvelope,
  faBirthdayCake,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./User.css";
import { Context } from "../../../../utils/context";
import { useLocation } from "react-router-dom";
import { set, useForm } from "react-hook-form";
import { getData, postData } from "../../../../utils/api";

function User({ setUserId, user_id }) {
  const [checkUser, setCheckUser] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
    getValues,
    setValue,
    reset,
  } = useForm();

  const calculateAge = (dob) => {
    if (!dob) return "";

    const birthDate = new Date(dob);
    const today = new Date();

    // Guard: future DOB
    if (birthDate > today) return 0;

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    console.log(age, "fffffffffffffff age age");

    return age;
  };

  const onSubmit = async (data) => {
    const res = await postData("/admin/offline-order/registerUser", data);

    if (res.success) {
      alert("User registered successfully");
      await setValue("user_id", res?.data?.id);
      await setUserId(res?.data?.id);

      setValue(
        "age",
        res?.data?.date_of_birth ? calculateAge(res.data.date_of_birth) : "",
        {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        }
      );
      console.log(res.data);
console.log("Full User Data:", res.data);
console.log("DOB:", res.data.date_of_birth);
console.log("Age:", calculateAge(res.data.date_of_birth));
      setValue(
        "age",
        res?.data?.date_of_birth ? calculateAge(res.data.date_of_birth) : "",
        {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        }
      );
      getUserDetails();

      setCheckUser(true);
    } else {
      if (res?.errors) {
        Object.keys(res?.errors).forEach((key) => {
          setError(key, { type: "manual", message: res?.errors[key] });
        });
      }
    }
  };

  const getUserDetails = async () => {
    const contact_no = watch("contact_no");
    if (contact_no && contact_no.length === 10) {
      const res = await getData(
        `/admin/offline-order/getUser?contact_no=${contact_no}`
      );

      if (res.success) {
        clearErrors("contact_no");
        await setCheckUser(true);
        if (res?.data) {
          await setValue("user_id", res?.data?.id);
          await setUserId(res?.data?.id);
          await setValue("name", res?.data?.name);
          await setValue("email", res?.data?.email);
          await setValue("date_of_birth", res?.data?.date_of_birth);

          console.log(res?.data?.date_of_birth, " res?.data?.date_of_birth");

       await setValue(
  "date_of_birth",
  res?.data?.date_of_birth
    ? res.data.date_of_birth.split("T")[0]
    : ""
);
setValue(

  "age",

  res?.data?.date_of_birth

    ? calculateAge(res.data.date_of_birth)

    : ""

);
        } else {
          await setUserId(null);
          await setValue("user_id", "");
          await setValue("name", "");
          await setValue("email", "");
          await setValue("age", "");
        }
      } else {
        await setCheckUser(true);
        setError("contact_no", { type: "manual", message: "User Not Found" });
      }
    } else {
      setError("contact_no", {
        type: "manual",
        message: "Enter valid 10-digit mobile number",
      });
    }
  };

  useEffect(() => {
    setCheckUser(false);
    setValue("user_id", "");
    setUserId(null);
    setValue("name", "");
    setValue("email", "");
    setValue("age", "");
    setValue("date_of_birth", "");
  }, [watch("contact_no")]);

  return (
    <>
      <section className="user-container">
        <h3 className="user-title">Bapat Optics</h3>

        <Form onSubmit={handleSubmit(onSubmit)}>
     <Row className="gx-2 gy-2 align-items-center">
  {/* Mobile */}
<Col lg={3} md={3} className="mb-2">
    <Form.Group className="user-input-group">
      <div className="input-icon">
        <FontAwesomeIcon icon={faMobileAlt} className="icon" />

        <Form.Control
          type="tel"
          placeholder="Mobile"
          maxLength={10}
          className="user-input small-input"
          {...register("contact_no", {
            required: "Mobile number is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Enter valid 10-digit mobile number",
            },
          })}
         onKeyDown={(e) => {
  const allowedKeys = [
    "Backspace",
    "Delete",
    "ArrowLeft",
    "ArrowRight",
    "Tab",
    "Enter",
  ];

  if (e.key === "Enter") {
    e.preventDefault();

    if (watch("contact_no")?.length === 10) {
      getUserDetails();
    }

    return;
  }

  if (
    !(
      (e.key >= "0" && e.key <= "9") ||
      allowedKeys.includes(e.key)
    )
  ) {
    e.preventDefault();
  }
}}
          onPaste={(e) => {
            const pastedData = e.clipboardData.getData("text");
            if (!/^\d+$/.test(pastedData)) {
              e.preventDefault();
            }
          }}
        />
      </div>

      {errors.contact_no && (
        <p className="text-danger">{errors.contact_no.message}</p>
      )}
    </Form.Group>
  </Col>

  {/* Full Name */}
 <Col lg={3} md={3} className="mb-2">
    <Form.Group className="user-input-group">
      <div className="input-icon">
        <FontAwesomeIcon icon={faUser} className="icon" />

        <Form.Control
          type="text"
          placeholder="Full Name"
          className="user-input"
          {...register("name", {
            required: "Full name is required",
          })}
        />
      </div>

      {errors.name && (
        <p className="text-danger">{errors.name.message}</p>
      )}
    </Form.Group>
  </Col>

  {/* Email */}
<Col lg={3} md={3} className="mb-2">
    <Form.Group className="user-input-group">
      <div className="input-icon">
        <FontAwesomeIcon icon={faEnvelope} className="icon" />

        <Form.Control
          type="email"
          placeholder="Email Address"
          className="user-input"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email address",
            },
          })}
        />
      </div>

      {errors.email && (
        <p className="text-danger">{errors.email.message}</p>
      )}
    </Form.Group>
  </Col>

  {/* Age / DOB */}
<Col lg={2} md={2} className="mb-2">

    {checkUser && !watch("user_id") ? (

      <Form.Group className="user-input-group">
        <div className="input-icon">
          <FontAwesomeIcon icon={faBirthdayCake} className="icon" />

          <Form.Control
            type="date"
            className="user-input"
            max={new Date().toISOString().split("T")[0]}
            {...register("date_of_birth", {
              required: "Date of Birth is required",
              validate: (value) => {
                const today = new Date();
                const dob = new Date(value);

                if (dob >= today) {
                  return "Date of Birth must be in the past";
                }

                return true;
              },
            })}
          />
        </div>

        {errors.date_of_birth && (
          <p className="text-danger">
            {errors.date_of_birth.message}
          </p>
        )}
      </Form.Group>

    ) : (

      <Form.Group className="user-input-group">
        <div className="input-icon">
          <FontAwesomeIcon icon={faBirthdayCake} className="icon" />

          <Form.Control
            type="number"
            placeholder="Age"
            className="user-input"
            {...register("age", {
              required: "Age is required",
              min: {
                value: 1,
                message: "Age must be greater than 0",
              },
              max: {
                value: 120,
                message: "Age must be less than 120",
              },
            })}
          />
        </div>

        {errors.age && (
          <p className="text-danger">{errors.age.message}</p>
        )}
      </Form.Group>

    )}

  </Col>
</Row>
        </Form>
      </section>
    </>
  );
}

export default User;
