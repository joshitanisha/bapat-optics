import { useEffect, useRef } from "react";
import { useWatch } from "react-hook-form";

export const formatVisionValue = (value, type) => {
  if (!value) return "";

  if (type === "VA") return value;

  const num = Number(value);
  if (isNaN(num)) return "";

  if (type === "AXIS" || type === "PD") {
    return String(Math.trunc(num));
  }

  const sign = num >= 0 ? "+" : "-";
  return `${sign}${Math.abs(num).toFixed(2)}`;
};

export const validateVisionKeyDown = (e, type, setError, setErrormodal) => {
  const allowedKeys = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];

  if (allowedKeys.includes(e.key)) return;

  const value = e.currentTarget.value;
  const nextValue = value + e.key;

  /* ---------- VA ---------- */
  if (type === "VA") {
    if (!/[0-9/]/.test(e.key)) e.preventDefault();
    return;
  }

  /* ---------- AXIS / PD ---------- */
  if (type === "AXIS" || type === "PD") {
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
      return;
    }

    if (nextValue.length > 3) {
      setError("Cannot exceed 3 digits");
      setErrormodal(true);
      e.preventDefault();
      return;
    }

    if (Number(nextValue) > 180) {
      setError("Must be between 0–180");
      setErrormodal(true);
      e.preventDefault();
    }

    return;
  }

  /* ---------- ADD ---------- */
  if (type === "ADD" && e.key === "-") {
    setError("ADD cannot be negative");
    setErrormodal(true);
    e.preventDefault();
    return;
  }

  /* ---------- SIGN RULE ---------- */
  if (
    ["+", "-"].includes(e.key) &&
    (value.includes("+") || value.includes("-"))
  ) {
    setError("Only one sign allowed");
    setErrormodal(true);
    e.preventDefault();
    return;
  }

  /* ---------- DECIMAL RULE ---------- */
  if (e.key === "." && value.includes(".")) {
    setError("Only one decimal allowed");
    setErrormodal(true);
    e.preventDefault();
    return;
  }

  if (!/[0-9.+-]/.test(e.key)) {
    e.preventDefault();
    return;
  }

  /* ---------- 0.25 STEP VALIDATION ---------- */
  const num = Number(nextValue);
  if (!isNaN(num)) {
    const step = 0.25;
    const steps = Math.abs(num / step);

    const decimal = Math.abs(num) % 1;
    const oneDecimal = decimal.toFixed(1);

    if (
      !Number.isInteger(steps) &&
      oneDecimal !== "0.2" &&
      oneDecimal !== "0.8"
    ) {
      setError("Allowed: 0.25 steps or .2 or .8");
      setErrormodal(true);
      e.preventDefault();
    }
  }
};

// detect field type
export const getFieldType = (headName, labelName) => {
  const field = headName?.toLowerCase() || "";
  const label = labelName?.toLowerCase() || "";
  return {
    isAxis: field.includes("axis"),
    isAdd: label.includes("add") || field.includes("add"),
    isSph: field.includes("sph"),
    isCyl: field.includes("cyl"),
    isVa: field.includes("va"),
    isPd: field.includes("pd") || label.includes("pd"),
    isNV: field.includes("nv") || label.includes("nv"),
    isDV: field.includes("dv") || label.includes("dv"),
  };
};

