import React, { useEffect, useContext, useState } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Table,
  Card,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { FiSearch } from "react-icons/fi";
import { IoAdd } from "react-icons/io5";
import ProductSearchModal from "./ProductSearchModal";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuFileText } from "react-icons/lu";
import {
  faArchive,
  faBarcode,
  faCircleXmark,
  faCube,
  faPlus,
  faTrash,
  faFilePrescription,
} from "@fortawesome/free-solid-svg-icons";
 
import "./Product.css";
import { Context } from "../../../../utils/context";
import { useLocation } from "react-router-dom";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { getData } from "../../../../utils/api";
import Summary from "../Summary/Summary";
import LensModal from "../LensModal/LensModal";
import { faProductHunt } from "@fortawesome/free-brands-svg-icons";
import { Category, Select2Data } from "../../../../utils/common";
import Lense_prescription_modal from "../LensModal/prescription_modal";

function Product({ user_id }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const { toggleSidebarFalse, IMG_URL } = useContext(Context);
const [showProductSearch, setShowProductSearch] = useState(false);
const [selectedRow, setSelectedRow] = useState(null);
  const [lensModalShow, setLensModalShow] = useState(false);
  const [lensIndex, setLensIndex] = useState("");
  const [PrescriptionModel, setPrescriptionModel] = useState(false);
  const [prescription, setPrescription] = useState(false);
const [category, setCategory] = useState("");
const [search, setSearch] = useState("");
const [products, setProducts] = useState([]);
const { control, register, handleSubmit, watch, setValue, getValues } =
  useForm({
    defaultValues: {
      products: Array.from({ length: 4 }, () => ({
        search: "",
        product_details: "",
      })),
    },
  });
  const { fields, append, remove } = useFieldArray({
  control,
  name: "products",
});
  const onSubmit = (data) => {
    console.log("Product Search Input:", data);
  };
  const handleAddRow = () => {
  if (fields.length >= 10) return;

  append({
    search: "",
    product_details: "",
  });
};
const handleDeleteRow = (index) => {
  // Keep minimum 4 rows
  if (fields.length <= 4) return;

  remove(index);
};

  const [productId, setProductId] = useState([{}]);
const [searchResults, setSearchResults] = useState({});
const [showDropdown, setShowDropdown] = useState({});
const getProductDetails = async (index) => {
  const search = watch(`products.${index}.search`);
  const p_category_id = watch(`products.${index}.p_category_id`) || "";

  const url = `/admin/offline-order/getBarModProduct?model=${encodeURIComponent(
    search || ""
  )}&p_category_id=${p_category_id}`;

  console.log("Request URL:", url);

  const res = await getData(url);

  console.log("API Response:", res);

  if (res.success) {
    setValue(`products.${index}.product_details`, res.data);
  } else {
    setValue(`products.${index}.product_details`, "");
  }
};


  const handleAddLens = async (index) => {
    if (!user_id) {
      alert("Please Add User Details...!");
      return false;
    }
    await setLensModalShow(true);
    await setLensIndex(index);
  };
const handleprescription = (index) => {
    if (!user_id) {
        alert("Please Add User Details...!");
        return;
    }

    setLensIndex(index);
    setPrescriptionModel(true);
};


  const [orderSummaryData, setOrderSummaryData] = useState({});


 


  useEffect(() => {
  console.log("Order Summary Data:", orderSummaryData);
}, [orderSummaryData]);

useEffect(() => {
  const subscription = watch((value, { name }) => {
    if (
      name &&
      name.includes("products") &&
      name.endsWith("search")
    ) {
      const match = name.match(/products\.(\d+)\./);
      if (match) {
        const index = parseInt(match[1], 10);
        getProductDetails(index);
      }
    }
  });

  return () => subscription.unsubscribe();
}, [watch, prescription]);

  const handleRemoveProduct = (index) => {
    setValue(`products.${index}.product_details`, null);
    // setValue(`products.${index}.product_details.lens_details`, null);
    // setValue(`products.${index}.product_details.addon_details`, null);
  };

  const handleRemoveLens = (index) => {
    setValue(`products.${index}.product_details.lens_details`, null);
  };
  const handleRemoveAdd = (index) => {
    setValue(`products.${index}.product_details.addon_details`, null);
  };
  const searchProducts = async (value) => {
  setSearch(value);

  if (value.trim().length < 2) {
    setProducts([]);
    return;
  }

  const url = `/admin/offline-order/getBarModProduct?model=${encodeURIComponent(
    value
  )}&p_category_id=${category}`;

  console.log("Calling:", url);

  const res = await getData(url);

  console.log("Full Response:", res);

  if (res?.success) {
    const list = Array.isArray(res.data)
      ? res.data
      : res.data
      ? [res.data]
      : [];

    console.log("Products:", list);

    setProducts(list);
  } else {
    console.log("API returned failure");
    setProducts([]);
  }
};

  return (
  <>
    <Row>
      <Col md={12}>
        <section className="product-container">
<h4 className="product-title text-center">
    Products
</h4>

          <Form onSubmit={handleSubmit(onSubmit)}>


            {/* Invoice Header */}

            <div className="invoice-header">
              <div>S.No</div>
              <div>HSN</div>
              <div>Product Details</div>
              <div>MRP</div>
              <div>Discount %</div>
              <div>Discount Amt</div>
              <div>Final Price</div>
            </div>
{/* Invoice Rows */}
{fields.map((item, index) => {
  const isLens = index % 2 === 1;

  return (
<div
    className="invoice-row"
    key={item.id}
    onMouseEnter={() =>
        setHoveredProduct(
            watch(`products.${index}.product_details`)
        )
    }
>
      <div>{index + 1}</div>

      <div>
        {watch(`products.${index}.product_details`)?.hsn || "-"}
      </div>

      <div>
        <div className="product-search-cell">
          <div
            className="product-search-trigger"
           onClick={() => {
    setSelectedRow(index);
    setShowProductSearch(true);
}}
          >
            <FiSearch className="search-icon" />

            <span>
              {watch(`products.${index}.product_details`)?.product_name ||
                "Select Product"}
            </span>
          </div>
        </div>
      </div>

      <div>
        ₹{watch(`products.${index}.product_details`)?.mrp || 0}
      </div>

      <div>
        {watch(`products.${index}.product_details`)?.discount || 0}%
      </div>

      <div>
        ₹{watch(`products.${index}.product_details`)?.discount_amount || 0}
      </div>

      <div className="final-price-cell">
        ₹{watch(`products.${index}.product_details`)?.final_price || 0}

        {isLens && (
          <LuFileText
            className="action-icon prescription-icon"
            onClick={() => handleprescription(index)}
          />
        )}

        <RiDeleteBin6Line
          className="action-icon delete-icon"
          onClick={() => handleDeleteRow(index)}
        />
      </div>
    </div>
  );
})}

{/* Add Row Button */}
<div className="text-end mt-3">
  {fields.length < 10 && (
    <Button
      variant="primary"
      onClick={handleAddRow}
    >
      <IoAdd className="me-2" />
      Add Row
    </Button>
  )}
</div>

</Form>

</section>
</Col>
</Row>

<Row className="mt-4">
  <Col md={12}>
<Summary
    prescription={prescription}
    useWatch={useWatch}
    control={control}
    user_id={user_id}
    getValues={getValues}
    watch={watch}
    setValue={setValue}
    setOrderSummaryData={setOrderSummaryData}
    selectedProduct={selectedProduct}
/>
  </Col>
</Row>
<ProductSearchModal
    show={showProductSearch}
    onHide={() => setShowProductSearch(false)}
    selectedRow={selectedRow}
    setValue={setValue}
    getData={getData}
    setSelectedProduct={setSelectedProduct}
/>
<Lense_prescription_modal
  user_id={user_id}
  setPrescription={setPrescription}
  productId={productId}
  handleAddLens={handleAddLens}
  show={PrescriptionModel}
  onHide={() => setPrescriptionModel(false)}
  setValueMain={setValue}
  index={lensIndex}
  getValues={getValues}
  watch={watch}
  register={register}
  setLensIndex={setLensIndex}
/>

<LensModal
  user_id={user_id}
  setPrescription={setPrescription}
  productId={productId}
  show={lensModalShow}
  onHide={() => setLensModalShow(false)}
  setValue={setValue}
  index={lensIndex}
  getValues={getValues}
  watch={watch}
  register={register}
  setLensIndex={setLensIndex}
/>
          

                 
  </>
);
}

export default Product;