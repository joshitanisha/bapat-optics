import { useState } from "react";
import { useContext } from "react";
import { Context } from "../utils/context";
export const Per_Page_Dropdown = async (data) => {
  const a = [];
  for (let i = 5; i <= data; i *= 2) {
    a.push(i);
  }
  a.push(data);
  // console.log(a);

  return a;
};

export const cuppon_type = {
  percentage: "percentage",
  fixedamount: "fixedamount",
};

export const product_coupon = {
  Percentage: "Percentage",
  FixedAmount: "Fixed Amount",
};

export const product_type = {
  B2B: "Bulk Order",
  B2C: "Home Page",
  SampleRoll: "Sample Roll",
};

export const ImageValidation = {
  files_type: ["jpg", "png", "jpeg"],
  product: { w: 578, h: 762 },
};

export const RequiredIs = {
  roles: [1],
  service_term: [1, 2, 3, 4],
  service_type: [1, 2, 3],
  product_type: [1, 2, 3, 4],
};

export const Select2Data = async (data, name, other = false) => {
  const result = data?.map((data) => ({
    value: data?.id,
    label: data?.name,
    name: name,
  }));

  if (other) {
    result.push({ value: "0", label: "Other", name: name });
  }
  return result;
};

export const Select2DataColor = async (data, name, other = false) => {
  const result = data?.map((data) => ({
    value: data?.id,
    label: data?.name,
    code: data?.first_color,
    name: name,
  }));

  if (other) {
    result.push({ value: "0", label: "Other", name: name });
  }
  return result;
};

export const SelectImageData = async (data, name) => {
  const result = data.map((data) => ({
    value: data?.id,
    label: data?.name,
    name: name,
    image: data?.image,
  }));

  return result;
};

export const getDimension = async (file) => {
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

export function formatDate(dateString) {
  if (!dateString) return ""; // handle null/undefined/empty string

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return ""; // Invalid date, return empty string or handle as needed
  }

  return date.toISOString().split("T")[0];
}

export const ProductNarrationChange = (e) => {
  const { value } = e.target;
  const capitalizedValue = value
    .split(" ")
    .map((word) => word.trim())
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return capitalizedValue;
};

export const ProductNarrationChangeComa = (e) => {
  const { value } = e.target;
  const capitalizedValue = value
    .split(",")
    .map((word) => word.trim())
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(",");
  return capitalizedValue;
};

// export const formatDateTime = (dateString) => {
//   if (!dateString) return "";

//   const date = new Date(dateString);

//   const options = {
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   };

//   return date.toLocaleString("en-GB", options).replace(",", "");
// };

export const validateImage = async (file, size = 500) => {
  if (!file) {
    return false;
  }

  return true;
  // if (!file) return "Image is required";

  // Check file size (500KB = 500 * 1024 bytes)
  const maxSizeInBytes = size * 1024;
  if (file.size > maxSizeInBytes) {
    return false;
    // return "Image size must be less than or equal to 500KB";
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const aspectRatio = img.width / img.height;

      if (aspectRatio.toFixed(1) == 0.5) {
        resolve(true);
      } else {
        resolve(false);
        // resolve("Image aspect ratio must be 1:2 (width:height)");
      }
    };
    img.onerror = () => {
      resolve(false);
      // resolve("Invalid image file");
    };
  });
};

export const validateVideo = async (file, size = 5, duration = 40) => {
  return new Promise((resolve) => {
    if (!file) {
      resolve(false);
      return;
    }

    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const v_duration = video.duration;
      const v_size = file.size / (1024 * 1024); // size in MB

      if (v_duration > duration) {
        resolve(false);
      } else if (v_size > size) {
        resolve(false);
      } else {
        resolve(true);
      }
    };

    video.src = URL.createObjectURL(file);
  });
};

export const formatDateToIST = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    // hour: "2-digit",
    // minute: "2-digit",
    // second: "2-digit",
    // hour12: true, // Optional: use 12-hour format with AM/PM
  });
};
export const formatDateToISTTime = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // Optional: use 12-hour format with AM/PM
  });
};

export function formatDateTimeNew(dateStr) {
  const date = new Date(dateStr);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" }); // Jan, Feb, etc.
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Add ordinal suffix to day
  const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  // Format time as hh:mm am/pm with leading zeros
  const formatTime = (h, m) => {
    const period = h >= 12 ? "pm" : "am";
    const hour12 = h % 12 || 12;
    const hourStr = hour12 < 10 ? `0${hour12}` : hour12;
    const min = m < 10 ? `0${m}` : m;
    return `${hourStr}:${min} ${period}`;
  };

  return `${getOrdinal(day)} ${month} ${year} | ${formatTime(hours, minutes)}`;
}

