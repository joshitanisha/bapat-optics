const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");
const { HTTPS } = require("../https-status-codes/https-status-codes");
const Base = require("../exception_handling");
const { ContactType } = require("../fix_ids");
const request = require("request");
const QRCode = require("qrcode");
const { AdminNotifications } = require("../mobile_notifications");
const {
  Users,
  Notification,
  sequelize,
  App_Setup,
} = require("../../models/index");
const crypto = require("crypto");
const {
  transaction,
} = require("../../controllers/api/v1/mobile/wallet/wallet.controller");
const { default: axios } = require("axios");

const Razorpay = require("razorpay");
console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log(
  "RAZORPAY_KEY_SECRET exists:",
  !!process.env.RAZORPAY_KEY_SECRET
);


const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
exports.generateReferralCode = async (length = 5, attempts = 5, t = null) => {
  for (let i = 0; i < attempts; i++) {
    const refer_code = crypto
      .randomBytes(Math.ceil(length / 2))
      .toString("hex")
      .slice(0, length)
      .toUpperCase();

    const exists = await Users.findOne({
      where: { refer_code },
      transaction: t,
    });

    if (!exists) {
      return refer_code;
    }
  }

  throw new Error(
    "Failed to generate unique referral code after multiple attempts",
  );
};

exports.UpdateDataDemo = async (database, updatedata, condition, t) => {
  try {
    const data = await database.update(updatedata, {
      where: condition,
      transaction: t,
    });
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.formatDateTime = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return date.toLocaleString("en-GB", options).replace(",", "");
};

exports.getDistance = async (customer_pincode) => {
  try {
    // 1. Fetch main store coordinates
    const appsetup = await App_Setup.findOne(); // assuming single store
    if (!appsetup || !appsetup.lat || !appsetup.long) {
      throw new Error("Main store location not found in App_Setup");
    }
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const storeLat = appsetup.lat;
    const storeLng = appsetup.long;
    const currentOrigin = `${storeLat},${storeLng}`;

    // 2. Geocode customer pincode to get lat/lng
    const geoResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${customer_pincode}&key=${apiKey}`,
    );

    if (geoResponse.data.status !== "OK" || !geoResponse.data.results.length) {
      throw new Error("Failed to geocode customer pincode");
    }

    const customerLocation = geoResponse.data.results[0].geometry.location;
    const destination = `${customerLocation.lat},${customerLocation.lng}`;

    // 3. Calculate distance using Distance Matrix API
    const distanceResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${currentOrigin}&destinations=${destination}&key=${apiKey}`,
    );

    const distanceData = distanceResponse.data;

    if (
      distanceData.status !== "OK" ||
      !distanceData.rows[0].elements[0] ||
      distanceData.rows[0].elements[0].status !== "OK"
    ) {
      throw new Error("Distance Matrix API failed to return valid data");
    }

    const distanceValue = distanceData.rows[0].elements[0].distance.value;
    const distanceInKm = +(distanceValue / 1000).toFixed(1);

    return distanceInKm;
  } catch (error) {
    console.error("Error calculating distance:", error.message);
    throw error;
  }
};

exports.capturePayment = async (data) => {
  try {
    const payment = await instance.payments.capture(
      data.payment_id,
      Math.round(Number(data.amount) * 100),
      "INR",
    );
    console.log("Payment captured successfully:", payment);
    return payment;
  } catch (error) {
    console.error("Error capturing payment:", error);
    // throw error; // You can throw the error or handle it differently
  }
};
// module.exports = {
//   UpdateDataDemo,
//   generateReferralCode,
//   formatDateTime,
//   getDistance,
// };
