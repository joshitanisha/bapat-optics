'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('about_us', [
      {
        id: 1,
        content: `<div class="welcome_div" style="box-sizing: border-box; color: rgb(33, 37, 41); font-family: Roboto, &quot;sans-serif&quot;; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;">
          <p class="heading1" style="box-sizing: border-box; margin-top: 0px; margin-bottom: 0px; color: rgb(32, 32, 32); opacity: 1; font-size: 22px; font-weight: 700;">Welcome to 'the MOON,</p>
          <p class="info_descn" style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1rem; letter-spacing: 0px; color: rgb(32, 32, 32); font-size: 16px;">the ultimate online shopping destination that’s built with you in mind. We believe shopping should be simple, enjoyable, and accessible to everyone. Our mission is to bring the latest trends, essentials, and unique finds right to your fingertips, offering a seamless and personalized experience for every shopper.</p>
          <p class="info_descn" style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1rem; letter-spacing: 0px; color: rgb(32, 32, 32); font-size: 16px;">At 'the MOON', we’re passionate about connecting people with the products they love. From fashion and beauty to electronics and home goods, our carefully curated collections cater to every taste and need. We partner with trusted brands and vendors around the world, ensuring top-quality items, fair pricing, and exclusive deals you won’t find anywhere else.</p>
        </div>
        <div class="why_shop_with_us_div" style="box-sizing: border-box; margin-top: 35px; color: rgb(33, 37, 41); font-family: Roboto, &quot;sans-serif&quot;; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;">
          <p class="heading1" style="box-sizing: border-box; margin-top: 0px; margin-bottom: 0px; color: rgb(32, 32, 32); opacity: 1; font-size: 22px; font-weight: 700;">Why Shop with Us?</p>
          <p class="heading2" style="box-sizing: border-box; margin-top: 16px; margin-bottom: 0px; color: rgb(32, 32, 32); opacity: 1; font-size: 16px; font-weight: 700;">User-Centric Experience</p>
          <p class="info_descn" style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1rem; letter-spacing: 0px; color: rgb(32, 32, 32); font-size: 16px;">Our app is designed to make shopping easy and fun. With intuitive navigation, personalized recommendations, and secure checkout, you can shop confidently and conveniently.</p>
          <p class="heading2" style="box-sizing: border-box; margin-top: 16px; margin-bottom: 0px; color: rgb(32, 32, 32); opacity: 1; font-size: 16px; font-weight: 700;">Wide Selection:</p>
          <p class="info_descn" style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1rem; letter-spacing: 0px; color: rgb(32, 32, 32); font-size: 16px;">Explore a diverse range of products across multiple categories, all handpicked to provide the best options for your lifestyle.</p>
          <p class="heading2" style="box-sizing: border-box; margin-top: 16px; margin-bottom: 0px; color: rgb(32, 32, 32); opacity: 1; font-size: 16px; font-weight: 700;">Exceptional Service:</p>
          <p class="info_descn" style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1rem; letter-spacing: 0px; color: rgb(32, 32, 32); font-size: 16px;">From fast shipping to responsive customer support, we’re here to make sure your shopping experience is smooth and satisfying.</p>
          <p class="heading2" style="box-sizing: border-box; margin-top: 16px; margin-bottom: 0px; color: rgb(32, 32, 32); opacity: 1; font-size: 16px; font-weight: 700;">Thank you for choosing 'the MOON'.</p>
          <p class="info_descn" style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1rem; letter-spacing: 0px; color: rgb(32, 32, 32); font-size: 16px;">We’re excited to be a part of your shopping journey and are committed to making it as enjoyable as possible. Happy shopping!</p>
        </div>`,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {
      // Add this option to ensure that the existing records are updated
      updateOnDuplicate: ["content", "updatedAt"],
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('about_us', {
      id: {
        [Sequelize.Op.in]: [1],
      },
    }, {});
  }
};
