const {
  Paginate,
  SingleCheckExits,
  CheckExits,
  CreateNew,
  UpdateData,
  File_Uploade,
  NotificationsManagment,
  barcodeGenerate,
} = require("../../../../../../helper/common/utils/dbUtils");
const Base = require("../../../../../../helper/exception_handling");
const { RoleId } = require("../../../../../../helper/fix_ids");
const {
  HTTPS,
} = require("../../../../../../helper/https-status-codes/https-status-codes");
const {
  Receiving_Product,
  Receiving,
  Purchase_Receiving,
  Purchase_Order_Product,
  Purchase_Order,
  Purchase_Order_Status,
  Purchase_History,
  Product_Stock,
  Product,
  Supplier,
  Product_Variant_Stock,
  Product_Variant,
  Stocks,
  p_category,
  Stock_History,
  Brand,
  Colour,
  Product_Images,
  Shape,
  sequelize,
} = require("../../../../../../models/index");
const { Op } = require("sequelize");
const product = require("../../../../../../models/product");
const IDS = require("../../../../../../helper/fix_ids");
const moment = require("moment");
const purchase_order = require("../../../../../../models/purchase_order");
const { commonMail } = require("../../../../../../helper/NodeMailer");
const { ProductCreate } = require("../../../../../../helper/product/function");
class PlanController {
  // Fetch all Data
  async findAll(req, res) {
    try {
      const name = req.query.term?.trim() || "";
      let whereClause = {
        [Op.or]: [
          {
            [Op.and]: [{ batch_no: { [Op.like]: `%${name}%` } }],
          },
        ],
      };

      const fromDate = req.query.from ? new Date(req.query.from.trim()) : null;
      const toDate = req.query.to ? new Date(req.query.to.trim()) : null;
      let startCheckDate;

      if (toDate) {
        startCheckDate = new Date(toDate);
        startCheckDate.setDate(startCheckDate.getDate() + 1);
        startCheckDate.setHours(0, 0, 0, 0);
      }

      if (fromDate && toDate) {
        whereClause.createdAt = {
          [Op.between]: [fromDate.toISOString(), startCheckDate.toISOString()],
        };
      } else if (fromDate) {
        whereClause.createdAt = {
          [Op.gte]: fromDate.toISOString(),
        };
      } else if (toDate) {
        whereClause.createdAt = {
          [Op.lte]: startCheckDate.toISOString(),
        };
      }

      const options = {
        include: [
          { model: Purchase_Order_Product, include: [{ model: Product }] },
          { model: Purchase_Order_Status },
          {
            model: Supplier,
          },
        ],
        where: whereClause,
        order: [["createdAt", "DESC"]],
      };
      await Paginate(Purchase_Order, options, req, res, Op);
    } catch (error) {
      console.error("Error fetching Plans:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Fetch a single country by ID
  async findOne(req, res) {
    const t = await sequelize.transaction();
    try {
      const include = [
        {
          model: Purchase_Order_Product,
          include: [
            {
              model: Product,
              include: [
                { model: Brand },
                { model: Colour },
                {
                  model: Colour,
                  as: "lens_color",
                  required: false,
                },
              ],
            },
          ],
        },

        {
          model: Supplier,
        },
      ];

      const result = await Purchase_Order.findOne({
        where: { id: req.params.id },
        include: include,
        transaction: t,
      });

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Plan not found");
      }

      const data = {
        id: result.id,
        batch_no: result.batch_no,
        supplier_id: {
          value: result.supplier_id,
          name: "supplier_id",
          label: result.Supplier?.name || "",
        },
        quantitys: result.Purchase_Order_Products?.map((val) => ({
          id: val.id,
          quantity: val.quantity,
          description: val.description,
          product_id: {
            value: val.product_id,
            name: "product_id",
            label: val.Product?.name || "",
            data: val.Product,
          },
          barcode_status: val.Product?.barcode_status,
          price: val.Product?.price || "",
        })),
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      };

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, data);
    } catch (error) {
      await t.rollback();
      console.error("Error fetching Plan:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const parsequantitys = JSON.parse(req.body.quantitys || "[]");

      const now = new Date();

      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const hour = String(now.getHours()).padStart(2, "0");
      const minute = String(now.getMinutes()).padStart(2, "0");

      // Count existing orders today (optional: per supplier)
      const count = await Purchase_Order.count({
        where: {
          createdAt: {
            [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
        transaction: t,
      });

      const formattedCount = String(count + 1).padStart(3, "0");

      const batchNo = `BN${day}${month}${hour}${minute}${formattedCount}`;

      const PurchaseOrder = await CreateNew(
        Purchase_Order,
        {
          batch_no: batchNo,
          p_o_s_id: IDS.PurchaseOrderStatus.newOrder,
          user_id: req.user.user_id,
          supplier_id: req.body.supplier_id,
          total_quantity: req.body.total_quantity,
        },
        t,
      );

      for (let val of parsequantitys) {
        await CreateNew(
          Purchase_Order_Product,
          {
            user_id: req.user.user_id,
            p_o_id: PurchaseOrder.id,
            product_id: val.product_id,
            quantity: val.quantity,
            description: val.description,
          },
          t,
        );
      }
      const PurchaseHistory = await CreateNew(
        Purchase_History,
        {
          p_o_id: PurchaseOrder.id,
          p_o_s_id: IDS.PurchaseOrderStatus.newOrder,
          comment: "Order Added",
          user_id: req.user.user_id,
          supplier_id: IDS.UserId.Supplier,
          total_quantity: req.body.total_quantity,
        },
        t,
      );

      const supplier = await Supplier.findOne({
        where: { id: req.body.supplier_id },
        transaction: t,
      });

      let productTable = `
      <table border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse; width: 100%;">
        <thead style="background-color: #f2f2f2;">
          <tr>
            <th>Sr. No.</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
    `;

      parsequantitys.forEach((item, index) => {
        productTable += `
        <tr>
          <td>${index + 1}</td>
          <td>${item.product_name}</td>
          <td>${item.quantity}</td>
          <td>${item.description || "-"}</td>
        </tr>
      `;
      });

      productTable += `
        </tbody>
      </table>
    `;

      const emailBody = `
      <h2>New Purchase Order Received</h2>
      <p>Dear ${supplier?.name || "Supplier"},</p>
      <p>A new purchase order has been created with the following details:</p>
      <p><strong>Batch No:</strong> ${batchNo}</p>
      <p><strong>Total Quantity:</strong> ${req.body.total_quantity}</p>
      ${productTable}
      <br/>
      <p>Thank you,<br/>Procurement Team</p>
    `;

      // await commonMail(
      //   supplier?.email,
      //   `New Purchase Order - ${batchNo}`,
      //   emailBody
      // );

      await t.commit();
      return Base.sendResponse(res, HTTPS.CREATED, PurchaseOrder);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Plan:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update a country by ID
  async update(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const parsequantitys = JSON.parse(req.body.quantitys || "[]");
      const PurchaseOrder = await UpdateData(
        Purchase_Order,
        {
          total_quantity: req.body.total_quantity,
        },
        { id: id },
        t,
      );

      await Purchase_Order_Product.destroy({
        where: {
          p_o_id: id,
        },
        transaction: t,
      });

      for (let val of parsequantitys) {
        await CreateNew(
          Purchase_Order_Product,
          {
            user_id: req.user.user_id,
            p_o_id: id,
            product_id: val.product_id,
            quantity: val.quantity,
            description: val.description,
          },
          t,
        );
      }
      const PurchaseHistory = await CreateNew(
        Purchase_History,
        {
          p_o_id: id,
          p_o_s_id: IDS.PurchaseOrderStatus.newOrder,
          comment: "Updated Added",
          user_id: req.user.user_id,
          supplier_id: req.body.supplier_id,
          total_quantity: req.body.total_quantity,
        },
        t,
      );

      await t.commit();
      return Base.sendResponse(
        res,
        HTTPS.ACCEPTED,
        "Plan updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Plan:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  async ReceivingCreate(req, res) {
    const t = await sequelize.transaction();
    try {
      const parsequantitys = JSON.parse(req.body.quantitys || "[]");
      const Receivingdata = await CreateNew(
        Receiving,
        {
          p_o_id: req.body.id,
          batch_no: req.body.batch_no,
          user_id: req.user.user_id,
          supplier_id: req.body.supplier_id,
          quantity: req.body.total_quantity,
          invoice_no: req.body.invoice_no,
          order_no: req.body.order_no,
          // expiry_date: req.body.expiry_date,
          total_price: req.body.total_price,
        },
        t,
      );

      for (let val of parsequantitys) {
        const include = [
          {
            model: Product_Images,
          },
        ];
        const product = await CheckExits(
          Product,
          { id: val?.product_id },
          t,
          include,
        );

        if (val.models.length > 0) {
          for (const model of val.models || []) {
            let productmodel = null;
            if (model?.use_product_color_brand) {
              productmodel = await CheckExits(
                Product,
                {
                  color_id: model?.color_id?.value || null,
                  size: model?.size,
                  model_no: model.model_no,
                },
                t,
              );
            } else {
              productmodel = await CheckExits(
                Product,
                {
                  model_no: model.model_no,
                },
                t,
              );
            }

            if (!productmodel) {
              productmodel = await ProductCreate({
                model,
                product,
                t,
                res,
                req,
              });

              const receivingProduct = await CreateNew(
                Receiving_Product,
                {
                  receiving_id: Receivingdata.id,
                  user_id: req.user.user_id,
                  p_o_p_id: val?.id,
                  product_id: productmodel?.id,
                  quantity: 1,
                  expiry_date: val?.expiry_date,
                  total_price: val?.total_price,
                  price: val?.price,
                  description: val.description,
                },
                t,
              );
              let productstock = await CreateNew(
                Product_Stock,
                {
                  receiving_product_id: receivingProduct.id,
                  product_id: productmodel?.id,
                  // variant_id: variant.variant_id,
                  general_stock: 1,
                  user_id: req.user.user_id,
                  receiving_id: Receivingdata.id,
                },
                t,
              );

              const updatedStock =
                (productmodel?.available_stock || 0) + Number(1);

              await UpdateData(
                Product,
                {
                  available_stock: updatedStock,
                },
                { id: productmodel?.id },
                t,
              );

              let stock = await CheckExits(
                Stocks,
                {
                  product_id: productmodel?.id,
                  stock_status_id: IDS.Stock_Status.Dummy,
                },
                t,
              );

              let stockData = {
                product_id: productmodel?.id,
                supplier_id: req.body.supplier_id,
                // stock_status_id: IDS.Stock_Status.Available,
                model: model.model_no,
                product_stock_id: productstock?.id,
              };

              if (productmodel?.barcode_status) {
                const barcodeData = await barcodeGenerate(null, t);
                stockData.barcode_no = barcodeData.barcode_no;
                stockData.barcode = barcodeData.barcode;
              }

              if (stock) {
                 stockData.stock_status_id= IDS.Stock_Status.Selled,
                await UpdateData(
                  Stocks,
                  stockData,
                  { id: stock?.id },
                  t,
                );
              } else {
                stockData.stock_status_id= IDS.Stock_Status.Available,
                stock = await CreateNew(Stocks, stockData, t);
              }

              await CreateNew(
                Stock_History,
                {
                  stock_id: stock.id,
                  name: "stock Purchase",
                },
                t,
              );

              const ReceivingHistory = await CreateNew(
                Purchase_Receiving,
                {
                  p_o_id: req.body.id,
                  receiving_id: Receivingdata.id,
                  user_id: req.user.user_id,
                },
                t,
              );

              const PurchaseOrder = await UpdateData(
                Purchase_Order,
                {
                  p_o_s_id: IDS.PurchaseOrderStatus.Ordered,
                  // quantity: 1,
                },
                { id: req.params.id },
                t,
              );

              const PurchaseHistory = await CreateNew(
                Purchase_History,
                {
                  p_o_id: req.body.id,
                  p_o_s_id: IDS.PurchaseOrderStatus.Ordered,
                  comment: "Order Converted To Receiving",
                  user_id: req.user.user_id,
                  supplier_id: IDS.UserId.Supplier,
                  total_quantity: req.body.total_quantity,
                },
                t,
              );
            } else {
              const receivingProduct = await CreateNew(
                Receiving_Product,
                {
                  receiving_id: Receivingdata.id,
                  user_id: req.user.user_id,
                  p_o_p_id: val?.id,
                  product_id: productmodel?.id,
                  quantity: 1,
                  expiry_date: val?.expiry_date,
                  total_price: val?.total_price,
                  price: val?.price,
                  description: val.description,
                },
                t,
              );
              let productstock = await CreateNew(
                Product_Stock,
                {
                  receiving_product_id: receivingProduct.id,
                  product_id: productmodel?.id,
                  // variant_id: variant.variant_id,
                  general_stock: 1,
                  // selling_price: variant.selling_price,
                  // subscription_stock: variant.subscription_stock,
                  user_id: req.user.user_id,
                  receiving_id: Receivingdata.id,
                },
                t,
              );

              const updatedStock =
                (productmodel?.available_stock || 0) + Number(1);

              await UpdateData(
                Product,
                {
                  available_stock: updatedStock,
                },
                { id: productmodel?.id },
                t,
              );

              let stock = await CheckExits(
                Stocks,
                {
                  product_id: productmodel?.id,
                  stock_status_id: IDS.Stock_Status.Dummy,
                },
                t,
              );
              let stockData = {
                product_id: productmodel?.id,
                supplier_id: req.body.supplier_id,
                // stock_status_id: IDS.Stock_Status.Available,
                model: productmodel.model_no,
                product_stock_id: productstock?.id,
              };

              if (productmodel?.barcode_status) {
                const barcodeData = await barcodeGenerate(null, t);
                stockData.barcode_no = barcodeData.barcode_no;
                stockData.barcode = barcodeData.barcode;
              }

              // const stock = await CreateNew(Stocks, stockData, t);
              if (stock) {
                 stockData.stock_status_id= IDS.Stock_Status.Selled,
                await UpdateData(Stocks, stockData, { id: stock?.id }, t);
              } else {
                stockData.stock_status_id= IDS.Stock_Status.Available,
                stock = await CreateNew(Stocks, stockData, t);
              }
              await CreateNew(
                Stock_History,
                {
                  stock_id: stock.id,
                  name: "stock Purchase",
                },
                t,
              );

              const ReceivingHistory = await CreateNew(
                Purchase_Receiving,
                {
                  p_o_id: req.body.id,
                  receiving_id: Receivingdata.id,
                  user_id: req.user.user_id,
                },
                t,
              );

              const PurchaseOrder = await UpdateData(
                Purchase_Order,
                {
                  p_o_s_id: IDS.PurchaseOrderStatus.Ordered,
                },
                { id: req.params.id },
                t,
              );

              const PurchaseHistory = await CreateNew(
                Purchase_History,
                {
                  p_o_id: req.body.id,
                  p_o_s_id: IDS.PurchaseOrderStatus.Ordered,
                  comment: "Order Converted To Receiving",
                  user_id: req.user.user_id,
                  supplier_id: IDS.UserId.Supplier,
                  total_quantity: req.body.total_quantity,
                },
                t,
              );
            }
          }
        } else {
          const receivingProduct = await CreateNew(
            Receiving_Product,
            {
              receiving_id: Receivingdata.id,
              user_id: req.user.user_id,
              p_o_p_id: val?.id,
              product_id: val?.product_id,
              quantity: val?.quantity,
              expiry_date: val?.expiry_date,
              total_price: val?.total_price,
              price: val?.price,
              description: val.description,
            },
            t,
          );

          const general_stock = Number(val.quantity);
          let productstock = await CreateNew(
            Product_Stock,
            {
              receiving_product_id: receivingProduct.id,
              product_id: val.product_id,
              // variant_id: variant.variant_id,
              general_stock: val.quantity,
              // selling_price: variant.selling_price,
              // subscription_stock: variant.subscription_stock,
              user_id: req.user.user_id,
              receiving_id: Receivingdata.id,
            },
            t,
          );

          const updatedStock =
            (product?.available_stock || 0) + Number(val.quantity);

          await UpdateData(
            Product,
            {
              available_stock: updatedStock,
            },
            { id: val.product_id },
            t,
          );
          for (let i = 0; i < general_stock; i++) {
            let stock = await CheckExits(
              Stocks,
              {
                product_id: val.product_id,
                stock_status_id: IDS.Stock_Status.Dummy,
              },
              t,
            );
            let stockData = {
              product_id: val.product_id,
              supplier_id: req.body.supplier_id,
              // variant_id: variant.variant_id,
              // stock_status_id: IDS.Stock_Status.Available,
              model: val?.models[i] || null,
              product_stock_id: productstock?.id,
            };

            if (product?.barcode_status) {
              // let barcodeData = await barcodeGenerate(product?.name,product?.price,supplier?.name, t,null);
              let barcodeData = await barcodeGenerate(null, t);

              stockData.barcode_no = barcodeData.barcode_no;
              stockData.barcode = barcodeData.barcode;
            }

            // const stock = await CreateNew(Stocks, stockData, t);
            if (stock) {
              stockData.stock_status_id= IDS.Stock_Status.Selled,
              await UpdateData(Stocks, stockData, { id: stock?.id }, t);
            } else {
               stockData.stock_status_id= IDS.Stock_Status.Available,
              stock = await CreateNew(Stocks, stockData, t);
            }
            await CreateNew(
              Stock_History,
              {
                stock_id: stock?.id,
                name: "stock Purchase",
              },
              t,
            );
          }
        }

        const ReceivingHistory = await CreateNew(
          Purchase_Receiving,
          {
            p_o_id: req.body.id,
            receiving_id: Receivingdata.id,
            user_id: req.user.user_id,
          },
          t,
        );

        const PurchaseOrder = await UpdateData(
          Purchase_Order,
          {
            p_o_s_id: IDS.PurchaseOrderStatus.Ordered,
          },
          { id: req.params.id },
          t,
        );

        const PurchaseHistory = await CreateNew(
          Purchase_History,
          {
            p_o_id: req.body.id,
            p_o_s_id: IDS.PurchaseOrderStatus.Ordered,
            comment: "Order Converted To Receiving",
            user_id: req.user.user_id,
            supplier_id: IDS.UserId.Supplier,
            total_quantity: req.body.total_quantity,
          },
          t,
        );
      }

      await t.commit();
      return Base.sendResponse(res, HTTPS.CREATED, Receivingdata);
    } catch (error) {
      await t.rollback();
      console.error("Error creating Receiving:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // async ReceivingCreate(req, res) {
  //   const t = await sequelize.transaction();
  //   try {
  //     const parsequantitys = JSON.parse(req.body.quantitys || "[]");

  //     const Receivingdata = await CreateNew(
  //       Receiving,
  //       {
  //         p_o_id: req.body.id,
  //         batch_no: req.body.batch_no,
  //         user_id: req.user.user_id,
  //         supplier_id: req.body.supplier_id,
  //         quantity: req.body.total_quantity,
  //         invoice_no: req.body.invoice_no,
  //         order_no: req.body.order_no,
  //         // expiry_date: req.body.expiry_date,
  //         total_price: req.body.total_price,
  //       },
  //       t
  //     );

  // for (let val of parsequantitys) {
  //   // Create main product receiving entry
  //   const receivingProduct = await CreateNew(
  //     Receiving_Product,
  //     {
  //       receiving_id: Receivingdata.id,
  //       user_id: req.user.user_id,
  //       p_o_p_id: val?.id,
  //       product_id: val?.product_id,
  //       quantity: val?.quantity,
  //       expiry_date: val?.expiry_date,
  //       total_price: val?.total_price,
  //       price: val?.price,
  //       description: val.description,
  //     },
  //     t
  //   );

  //   const product = await CheckExits(Product, { id: val?.product_id }, t);
  //     const supplier = await CheckExits(Supplier, { id: val?.product_id }, t);

  //   const general_stock = Number(val.quantity);
  //   let productstock = await CreateNew(
  //     Product_Stock,
  //     {
  //       receiving_product_id: receivingProduct.id,
  //       product_id: val.product_id,
  //       // variant_id: variant.variant_id,
  //       general_stock: val.quantity,
  //       // selling_price: variant.selling_price,
  //       // subscription_stock: variant.subscription_stock,
  //       user_id: req.user.user_id,
  //       receiving_id: Receivingdata.id,
  //     },
  //     t
  //   );

  //   const updatedStock =
  //     (product?.available_stock || 0) + Number(val.quantity);

  //   await UpdateData(
  //     Product,
  //     {
  //       available_stock: updatedStock,
  //     },
  //     { id: val.product_id },
  //     t
  //   );
  //   for (let i = 0; i < general_stock; i++) {
  //     let stockData = {
  //       product_id: val.product_id,
  //       supplier_id: req.body.supplier_id,
  //       // variant_id: variant.variant_id,
  //       stock_status_id: IDS.Stock_Status.Available,
  //       model: val?.models[i] || null,
  //       product_stock_id: productstock?.id,
  //     };

  //     if (product?.barcode_status) {
  //       // let barcodeData = await barcodeGenerate(product?.name,product?.price,supplier?.name, t,null);
  //       let barcodeData = await barcodeGenerate(null, t);

  //       stockData.barcode_no = barcodeData.barcode_no;
  //       stockData.barcode = barcodeData.barcode;
  //     }

  //     const stock = await CreateNew(Stocks, stockData, t);

  //     await CreateNew(
  //       Stock_History,
  //       {
  //         stock_id: stock?.id,

  //         name: "stock Purchase",
  //       },
  //       t
  //     );
  //   }

  //   // for (let variant of val.varients || []) {
  //   // const existingVariant = await Product_Variant.findOne({
  //   //   where: { id: variant.variant_id },
  //   //   transaction: t,
  //   // });

  //   // const updatedGeneralStock =
  //   //   (existingVariant?.general_stock || 0) +
  //   //   Number(variant.general_stock);

  //   //   const updatedSubscriptionStock =
  //   //     (existingVariant?.subscription_stock || 0) +
  //   //     Number(variant.subscription_stock);

  //   //   // Step 2: Create stock entry
  //   // let productvariantstock = await CreateNew(
  //   //   Product_Variant_Stock,
  //   //   {
  //   //     receiving_product_id: receivingProduct.id,
  //   //     product_id: variant.product_id,
  //   //     variant_id: variant.variant_id,
  //   //     general_stock: variant.general_stock,
  //   //     // selling_price: variant.selling_price,
  //   //     subscription_stock: variant.subscription_stock,
  //   //     user_id: req.user.user_id,
  //   //     receiving_id: Receivingdata.id,
  //   //   },
  //   //   t
  //   // );

  //   //   // Step 3: Update variant with new cumulative stock
  //   // await UpdateData(
  //   //   Product_Variant,
  //   //   {
  //   //     general_stock: updatedGeneralStock,
  //   //     subscription_stock: updatedSubscriptionStock,
  //   //     // selling_price: variant.selling_price,
  //   //   },
  //   //   { id: variant.variant_id },
  //   //   t
  //   // );

  //   //   const general_stock = variant.general_stock;

  //   //   for (let i = 0; i < general_stock; i++) {
  //   //     let stockData = {
  //   //       product_id: variant.product_id,
  //   //       variant_id: variant.variant_id,
  //   //       stock_status_id: IDS.Stock_Status.Available,
  //   //       model: variant?.models[i],
  //   //       product_variant_stock_id: productvariantstock?.id,
  //   //     };

  //   //     let barcodeData = await barcodeGenerate(
  //   //       product?.name,
  //   //       existingVariant?.price,
  //   //       variant?.models[i],
  //   //       t
  //   //     );

  //   //     stockData.barcode_no = barcodeData.barcode_no;
  //   //     stockData.barcode = barcodeData.barcode;

  //   //     await CreateNew(Stocks, stockData, t);
  //   //   }
  //   // }
  // }

  // const ReceivingHistory = await CreateNew(
  //   Purchase_Receiving,
  //   {
  //     p_o_id: req.body.id,
  //     receiving_id: Receivingdata.id,
  //     user_id: req.user.user_id,
  //   },
  //   t
  // );

  // const PurchaseOrder = await UpdateData(
  //   Purchase_Order,
  //   {
  //     p_o_s_id: IDS.PurchaseOrderStatus.Ordered,
  //   },
  //   { id: req.params.id },
  //   t
  // );

  // const PurchaseHistory = await CreateNew(
  //   Purchase_History,
  //   {
  //     p_o_id: req.body.id,
  //     p_o_s_id: IDS.PurchaseOrderStatus.Ordered,
  //     comment: "Order Converted To Receiving",
  //     user_id: req.user.user_id,
  //     supplier_id: IDS.UserId.Supplier,
  //     total_quantity: req.body.total_quantity,
  //   },
  //   t
  // );

  //     await t.commit();
  //     return Base.sendResponse(res, HTTPS.CREATED, Receivingdata);
  //   } catch (error) {
  //     await t.rollback();
  //     console.error("Error creating Receiving:", error);
  //     return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
  //   }
  // }

  async delete(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      // Check if the country exists
      const result = await CheckExits(Purchase_Order, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "Plan not found");
      }
      await Purchase_Order_Product.destroy({
        where: { p_o_id: id },
        transaction: t,
      });
      await Purchase_Order.destroy({ where: { id }, transaction: t });

      await t.commit();
      return Base.sendResponse(res, HTTPS.OK, "Plan Deleted Successfully");
    } catch (error) {
      await t.rollback();
      console.error("Error Deleting Plan:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // Update the status of a country
  async status(req, res) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const result = await CheckExits(Purchase_Order, { id }, t);

      if (!result) {
        await t.rollback();
        return Base.sendError(res, HTTPS.NOT_FOUND, "result not found");
      }

      await UpdateData(
        Purchase_Order,
        { status: result.status ? false : true },
        { id },
        t,
      );

      await t.commit();

      return Base.sendResponse(
        res,
        HTTPS.OK,
        "Plan status updated successfully",
      );
    } catch (error) {
      await t.rollback();
      console.error("Error updating Plan status:", error);
      return Base.sendError(res, HTTPS.INTERNAL_SERVER_ERROR, error);
    }
  }
}

module.exports = new PlanController();
