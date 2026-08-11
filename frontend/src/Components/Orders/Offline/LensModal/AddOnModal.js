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
import Lense_prescription_modal from "./prescription_modal";
import parse from "html-react-parser";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
function AddOnModal({
  user_id,
  index,
  show,
  onHide,
  setValue,
  getValues,
  watch,
  register,
  setLensIndex,
  lenseId,
  productId,
  lenseTypeId,
  handleAddLens,
  setPrescription,
}) {
  const { toggleSidebarFalse, IMG_URL } = useContext(Context);

  const [products, setProducts] = useState([{}]);

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
        await setValue(
          `products.${index}.product_details.lens_details`,
          res.data
        );
        console.log(res.data, "✅ Product Details");
      } else {
        await setValue(`products.${index}.product_details.lens_details`, "");
        console.warn("❌ Product not found");
      }
    } else {
      await setValue(`products.${index}.product_details.lens_details`, "");
    }
  };

  // const handleAddLens = async () => {
  //   await setLensIndex("");
  //   onHide();
  // };

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

  const [PrescriptionModel, setPrescriptionModel] = useState(false);
  const [addOnId, setAddOnId] = useState(null);
  const [add_on, setAdd_on] = useState([]);

  const GetAddOnData = async () => {
    const response = await getData(`/common/masters/all-addon`);
    setAdd_on(response?.data);
  };

  useEffect(() => {
    GetAddOnData();
  }, []);
  return (
    <>
      <Modal
        show={show}
        onHide={cancelLens}
        size="lg"
        centered
        className="Lens_Details_Modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add AddOn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal_content_div">
            <p className="title_text">Choose Your Lens</p>

            <div className="all_cards_holder">
              {add_on?.map((item) => {
                return (
                  <div
                    className="row_holder"
                    onClick={() => {
                      onHide();
                      setPrescriptionModel(true);
                      setAddOnId(item?.id);
                      setValue(
                        `products.${index}.product_details.addon_details`,
                        item
                      );
                    }}
                  >
                    <div className="left_img_div">
                      <img src={IMG_URL + item?.image} className="img_class" />
                    </div>
                    <div className="text_holder">
                      <div className="first_div">
                        <div className="left_text_div">
                          <p className="label_text">{item?.name}</p>
                          <ul>
                            {parse(
                              typeof item?.description === "string"
                                ? item.description
                                : ""
                            )}
                            {/* {item?.descn?.map((it) => {
                              return <li className="inner_li">{it}</li>;
                            })} */}
                          </ul>
                        </div>

                        <div className="icon_holder">
                          <FontAwesomeIcon
                            icon={faAngleRight}
                            className="icon"
                          />
                        </div>
                      </div>

                      <div className="price_div">
                        <p className="rate_descn_text">Rate cut is now Live</p>
                        <p className="price_text">
                          ₹{item?.price}{" "}
                          <span className="mrp_text">₹{item?.mrp}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <Button
                className="skip_btn"
                onClick={() => {
                  setPrescriptionModel(true);
                  onHide();
                }}
              >
                {" "}
                Skip
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Lense_prescription_modal
      user_id={user_id}
        setPrescription={setPrescription}
        lenseTypeId={lenseTypeId}
        productId={productId}
        handleAddLens={handleAddLens}
        lenseId={lenseId}
        addOnId={addOnId}
        show={PrescriptionModel}
        onHide={() => setPrescriptionModel(false)}
        setValueMain={setValue}
        index={index}
        getValues={getValues}
        watch={watch}
        register={register}
        setLensIndex={setLensIndex}
      />
    </>
  );
}

export default AddOnModal;
