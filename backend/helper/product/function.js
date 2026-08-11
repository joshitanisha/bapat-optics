const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");
const { HTTPS } = require("../https-status-codes/https-status-codes");
const Base = require("../exception_handling");
const { ContactType } = require("../fix_ids");
const request = require("request");
const QRCode = require("qrcode");
const { AdminNotifications } = require("../mobile_notifications");
const {
  Product,
  Purchase_History,
  Receiving,
  Receiving_Product,
  Brand,
  Offer,
  Colour,
  Shape,
  Supplier,
  Purchase_Order,
  Purchase_Order_Product,
  Product_Stock,
  Stock_History,
  Purchase_Receiving,
  Stocks,
  Product_Images,
  sequelize,
} = require("../../models/index");

const {
  CreateNew,
  UpdateData,
  File_Uploade,
  CheckExits,
} = require("../common/utils/dbUtils");
const IDS = require("../fix_ids");

const ProductCreate = async ({ model, product, t, res, req }) => {
  const Count = await Product.count({});
  const brand = await CheckExits(
    Brand,
    { id: model?.brand_id?.value || product?.brand_id },
    t
  );
  const shape = await CheckExits(
    Shape,
    { id: model?.brand_id?.value || product?.shape_id },
    t
  );
  const color = await CheckExits(
    Colour,
    { id: model?.color_id?.value || product?.color_id },
    t
  );
  const productname = `${brand?.name} ${shape?.name} ${color?.name} ${model?.model_no}`;
  const data = {
    name: productname,
    price: product?.price ? Number(product.price) : null,
    mrp: product?.mrp ? Number(product.mrp) : null,
    discount: product?.discount ? Number(product.discount) : null,
    discount_amount: product?.discount_amount
      ? Number(product.discount_amount)
      : null,
    tax_percentage: product?.tax_percentage
      ? Number(product.tax_percentage)
      : null,
    tax_amount: product?.tax_amount ? Number(product.tax_amount) : null,
    base_amount: product?.base_amount ? Number(product.base_amount) : null,
    manufacturer: product?.manufacturer?.trim(),
    description: product?.description?.trim(),
    p_category_id: product?.p_category_id || null,
    brand_id: brand?.id || null,
    gender_id: product?.gender_id || null,
    shape_id: product?.shape_id || null,
    color_id: color?.id || null,
    frame_type_id: product?.frame_type_id || null,
    face_width_id: product?.face_width_id || null,
    material_id: product?.material_id || null,
    made_in_id: product?.made_in_id || null,
    approval_status_id: IDS.ApprovalStatus.Approved,
    sort_order: Count + 1,
    image: product?.image || null,
    tax_type_id: product?.tax_type_id || null,
    water_content: product?.water_content?.trim(),
    diameter: product?.diameter?.trim(),
    base_curve: product?.base_curve?.trim(),
    modality: product?.modality?.trim(),
    dk_t: product?.dk_t?.trim(),
    index:
      product?.index && !isNaN(product.index) ? Number(product.index) : null,
    customer_view: product?.customer_view,
    lens_type_id: product?.lens_type_id || null,
    coating_id: product?.coating_id || null,
    lens_color_id: product?.lens_color_id || null,
    lens_category_id: product?.lens_category_id || null,
    bo_code: product?.bo_code?.trim(),
    coating_name: product?.coating_name?.trim(),
    size: model?.size || product?.size,
    total_measurements: product?.total_measurements?.trim(),
    available_stock: product?.quantity,
    model_no: model?.model_no,
    barcode_status: product?.barcode_status,
  };

  const newProduct = await CreateNew(Product, data, t);

  const variantImages = product.Product_Images;
  const images = Array.isArray(variantImages)
    ? variantImages
    : variantImages
    ? [variantImages]
    : [];

  for (const image of images) {
    await Product_Images.create(
      {
        product_id: newProduct.id,
        image: image?.image,
      },
      { transaction: t }
    );
  }
 
  return newProduct;
};

module.exports = {
  ProductCreate,
};
