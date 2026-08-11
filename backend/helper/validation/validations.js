const { check, body, validationResult } = require("express-validator");
const Base = require("../exception_handling/index");
const { HTTPS } = require("../https-status-codes/https-status-codes");

const createValidation = (field, message, additionalChecks = []) => {
  let validationChain = [check(field).notEmpty().withMessage(message)];
  if (additionalChecks.length > 0) {
    validationChain = validationChain.concat(additionalChecks);
  }
  return validationChain;
};

const createDateValidation = (field, message) => {
  return body(field)
    .notEmpty()
    .withMessage(message)
    .bail()
    .isISO8601({ strict: true })
    .withMessage(`${field} must be a valid date in 2025-05-09 11:18:00 format`)
    .toDate();
};

const Validation = {
  name: createValidation("name", "Name is required"),
  appointment_reason_id: createValidation("appointment_reason_id", "Appointment Reason is required"),
  date_of_birth: createValidation("date_of_birth", "Date of Birth is required"),
  time: createValidation("time", "Time is required"),


  f_name: createValidation("f_name", "First name is required"),
  l_name: createValidation("l_name", "Last name is required"),
  contact_no: createValidation("contact_no", "Contact no is required"),
  country_id: createValidation("country_id", "Country is required"),
  country_code_id: createValidation(
    "country_code_id",
    "Country Code is required"
  ),
  state_id: createValidation("state_id", "State is required"),
  city_id: createValidation("city_id", "City is required"),

  pincode_id: createValidation("pincode_id", "Pincode is required"),
  s_category_id: createValidation("s_category_id", "S Category is required"),
  s_sub_category_id: createValidation(
    "s_sub_category_id",
    "S Sub Category is required"
  ),
  s_child_category_id: createValidation(
    "s_child_category_id",
    "S Child Category is required"
  ),
  store_name: createValidation("store_name", "Store name is required"),
  image: createValidation("image", "Image is required"),
  cancel_reason_id: createValidation("cancel_reason_id", "Reason is required"),
  return_reason_id: createValidation("return_reason_id", "Return is required"),
  country: createValidation("country", "Country Name is required"),
  address_type_id: createValidation(
    "address_type_id",
    "Address Type is required"
  ),
  p_category_id: createValidation("p_category_id", "P Category is required"),
  p_sub_category_id: createValidation(
    "p_sub_category_id",
    "P Sub Category is required"
  ),
  p_child_category_id: createValidation(
    "p_child_category_id",
    "P Child Category is required"
  ),
  subscription_id: createValidation(
    "subscription_id",
    "subscription_id is required"
  ),
  week_id: createValidation(
    "week_id",
    "week_id is required"
  ),
  product_id: createValidation("product_id", "Product ID is required"),
  order_id: createValidation("order_id", "Order ID is required"),
  variant_id: createValidation("variant_id", "Variant ID is required"),
  ratings: createValidation("ratings", "Rating count is required"),
  store_id: createValidation("store_id", "Store ID is required"),
  type: createValidation("type", "Type is required"),
  cart_id: createValidation("cart_id", "Cart ID is required"),
  payment_mode_id: createValidation(
    "payment_mode_id",
    "Payment Mode ID is required"
  ),
  coupon_id: createValidation("coupon_id", "Couppon ID is required"),
  service_id: createValidation("service_id", "Service ID is required"),
  address_id: createValidation("address_id", "Address ID is required"),
  item_type_id: createValidation("item_type_id", "item_type_id is required"),

  f_category_id: createValidation("f_category_id", "F Category is required"),
  f_sub_category_id: createValidation(
    "f_sub_category_id",
    "F Sub Category is required"
  ),
  f_child_category_id: createValidation(
    "f_child_category_id",
    "F Child Category is required"
  ),
  add_on_category_id: createValidation(
    "add_on_category_id",
    "add_on_category_id is required"
  ),

  first_name: createValidation("first_name", "First Name is required"),
  last_name: createValidation("last_name", "Last Name is required"),
  address_type: createValidation("address_type", "Address type is required"),

  otp: createValidation("otp", "OTP is required"),
  room_no: createValidation("room_no", "Room No is required"),
  table_no: createValidation("table_no", "Table No is required"),
  faq_category_id: createValidation(
    "faq_category_id",
    "Faq Category ID is required"
  ),
  question: createValidation("question", "Question is required"),
  answer: createValidation("answer", "Answer is required"),
  content: createValidation("content", "Content is required"),
  delivery_range: createValidation(
    "delivery_range",
    "Delivery Range is required"
  ),
  device_key: createValidation("device_key", "device_key is required"),
  delivery_charges: createValidation(
    "delivery_charges",
    "delivery_charges is required"
  ),
  packing_charges: createValidation(
    "packing_charges",
    "packing_charges is required"
  ),
  pack_type_id: createValidation("pack_type_id", "pack_type_id is required"),

  tax_type_id: createValidation("tax_type_id", "tax_type_id is required"),
  delivery_type_id: createValidation(
    "delivery_type_id",
    "delivery_type_id is required"
  ),
  payment_id: createValidation("payment_id", "payment_id is required"),
  // delivery_date: createValidation("delivery_date", "delivery_date is required"),
  delivery_date: createDateValidation("delivery_date", "delivery_date is required"),
  time_slot_id: createValidation("time_slot_id", "time_slot_id is required"),
  address: createValidation("address", "address is required"),
  long: createValidation("long", "long is required"),
  lat: createValidation("lat", "lat is required"),
  pan_no: createValidation("pan_no", "pan_no is required"),
  driving_license_no: createValidation(
    "driving_license_no",
    "driving_license_no is required"
  ),
  aadhar_no: createValidation("aadhar_no", "aadhar_no is required"),
  ac_no: createValidation("ac_no", "ac_no is required"),
  ifsc_code: createValidation("ifsc_code", "ifsc_code is required"),
  land: createValidation("land", "land is required"),
  farmer_id: createValidation("farmer_id", "farmer_id is required"),


  building: createValidation("building", "building is required"),

  branch_name: createValidation("branch_name", "branch_name is required"),
  bank_name: createValidation("bank_name", "bank_name is required"),
  ifsc: createValidation("ifsc", "ifsc is required"),
  account_no: createValidation("account_no", "account_no is required"),
  height: createValidation("height", "height is required"),
  weight: createValidation("weight", "weight is required"),
  dob: createValidation("dob", "dob is required"),
  plan_price_id: createValidation("plan_price_id", "plan_price_id is required"),
  category_id: createValidation("category_id", "category_id is required"),
  plan_id: createValidation("plan_id", "plan_id is required"),
  payment_method_id: createValidation(
    "payment_method_id",
    "payment_method_id is required"
  ),
  doctor_id: createValidation("doctor_id", "doctor_id is required"),
  appointment_id: createValidation(
    "appointment_id",
    "appointment_id is required"
  ),
  category_id: createValidation("category_id", "category_id is required"),
  transaction_id: createValidation(
    "transaction_id",
    "transaction_id is required"
  ),
  transaction_type: createValidation(
    "transaction_type",
    "transaction_type is required"
  ),
  amount: createValidation("amount", "amount is required"),
  code: createValidation("code", "code is required"),
  delivery_kilometer: createValidation("delivery_kilometer", "delivery_kilometer is required"),
  description: createValidation("description", "description is required"),
  email: createValidation("email", "Email is required", [
    check("email").isEmail().withMessage("Enter a valid email"),
  ]),
  password: createValidation(
    "password",
    "Password is required"
    //   [
    //   check("password")
    //     .isLength({ min: 6 })
    //     .withMessage("Password must be at least 6 characters long"),
    // ]
  ),

  old_password: createValidation(
    "old_password",
    "old Password is required"
    //   [
    //   check("password")
    //     .isLength({ min: 6 })
    //     .withMessage("Password must be at least 6 characters long"),
    // ]
  ),



  // Add more validations as needed
};

