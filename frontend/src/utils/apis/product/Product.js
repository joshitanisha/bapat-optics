import {
  getData,
  postData,
  putData,
  editStatusData,
  deleteData,
  getDownloadDataExcel,
} from "../../api";
import { formatDate } from "../../common";

export const getAllProducts = async (
  page = 1,
  title = "",
  status = "",
  category_id = "",
  startDate = "",
  endDate = ""
) => {
  try {
    if (status !== "" && category_id !== "") {
      return await getData(
        `/seller/seller-product/all-products?page=${page}&product_title=${title}&product_status=${status}&category_id=${category_id}`
      );
    }
    if (status === "" && category_id !== "") {
      return await getData(
        `/seller/seller-product/all-products?page=${page}&product_title=${title}&category_id=${category_id}`
      );
    }
    if (status !== "") {
      return await getData(
        `/seller/seller-product/all-products?page=${page}&product_title=${title}&product_status=${status}`
      );
    }
    if (startDate !== "" && endDate !== "") {
      return await getData(
        `/seller/seller-product/all-products?page=${page}&product_title=${title}&from=${formatDate(
          startDate
        )}&to=${formatDate(endDate)}`
      );
    }

    return await getData(
      `/seller/seller-product/all-products?page=${page}&product_title=${title}`
    );
  } catch (error) {
    console.log(error);
  }
};

export const SelectedVariantPost = async (data) => {
  try {
    const res = await postData(`/product/selected-variant`, data);

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const SelectedVariantGet = async (id) => {
  try {
    const res = await getData(`/product/selected-variant/${id}`);

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const SelectedAttributeDelete = async (type, id) => {
  try {
    const res = await deleteData(`/product/selected-variant/${id}/${type}`);

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const VariantIdDataGet = async (type, id) => {
  try {
    const res = await getData(`/product/add-details/${id}/${type}`);

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const VariantIdDataPost = async (data) => {
  try {
    const res = await postData(`/product/add-details`, data);

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const RemoveAll = async (type, id) => {
  try {
    const res = await deleteData(`/product/remove-all/${id}/${type}`);

    return res;
  } catch (error) {
    console.log(error);
  }
};

// export const formatDate = (date) => {
//   if (!date) return null;
//   const day = date.getDate().toString().padStart(2, "0");
//   const month = (date.getMonth() + 1).toString().padStart(2, "0");
//   const year = date.getFullYear();
//   return `${year}-${month}-${day}`;
// };

// export const productStatusChange = async (id) => {
//   try {
//     const res = await putData(`/seller/seller-product/all-products/${id}`);

//     return res;
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const ProductDelete = async (id) => {
//   try {
//     const res = await deleteData(`/seller/seller-product/all-products/${id}`);

//     return res;
//   } catch (error) {
//     console.log(error);
//   }
// };
