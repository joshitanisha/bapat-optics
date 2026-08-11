import React, { useEffect, useContext, useState } from "react";
import { Button, Form, Row, Col, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarcode,
  faCube,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "./LensModal.css";
import { Context } from "../../../../utils/context";
import { useLocation } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { getData } from "../../../../utils/api";
import Summary from "../Summary/Summary";
import AddOnModal from "./AddOnModal";

function LensModal({
  user_id,
  index,
  show,
  onHide,
  setValue,
  getValues,
  watch,
  register,
  productId,
  setLensIndex,
  setPrescription,
}) {
  const { toggleSidebarFalse, IMG_URL } = useContext(Context);

  const [products, setProducts] = useState([{}]);
  const [lenseId, setLenseId] = useState(null);
  const [lenseTypeId, setLenseTypeId] = useState(null);
  // 🔹 Function to fetch product details
  const getProductDetails = async (index) => {
    const bo_code = watch(`products.${index}.bo_code`);
    const lens_name = watch(`products.${index}.lens_name`);

    if (bo_code || lens_name) {
      const res = await getData(
        `/admin/offline-order/getBoProduct?bo_code=${bo_code || ""}&lens_name=${
          lens_name || ""
        }`
      );
      if (res.success) {
       
        await setLenseTypeId(res.data?.lens_type_id);
        await setLenseId(res.data?.id);

        await setValue(
          `products.${index}.product_details.lens_details`,
          res.data
        );

      
      } else {
        await setValue(`products.${index}.product_details.lens_details`, "");
        console.warn("❌ Product not found");
      }
    } else {
      await setValue(`products.${index}.product_details.lens_details`, "");
    }
  };

  const handleAddLens = async () => {
    await setLensIndex("");
    onHide();
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (
        name &&
        name.includes("products") &&
        (name.endsWith("bo_code") || name.endsWith("lens_name"))
      ) {
        const match = name.match(/products\.(\d+)\./);
        if (match) {
          const index = parseInt(match[1], 10);
          getProductDetails(index);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const cancelLens = () => {
    setValue(`products.${index}.bo_code`, "");
    setValue(`products.${index}.lens_name`, "");
    setValue(`products.${index}.product_details.lens_details`, "");
    onHide();
  };

  const [showAddOnModel, setShowAddOnModel] = useState(false);

  return (
    <>
      <Modal
        show={show}
        onHide={cancelLens}
        size="lg"
        centered
        className="want_modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Lens Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={12}>
              <section className="product-container">
                <h4 className="product-title">Lens</h4>

                <Form>
                  <Row key={index} className="mb-4">
                    <Col md={12}>
                      <div className="product-input-wrapper p-4 shadow rounded bg-white position-relative">
                        <Row className="align-items-start g-3 mb-4">
                          <Col md={5}>
                            <Form.Group>
                              <div className="input-icon d-flex align-items-center">
                                <FontAwesomeIcon
                                  icon={faBarcode}
                                  className="icon me-2"
                                />
                                <Form.Control
                                  type="text"
                                  placeholder="BO Code"
                                  {...register(`products.${index}.bo_code`)}
                                  className="user-input"
                                  autoFocus={
                                    index === products.length - 1 ? true : false
                                  }
                                />
                              </div>
                            </Form.Group>
                          </Col>

                          <Col md={1} className="text-center">
                            <span className="text-muted">OR</span>
                          </Col>

                          <Col md={6}>
                            <Form.Group>
                              <div className="input-icon d-flex align-items-center">
                                <FontAwesomeIcon
                                  icon={faCube}
                                  className="icon me-2"
                                />
                                <Form.Control
                                  type="text"
                                  placeholder="Lens Name"
                                  {...register(`products.${index}.lens_name`)}
                                  className="user-input"
                                />
                              </div>
                            </Form.Group>
                          </Col>
                        </Row>

                        {/* Product Details */}
                        {watch(
                          `products.${index}.product_details.lens_details`
                        ) && (
                          <>
                            <Row>
                              <Col
                                className="col-lg-12 col-md-12 col-12 mb-4"
                                onClick={() => {
                                  setShowAddOnModel(true);
                                  onHide();
                                }}
                              >
                                <div className="product-details-card shadow-sm p-3 rounded bg-white  ">
                                  <div className="product-image-container  text-center">
                                    <img
                                      src={
                                        IMG_URL +
                                        watch(
                                          `products.${index}.product_details.lens_details`
                                        )?.image
                                      }
                                      alt="Product"
                                      className="product-image"
                                    />
                                  </div>

                                  <div className="product-info ">
                                    <p className="variant-name mb-1">
                                      {
                                        watch(
                                          `products.${index}.product_details.lens_details`
                                        )?.name
                                      }
                                    </p>
                                    <h5 className="product-name mb-2">
                                      {
                                        watch(
                                          `products.${index}.product_details.lens_details`
                                        )?.Product_Variants?.[0]?.name
                                      }
                                    </h5>
                                    <p className="product-price mb-1">
                                      <strong>Price:</strong> ₹{" "}
                                      {
                                        watch(
                                          `products.${index}.product_details.lens_details`
                                        )?.price
                                      }
                                    </p>
                                    <p className="barcode-no mb-0">
                                      <strong>BO Code:</strong>{" "}
                                      {
                                        watch(
                                          `products.${index}.product_details.lens_details`
                                        )?.bo_code
                                      }
                                    </p>
                                  </div>
                                </div>
                              </Col>
                            </Row>

                            {/* <Button
                              variant="dark"
                              className="add-btn-floating"
                              onClick={() => {
                                setShowAddOnModel(true);
                                onHide();
                              }}
                            >
                              <FontAwesomeIcon icon={faPlus} className="me-2" />
                              Add AddOn
                            </Button> */}

                            {/* <Button
                              variant="dark"
                              className="add-btn-floating"
                              onClick={handleAddLens}
                            >
                              <FontAwesomeIcon icon={faPlus} className="me-2" />
                              Add Lens
                            </Button> */}
                          </>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Form>
              </section>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
      <AddOnModal
      user_id={user_id}
        setPrescription={setPrescription}
        handleAddLens={handleAddLens}
        lenseId={lenseId}
        lenseTypeId={lenseTypeId}
        productId={productId}
        show={showAddOnModel}
        onHide={() => setShowAddOnModel(false)}
        setValue={setValue}
        index={index}
        getValues={getValues}
        watch={watch}
        register={register}
        setLensIndex={setLensIndex}
      />
    </>
  );
}

export default LensModal;
