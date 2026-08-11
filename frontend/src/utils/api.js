import axiosClient from "./ApiInstance";
import Cookies from "js-cookie";
import { ImageValidation } from "./common";

export const getData = async (url, data) => {
  try {
    const response = await axiosClient.get(
      process.env.REACT_APP_BASE_URL + url,
      data
    );
    return response.data;
  } catch (error) {
    // Cookies.remove("bapat_optics_admin_security", { path: "/" });
    // window.location.href = "/";
    console.log(error);
    return error?.response?.data;
  }
};

export const postData = async (url, data,config = {}) => {
  try {
    const response = await axiosClient.post(
      process.env.REACT_APP_BASE_URL + url,
      data,
      config
    );

    return response.data;
  } catch (error) {
    //  Cookies.remove("bapat_optics_admin_security", { path: "/" });
    // window.location.href = "/";
    console.log(error);
    return error?.response?.data;
  }
};

export const postDataPDF = async (url, data, config = {}) => {
  try {
    const response = await axiosClient.post(
      process.env.REACT_APP_BASE_URL + url,
      data,
      config
    );

    return response;   // 👈 return full response
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const putData = async (url, data) => {
  try {
    const response = await axiosClient.put(
      process.env.REACT_APP_BASE_URL + url,
      data
    );

    return response.data;
  } catch (error) {
    // Cookies.remove("net_purti_security", { path: "/" });
    // window.location.href = "/";
    console.log(error);
    return error?.response?.data;
  }
};

export const editStatusData = async (url) => {
  try {
    const response = await axiosClient.post(
      process.env.REACT_APP_BASE_URL + url
    );

    return response.data;
  } catch (error) {
    // Cookies.remove("bapat_optics_admin_security", { path: "/" });
    // window.location.href = "/";
    console.log(error);
    return error?.response?.data;
  }
};

export const deleteData = async (url) => {
  try {
    const response = await axiosClient.delete(
      process.env.REACT_APP_BASE_URL + url
    );

    return response.data;
  } catch (error) {
    // Cookies.remove("bapat_optics_admin_security", { path: "/" });
    // window.location.href = "/";
    console.log(error);
    return error?.response?.data;
  }
};

// Download Apis
export const getDownloadDataExcel = async (aurl, data, name) => {
  try {
    const response = await axiosClient.post(
      process.env.REACT_APP_BASE_URL + aurl,
      data,
      {
        responseType: "blob", // Set responseType to "blob"
      }
    );

    console.log("response", response);

    const url = window.URL.createObjectURL(new Blob([response.data]));
    // Create a temporary anchor element to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${name + " " + new Date().toLocaleDateString()}.xlsx`
    );
    document.body.appendChild(link);
    link.click();

    // Clean up after the download
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.log(error);
    return error?.response?.data;
  }
};

export const Select2Data = async (data, name, other = false) => {
  const result = data.map((data) => ({
    value: data?.id,
    label: data?.name,
    name: name,
  }));

  if (other) {
    result.push({ value: "0", label: "Other", name: name });
  }
  return result;
};

export const getDimension = async (file, w, h) => {
  let reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onerror = () => {
      reader.abort();
      reject(new DOMException("Problem parsing input file."));
    };

    reader.onload = () => {
      var image = new Image();
      image.src = reader.result;
      image.onload = function () {
        resolve({ width: this.width, height: this.height });
      };
    };
    reader.readAsDataURL(file);
  });
};

export const ValidationImage = async (value, w, h) => {
  if (typeof value !== "string") {
    const fileTypes = ImageValidation?.files_type;
    const fileType = value[0]?.name?.split(".")[1];

    if (!fileTypes.includes(fileType)) {
      return `please upload a valid file format. (${fileTypes})`;
    }

    const sizes = await getDimension(value[0]);
    if (sizes.width !== w && sizes.height !== h) {
      return `Image width and height must be ${w} px and ${h} px`;
    }
  }
};