const Integer = (field) => [
  body(field)
    .isInt()
    .withMessage(`${field} must be an integer`)
];

// Helper to check string fields
const StringField = (field) => [
  body(field)
    .isString()
    .withMessage(`${field} must be a string`)
    .notEmpty()
    .withMessage(`${field} cannot be empty`)
];

// Helper to check date format (ISO 8601)
const DateField = (field) => [
  body(field)
    .isISO8601()
    .withMessage(`${field} must be a valid ISO8601 date`)
];

// Helper to check decimal or numeric string
const DecimalString = (field) => [
  body(field)
    .matches(/^\d+(\.\d+)?$/)
    .withMessage(`${field} must be a decimal number or numeric string`)
];

// Your full validation array
const validatePlanData = [
  // Top-level fields
  body("plan_id").isNumeric().withMessage("plan_id must be a number"),
  body("plan_price_id").isNumeric().withMessage("plan_price_id must be a number"),
  body("category_id").isNumeric().withMessage("category_id must be a number"),
  body("payment_method_id").isNumeric().withMessage("payment_method_id must be a number"),

  // Week array
  body("week").isArray({ min: 1 }).withMessage("week must be a non-empty array"),

  // Each week
  body("week.*.total_weight")
    .matches(/^\d+(\.\d+)?$/)
    .withMessage("total_weight must be a decimal number"),

  // Delivery array inside week
  body("week.*.delivery").isArray({ min: 1 }).withMessage("Each week must have at least one delivery"),

  // Each delivery
  body("week.*.delivery.*.day_id").isNumeric().withMessage("day_id must be a number"),
  body("week.*.delivery.*.time_slot_id").isNumeric().withMessage("time_slot_id must be a number"),
  body("week.*.delivery.*.total_weight")
    .matches(/^\d+(\.\d+)?$/)
    .withMessage("total_weight must be a decimal number"),

  // Product array inside delivery
  body("week.*.delivery.*.product").isArray({ min: 1 }).withMessage("Each delivery must have at least one product"),

  // Each product
  body("week.*.delivery.*.product.*.product_id")
    .isNumeric()
    .withMessage("product_id must be a number"),
  body("week.*.delivery.*.product.*.quantity")
    .isNumeric()
    .withMessage("quantity must be a number"),
  body("week.*.delivery.*.product.*.serving_size")
    .isString()
    .withMessage("serving_size must be a string"),
  body("week.*.delivery.*.product.*.calories")
    .isNumeric()
    .withMessage("calories must be a number"),
];

