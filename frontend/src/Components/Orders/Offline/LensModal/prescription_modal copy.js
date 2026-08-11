import React, { useEffect, useRef, useState } from "react";
// import "./want-by-modal.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { FormGroup } from "react-bootstrap";
// import Success_Modal from "../success_modal/Success_Modal";
import { useForm, useWatch } from "react-hook-form";
import classNames from "classnames";
import { getData, postData } from "../../../../utils/api";
import ModalSave from "../../../common/ModelSave";
import { Select2Data } from "../../../../utils/common";
import Error_Modal from "../../../common/success_modal/Error_Modal";

export function useVisionSync(
  control,
  setValue,
  getValues,
  basePath,
  setError,
  setErrormodal,
) {
  const dv = useWatch({ control, name: `${basePath}.1` }) || {};
  const nv = useWatch({ control, name: `${basePath}.2` }) || {};
  const add = useWatch({ control, name: `${basePath}.3` }) || {};

  const lock = useRef(false);
  const prev = useRef({ init: false, dv: {}, nv: {}, add: {} });

  // ✅ Detect AXIS field by id
  const isAxisField = (id) => {
    return String(id).toLowerCase().includes("axis");
  };

  const formatValueNV = (value, axis = false) => {
    if (value === null || value === undefined || value === "") return "";

    // VA like 6/6
    if (typeof value === "string" && value.includes("/")) return value;

    const num = Number(value);
    if (isNaN(num)) return "";

    const sign = num >= 0 ? "+" : "-";
    return `${sign}${Math.abs(num).toFixed(2)}`;
  };

  const formatValue = (value) => {
    console.log(value, "value value");

    if (value === null || value === undefined || value === "") return "";

    if (typeof value === "string") return value;

    // ✅ If already formatted with + or - sign → return as-is
    if (typeof value === "string" && /^[+-]\d+(\.\d+)?$/.test(value.trim())) {
      return value;
    }

    const num = Number(value);
    if (isNaN(num)) return "";

    // ✅ If integer → treat as axis (no + sign, no decimals)
    if (Number.isInteger(num)) {
      return String(num);
    }

    // ✅ Decimal → force + / - with 2 decimals
    const sign = num >= 0 ? "+" : "-";
    return `${sign}${Math.abs(num).toFixed(2)}`;
  };

  useEffect(() => {
    const cur = { dv, nv, add };

    if (!prev.current.init) {
      prev.current = {
        init: true,
        dv: { ...cur.dv },
        nv: { ...cur.nv },
        add: { ...cur.add },
      };
      return;
    }

    if (lock.current) {
      prev.current = {
        init: true,
        dv: { ...dv },
        nv: { ...nv },
        add: { ...add },
      };
      return;
    }

    const keys = new Set([
      ...Object.keys(prev.current.dv),
      ...Object.keys(prev.current.nv),
      ...Object.keys(prev.current.add),
      ...Object.keys(cur.dv),
      ...Object.keys(cur.nv),
      ...Object.keys(cur.add),
    ]);

    let updated = false;
    lock.current = true;

    for (const id of keys) {
      const prevDV = prev.current.dv[id];
      const prevNV = prev.current.nv[id];
      const prevADD = prev.current.add[id];

      const curDV = cur.dv[id];
      const curNV = cur.nv[id];
      const curADD = cur.add[id];

      const dvChanged = prevDV !== curDV;
      const nvChanged = prevNV !== curNV;
      const addChanged = prevADD !== curADD;

      const changes =
        (dvChanged ? 1 : 0) + (nvChanged ? 1 : 0) + (addChanged ? 1 : 0);

      if (changes !== 1) continue;

      const axis = isAxisField(id); // ✅ detect axis once

      /* ---------------- DV → NV + ADD ---------------- */
      if (dvChanged) {
        const desiredNV = curDV;
        const formattedNV = formatValue(desiredNV, axis); // ✅ now adds +0.00 automatically

        if (getValues(`${basePath}.2.${id}`) !== formattedNV) {
          setValue(`${basePath}.2.${id}`, formattedNV);
          updated = true;
        }

        const desiredADD = Number(curDV) - Number(curDV);
        const formattedADD = formatValue(desiredADD, false);

        if (getValues(`${basePath}.3.${id}`) !== formattedADD) {
          setValue(`${basePath}.3.${id}`, formattedADD);
          updated = true;
        }

        continue;
      }

      if (nvChanged) {
        if (typeof curNV === "string" && curNV.includes("/")) continue;

        if (Number(curNV) > Number(curDV)) {
          setError("NV Greater than DV is not allowed");
          setErrormodal(true);
          setValue(`${basePath}.2.${id}`, formatValueNV(0, axis));
          updated = true;
          continue;
        }

        const desiredADD = Number(curDV) - Number(curNV);
        const formattedADD = formatValueNV(desiredADD);

        if (getValues(`${basePath}.3.${id}`) !== formattedADD) {
          setValue(`${basePath}.3.${id}`, formattedADD);
          updated = true;
        }

        continue;
      }

      /* ---------------- ADD → NV ---------------- */
      if (addChanged) {
        const dvNum = Number(curDV) || 0;
        const addNum = Number(curADD) || 0;

        const desiredNV = dvNum + addNum;
        const formattedNV = formatValueNV(desiredNV, axis); // ✅ axis safe

        if (getValues(`${basePath}.2.${id}`) !== formattedNV) {
          setValue(`${basePath}.2.${id}`, formattedNV);
          updated = true;
        }

        continue;
      }
    }

    prev.current = {
      init: true,
      dv: { ...(getValues(`${basePath}.1`) || {}) },
      nv: { ...(getValues(`${basePath}.2`) || {}) },
      add: { ...(getValues(`${basePath}.3`) || {}) },
    };

    lock.current = false;
  }, [dv, nv, add]);
}

