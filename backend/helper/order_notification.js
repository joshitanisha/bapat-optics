const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  getDocs,
} = require("firebase/firestore"); // Use Firestore Lite module

const customer_firebaseConfig = {
    apiKey: "AIzaSyChyn4ts4dM1C2RyK1GCR4senvM-JnN89Y",
  authDomain: "groscidomobileapp-f78da.firebaseapp.com",
  projectId: "groscidomobileapp-f78da",
  storageBucket: "groscidomobileapp-f78da.firebasestorage.app",
  messagingSenderId: "139396943773",
  appId: "1:139396943773:web:b58df241e667e44049e974",
  measurementId: "G-QSKXEE6Q0B"
};

const customer_app = initializeApp(customer_firebaseConfig, "groscido");

const db = getFirestore(customer_app);

const axios = require("axios");

// const create_order = async (order_id, customer_id, store_id) => {
//     const customer_ids = String(customer_id);
//     const store_ids = String(store_id);
//     const order_ids = String(order_id);

//     const orderData = { order_status_id: 1, };

//     try {
//         const customerOrderDoc = doc(db, "Customer", customer_ids, "Orders", order_ids);
//         const storeOrderDoc = doc(db, "Store", store_ids, "Orders", order_ids);

//         await Promise.all([
//             setDoc(customerOrderDoc, orderData),
//             setDoc(storeOrderDoc, orderData),
//         ]);

//         console.log("Order created in both Customer and Store subcollections.");
//     } catch (error) {
//         console.error("Error creating order:", error);
//     }
// };

const create_order = async (order_id, user_ids) => {
  const orderIdStr = String(order_id);
  const orderData = { updatedAt: new Date() };

  try {
    const orderDoc = doc(db, "Orders", orderIdStr);
    const operations = [setDoc(orderDoc, orderData)];

    // for (const user_id of user_ids) {
    //   const userDoc = doc(db, "Users", String(user_id));
    //   operations.push(setDoc(userDoc, orderData));
    // }

    await Promise.all(operations);
  } catch (error) {
    console.error("Error creating order or user documents:", error);
  }
};

const create_User = async ( user_ids) => {
//   const orderIdStr = String(order_id);
  const orderData = { updatedAt: new Date() };

  try {
   
  const operations = [];
    // for (const user_id of user_ids) {
      const userDoc = doc(db, "Users", String(user_ids));
      operations.push(setDoc(userDoc, orderData));
    // }

    await Promise.all(operations);
  } catch (error) {
    console.error("Error creating order or user documents:", error);
  }
};
const update_user = async ( user_ids) => {
//   const orderIdStr = String(order_id);
  const updatedAt = new Date();

  try {
    const operations = [];

   

    // const orderDoc = doc(db, "Orders", orderIdStr);
    // operations.push(updateDoc(orderDoc, { updatedAt }));

    // for (const user_id of user_ids) {
      const userDoc = doc(db, "Users", String(user_ids));
      operations.push(setDoc(userDoc, { updatedAt }, { merge: true }));
    // }

    await Promise.all(operations);
    console.log("Order and user documents updated.");
  } catch (error) {
    console.error("Error updating order or user documents:", error);
  }
};

const update_order = async (order_id, user_id) => {
  const orderIdStr = String(order_id);
  const updatedAt = new Date();

  try {
    const operations = [];

   

    const orderDoc = doc(db, "Orders", orderIdStr);
    operations.push(updateDoc(orderDoc, { updatedAt }));

    // for (const user_id of user_ids) {
    //   const userDoc = doc(db, "Users", String(user_id));
    //   operations.push(setDoc(userDoc, { updatedAt }, { merge: true }));
    // }

    await Promise.all(operations);
    console.log("Order and user documents updated.");
  } catch (error) {
    console.error("Error updating order or user documents:", error);
  }
};

// const update_order_status = async (customer_id, order_id, store_id, new_status_id) => {
//     const customer_ids = String(customer_id);
//     const store_ids = String(store_id);
//     const order_ids = String(order_id);

//     console.log("Updating order status for:", {
//         customer_id,
//         store_id,
//         order_id,
//         new_status_id,
//     });

//     const customerOrderDoc = doc(db, "Customer", customer_ids, "Orders", order_ids);
//     const storeOrderDoc = doc(db, "Store", store_ids, "Orders", order_ids);

//     const [customerSnapshot, storeSnapshot] = await Promise.all([
//         getDoc(customerOrderDoc),
//         getDoc(storeOrderDoc),
//     ]);

//     // --- Customer Order Check and Update ---
//     if (!customerSnapshot.exists()) {
//         console.error(No customer order found: Customer ${customer_ids}, Order ${order_ids});
//     } else {
//         try {
//             await updateDoc(customerOrderDoc, { order_status_id: new_status_id });
//             console.log(Customer order status updated to ${new_status_id});
//         } catch (error) {
//             console.error("Error updating customer order status:", error);
//         }
//     }

//     // --- Store Order Check and Update ---
//     if (!storeSnapshot.exists()) {
//         console.error(No store order found: Store ${store_ids}, Order ${order_ids});
//     } else {
//         try {
//             await updateDoc(storeOrderDoc, { order_status_id: new_status_id });
//             console.log(Store order status updated to ${new_status_id});
//         } catch (error) {
//             console.error("Error updating store order status:", error);
//         }
//     }
// };

module.exports = {
  create_order,
  update_order,
  create_User,
  update_user
};
