import {
  getData,
  postData,
  putData,
  editStatusData,
  deleteData,
  getDownloadDataExcel,
} from "../../api";

export const GetOrderDetails = async (id) => {
  try {
    const res = await getData(`/order/order-details/${id}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};
