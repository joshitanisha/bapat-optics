const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");
const { HTTPS } = require("../../https-status-codes/https-status-codes");
const Base = require("../../exception_handling");
const { ContactType } = require("../../fix_ids");
const request = require("request");
const QRCode = require("qrcode");
const bwipjs = require("bwip-js");
const { createCanvas, loadImage } = require("canvas");
const { AdminNotifications } = require("../../mobile_notifications");
const {
  Users,
  Notification,
  Stocks,
  sequelize,
} = require("../../../models/index");
const crypto = require("crypto");
const {
  transaction,
} = require("../../../controllers/api/v1/mobile/wallet/wallet.controller");

const File_Uploade = async (mediaFiles, folder) => {
  try {
    const file = mediaFiles;
    const fileName = Date.now() + "-" + file?.name;

    // Ensure the directory exists
    const dir = path.join(__dirname, "../../../", "public", folder);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const uploadPath = path.join(
      __dirname,
      `../../../public${folder}`,
      fileName,
    );

    await new Promise((resolve, reject) => {
      file?.mv(uploadPath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    return `/public${folder}/` + fileName;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const Custom_File_Uploade = async (mediaFiles, folder) => {
  try {
    const file = mediaFiles;
    const fileName = file?.name;

    // Ensure the directory exists
    const dir = path.join(__dirname, "../../../", "public", folder);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const uploadPath = path.join(
      __dirname,
      `../../../public${folder}`,
      fileName,
    );

    await new Promise((resolve, reject) => {
      file?.mv(uploadPath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    return `/public${folder}/` + fileName;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const QRStore = async (url, fileName) => {
  try {
    const outputPath = path.join("public", "uploads", "store-qr", fileName);

    const storePath = `public/uploads/store-qr/${fileName}`;
    // Ensure directory exists
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    // Generate QR and save as file
    QRCode.toFile(
      outputPath,
      url,
      {
        type: "png",
        width: 300,
      },
      function (err) {
        if (err) return console.error("QR generation failed:", err);
        console.log("✅ QR code saved to:", outputPath);
      },
    );
    return outputPath;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getSingle = async (database, condition, t, include = []) => {
  try {
    const data = await database.findOne({
      include: include,
      where: condition,
      transaction: t,
    });
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const CheckExits = async (database, condition, t, include = []) => {
  try {
    const data = await database.findOne({
      include: include,
      where: condition,
      transaction: t,
    });
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const CreateNew = async (database, addData, t) => {
  try {
    const data = await database.create(addData, {
      transaction: t,
    });
    return data;
  } catch (error) {
    // await t.rollback();
    console.error(error);
    throw error;
  }
};

const UpdateData = async (database, updatedata, condition, t) => {
  try {
    const data = await database.update(updatedata, {
      where: condition,
      transaction: t,
    });
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const BulkUploadCreate = async (database, condition, t) => {
  try {
    const exits = await CheckExits(database, condition, t);
    if (exits) {
      return [exits, "Exits"];
    } else {
      const created = await CreateNew(database, condition, t);
      return [created, "Created"];
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const Paginate = async (model, options, req, res, Op) => {
  try {
    const term = req.query.term || "";
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const per_page = req.query.per_page ? parseInt(req.query.per_page) : 10;

    // Adjust options for findAndCountAll
    const queryOptions = {
      ...options,
      where: {
        ...options.where,
      },
      offset: (page - 1) * per_page,
      limit: per_page,
      distinct: true,
    };

    const { count, rows: data } = await model.findAndCountAll(queryOptions);

    const total_pages = Math.ceil(count / per_page);

    // Send the response
    return Base.sendResponse(res, HTTPS.OK, {
      data: data,
      current_page: page,
      total_pages: total_pages,
      per_page: per_page,
      total: count,
      search_name: term,
    });
  } catch (error) {
    return Base.sendResponse(res, HTTPS.INTERNAL_SERVER_ERROR, {
      message: error.message,
    });
  }
};

const VerifyAnyOtp = async (
  database,
  req,
  res,
  contact_type_id = ContactType.Phone,
) => {
  try {
    let whereCondition = {};

    if (contact_type_id === ContactType.Phone) {
      whereCondition = {
        contact_no: req.body.contact_no,
        contact_type_id: contact_type_id,
      };
    } else {
      whereCondition = {
        email: req.body.email,
        contact_type_id: contact_type_id,
      };
    }
    const verify = await database.findOne({
      where: whereCondition,
      order: [["createdAt", "DESC"]],
      limit: 1,
    });

    if (verify && verify.otp == req.body.otp) {
      await verify.destroy();
      await database.destroy({
        where: whereCondition,
      });
      return true;
    } else {
      return false;
    }
  } catch (err) {
    await t.rollback();
    console.error(err);
    return false;
  }
};

const DownloadSample = async (req, res, name) => {
  try {
    const filePath = path.join(
      __dirname,
      `../../../public/sample/${name}.xlsx`,
    );

    if (fs.existsSync(filePath)) {
      res.setHeader("Content-Type", "application/octet-stream");

      res.setHeader("Content-Disposition", `attachment; filename=${name}.ext`);

      const fileStream = fs.createReadStream(filePath);
      return fileStream.pipe(res);
    } else {
      res.status(404).send("File not found");
    }
  } catch (error) {
    console.error(error);
  }
};

const SendMobileSms = async (mobile, text) => {
  try {
    console.log("Sending SMS to:", mobile, "with text:", text);

    const url = `http://sms.orcainfosolutions.com/api/mt/SendSMS?user=profcyma&password=password1&senderid=PROGBL&channel=Trans&DCS=0&flashsms=0&number=${mobile}&text=${text}&route=13&PEId=1201168896800164072`;

    request(url, function (error, response, body) {
      if (error) throw new Error(error);
      else {
        console.log("SMS sent successfully");
        return true;
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(Base.sendError("Internal server error"));
  }
};

const NotificationsManagment = async (data, t, type = "created") => {
  try {
    const settings = await Users.findAll({
      where: {
        device_key: {
          [Op.ne]: null,
        },
      },
    });

    // UsersNotifications
    for (const customer of settings) {
      await AdminNotifications(customer?.device_key, data);
      // await CreateNew(
      //   UsersNotifications,
      //   {
      //     customer_id: customer.id,
      //     notification_id: data.id,
      //   },
      //   t
      // );
    }
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const formatDate = async (input) => {
  const date = new Date(input);
  if (isNaN(date)) {
    throw new Error(`Invalid date provided: ${input}`);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// const barcodeGenerate = async (
//   productName,
//   price,
//   modelNo,
//   t,
//   barcode_no = null
// ) => {
//   let exists;

//   // Generate unique barcode number

//   if (barcode_no === null) {
//     do {
//       barcode_no = Math.floor(100000 + Math.random() * 900000);
//       exists = await CheckExits(Stocks, { barcode_no }, t);
//     } while (exists);
//   }

//   // Generate barcode
//   const barcodeBuffer = await bwipjs.toBuffer({
//     bcid: "code128",
//     text: String(barcode_no),
//     scale: 2.5,
//     height: 25,
//     includetext: true,
//     textxalign: "center",
//   });

//   const barcodeImage = await loadImage(barcodeBuffer);

//   // 300 DPI = 11.81 px/mm
//   const mmToPx = (mm) => Math.round((mm / 25.4) * 300);

//   const labelWidth = mmToPx(55); // 55mm printable width (bat body)
//   const labelHeight = mmToPx(12); // 12mm height

//   const canvas = createCanvas(labelWidth, labelHeight);
//   const ctx = canvas.getContext("2d");

//   // Background white
//   ctx.fillStyle = "#FFFFFF";
//   ctx.fillRect(0, 0, labelWidth, labelHeight);

//   // Add "Bapat Optics" above barcode
//   ctx.fillStyle = "#000000";
//   ctx.font = "bold 14px Arial";
//   ctx.textAlign = "center";
//   ctx.fillText("Bapat Optics", labelWidth / 2, 15);

//   // Product info (left)
//   ctx.textAlign = "left";
//   ctx.font = "12px Arial";
//   ctx.fillText(productName, 5, 30);
//   ctx.fillText(`Rs. ${price}`, 5, 45);
//   ctx.fillText(modelNo, 5, 60);

//   // Draw barcode (right side)
//   const barcodeX = labelWidth / 2 + 25;
//   const barcodeY = 25;

//   // scale barcode if needed
//   const scaleFactor = Math.min((labelHeight - 25) / barcodeImage.height, 1);
//   const barcodeWidth = barcodeImage.width * scaleFactor;
//   const barcodeHeight = barcodeImage.height * scaleFactor;

//   ctx.drawImage(barcodeImage, barcodeX, barcodeY, barcodeWidth, barcodeHeight);

//   // Save to file
//   const fileName = `barcode_${barcode_no}.png`;
//   const savePath = path.join(
//     process.cwd(),
//     "public",
//     "uploads",
//     "barcode",
//     fileName
//   );
//   fs.mkdirSync(path.dirname(savePath), { recursive: true });
//   fs.writeFileSync(savePath, canvas.toBuffer("image/png"));

//   return {
//     barcode_no,
//     barcode: `/public/uploads/barcode/${fileName}`,
//   };
// };

// const barcodeGenerate = async (barcode_no = null, t) => {
//   let exists;

//   if (barcode_no === null) {
//     do {
//       barcode_no = Math.floor(100000 + Math.random() * 900000);
//       exists = await CheckExits(Stocks, { barcode_no }, t);
//     } while (exists);
//   }

//   // Generate barcode WITHOUT alpha background
//   const barcodeBuffer = await bwipjs.toBuffer({
//     bcid: "code128",
//     text: String(barcode_no),
//     scale: 3,
//     height: 25,
//     includetext: true,
//     textxalign: "center",
//     paddingwidth: 0,
//     paddingheight: 0,
//     backgroundcolor: "FFFFFF", // IMPORTANT
//   });

//   const barcodeImage = await loadImage(barcodeBuffer);

//   // Canvas EXACT barcode size
//   const canvas = createCanvas(barcodeImage.width, barcodeImage.height);
//   const ctx = canvas.getContext("2d");

//   // Transparent canvas
//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   // Draw barcode
//   ctx.drawImage(barcodeImage, 0, 0);

//   const fileName = `barcode_${barcode_no}.png`;
//   const savePath = path.join(
//     process.cwd(),
//     "public",
//     "uploads",
//     "barcode",
//     fileName
//   );

//   fs.mkdirSync(path.dirname(savePath), { recursive: true });
//   fs.writeFileSync(savePath, canvas.toBuffer("image/png"));

//   return {
//     barcode_no,
//     barcode: `/public/uploads/barcode/${fileName}`,
//   };
// };

const barcodeGenerate = async (barcode_no = null, t) => {
  let exists;

  if (barcode_no === null) {
    do {
      barcode_no = Math.floor(100000 + Math.random() * 900000);
      exists = await CheckExits(Stocks, { barcode_no }, t);
    } while (exists);
  }

  // Generate SMALL barcode WITHOUT text
  const barcodeBuffer = await bwipjs.toBuffer({
    bcid: "code128",
    text: String(barcode_no),
    scale: 2, // thinner barcode
    height: 6, // SMALL height (try 8–15 as needed)
    includetext: false, // ❌ remove number text
    paddingwidth: 0,
    paddingheight: 0,
    backgroundcolor: "FFFFFF",
  });

  const barcodeImage = await loadImage(barcodeBuffer);

  // Exact size canvas
  const canvas = createCanvas(barcodeImage.width, barcodeImage.height);
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(barcodeImage, 0, 0);

  const fileName = `barcode_${barcode_no}.png`;
  const savePath = path.join(
    process.cwd(),
    "public",
    "uploads",
    "barcode",
    fileName,
  );

  fs.mkdirSync(path.dirname(savePath), { recursive: true });
  fs.writeFileSync(savePath, canvas.toBuffer("image/png"));

  return {
    barcode_no,
    barcode: `/public/uploads/barcode/${fileName}`,
  };
};


module.exports = {
  File_Uploade,
  CheckExits,
  CreateNew,
  UpdateData,
  BulkUploadCreate,
  Paginate,
  getSingle,
  VerifyAnyOtp,
  DownloadSample,
  SendMobileSms,
  QRStore,
  NotificationsManagment,
  formatDate,
  barcodeGenerate,
  Custom_File_Uploade,
};
