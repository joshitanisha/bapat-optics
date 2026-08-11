'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   const homebanner = await queryInterface.describeTable("kyc_documents");
    if (!homebanner.hasOwnProperty("aadhar_back_image")) {
      await queryInterface.addColumn(
        "kyc_documents",
        "aadhar_back_image",
        {
          type: Sequelize.STRING,
          allowNull: true,
         
        }
      );
    }

     if (!homebanner.hasOwnProperty("driving_license_back_image")) {
      await queryInterface.addColumn(
        "kyc_documents",
        "driving_license_back_image",
        {
          type: Sequelize.STRING,
          allowNull: true,
         
        }
      );
    }

    
     if (!homebanner.hasOwnProperty("driving_license_image")) {
      await queryInterface.addColumn(
        "kyc_documents",
        "driving_license_image",
        {
          type: Sequelize.STRING,
          allowNull: true,
         
        }
      );
    }
     if (!homebanner.hasOwnProperty("pan_back_image")) {
      await queryInterface.addColumn(
        "kyc_documents",
        "pan_back_image",
        {
          type: Sequelize.STRING,
          allowNull: true,
        
        }
      );
    }
  },

  async down (queryInterface, Sequelize) {
      await queryInterface.removeColumn(
      "kyc_documents",
      "aadhar_back_image"
    );
     await queryInterface.removeColumn(
      "kyc_documents",
      "pan_back_image"
    );
     await queryInterface.removeColumn(
      "kyc_documents",
      "driving_license_back_image"
    );
  }
};
