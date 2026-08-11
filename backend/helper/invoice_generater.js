const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const ejs = require("ejs");
const Base = require("./exception_handling");
const { HTTPS } = require("./https-status-codes/https-status-codes");
const {
  Product_Order,
  Product_Order_Detail,

  Users,
  Payment_Type,
  Order_status,
  User_Address,
  Product,
  Product_Variant,

  Payment_Method,
  p_category,

  Purchase_History,
  Purchase_Order,
  Receiving_Product,
  Product_Variant_Stock,
  Area,
  Pincode,
  City,
  State,
  Country,
  App_Setup,
  Users_Address_Details,
  Prescription_Details,
  Lens_Option,
  Prescriptions_Type,
  Prescriptions,
  Addon,
  LensType,
  Lens,
  Brand,
  Colour,
  Wallet,
  Wallet_History,
  Advance_Payment,
  sequelize,
} = require("../models/index");
const { Op } = require("sequelize");
const IDS = require("./fix_ids");
const { Console } = require("console");
require("dotenv").config();

exports.InvoiceGenerater = async (id) => {
  try {
    const html = fs.readFileSync(
      path.join(__dirname, "../view/template/bapat_invoice_order_details.ejs"),
      "utf-8",
    );

    let Order = await Product_Order.findOne({
      include: [
        {
          model: Users,
          include: [
            {
              model: Wallet,
            },
          ],
        },
        {
          model: Product_Order_Detail,
          include: [
            {
              model: Product,
              include: [{ model: Brand }, { model: Colour }],
            },
            {
              model: Product_Variant,
            },
            {
              model: Prescriptions,
              include: [
                {
                  model: Prescription_Details,
                },
                {
                  model: Lens_Option,
                },
                {
                  model: Prescriptions_Type,
                },
                {
                  model: Lens,
                },
                {
                  model: LensType,
                },
                {
                  model: Addon,
                },
                {
                  model: Product,
                  as: "Lense",
                },
              ],
            },
          ],
        },
        {
          model: Payment_Method,
        },

        {
          model: User_Address,
          include: [
            {
              model: Users_Address_Details,
              include: [
                { model: Country },
                { model: State },
                { model: City },
                { model: Pincode },
                { model: Area },
              ],
            },
          ],
        },
      ],
      where: {
        id: id,
      },
    });

    let app_setup = await App_Setup.findOne({
      include: [{ model: Pincode }],
    });

    let wallethistory = await Wallet_History.findOne({
      where: { type: IDS.Wallet_type?.Purchase, order_id: id },
    });
    const filename = Order?.invoice_no + ".pdf";
    const Data = {
      base: process.env.base,
      order: Order,
      app_setup: app_setup,
      wallet_history: wallethistory,
    };

    // const compiledHtml = ejs.render(html, { data: Data });
    const compiledHtml = await ejs.render(
      html,
      { data: Data },
      { async: true },
    );
    const documents = {
      html: compiledHtml,
      data: {
        data: Data,
      },
      path: "./public/invoices/" + filename,
    };

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.setContent(compiledHtml, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdf = await page.pdf({ format: "A4", printBackground: true });

    // Ensure the directory exists
    const dir = path.dirname(documents.path);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write PDF to file
    fs.writeFile(documents.path, pdf, async function (err) {
      if (err) throw err;

      await Product_Order.update(
        { invoice: "/public/invoices/" + filename },
        {
          where: {
            id: id,
          },
        },
      );
    });

    await browser.close();
    return true;
  } catch (error) {
    console.error(error);
  }
};

exports.BarcodeGenerater = async (data) => {
  try {
    const html = fs.readFileSync(
      path.join(__dirname, "../view/template/invoiceBarcode.ejs"),
      "utf-8",
    );

    const filename = `barcode_${Date.now()}.pdf`;
    const Data = {
      base: process.env.base,
      data: data,
    };

    // Render EJS template
    const compiledHtml = ejs.render(html, { data: Data });

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ],
    });

    const page = await browser.newPage();

    // Set viewport to a reasonable size first
    await page.setViewport({
      width: 800,  // Use pixels for viewport
      height: 600,
      deviceScaleFactor: 1,
    });

    await page.setContent(compiledHtml, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Calculate content height
    const bodyHeight = await page.evaluate(() => {
      return document.body.scrollHeight;
    });

    // Generate PDF - use numeric values or proper unit strings
    const pdf = await page.pdf({
      width: "80mm",  // 85mm in pixels (85 * 3.78 = 321.3)
      height: "13mm",  // Use calculated height in pixels
      printBackground: true,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    });

    // Ensure the directory exists
    const dir = path.join(__dirname, "../public/invoices");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filePath = path.join(dir, filename);

    // Write PDF to file
    await fs.promises.writeFile(filePath, pdf);

    await browser.close();

    return `/public/invoices/${filename}`;

  } catch (error) {
    console.error("Barcode generation error:", error);
    throw error;
  }
};