// validate + format value
export const validateVisionValue = (
  value,
  type,
  setError,
  setErrormodal,
  setValue,
) => {
  if (!value) return null;

  // VA like 6/6
  if (type.isVa) return value;

  const num = Number(value);
  if (isNaN(num)) return null;

  /* ---------- AXIS / PD ---------- */
  if (type.isAxis || type.isPd) {
    if (num < 0 || num > 180) {
      setError("AXIS must be between 0 and 180");
      setErrormodal(true);
      return null;
    }
    return String(Math.trunc(num)); // integer only
  }

  /* ---------- ADD ---------- */
  if (type.isAdd && num < 0) {
    setError("ADD cannot be negative");
    setErrormodal(true);
    return null;
  }

  // if (type.isNV ) {
  //   setValue();
  // }

  /* ---------- STEP VALIDATION ---------- */
  // if (type.isSph || type.isCyl || type.isAdd) {
  //   const step = 0.25;
  //   const steps = Math.abs(num / step);
  //   const decimalPart = Math.abs(num) % 1;

  //   if (
  //     !Number.isInteger(steps) &&
  //     decimalPart.toFixed(1) !== "0.2" &&
  //     decimalPart.toFixed(1) !== "0.8"
  //   ) {
  //     setError("Allowed: 0.25 steps or .2 or .8 only");
  //     setErrormodal(true);
  //     return null;
  //   }
  // }

  /* ---------- SPH / CYL / ADD FORMAT ---------- */
  const sign = num >= 0 ? "+" : "-";
  return `${sign}${Math.abs(num).toFixed(2)}`;
};

// export function useVisionSync(
//   control,
//   setValue,
//   getValues,
//   basePath,
//   setError,
//   setErrormodal,
// ) {
//   // DV = 1, NV = 2, ADD = 3
//   const dv = useWatch({ control, name: `${basePath}.1` }) || {};
//   const nv = useWatch({ control, name: `${basePath}.2` }) || {};
//   const add = useWatch({ control, name: `${basePath}.3` }) || {};

//   const lock = useRef(false);
//   const prev = useRef({ init: false, dv: {}, nv: {}, add: {} });

//   const formatValue = (value) => {
//     if (value === "" || value === null || value === undefined) return "";

//     const num = Number(value);
//     if (isNaN(num)) return "";

//     if (Number.isInteger(num)) return String(num);

//     const sign = num >= 0 ? "+" : "-";
//     return `${sign}${Math.abs(num).toFixed(2)}`;
//   };

//   useEffect(() => {
//     if (!prev.current.init) {
//       prev.current = { init: true, dv, nv, add };
//       return;
//     }

//     if (lock.current) return;
//     lock.current = true;

//     const keys = new Set([
//       ...Object.keys(dv),
//       ...Object.keys(nv),
//       ...Object.keys(add),
//     ]);

//     for (const id of keys) {
//       const prevDV = prev.current.dv[id];
//       const prevNV = prev.current.nv[id];
//       const prevADD = prev.current.add[id];

//       const curDV = dv[id];
//       const curNV = nv[id];
//       const curADD = add[id];

//       const dvChanged = prevDV !== curDV;
//       const nvChanged = prevNV !== curNV;
//       const addChanged = prevADD !== curADD;

//       const dvNum = Number(curDV) || 0;
//       const nvNum = Number(curNV) || 0;
//       const addNum = Number(curADD) || 0;

//       console.log(dvChanged, "dvChanged dvChanged dvChanged");

//       /* ---------- DV → NV + ADD RESET ---------- */
//       if (dvChanged) {
//         const formattedDV = formatValue(dvNum);

//         setValue(`${basePath}.2.${id}`, formattedDV); // NV = DV
//         setValue(`${basePath}.3.${id}`, formatValue(0)); // ADD = 0
//         continue;
//       }

//       /* ---------- NV → CALCULATE ADD ---------- */
//       if (nvChanged) {
//         if (nvNum > dvNum) {
//           setError("NV cannot be greater than DV");
//           setErrormodal(true);
//           setValue(`${basePath}.2.${id}`, formatValue(dvNum));
//           continue;
//         }

//         const calculatedADD = dvNum - nvNum;
//         setValue(`${basePath}.3.${id}`, formatValue(calculatedADD));
//         continue;
//       }

//       /* ---------- ADD → CALCULATE NV ---------- */
//       if (addChanged) {
//         const calculatedNV = dvNum + addNum;
//         setValue(`${basePath}.2.${id}`, formatValue(calculatedNV));
//       }
//     }

//     prev.current = { init: true, dv, nv, add };
//     lock.current = false;
//   }, [dv, nv, add]);
// }
