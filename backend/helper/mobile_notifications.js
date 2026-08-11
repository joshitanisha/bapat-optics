const admin = require("firebase-admin");
const serviceAccount = require("./firebase/service_account.json");

const adminApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
}, "adminApp");

const AdminNotifications = async (device_key, data) => {
  try {
    if (device_key && data) {
      const payload = {
        token: device_key,
        notification: {
          title: "Grocido",
          body: data?.message,
        },
      };

      await adminApp.messaging().send(payload);
    }
  } catch (error) {
    console.error("Admin Notification Error:", error);
  }
};

module.exports = {
  AdminNotifications,
};