// exports.BarcodeGenerater = async (data) => {
//   try {
//     const html = fs.readFileSync(
//       path.join(__dirname, "../view/template/invoiceBarcode.ejs"),
//       "utf-8",
//     );
//     // console.log(data,"data data");

//     const filename = "barcode" + ".pdf";
//     const Data = {
//       base: process.env.base,
//       data: data,
//     };

//     // const compiledHtml = ejs.render(html, { data: Data });
//     const compiledHtml = await ejs.render(
//       html,
//       { data: Data },
//       { async: true },
//     );
//     const documents = {
//       html: compiledHtml,
//       data: {
//         data: Data,
//       },
//       path: "./public/invoices/" + filename,
//     };

//     const browser = await puppeteer.launch({
//       headless: true,
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });
//     const page = await browser.newPage();

//     await page.setContent(compiledHtml, { waitUntil: "networkidle0" });

//     // Generate PDF
//     // const pdf = await page.pdf({ format: "A4", printBackground: true });

//     const pdf = await page.pdf({
//       width: "100mm",
//       height: "11mm", // 👈 custom page height
//       printBackground: true,
//     });

//     // Ensure the directory exists
//     const dir = path.dirname(documents.path);
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }

//     // Write PDF to file
//     fs.writeFile(documents.path, pdf, async function (err) {
//       if (err) throw err;

//       // await Product_Order.update(
//       //   { invoice: "/public/invoices/" + filename },
//       //   {
//       //     where: {
//       //       id: id,
//       //     },
//       //   }
//       // );
//     });

//     await browser.close();
//     return "/public/invoices/" + filename;
//   } catch (error) {
//     console.error(error);
//   }
// };

//old
// exports.BarcodeGenerater = async (data) => {
//   try {
//     const html = fs.readFileSync(
//       path.join(__dirname, "../view/template/invoiceBarcode.ejs"),
//       "utf-8",
//     );
//     // console.log(data,"data data");

//     const filename = "barcode" + ".pdf";
//     const Data = {
//       base: process.env.base,
//       data: data,
//     };

//     // const compiledHtml = ejs.render(html, { data: Data });
//     const compiledHtml = await ejs.render(
//       html,
//       { data: Data },
//       { async: true },
//     );
//     const documents = {
//       html: compiledHtml,
//       data: {
//         data: Data,
//       },
//       path: "./public/invoices/" + filename,
//     };

//     const browser = await puppeteer.launch({
//       headless: true,
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });
//     const page = await browser.newPage();

//     await page.setContent(compiledHtml, { waitUntil: "networkidle0" });

//     // Generate PDF
//     // const pdf = await page.pdf({ format: "A4", printBackground: true });

//     const pdf = await page.pdf({
//       width: "100mm",
//       height: "10.5mm", // ðŸ‘ˆ custom page height
//       printBackground: true,
//     });

//     // Ensure the directory exists
//     const dir = path.dirname(documents.path);
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }

//     // Write PDF to file
//     fs.writeFile(documents.path, pdf, async function (err) {
//       if (err) throw err;

//       // await Product_Order.update(
//       //   { invoice: "/public/invoices/" + filename },
//       //   {
//       //     where: {
//       //       id: id,
//       //     },
//       //   }
//       // );
//     });

