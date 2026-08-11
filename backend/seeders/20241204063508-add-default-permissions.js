"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Adding default roles with fixed IDs
    await queryInterface.bulkInsert(
      "permissions",
      [
        {
          id: 1,
          name: "Roles List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "Roles Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: "Roles Update",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          name: "Roles Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 5,
          name: "User List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          name: "User Create",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 7,
          name: "User Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 8,
          name: "User Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 9,
          name: "Country List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 10,
          name: "Country Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 11,
          name: "Country Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 12,
          name: "Country Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 13,
          name: "State List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 14,
          name: "State Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 15,
          name: "State Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 16,
          name: "State Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 17,
          name: "City List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 18,
          name: "City Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 19,
          name: "City Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 20,
          name: "City Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 21,
          name: "Pincode List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 22,
          name: "Pincode Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 23,
          name: "Pincode Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 24,
          name: "Pincode Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 25,
          name: "Store Category List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 26,
          name: "Store Category Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 27,
          name: "Store Category Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 28,
          name: "Store Category Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 29,
          name: "Store Sub Category List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 30,
          name: "Store Sub Category Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 31,
          name: "Store Sub Category Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 32,
          name: "Store Sub Category Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 33,
          name: "Store Child Category List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 34,
          name: "Store Child Category Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 35,
          name: "Store Child Category Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 36,
          name: "Store Child Category Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 37,
          name: "Product Category List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 38,
          name: "Product Category Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 39,
          name: "Product Category Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 40,
          name: "Product Category Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 41,
          name: "Product Sub Category List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 42,
          name: "Product Sub Category Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 43,
          name: "Product Sub Category Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 44,
          name: "Product Sub Category Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 45,
          name: "Product Child Category List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 46,
          name: "Product Child Category Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 47,
          name: "Product Child Category Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 48,
          name: "Product Child Category Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 49,
          name: "Food Category List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 50,
          name: "Food Category Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 51,
          name: "Food Category Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 52,
          name: "Food Category Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 53,
          name: "Food Sub Category List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 54,
          name: "Food Sub Category Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 55,
          name: "Food Sub Category Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 56,
          name: "Food Sub Category Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 57,
          name: "Food Child Category List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 58,
          name: "Food Child Category Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 59,
          name: "Food Child Category Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 60,
          name: "Food Child Category Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 61,
          name: "Brand List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 62,
          name: "Brand Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 63,
          name: "Brand Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 64,
          name: "Brand Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // {
        //   id: 65,
        //   name: "Plan List",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        // {
        //   id: 66,
        //   name: "Plan Add",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        // {
        //   id: 67,
        //   name: "Plan Edit",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        // {
        //   id: 68,
        //   name: "Plan Delete",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },

        {
          id: 69,
          name: "Vendor List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 70,
          name: "Vendor Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 71,
          name: "Vendor Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 72,
          name: "Vendor Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // {
        //   id: 73,
        //   name: "Subscription List",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        // {
        //   id: 74,
        //   name: "Subscription Add",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        // {
        //   id: 75,
        //   name: "Subscription Edit",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        // {
        //   id: 76,
        //   name: "Subscription Delete",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },

        {
          id: 77,
          name: "Payment Type List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 78,
          name: "Payment Type Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 79,
          name: "Payment Type Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 80,
          name: "Payment Type Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 81,
          name: "Unit List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 82,
          name: "Unit Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 83,
          name: "Unit Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 84,
          name: "Unit Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 85,
          name: "Product List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 86,
          name: "Product Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 87,
          name: "Product Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 88,
          name: "Product Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 89,
          name: "Home Banner List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 90,
          name: "Home Banner Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 91,
          name: "Home Banner Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 92,
          name: "Home Banner Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 93,
          name: "Rating Reviews List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 94,
          name: "Rating Reviews Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 95,
          name: "Rating Reviews Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 96,
          name: "Rating Reviews Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 97,
          name: "Reviews Reply List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 98,
          name: "Reviews Reply Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 99,
          name: "Reviews Reply Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 100,
          name: "Reviews Reply Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 101,
          name: "Order List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 102,
          name: "Order Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 103,
          name: "Order Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 104,
          name: "Order Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 105,
          name: "Customer List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 106,
          name: "Customer Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 107,
          name: "Customer Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 108,
          name: "Customer Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 109,
          name: "Coupon List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 110,
          name: "Coupon Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 111,
          name: "Coupon Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 112,
          name: "Coupon Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 113,
          name: "Wallet List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 114,
          name: "Wallet Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 115,
          name: "Wallet Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 116,
          name: "Wallet Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 117,
          name: "Gallery Images List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 118,
          name: "Gallery Images Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 119,
          name: "Gallery Images Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 120,
          name: "Gallery Images Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 121,
          name: "Restaurant Service List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 122,
          name: "Restaurant Service Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 123,
          name: "Restaurant Service Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 124,
          name: "Restaurant Service Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 125,
          name: "Food Add On Category List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 126,
          name: "Food Add On Category Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 127,
          name: "Food Add On Category Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 128,
          name: "Food Add On Category Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 129,
          name: "Food Add On List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 130,
          name: "Food Add On Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 131,
          name: "Food Add On Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 132,
          name: "Food Add On Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 133,
          name: "Restaurant Category List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 134,
          name: "Restaurant Category Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 135,
          name: "Restaurant Category Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 136,
          name: "Restaurant Category Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 137,
          name: "Approval Status List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 138,
          name: "Approval Status Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 139,
          name: "Approval Status Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 140,
          name: "Approval Status Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 141,
          name: "Cancel Reason List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 142,
          name: "Cancel Reason Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 143,
          name: "Cancel Reason Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 144,
          name: "Cancel Reason Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 145,
          name: "Return Reason List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 146,
          name: "Return Reason Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 147,
          name: "Return Reason Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 148,
          name: "Return Reason Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 149,
          name: "Faq Category List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 150,
          name: "Faq Category Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 151,
          name: "Faq Category Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 152,
          name: "Faq Category Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 153,
          name: "Faq List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 154,
          name: "Faq Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 155,
          name: "Faq Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 156,
          name: "Faq Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 157,
          name: "About Us List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 158,
          name: "About Us Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 159,
          name: "About Us Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 160,
          name: "About Us Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 161,
          name: "Terms And Condition List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 162,
          name: "Terms And Condition Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 163,
          name: "Terms And Condition Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 164,
          name: "Terms And Condition Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 165,
          name: "Privacy Policy List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 166,
          name: "Privacy Policy Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 167,
          name: "Privacy Policy Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 168,
          name: "Privacy Policy Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 169,
          name: "App Setup List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 170,
          name: "App Setup Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 171,
          name: "App Setup Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 172,
          name: "App Setup Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 173,
          name: "Social Link List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 174,
          name: "Social Link Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 175,
          name: "Social Link Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 176,
          name: "Social Link Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 177,
          name: "Offered Product List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 178,
          name: "Offered Product Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 179,
          name: "Offered Product Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 180,
          name: "Offered Product Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 181,
          name: "Country Code List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 182,
          name: "Country Code Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 183,
          name: "Country Code Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 184,
          name: "Country Code Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 185,
          name: "Rejected Reasons List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 186,
          name: "Rejected Reasons Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 187,
          name: "Rejected Reasons Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 188,
          name: "Rejected Reasons Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // {
        //   id: 189,
        //   name: "Appointment List",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        {
          id: 190,
          name: "Farmer List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 191,
          name: "Time Slot List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 192,
          name: "Time Slot Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 193,
          name: "Time Slot Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 194,
          name: "Time Slot Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 195,
          name: "Help List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 196,
          name: "Help Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 197,
          name: "Help Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 198,
          name: "Help Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // {
        //   id: 199,
        //   name: "Plan Feature List",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        // {
        //   id: 200,
        //   name: "Plan Feature Add",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        // {
        //   id: 201,
        //   name: "Plan Feature Edit",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        // {
        //   id: 202,
        //   name: "Plan Feature Delete",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        // {
        //   id: 203,
        //   name: "Appointment Edit",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        // {
        //   id: 204,
        //   name: "Appointment Delete",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },

        {
          id: 205,
          name: "Area List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 206,
          name: "Area Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 207,
          name: "Area Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 208,
          name: "Area Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // {
        //   id: 209,
        //   name: "Crop List",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        // {
        //   id: 210,
        //   name: "Crop Add",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        // {
        //   id: 211,
        //   name: "Crop Edit",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        // {
        //   id: 212,
        //   name: "Crop Delete",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },

        {
          id: 213,
          name: "Collection Center List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 214,
          name: "Collection Center Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 215,
          name: "Collection Center Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 216,
          name: "Collection Center Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 217,
          name: "Review Reason List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 218,
          name: "Review Reason Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 219,
          name: "Review Reason Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 220,
          name: "Review Reason Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        // {
        //   id: 221,
        //   name: "Farmer Detail List",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        // {
        //   id: 222,
        //   name: "Farmer Detail Add",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        // {
        //   id: 223,
        //   name: "Farmer Detail Edit",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        // {
        //   id: 224,
        //   name: "Farmer Detail Delete",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },

        // {
        //   id: 225,
        //   name: "Farmer Add",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        // {
        //   id: 226,
        //   name: "Farmer Edit",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        // {
        //   id: 227,
        //   name: "Farmer Delete",
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // },
        {
          id: 228,
          name: "Purchase List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 229,
          name: "Purchase Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 230,
          name: "Purchase Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 231,
          name: "Purchase Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 232,
          name: "Receiving List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 233,
          name: "Receiving Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 234,
          name: "Receiving Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 235,
          name: "Receiving Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 236,
          name: "Supplier List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 237,
          name: "Supplier Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 238,
          name: "Supplier Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 239,
          name: "Supplier Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 240,
          name: "Blog List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 241,
          name: "Blog Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 242,
          name: "Blog Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 243,
          name: "Blog Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 244,
          name: "Contact_us List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 245,
          name: "Contact_us Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 246,
          name: "Contact_us Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 247,
          name: "Contact_us Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 248,
          name: "Shape List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 249,
          name: "Shape Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 250,
          name: "Shape Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 251,
          name: "Shape Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 252,
          name: "Material List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 253,
          name: "Material Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 254,
          name: "Material Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 255,
          name: "Material Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 256,
          name: "Colour List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 257,
          name: "Colour Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 258,
          name: "Colour Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 259,
          name: "Colour Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 260,
          name: "Offer List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 261,
          name: "Offer Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 262,
          name: "Offer Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 263,
          name: "Offer Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 264,
          name: "Face Width List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 265,
          name: "Face Width Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 266,
          name: "Face Width Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 267,
          name: "Face Width Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 268,
          name: "Refund Policy List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 269,
          name: "Refund Policy Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 270,
          name: "Refund Policy Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 271,
          name: "Refund Policy Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 272,
          name: "Shipping Policy List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 273,
          name: "Shipping Policy Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 274,
          name: "Shipping Policy Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 275,
          name: "Shipping Policy Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 276,
          name: "Offered Product List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 277,
          name: "Offered Product Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 278,
          name: "Offered Product Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 279,
          name: "Offered Product Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 280,
          name: "Eyeq List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 281,
          name: "Eyeq Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 282,
          name: "Eyeq Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 283,
          name: "Eyeq Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          id: 284,
          name: "LensType List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 285,
          name: "LensType Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 286,
          name: "LensType Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 287,
          name: "LensType Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        

        {
          id: 288,
          name: "LensCategory List",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 289,
          name: "LensCategory Add",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 290,
          name: "LensCategory Edit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 291,
          name: "LensCategory Delete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

      ],
      {
        // Add this option to ensure that the existing records are updated
        updateOnDuplicate: ["name", "updatedAt"],
      }
    );
  },

  async down(queryInterface, Sequelize) {
    // Removing the added roles based on the fixed IDs
    await queryInterface.bulkDelete(
      "permissions",
      {
        id: {
          [Sequelize.Op.in]: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
            37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
            54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70,
            71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87,
            88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103,
            104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116,
            117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129,
            130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142,
            143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155,
            156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168,
            169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181,
            182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194,
            195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207,
            208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220,
            221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233,
            234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246,
            247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259,
            260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272,
            273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285,
            286, 287, 288, 289, 290, 291,
          ],
        },
      },
      {}
    );
  },
};
