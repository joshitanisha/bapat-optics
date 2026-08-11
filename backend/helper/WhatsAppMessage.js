const axios = require("axios");
const admin = require("firebase-admin");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { where } = require("sequelize");
const https = require("https");
const fs = require("fs");
// Replace with your actual API key and instance key
const API_KEY = "Ybdwlzcz3ZKK2noUCwp7aLFASgmqPHBLiVagAnjj";
const INSTANCE_KEY = "JbI5abFyXhFldObw";
const TEMPLATE_ID = "171458405460";

const agent = new https.Agent({
  rejectUnauthorized: false,
});

const sendWatsappMessage = async (user, message) => {
  try {
    
    const to_sent = `91${user?.contact_no}`;
    const url = `https://node.profcymafoundation.com:4343/api/v1/profcyma-apis/send-text?apikey=${API_KEY}&instance_key=${INSTANCE_KEY}&to_sent=${to_sent}&template_id=${TEMPLATE_ID}&message=${encodeURIComponent(
      message
    )}`;

    const response = await axios.post(url, {}, { httpsAgent: agent });
    return response.data;
  } catch (error) {
    console.error("Error sending push notification:", error.message);
    // throw error;
  }
};

const sendWatsapp = async (contact_no, message) => {
  try {
    
    const to_sent = `91${contact_no}`;
    const url = `https://node.profcymafoundation.com:4343/api/v1/profcyma-apis/send-text?apikey=${API_KEY}&instance_key=${INSTANCE_KEY}&to_sent=${to_sent}&template_id=${TEMPLATE_ID}&message=${encodeURIComponent(
      message
    )}`;

    const response = await axios.post(url, {}, { httpsAgent: agent });
    return response.data;
  } catch (error) {
    console.error("Error sending push notification:", error.message);
    // throw error;
  }
};

const FormData = require("form-data");

const sendWatsappMessageWithMedia = async (user, message, media) => {
  try {
    const to_sent = `91${user?.contact_no}`;
    const filePath = `${process.env.base}${media}`;


    const url = `https://node.profcymafoundation.com:4343/api/v1/profcyma-apis/send-media?apikey=${API_KEY}&instance_key=${INSTANCE_KEY}&template_id=${TEMPLATE_ID}`;

    const formData = new FormData();

    formData.append("to_sent", to_sent);
    formData.append("message", message);

    const mediaResponse = await axios.get(filePath, { responseType: "stream" });
    formData.append("media_file", mediaResponse.data, {
      filename: media.split("/").pop(),
    });

    const response = await axios.post(url, formData, {
      httpsAgent: agent,
      headers: formData.getHeaders(),
    });

    return response.data;
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendWatsappMessage, sendWatsappMessageWithMedia,sendWatsapp };