//     await browser.close();
//     return "/public/invoices/" + filename;
//   } catch (error) {
//     console.error(error);
//   }
// };
exports.BillGenerater = async (id) => {
  try {
    const html = fs.readFileSync(
      path.join(__dirname, "../view/template/Bill.ejs"),
      "utf-8",
    );

    let Order = await Product_Order.findOne({
      include: [
        {
          model: Product_Order_Detail,
          include: [
            {
              model: Product,
            },
            {
              model: Product_Variant,
            },
          ],
        },
        {
          model: Payment_Method,
        },

        {
          model: User_Address,
        },
        {
          model: Users,
        },
      ],
      where: {
        id: id,
      },
    });

    const filename = Order?.invoice_no + ".pdf";
    const Data = {
      base: process.env.base,
      order: Order,
    };

    // const compiledHtml = ejs.render(html, { data: Data });
    const compiledHtml = await ejs.render(
      html,
      { data: Data },
      { async: true },
    );
    const documents = {
      html: compiledHtml,
      data: {
        data: Data,
      },
      path: "./public/invoices/" + filename,
    };

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.setContent(compiledHtml, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdf = await page.pdf({ format: "A4", printBackground: true });

    // Ensure the directory exists
    const dir = path.dirname(documents.path);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write PDF to file
    fs.writeFile(documents.path, pdf, async function (err) {
      if (err) throw err;

      await Product_Order.update(
        { invoice: "/public/invoices/" + filename },
        {
          where: {
            id: id,
          },
        },
      );
    });

    await browser.close();
    return true;
  } catch (error) {
    console.error(error);
  }
};

exports.ShippingSlip = async (id) => {
  try {
    const html = fs.readFileSync(
      path.join(__dirname, "../view/template/shipping_slip.ejs"),
      "utf-8",
    );

    let Order = await db.orders.findOne({
      include: [
        {
          model: db.orders_details,
          include: [
            {
              model: db.product,
            },
            // { model: db.p_a_v, include: [{ model: db.variant }] },
            // { model: db.p_a_v_a_v, include: [{ model: db.variant }] },
          ],
        },
        {
          model: db.order_payment,
        },
        {
          model: db.address,
        },
        {
          model: db.users,
        },
        {
          model: db.shipping_details,
        },
      ],
      where: {
        id: id,
      },
    });

    // const filename = Math.random() + "_doc" + ".pdf";
    const filename = Order?.invoice_number + "shipping.pdf";
    const Data = {
      base: db.base,
      order: Order,
    }; // Add your data here

    const compiledHtml = ejs.render(html, { data: Data });
    const documents = {
      html: compiledHtml,
      data: {
        data: Data,
      },
      path: "./public/shipping_slips/" + filename,
    };

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.setContent(compiledHtml, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({ format: "A4", printBackground: true });

    // Ensure the directory exists
    const dir = path.dirname(documents.path);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write PDF to file
    fs.writeFile(documents.path, pdf, async function (err) {
      if (err) throw err;

      await db.shipping_details.update(
        { shipping_slip: "/public/shipping_slips/" + filename },
        {
          where: {
            order_id: id,
          },
        },
      );
    });

    await browser.close();
    return true;
  } catch (error) {
    console.error(error);
  }
};

exports.InvoiceGeneraterNormal = async (id, isAdvance = false) => {
  let browser;
  try {
    const html = fs.readFileSync(
      path.join(__dirname, "../view/template/bapat_invoice_order_details.ejs"),
      "utf-8",
    );
    const isAdvanceReceipt = String(isAdvance) === "true" || isAdvance === true;

    let Order = await Product_Order.findOne({
      include: [
        {
          model: Users,
          include: [
            {
              model: Wallet,
            },
          ],
        },
        // { model: Advance_Payment, include: [{ model: Payment_Method }] },
        {
          model: Product_Order_Detail,
          include: [
            {
              model: Product,
              include: [{ model: Brand }, { model: Colour }],
            },
            {
              model: Product_Variant,
            },
            {
              model: Prescriptions,
              include: [
                {
                  model: Prescription_Details,
                },
                {
                  model: Lens_Option,
                },
                {
                  model: Prescriptions_Type,
                },
                {
                  model: Lens,
                },
                {
                  model: LensType,
                },
                {
                  model: Addon,
                },
                {
                  model: Product,
                  as: "Lense",
                },
              ],
            },
          ],
        },
        {
          model: Advance_Payment,
        },
        {
          model: Payment_Method,
        },
        {
          model: User_Address,
          include: [
            {
              model: Users_Address_Details,
              include: [
                { model: Country },
                { model: State },
                { model: City },
                { model: Pincode },
                { model: Area },
              ],
            },
          ],
        },
      ],
      where: {
        id: id,
      },
    });

    let app_setup = await App_Setup.findOne({
      include: [{ model: Pincode }],
    });
    let wallethistory = await Wallet_History.findOne({
      where: { type: IDS.Wallet_type?.Purchase, order_id: id },
    });

    // console.log("Order", Order);
    // Order?.id
    console.log("isAdvance", isAdvanceReceipt);
    const prefix = isAdvanceReceipt ? "Advance_Receipt_" : "Invoice_";
    const filename = prefix + Order?.invoice_no + ".pdf";
    // const filename = Order?.invoice_no + ".pdf";
    console.log("filename", filename);
    // ***************
    let base64Logo = "";
    try {
      // Assuming app_setup.logo is a relative path like "/public/images/logo.png"
      // Adjust the path.join logic to point to exactly where the image lives on your server
      const logoPath = path.join(__dirname, "..", app_setup.logo);
      const logoBuffer = fs.readFileSync(logoPath);
      const base64Data = logoBuffer.toString('base64');

      // Determine the extension (png, jpg, etc.)
      const ext = path.extname(logoPath).replace('.', '') || 'png';
      base64Logo = `data:image/${ext};base64,${base64Data}`;
    } catch (err) {
      console.error("Failed to convert logo to Base64:", err);
      base64Logo = app_setup?.logo; // Fallback to standard URL if local read fails
    }
    // ***************
    const cleanOrder = Order ? Order.get({ plain: true }) : null;

    const Data = {
      base: process.env.base,
      order: cleanOrder,
      app_setup: app_setup,
      logo_base64: base64Logo, // Injecting the new base64 string
      wallet_history: wallethistory,
      isAdvance: isAdvanceReceipt // <--- Add this here
    };
    console.log("Data",Data);
    // const compiledHtml = ejs.render(html, { data: Data });
    const compiledHtml = await ejs.render(
      html,
      { data: Data },
      { async: true },
    );
    const documents = {
      html: compiledHtml,
      data: {
        data: Data,
      },
      path: "./public/invoices/" + filename,
    };

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.setContent(compiledHtml, { waitUntil: "networkidle0", timeout: 60000 });

    // Generate PDF
    const pdf = await page.pdf({ format: "A4", printBackground: true });

    // Ensure the directory exists
    const dir = path.dirname(documents.path);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write PDF to file
    // fs.writeFile(documents.path, pdf, async function (err) {
    //   if (err) throw err;

    //   // await Product_Order.update(
    //   //   { invoice: "/public/invoices/" + filename },
    //   //   {
    //   //     where: {
    //   //       id: id,
    //   //     },
    //   //   }
    //   // );
    // });

    fs.writeFileSync(documents.path, pdf);

    // await browser.close();
    return "/public/invoices/" + filename;
  } catch (error) {
    console.error(error);
  }
  finally {
    // 4. ADD the finally block. This runs 100% of the time, even if the try block fails.
    if (browser) {
      await browser.close();
    }
  }
};

exports.InvoiceGeneraterReturn = async (id) => {
  try {
    const html = fs.readFileSync(
      path.join(__dirname, "../view/template/bapat_invoice_order_details.ejs"),
      "utf-8",
    );

    let Order = await Product_Order.findOne({
      include: [
        {
          model: Users,
          include: [
            {
              model: Wallet,
            },
          ],
        },
        {
          model: Product_Order_Detail,
          where: { return_status: false },
          include: [
            {
              model: Product,
              include: [{ model: Brand }, { model: Colour }],
            },
            {
              model: Product_Variant,
            },
            {
              model: Prescriptions,
              include: [
                {
                  model: Prescription_Details,
                },
                {
                  model: Lens_Option,
                },
                {
                  model: Prescriptions_Type,
                },
                {
                  model: Lens,
                },
                {
                  model: LensType,
                },
                {
                  model: Addon,
                },
                {
                  model: Product,
                  as: "Lense",
                },
              ],
            },
          ],
        },
        {
          model: Payment_Method,
        },

        {
          model: User_Address,
          include: [
            {
              model: Users_Address_Details,
              include: [
                { model: Country },
                { model: State },
                { model: City },
                { model: Pincode },
                { model: Area },
              ],
            },
          ],
        },
      ],
      where: {
        id: id,
      },
    });

    let app_setup = await App_Setup.findOne({
      include: [{ model: Pincode }],
    });

    let wallethistory = await Wallet_History.findOne({
      where: { type: IDS.Wallet_type?.Purchase, order_id: id },
    });
    const filename = Order?.invoice_no + ".pdf";
    const Data = {
      base: process.env.base,
      order: Order,
      app_setup: app_setup,
      wallet_history: wallethistory,
    };

    // const compiledHtml = ejs.render(html, { data: Data });
    const compiledHtml = await ejs.render(
      html,
      { data: Data },
      { async: true },
    );
    const documents = {
      html: compiledHtml,
      data: {
        data: Data,
      },
      path: "./public/invoices/" + filename,
    };

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.setContent(compiledHtml, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdf = await page.pdf({ format: "A4", printBackground: true });

    // Ensure the directory exists
    const dir = path.dirname(documents.path);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write PDF to file
    fs.writeFile(documents.path, pdf, async function (err) {
      if (err) throw err;

      // await Product_Order.update(
      //   { invoice: "/public/invoices/" + filename },
      //   {
      //     where: {
      //       id: id,
      //     },
      //   },
      // );
    });

    await browser.close();
    return "/public/invoices/" + filename;
  } catch (error) {
    console.error(error);
  }
};

exports.InvoiceGeneraterCancel = async (id) => {
  try {
    const html = fs.readFileSync(
      path.join(__dirname, "../view/template/bapat_invoice_order_details.ejs"),
      "utf-8",
    );

    let Order = await Product_Order.findOne({
      include: [
        {
          model: Users,
          include: [
            {
              model: Wallet,
            },
          ],
        },
        {
          model: Product_Order_Detail,
          where: { status: false },
          include: [
            {
              model: Product,
              include: [{ model: Brand }, { model: Colour }],
            },
            {
              model: Product_Variant,
            },
            {
              model: Prescriptions,
              include: [
                {
                  model: Prescription_Details,
                },
                {
                  model: Lens_Option,
                },
                {
                  model: Prescriptions_Type,
                },
                {
                  model: Lens,
                },
                {
                  model: LensType,
                },
                {
                  model: Addon,
                },
                {
                  model: Product,
                  as: "Lense",
                },
              ],
            },
          ],
        },
        {
          model: Payment_Method,
        },

        {
          model: User_Address,
          include: [
            {
              model: Users_Address_Details,
              include: [
                { model: Country },
                { model: State },
                { model: City },
                { model: Pincode },
                { model: Area },
              ],
            },
          ],
        },
      ],
      where: {
        id: id,
      },
    });

    let app_setup = await App_Setup.findOne({
      include: [{ model: Pincode }],
    });

    let wallethistory = await Wallet_History.findOne({
      where: { type: IDS.Wallet_type?.Purchase, order_id: id },
    });
    const filename = Order?.invoice_no + ".pdf";
    const Data = {
      base: process.env.base,
      order: Order,
      app_setup: app_setup,
      wallet_history: wallethistory,
    };

    // const compiledHtml = ejs.render(html, { data: Data });
    const compiledHtml = await ejs.render(
      html,
      { data: Data },
      { async: true },
    );
    const documents = {
      html: compiledHtml,
      data: {
        data: Data,
      },
      path: "./public/invoices/" + filename,
    };

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.setContent(compiledHtml, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdf = await page.pdf({ format: "A4", printBackground: true });

    // Ensure the directory exists
    const dir = path.dirname(documents.path);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write PDF to file
    fs.writeFile(documents.path, pdf, async function (err) {
      if (err) throw err;

      // await Product_Order.update(
      //   { invoice: "/public/invoices/" + filename },
      //   {
      //     where: {
      //       id: id,
      //     },
      //   },
      // );
    });

    await browser.close();
    return "/public/invoices/" + filename;
  } catch (error) {
    console.error(error);
  }
};
