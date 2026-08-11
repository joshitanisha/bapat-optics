import {
  getData,
  postData,
  putData,
  editStatusData,
  deleteData,
  getDownloadDataExcel,
} from "../../api";
import { SelectImageData } from "../../common";

export const Attributes = async () => {
  try {
    return await getData(`/all-attribute`);
  } catch (error) {
    console.log(error);
  }
};

export const SubAttributes = async (id) => {
  try {
    return await getData(`/all-sub-attribute/${id}`);
  } catch (error) {
    console.log(error);
  }
};

export const Country = async () => {
  try {
    return await getData(`/allcountry`);
  } catch (error) {
    console.log(error);
  }
};

export const State = async (id) => {
  try {
    return await getData(`/allstates/${id}`);
  } catch (error) {
    console.log(error);
  }
};

export const City = async (id) => {
  try {
    return await getData(`/allcity/${id}`);
  } catch (error) {
    console.log(error);
  }
};

export const PincodeByCity = async (id) => {
  try {
    return await getData(`/allpincode/${id}`);
  } catch (error) {
    console.log(error);
  }
};

export const Pincode = async (search = "") => {
  try {
    return await getData(`/allpincodes?search=${search}`);
  } catch (error) {
    console.log(error);
  }
};

// export const Area = async (search = "") => {
//   try {
//     return await getData(`/allareas?search=${search}`);
//   } catch (error) {
//     console.log(error);
//   }
// };

export const CountryCode = async () => {
  try {
    return await getData(`/allcountrycode`);
  } catch (error) {
    console.log(error);
  }
};

export const Category = async () => {
  try {
    return await getData(`/allcategories`);
  } catch (error) {
    console.log(error);
  }
};

export const SubCategory = async (id) => {
  try {
    return await getData(`/allsubcategories/${id}`);
  } catch (error) {
    console.log(error);
  }
};

export const ChildCategory = async (id) => {
  try {
    return await getData(`/allchildcategories/${id}`);
  } catch (error) {
    console.log(error);
  }
};

export const ChildSubCategory = async (id) => {
  try {
    return await getData(`/allchildsubcategories/${id}`);
  } catch (error) {
    console.log(error);
  }
};

export const GalleryImages = async () => {
  try {
    const response = await getData("/common/masters/all-gallery-images");

    // Check if response and response.data exist
    if (response && response.data) {
      return await SelectImageData(response.data, "image");
    } else {
      console.error("No gallery images data found:", response);
    }
  } catch (error) {
    console.error("Error fetching gallery images:", error);
  }
};