const Lense_prescription_modal = ({
  user_id,
  product,
  variant,
  product_id,
  lensId,
  lensOptionId,
  id,
  addOnId,
  lensTypeId,
  lenseId,
  index,
  productId,
  lenseTypeId,
  handleAddLens,
  setPrescription,
  onHide,
  setValueMain,
  ...props
}) => {
  const [appsetup, setappsetup] = useState(false);
  const [errormodal, setErrormodal] = useState(false);

  const GetAllCountry = async () => {
    const response = await getData("/common/masters/app-setup");
    if (response?.success) {
      setappsetup(response?.data);
    }
  };
  const [prescription, setdataPrescription] = useState(false);

  const GetAlPrescription = async (user_id) => {
    const response = await getData(
      `/admin/offline-order/get-prescription/${user_id}`,
    );
    if (response?.success) {
      setdataPrescription(response?.data);
    }
  };
  useEffect(() => {
    GetAllCountry();
  }, []);
  useEffect(() => {
    GetAlPrescription(user_id);
  }, [user_id]);

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
          1: {}, // Distance Vision
          2: {}, // Near Vision
          3: {}, // Addition
          4: {},
        },
        2: {
          // Left eye
          1: {},
          2: {},
          3: {},
          4: {},
        },
      },
    },
  });

  const [error, setError] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = methods;

  const { control } = methods;
  // const [error, setError] = useState(false);
  useVisionSync(
    control,
    setValue,
    getValues,
    "vision.1",
    setError,
    setErrormodal,
  );
  useVisionSync(
    control,
    setValue,
    getValues,
    "vision.2",
    setError,
    setErrormodal,
  );

  const fileInputRef = useRef(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isPdf, setIsPdf] = useState(false);

  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setValue("pdf", file);
    const fileType = file.type;

    if (fileType === "application/pdf") {
      setIsPdf(true);
      const fileURL = URL.createObjectURL(file);
      setFilePreview(fileURL);
    } else if (fileType.startsWith("image/")) {
      setIsPdf(false);
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });

  const onSubmit = async (d) => {
    const formData = new FormData();

    formData.append("prescriptions_type_id", type);
    formData.append("user_id", user_id);
    if (addOnId) {
      formData.append("addon_id", addOnId);
    }
    if (lenseId) {
      formData.append("lense_product_id", lenseId);
    }
    if (lenseTypeId) {
      formData.append("lens_type_id", lenseTypeId);
    }

    formData.append("product_id", productId);
    formData.append("vision", JSON.stringify(d.vision));

    if (d.pdf) {
      formData.append("pdf", d.pdf);
    }

    if (d.b_size) {
      formData.append("b_size", d.b_size);
    }
    if (d.a_size) {
      formData.append("a_size", d.a_size);
    }
    if (d.dbl) {
      formData.append("dbl", d.dbl);
    }
    if (d.fh) {
      formData.append("fh", d.fh);
    }
    const response = await postData(
      `/admin/offline-order/app-prescription`,
      formData,
    );

    if (response?.success) {
      await setValueMain(
        `products.${index}.product_details.prescription_details`,
        response.data,
        {
          shouldValidate: true,
          shouldDirty: true,
        },
      );
      await setShowModal({ code: response.code, message: response.message });
      await setPrescription(true);
      // handleAddLens();
      onHide();
    } else {
      await setShowModal({ code: response?.code, message: response?.errors });
    }
    setTimeout(() => {
      setShowModal(0);
      // props.handleClose();
    }, 1000);
  };

  useEffect(() => {
    if (prescription) {
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
        className="want_modal "
      >
        <Modal.Body>
          <div className="modal_sec">
            <div className="title_div">
              <h4 className="h4title">Lens Prescription</h4>
            </div>

            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
              <Nav variant="pills" className="row-column">
                <Nav.Item>
                  <Nav.Link eventKey="first" onClick={() => setType(1)}>
                    Enter Manually
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second" onClick={() => setType(2)}>
                    Upload Prescription
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="third" onClick={() => setType(3)}>
                    Not sure?
                  </Nav.Link>
                </Nav.Item>
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
                                        // For Add row — only first input visible
                                        if (label.id === 3 && headIndex > 0) {
                                          return (
                                            <div
                                              className="col-lg p-1 col-md col-sm-2 col-2 input_col"
                                              key={`${eye.id}-${label.id}-${head.id}`}
                                            />
                                          );
                                        }
                                        if (label.id === 4 && headIndex > 0) {
                                          return (
                                            <div
                                              className="col-lg p-1 col-md col-sm-2 col-2 input_col"
                                              key={`${eye.id}-${label.id}-${head.id}`}
                                            />
                                          );
                                        }

                                        const fieldName = `vision.${eye.id}.${label.id}.${head.id}`;
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
                                                placeholder={head.name}
                                                style={{
                                                  border: "1px solid",
                                                  borderColor: hasError
                                                    ? "red"
                                                    : "#ced4da",
                                                }}
                                                {...register(fieldName, {
                                                  required: false,
                                                })}
                                                onBlur={(e) => {
                                                  const val =
                                                    e.target.value?.trim();
                                                  if (!val) return;

                                                  const field =
                                                    head.name.toLowerCase();
                                                  const labelName =
                                                    label.name.toLowerCase();

                                                  const isVa =
                                                    field.includes("va");
                                                  const isAxis =
                                                    field.includes("axis");
                                                  const isPd =
                                                    field.includes("pd") ||
                                                    labelName.includes("pd");
                                                  const fieldPath = `vision.${eye.id}.${label.id}.${head.id}`;

                                                  if (isVa) {
                                                    setValue(fieldPath, val, {
                                                      shouldDirty: true,
                                                      shouldValidate: true,
                                                    });
                                                    return;
                                                  }

                                                  const num = Number(val);
                                                  if (isNaN(num)) return;

                                                  if (isAxis || isPd) {
                                                    const formatted = String(
                                                      Math.trunc(num),
                                                    );
                                                    setValue(
                                                      fieldPath,
                                                      formatted,
                                                      {
                                                        shouldDirty: true,
                                                        shouldValidate: true,
                                                      },
                                                    );
                                                    return;
                                                  }

                                                  const sign =
                                                    num >= 0 ? "+" : "-";
                                                  const formatted = `${sign}${Math.abs(num).toFixed(2)}`;

                                                  setValue(
                                                    fieldPath,
                                                    formatted,
                                                    {
                                                      shouldDirty: true,
                                                      shouldValidate: true,
                                                    },
                                                  );
                                                }}
                                             
                                                onKeyDown={(e) => {
                                                  const field =
                                                    head.name.toLowerCase();
                                                  const labelName =
                                                    label.name.toLowerCase();

                                                  const isAxis =
                                                    field.includes("axis");
                                                  const isAdd =
                                                    field.includes("add") ||
                                                    labelName.includes("add");
                                                  const isSph =
                                                    field.includes("sph");
                                                  const isVa =
                                                    field.includes("va");
                                                  const isCyl =
                                                    field.includes("cyl");
                                                  const isPd =
                                                    field.includes("pd") ||
                                                    labelName.includes("pd");
                                                  if (isVa) return;
                                                  const allowedKeys = [
                                                    "Backspace",
                                                    "Tab",
                                                    "ArrowLeft",
                                                    "ArrowRight",
                                                    "Delete",
                                                  ];
                                                  if (
                                                    allowedKeys.includes(e.key)
                                                  )
                                                    return;

                                                  const value =
                                                    e.currentTarget.value;
                                                  const nextValue =
                                                    value + e.key;

                                                  if (isAxis || isPd) {
                                                    if (
                                                      e.key === "+" ||
                                                      e.key === "-"
                                                    ) {
                                                      // setError(
                                                      //   "AXIS cannot contain + or -",
                                                      // );
                                                      // setErrormodal(true);
                                                      e.preventDefault();
                                                      return;
                                                    }

                                                    if (e.key === ".") {
                                                      setError(
                                                        "AXIS cannot contain decimal",
                                                      );
                                                      setErrormodal(true);
                                                      e.preventDefault();
                                                      return;
                                                    }

                                                    if (!/^\d$/.test(e.key)) {
                                                      e.preventDefault();
                                                      return;
                                                    }

                                                    if (nextValue.length > 3) {
                                                      setError(
                                                        "AXIS cannot exceed 3 digits",
                                                      );
                                                      setErrormodal(true);
                                                      e.preventDefault();
                                                      return;
                                                    }

                                                    const num =
                                                      Number(nextValue);
                                                    if (num > 180) {
                                                      setError(
                                                        "AXIS must be between 0 and 180",
                                                      );
                                                      setErrormodal(true);
                                                      e.preventDefault();
                                                      return;
                                                    }

                                                    return;
                                                  }

                                                  /* ---------- VA RULES ---------- */
                                                  if (isVa) {
                                                    if (!/[0-9/]/.test(e.key)) {
                                                      e.preventDefault();
                                                    }
                                                    return;
                                                  }

                                                  if (
                                                    ["+", "-"].includes(
                                                      e.key,
                                                    ) &&
                                                    (value.includes("+") ||
                                                      value.includes("-"))
                                                  ) {
                                                    setError(
                                                      "Only one sign (+ or -) allowed",
                                                    );
                                                    setErrormodal(true);
                                                    e.preventDefault();
                                                    return;
                                                  }

                                                  if (isAdd && e.key === "-") {
                                                    setError(
                                                      "ADD cannot be negative",
                                                    );
                                                    setErrormodal(true);
                                                    e.preventDefault();
                                                    return;
                                                  }

                                                  if (
                                                    (isSph || isCyl) &&
                                                    e.key === "-" &&
                                                    value.length > 0
                                                  ) {
                                                    setError(
                                                      "Sign (-) allowed only at start",
                                                    );
                                                    setErrormodal(true);
                                                    e.preventDefault();
                                                    return;
                                                  }

                                                  if (
                                                    e.key === "." &&
                                                    value.includes(".")
                                                  ) {
                                                    setError(
                                                      "Only one decimal allowed",
                                                    );
                                                    setErrormodal(true);
                                                    e.preventDefault();
                                                    return;
                                                  }

                                                  if (!/[0-9.+-]/.test(e.key)) {
                                                    e.preventDefault();
                                                    return;
                                                  }

                                                  const num = Number(nextValue);
                                                  if (
                                                    !isNaN(num) &&
                                                    (isSph || isCyl || isAdd)
                                                  ) {
                                                    const step = 0.25;

                                                    const steps = Math.abs(
                                                      num / step,
                                                    );
                                                    const decimalPart =
                                                      Math.abs(num) % 1;

                                                    const isStepValid =
                                                      Number.isInteger(steps);
                                                    const oneDecimal =
                                                      decimalPart.toFixed(1);

                                                    const isPoint2 =
                                                      oneDecimal === "0.2";
                                                    const isPoint8 =
                                                      oneDecimal === "0.8";

                                                    if (
                                                      !isStepValid &&
                                                      !isPoint2 &&
                                                      !isPoint8
                                                    ) {
                                                      setError(
                                                        "Allowed: 0.25 steps or .2 or .8 only",
                                                      );
                                                      setErrormodal(true);
                                                      e.preventDefault();
                                                      return;
                                                    }
                                                  }
                                                }}
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
                                      <p className="left_text prescription_left_text no_wrap_text">
                                        A Size
                                      </p>
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
                                          onKeyDown={(e) => {
                                            const allowedKeys = [
                                              "Backspace",
                                              "Delete",
                                              "ArrowLeft",
                                              "ArrowRight",
                                              "Tab",
                                              ".",
                                            ];

                                            if (
                                              !allowedKeys.includes(e.key) &&
                                              !/^\d$/.test(e.key)
                                            ) {
                                              e.preventDefault();
                                            }
                                          }}
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
                                      <p className="left_text prescription_left_text no_wrap_text">
                                        B Size
                                      </p>
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
                                          onKeyDown={(e) => {
                                            const allowedKeys = [
                                              "Backspace",
                                              "Delete",
                                              "ArrowLeft",
                                              "ArrowRight",
                                              "Tab",
                                              ".",
                                            ];

                                            if (
                                              !allowedKeys.includes(e.key) &&
                                              !/^\d$/.test(e.key)
                                            ) {
                                              e.preventDefault();
                                            }
                                          }}
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
                                      <p className="left_text prescription_left_text no_wrap_text">
                                        FH
                                      </p>
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
                                          onKeyDown={(e) => {
                                            const allowedKeys = [
                                              "Backspace",
                                              "Delete",
                                              "ArrowLeft",
                                              "ArrowRight",
                                              "Tab",
                                              ".",
                                            ];

                                            if (
                                              !allowedKeys.includes(e.key) &&
                                              !/^\d$/.test(e.key)
                                            ) {
                                              e.preventDefault();
                                            }
                                          }}
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
                                      <p className="left_text prescription_left_text  no_wrap_text">
                                        DBL
                                      </p>
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
                                          onKeyDown={(e) => {
                                            const allowedKeys = [
                                              "Backspace",
                                              "Delete",
                                              "ArrowLeft",
                                              "ArrowRight",
                                              "Tab",
                                              ".",
                                            ];

                                            if (
                                              !allowedKeys.includes(e.key) &&
                                              !/^\d$/.test(e.key)
                                            ) {
                                              e.preventDefault();
                                            }
                                          }}
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
                  <Tab.Pane eventKey="second">
                    {type === 2 && (
                      <div className="tabdata">
                        <div className="row">
                          <div className="col-lg-6 mx-auto text-center">
                            <div className="uploadphotosec">
                              <div className="box" onClick={handleBoxClick}>
                                {filePreview ? (
                                  isPdf ? (
                                    <iframe
                                      src={filePreview}
                                      title="PDF Preview"
                                      style={{
                                        width: "100%",
                                        height: "100px",
                                        border: "none",
                                      }}
                                    />
                                  ) : (
                                    <img
                                      className="uploaded-file"
                                      src={filePreview}
                                      alt="Preview"
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                      }}
                                    />
                                  )
                                ) : (
                                  <img
                                    className="addicon"
                                    src={
                                      process.env.PUBLIC_URL +
                                      "/assets/images/icons/doc-add.png"
                                    }
                                    alt="Upload"
                                  />
                                )}
                              </div>

                              {/* Hidden file input */}
                              <input
                                type="file"
                                accept="image/*,application/pdf"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                              />

                              {/* RHF hidden input */}
                              <input
                                type="hidden"
                                {...register("pdf", {
                                  required: true,
                                })}
                              />

                              <p className="uploadpp">
                                Upload a photo or PDF of your prescription.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Tab.Pane>

                  <Tab.Pane eventKey="third">
                    <div className="tabdata">
                      <div className="row">
                        <div className="col-lg-7 mx-auto">
                          <div className="socialinfobox">
                            <div className="row mb-2">
                              <div className="col-4 my-auto">
                                <p className="caltxt">DM Us</p>
                              </div>
                              <div className="col-8  my-auto text-end">
                                <img
                                  className="whatsappicon"
                                  src={
                                    process.env.PUBLIC_URL +
                                    "/assets/images/icons/whatsapp.png"
                                  }
                                  alt="whatsapp-icon"
                                />
                              </div>
                            </div>
                            <div className="row mb-2">
                              <div className="col-4 my-auto">
                                <p className="caltxt">Call Us</p>
                              </div>
                              <div className="col-8 my-auto text-end">
                                <p className="linkp">
                                  +91 {appsetup?.contact_no}
                                </p>
                              </div>
                            </div>
                            <div className="row mb-2">
                              <div className="col-4 my-auto">
                                <p className="caltxt">Mails Us</p>
                              </div>
                              <div className="col-8 my-auto text-end">
                                <p className="linkp">{appsetup?.email}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
                onClick={handleSubmit(onSubmit)}
              >
                Continue
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

      <ModalSave
        message={showModal.message}
        showErrorModal={showModal.code ? true : false}
      />

      <Error_Modal
        // link={"/cart"}
        show={errormodal}
        onHide={() => setErrormodal(false)}
        successText={error}
      />
    </>
  );
};

export default Lense_prescription_modal;
