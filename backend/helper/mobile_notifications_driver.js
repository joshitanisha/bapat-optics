const admin = require("firebase-admin");
const serviceAccount = require("./firebase/service_account_driver.json");

const driverApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
}, "driverApp");

const AdminNotificationsDriver = async (device_key, data) => {
  try {
    if (device_key && data) {
      const payload = {
        token: device_key,
        notification: {
          title: "Urban Prime",
          body: data?.message,
        },
      };

      await driverApp.messaging().send(payload);
    }
  } catch (error) {
    console.error("Driver Notification Error:", error);
  }
};

module.exports = {
  AdminNotificationsDriver,
};