export function formatDateTime(dateStr) {
  const date = new Date(dateStr);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" }); // Jan, Feb, etc.
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Add ordinal suffix to day
  const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  // Format time as hh:mm am/pm with leading zeros
  const formatTime = (h, m) => {
    const period = h >= 12 ? "pm" : "am";
    const hour12 = h % 12 || 12;
    const hourStr = hour12 < 10 ? `0${hour12}` : hour12;
    const min = m < 10 ? `0${m}` : m;
    return `${hourStr}:${min} ${period}`;
  };

  return `${getOrdinal(day)} ${month} ${year} | ${formatTime(hours, minutes)}`;
}

export const formatTo12Hour = (timeStr) => {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":");
  const date = new Date();
  date.setHours(+hours);
  date.setMinutes(+minutes);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const RoleId = {
  Admin: 1,
  Doctor: 2,
  Vendor: 3,
  Customer: 4,
  DeliveryBoy: 5,
  Vender: 7,
};

export const ApprovalStatus = {
  Pending: 1,
  Approved: 2,
  Rejected: 3,
  UnderReview: 4,
  OnHold: 5,
};

export const OrderStatusIds = {
  Pending: 1,
  Processing: 2,
  PickupSchedued: 3,
  Shipped: 4,
  Delivered: 5,
  Cancelled: 6,
  Returned: 7,
  Refunded: 8,
  Replaced: 9,
  Rejected: 10,
  Packing: 12,
};

export const ReturnStatusIds = {
  ReturnRequested: 1,
  PickupScheduled: 2,
  ItemPicked: 3,
  Returned: 4,
  RefundProcess: 5,
  Refunded: 6,
  ReturnRejected: 7,
};

export const ReplaceStatusIds = {
  ReplaceRequested: 1,
  StoreItmePickupScheduled: 2,
  StoreItemPicked: 3,
  // CustomerReplaceItem: 4,
  CustomerItemReplaced: 4,
  StoreReplaceItemDelivered: 5,
  ReplaceItemRejected: 6,
};
export const Stock_Status = {
  Available: 1,
  Selled: 2,
  Damaged: 3,
  Dummy: 4,
};

export const ServiceIds = {
  DineIn: 1,
  RoomService: 2,
  Delivery: 3,
  PickUp: 4,
};

export const Gender = {
  Male: 1,
  Female: 2,
  Other: 3,
};

export const ItemType = {
  Product: 1,
  Food: 2,
  Other: 3,
};

export const CouponType = {
  FixedAmount: 1,
  Percentage: 2,
  FreeShipping: 3,
  BuyOneGetOne: 4,
  FreeGift: 5,
};

export const DiscountType = {
  FixedAmount: 1,
  Percentage: 2,
  FreeShipping: 3,
  BuyOneGetOne: 4,
  FreeGift: 5,
};

export const ContactType = {
  Phone: 1,
  Email: 2,
  Address: 3,
  SocialMedia: 4,
};

export const PaymentMethods = {
  Cash: 1,
  Card: 2,
  QR: 3,
};

export const Category = {
  Lenses: 1,
  Sunglasses: 2,
  ContactLens: 3,
  Accessories: 4,
  Eyeglasses: 5,
};

