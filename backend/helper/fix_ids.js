const { Transaction } = require("firebase-admin/firestore");

const IDS = {
  UserId: {
    Admin: 1,
    Supplier: 2,
  },

  Category: {
    Lenses: 1,
    Sunglasses: 2,
    ContactLens: 3,
    Accessories: 4,
    Eyeglasses: 5,
    SPECTACLE_FRAMES: 9,
  },

  CouponTypeId: {
    Brand: 1,
    Categoty: 2,
    Global: 3,
    DateWise: 4,
  },

  PurchaseOrderStatus: {
    newOrder: 1,
    Requested: 2,
    Ordered: 3,
    PendingDelivery: 4,
    Received: 5,
    Canceled: 6,
  },

  Appointment_Status: {
    Pending: 1,
    Cancelled: 2,
    Confirmed: 3,
  },

  StockStatus: {
    Available: 1,
    Selled: 2,
    Damaged: 3,
    Dummy: 4,
  },

  ReplaceStatus: {
    Requested: 1,
    Replaced: 2,
    NotReplaced: 3,
    CNIssued: 4,
  },
  RoleId: {
    Admin: 1,
    Doctor: 2,
    Vendor: 3,
    Customer: 4,
    DeliveryBoy: 5,
    Farmer: 6,
  },

  AddressTypes: {
    Home: 1,
    Apartment: 2,
    Work: 3,
    Office: 4,
    Other: 5,
  },
  SubscriptionStatus: {
    Active: 1,
    Expire: 2,
    incoming: 3,
  },

  product_coupon: {
    Percentage: "Percentage",
    FixedAmount: "Fixed Amount",
  },

  product_coupon: {
    Percentage: "Percentage",
    FixedAmount: "Fixed Amount",
  },

  discountTypes: {
    percentage: 2,
    fixedamount: 1,
  },

  product_type: {
    B2B: "Bulk Order",
    B2C: "Home Page",
    SampleRoll: "Sample Roll",
  },

  payment_options: {
    CustomerType: {
      EndUser: "End User",
      Reseller: "Reseller",
    },
    Repeat: {
      SingleTime: "Single Time",
      RepeatedTime: "Repeated Time",
      NotSure: "Not Sure",
    },
  },

  ApprovalStatus: {
    Pending: 1,
    Approved: 2,
    Rejected: 3,
    UnderReview: 4,
    OnHold: 5,
  },

  Gender: {
    Male: 1,
    Female: 2,
    Other: 3,
  },

  ItemType: {
    Product: 1,
    Food: 2,
    Other: 3,
  },

  CouponType: {
    FixedAmount: 1,
    Percentage: 2,
    FreeShipping: 3,
    BuyOneGetOne: 4,
    FreeGift: 5,
  },
  CouponCategoryType: {
    Brand: 1,
    Category: 2,
    Global: 3,
    DateWise: 4,
  },

  ContactType: {
    Phone: 1,
    Email: 2,
    Address: 3,
    SocialMedia: 4,
  },

  order_status: {
    Pending: 1,
    Processing: 2,
    PickupScheduled: 3,
    Shipped: 4,
    Delivered: 5,
    Cancelled: 6,
    Returned: 7,
    Refunded: 8,
    Replaced: 9,
    Rejected: 10,
    Packing: 12,
  },

  replace_order_status: {
    ReplaceRequested: 1,
    StoreItmePickupScheduled: 2,
    StoreItemPicked: 3,
    // CustomerReplaceItem: 4,
    CustomerItemReplaced: 4,
    StoreReplaceItemDelivered: 5,
    ReplaceItemRejected: 6,
  },

  return_status: {
    ReturnRequested: 1,
    PickupScheduled: 2,
    ItemPicked: 3,
    Returned: 4,
    RefundProcess: 5,
    Refunded: 6,
    ReturnRejected: 7,
  },

  ServiceIds: {
    DineIn: 1,
    RoomService: 2,
    Delivery: 3,
    PickUp: 4,
  },

  payment_type: {
    Online: "online",
    COD: "cod",
  },

  PaymentMethods: {
    Cash: 1,
    Online: 2,
    Card: 3,
    QR: 4,
    Wallet: 5,
  },

  Stock_Status: {
    Available: 1,
    Selled: 2,
    Damaged: 3,
    Dummy: 4,
  },

  Transaction_type: {
    Credit: 1,
    Debit: 2,
    Withdraw: 3,
  },

  Wallet_type: {
    Purchase: "Purchase",
    Referral: "Referral",
  },

  permissions: {
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
    // Plan: { List: 65, Add: 66, Edit: 67, Delete: 68 },
    Vendor: { List: 69, Add: 70, Edit: 71, Delete: 72 },
    // Subscription: { List: 73, Add: 74, Edit: 75, Delete: 76 },
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
    RejectReason: { List: 185, Add: 186, Edit: 187, Delete: 188 },
    // Appointment: { List: 189, Edit: 203, Delete: 204 },
    // Farmer: { List: 190, Add: 225, Edit: 226, Delete: 227 },
    TimeSlot: { List: 191, Add: 192, Edit: 193, Delete: 194 },
    Help: { List: 195, Add: 196, Edit: 197, Delete: 198 },
    PlanFeature: { List: 199, Add: 200, Edit: 201, Delete: 202 },
    Area: { List: 205, Add: 206, Edit: 207, Delete: 208 },
    // Crop: { List: 209, Add: 210, Edit: 211, Delete: 212 },
    Collection_Center: { List: 213, Add: 214, Edit: 215, Delete: 216 },
    Review_Reason: { List: 217, Add: 218, Edit: 219, Delete: 220 },
    // Farmer_Detail: { List: 221, Add: 222, Edit: 223, Delete: 224 },
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
  },
};

module.exports = IDS;
