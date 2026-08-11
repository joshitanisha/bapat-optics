'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('career', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      job_type_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "jobtypes",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      shift_type_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "shift",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      skill: {
        type: Sequelize.STRING
      },
      job_location: {
        type: Sequelize.STRING
      },
      role_permission: {
        type: Sequelize.STRING
      },
      hr_name: {
        type: Sequelize.STRING
      },
      recruiter_email: {
        type: Sequelize.STRING
      },
      company_name: {
        type: Sequelize.STRING
      },
      vacancy: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      recruiter_contact_number: {
        type: Sequelize.INTEGER
      },
      experience_from: {
        type: Sequelize.INTEGER
      },
      experience_to: {
        type: Sequelize.INTEGER
      },
      start_annual_package: {
        type: Sequelize.DECIMAL
      },
      deadline: {
        type: Sequelize.DATE
      },
      end_annual_package: {
        type: Sequelize.DECIMAL
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {

        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('career');
  }
};