export const IDS = {
  Role: { List: 1, Add: 2, Edit: 3, Delete: 4 },
  User: { List: 5, Add: 6, Edit: 7, Delete: 8 },
  Country: { List: 9, Add: 10, Edit: 11, Delete: 12 },
  State: { List: 13, Add: 14, Edit: 15, Delete: 16 },
  City: { List: 17, Add: 18, Edit: 19, Delete: 20 },
  Pincode: { List: 21, Add: 22, Edit: 23, Delete: 24 },
  StoreCategory: { List: 25, Add: 26, Edit: 27, Delete: 28 },
  StoreSubCategory: { List: 29, Add: 30, Edit: 31, Delete: 32 },
  StoreChildCategory: { List: 33, Add: 34, Edit: 35, Delete: 36 },
  ProductCategory: { List: 37, Add: 38, Edit: 39, Delete: 40 },
  ProductSubCategory: { List: 41, Add: 42, Edit: 43, Delete: 44 },
  ProductChildCategory: { List: 45, Add: 46, Edit: 47, Delete: 48 },
  FoodCategory: { List: 49, Add: 50, Edit: 51, Delete: 52 },
  FoodSubCategory: { List: 53, Add: 54, Edit: 55, Delete: 56 },
  FoodChildCategory: { List: 57, Add: 58, Edit: 59, Delete: 60 },
  Brand: { List: 61, Add: 62, Edit: 63, Delete: 64 },
  Plan: { List: 65, Add: 66, Edit: 67, Delete: 68 },
  Vendor: { List: 69, Add: 70, Edit: 71, Delete: 72 },
  Subscription: { List: 73, Add: 74, Edit: 75, Delete: 76 },
  PaymentType: { List: 77, Add: 78, Edit: 79, Delete: 80 },
  Unit: { List: 81, Add: 82, Edit: 83, Delete: 84 },
  Product: { List: 85, Add: 86, Edit: 87, Delete: 88 },
  HomeBanner: { List: 89, Add: 90, Edit: 91, Delete: 92 },
  RatingReview: { List: 93, Add: 94, Edit: 95, Delete: 96 },
  ReviewReply: { List: 97, Add: 98, Edit: 99, Delete: 100 },
  Order: { List: 101, Add: 102, Edit: 103, Delete: 104 },
  Customer: { List: 105, Add: 106, Edit: 107, Delete: 108 },
  Coupon: { List: 109, Add: 110, Edit: 111, Delete: 112 },
  Wallet: { List: 113, Add: 114, Edit: 115, Delete: 116 },
  GalleryImage: { List: 117, Add: 118, Edit: 119, Delete: 120 },
  RestaurantService: { List: 121, Add: 122, Edit: 123, Delete: 124 },
  FoodAddOnCategory: { List: 125, Add: 126, Edit: 127, Delete: 128 },
  FoodAddOn: { List: 129, Add: 130, Edit: 131, Delete: 132 },
  RestaurantCategory: { List: 133, Add: 134, Edit: 135, Delete: 136 },
  ApprovalStatus: { List: 137, Add: 138, Edit: 139, Delete: 140 },
  CancelReason: { List: 141, Add: 142, Edit: 143, Delete: 144 },
  ReturnReason: { List: 145, Add: 146, Edit: 147, Delete: 148 },
  FaqCategory: { List: 149, Add: 150, Edit: 151, Delete: 152 },
  Faq: { List: 153, Add: 154, Edit: 155, Delete: 156 },
  AboutUs: { List: 157, Add: 158, Edit: 159, Delete: 160 },
  TermsAndCondition: { List: 161, Add: 162, Edit: 163, Delete: 164 },
  PrivacyPolicy: { List: 165, Add: 166, Edit: 167, Delete: 168 },
  AppSetup: { List: 169, Add: 170, Edit: 171, Delete: 172 },
  SocialLink: { List: 173, Add: 174, Edit: 175, Delete: 176 },
  OfferedProduct: { List: 177, Add: 178, Edit: 179, Delete: 180 },
  CountryCode: { List: 181, Add: 182, Edit: 183, Delete: 184 },
  RejectReasons: { List: 185, Add: 186, Edit: 187, Delete: 188 },
  Appointment: { List: 189, Edit: 203, Delete: 204 },
  Farmer: { List: 190, Add: 225, Edit: 226, Delete: 227 },
  TimeSlot: { List: 191, Add: 192, Edit: 193, Delete: 194 },
  Help: { List: 195, Add: 196, Edit: 197, Delete: 198 },
  PlanFeature: { List: 199, Add: 200, Edit: 201, Delete: 202 },
  Area: { List: 205, Add: 206, Edit: 207, Delete: 208 },
  Crop: { List: 209, Add: 210, Edit: 211, Delete: 212 },
  Collection_Center: { List: 213, Add: 214, Edit: 215, Delete: 216 },
  Review_Reason: { List: 217, Add: 218, Edit: 219, Delete: 220 },
  Farmer_Detail: { List: 221, Add: 222, Edit: 223, Delete: 224 },
  Purchase_Order: { List: 228, Add: 229, Edit: 230, Delete: 231 },
  Receiving_Order: { List: 232, Add: 233, Edit: 234, Delete: 235 },
  Supplier: { List: 236, Add: 237, Edit: 238, Delete: 239 },
  Blog: { List: 240, Add: 241, Edit: 242, Delete: 243 },
  Contact_us: { List: 244, Add: 245, Edit: 246, Delete: 247 },
  Shape: { List: 248, Add: 249, Edit: 250, Delete: 251 },
  Material: { List: 252, Add: 253, Edit: 254, Delete: 255 },
  Colour: { List: 256, Add: 257, Edit: 258, Delete: 259 },
  Offer: { List: 260, Add: 261, Edit: 262, Delete: 263 },
  Face_Width: { List: 264, Add: 265, Edit: 266, Delete: 267 },
  Refund_Policy: { List: 268, Add: 269, Edit: 270, Delete: 271 },
  Shipping_Policy: { List: 272, Add: 273, Edit: 274, Delete: 275 },
  Offered_Product: { List: 276, Add: 277, Edit: 278, Delete: 279 },
  Eyeq: { List: 280, Add: 281, Edit: 282, Delete: 283 },
  LensType: { List: 284, Add: 285, Edit: 286, Delete: 287 },
  LensCategory: { List: 288, Add: 289, Edit: 290, Delete: 291 },
};

// export const Loader = ({ height = "60vh", color = "primary" }) => {
//   return (
//     <div
//       className="d-flex justify-content-center align-items-center"
//       style={{ height }}
//     >
//       <div className={`spinner-border text-${color}`} role="status" />
//     </div>
//   );
// };

export const useLoader = () => {
  const { setGlobalLoader } = useContext(Context);

  const withLoader = async (apiCall) => {
    try {
      setGlobalLoader(true);
      return await apiCall();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    } finally {
      setGlobalLoader(false);
    }
  };

  return { withLoader };
};