const validateDeliveryData = [
  body("products")
    .isArray({ min: 1 })
    .withMessage("products must be a non-empty array"),

  body("products.*.product_id")
    .notEmpty()
    .withMessage("product_id is required")
    .isInt()
    .withMessage("product_id must be an integer"),

  body("products.*.collection_status_id")
    .notEmpty()
    .withMessage("collection_status_id is required")
    .isInt()
    .withMessage("collection_status_id must be an integer"),
];
// const validateSubscriptionData = [
//   createValidation("plan_id", "Plan ID", Integer("plan_id")),
//   createValidation("plan_price_id", "Plan Price ID", Integer("plan_price_id")),
//   createValidation("category_id", "Category ID", Integer("category_id")),
//   createValidation("payment_method_id", "Payment Method ID", Integer("payment_method_id")),
//   createValidation("transaction_id", "Transaction ID", String("transaction_id")),
//   createDateValidation("start_date", "Start Date"),
//   createDateValidation("end_date", "End Date"),

//   // Week array validation (like passengers)
//   check("week")
//     .isArray()
//     .withMessage("Week should be an array")
//     .notEmpty()
//     .withMessage("Week array cannot be empty")
//     .isLength({ min: 1 })
//     .withMessage("Week array must have at least one item")
//     .custom((value) => {
//       if (!Array.isArray(value) || value.length === 0) {
//         throw new Error("Week array is empty or invalid");
//       }
//       return true;
//     }),

//   // Week fields
//   createValidation("week.*.week_id", "Week ID", Integer("week.*.week_id")),
//   createValidation("week.*.total_weight", "Week Total Weight", Decimal("week.*.total_weight")),
//   createDateValidation("week.*.start_date", "Week Start Date"),
//   createDateValidation("week.*.end_date", "Week End Date"),

//   // Delivery array validation inside week
//   check("week.*.delivery")
//     .isArray()
//     .withMessage("Delivery should be an array")
//     .notEmpty()
//     .withMessage("Delivery array cannot be empty")
//     .isLength({ min: 1 })
//     .withMessage("Each week must have at least one delivery")
//     .custom((value) => {
//       if (!Array.isArray(value) || value.length === 0) {
//         throw new Error("Delivery array is empty or invalid");
//       }
//       return true;
//     }),

//   // Delivery fields
//   createValidation("week.*.delivery.*.day_id", "Delivery Day ID", Integer("week.*.delivery.*.day_id")),
//   createValidation("week.*.delivery.*.time_slot_id", "Time Slot ID", Integer("week.*.delivery.*.time_slot_id")),
//   createDateValidation("week.*.delivery.*.date", "Delivery Date"),
//   createValidation("week.*.delivery.*.total_weight", "Delivery Total Weight", Decimal("week.*.delivery.*.total_weight")),

//   // Product array validation inside delivery
//   check("week.*.delivery.*.product")
//     .isArray()
//     .withMessage("Product should be an array")
//     .notEmpty()
//     .withMessage("Product array cannot be empty")
//     .isLength({ min: 1 })
//     .withMessage("Each delivery must include at least one product")
//     .custom((value) => {
//       if (!Array.isArray(value) || value.length === 0) {
//         throw new Error("Product array is empty or invalid");
//       }
//       return true;
//     }),

//   // Product fields
//   createValidation("week.*.delivery.*.product.*.product_id", "Product ID", Integer("week.*.delivery.*.product.*.product_id")),
//   createValidation("week.*.delivery.*.product.*.quantity", "Quantity", Integer("week.*.delivery.*.product.*.quantity")),
//   createValidation("week.*.delivery.*.product.*.serving_size", "Serving Size", String("week.*.delivery.*.product.*.serving_size")),
//   createValidation("week.*.delivery.*.product.*.calories", "Calories", Decimal("week.*.delivery.*.product.*.calories")),
// ];
const Validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return Base.sendError(res, HTTPS.ALREADY_REPORTED, errors.mapped());
  }
  next();
};

module.exports = { Validation, validatePlanData, Validate, validateDeliveryData };
