import React, { useContext, useState, useEffect } from "react";
import { Row, Col, Form, Modal } from "react-bootstrap";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import classNames from "classnames";
import { Context } from "../../../../utils/context";
import ModalSave from "../../../common/ModelSave";
import { CancelButton, SaveButton } from "../../../common/Button";

const SendSupplier = (props) => {
  const { postData, getData, Select2Data } = useContext(Context);

  const [product, setProduct] = useState([]);
  const [stock, setStock] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [showModal, setShowModal] = useState({ code: 0, message: "" });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const GetAllProduct = async () => {
    const response = await getData(`/common/masters/product`);
    if (response?.success) {
      setProduct(await Select2Data(response.data, "product_id"));
    }
  };

  const GetAllStock = async (id) => {
    const response = await getData(
      `/common/masters/stock-available-sale/${id}`,
    );
    if (response?.success) {
      const result = response.data.map((d) => ({
        value: d.id,
        label: `${d.barcode_no}-${d.model}`,
        supplier_id: d.supplier_id,
      }));
      setStock(result);
    }
  };

  const GetAllSupplier = async () => {
    const response = await getData("/common/masters/all-supplier");
    if (response?.success) {
      setSupplier(await Select2Data(response?.data, "supplier_id"));
    }
  };

  useEffect(() => {
    GetAllProduct();
    GetAllSupplier();
  }, []);

  console.log(props.sendProduct, "props.sendProduct props.sendProduct");

  useEffect(() => {
    if (props.sendProduct) {
      const item = props.sendProduct;
      const productOption = {
        value: item?.Product?.id,
        label: item?.Product?.name,
      };
      const stockOption = {
        value: item?.Stock?.id,
        label: `${item?.Stock?.barcode_no}-${item?.Stock?.model}`,
        supplier_id: item?.Stock?.supplier_id,
      };
      const supplierOption = item?.Stock?.supplier_id
        ? supplier.find((s) => s.value === item?.Stock?.supplier_id)
        : null;

      setValue("product_id", productOption);

      setValue("id", item?.id);
      setValue("stock_id", stockOption);
      setValue("supplier_id", supplierOption);
    }
  }, [props.show, props.SelectedOrder, supplier]);

  const onSubmit = async (data) => {
    try {
      const DataToSend = new FormData();

      const payload = {
        product_id: data?.product_id?.value,
        stock_id: data?.stock_id?.value,
        supplier_id: data?.supplier_id?.value,
        description: data?.description,
      };

      DataToSend.append("quantitys", JSON.stringify([payload]));

      const response = await postData(
        `/admin/purchase-order/supplier-return`,
        DataToSend,
      );

      if (response?.success) {
        props.setSentProducts((prev) =>
          prev.includes(data?.id) ? prev : [...prev, data?.id],
        );
        props.setSendSupplierdone(true);
        setShowModal({ code: response.code, message: response.message });
      } else {
        setShowModal({ code: response?.code, message: response?.errors });
      }

      setTimeout(() => {
        setShowModal(0);
        props.handleClose();
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const supplierReadonly = watch("supplier_readonly");

  console.log(props.sendProduct, "props.sendProduct props.sendProduct");

  return (
    <>
      <Modal {...props} onHide={props.handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Supplier Return</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md={4}>
                <Form.Label>Product</Form.Label>
                <Controller
                  name="product_id"
                  control={control}
                  rules={{ required: "Select Product" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isDisabled={!!props.SelectedOrder?.length}
                      options={product}
                      onChange={(selected) => {
                        field.onChange(selected);
                        setValue("stock_id", null);
                        setValue("supplier_id", null);
                        GetAllStock(selected?.value);
                      }}
                    />
                  )}
                />
                {errors?.product_id && (
                  <span className="text-danger">
                    {errors.product_id.message}
                  </span>
                )}
              </Col>
              {[2, 5].includes(
                Number(props.sendProduct?.Product?.p_category_id),
              ) && (
                <Col md={4}>
                  <Form.Label>Stock</Form.Label>
                  <Controller
                    name="stock_id"
                    control={control}
                    rules={{ required: "Select Stock" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        isDisabled={!!props.SelectedOrder?.length}
                        options={stock}
                        onChange={(selected) => {
                          field.onChange(selected);
                          if (selected?.supplier_id) {
                            const selectedSupplier = supplier.find(
                              (s) => s.value === selected.supplier_id,
                            );
                            setValue("supplier_id", selectedSupplier || null);
                            setValue("supplier_readonly", true);
                          } else {
                            setValue("supplier_readonly", false);
                          }
                        }}
                      />
                    )}
                  />
                  {errors?.stock_id && (
                    <span className="text-danger">
                      {errors.stock_id.message}
                    </span>
                  )}
                </Col>
              )}

              <Col md={4}>
                <Form.Label>Supplier</Form.Label>
                <Controller
                  name="supplier_id"
                  control={control}
                  rules={{ required: "Select Supplier" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isDisabled={supplierReadonly}
                      options={supplier}
                    />
                  )}
                />
                {errors?.supplier_id && (
                  <span className="text-danger">
                    {errors.supplier_id.message}
                  </span>
                )}
              </Col>

              <Col md={12} className="mt-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Description"
                  {...register("description", {
                    required: "Description is required",
                    maxLength: {
                      value: 200,
                      message: "Maximum 200 characters allowed",
                    },
                  })}
                  className={classNames({
                    "is-invalid": errors?.description,
                  })}
                />
                {errors?.description && (
                  <span className="text-danger">
                    {errors.description.message}
                  </span>
                )}
              </Col>

              <Row className="mt-5 pb-3">
                <div className="d-flex justify-content-center">
                  <CancelButton name="cancel" handleClose={props.handleClose} />
                  <SaveButton
                    name="save"
                    handleSubmit={handleSubmit(onSubmit)}
                  />
                </div>
              </Row>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <ModalSave
        message={showModal.message}
        showErrorModal={showModal.code ? true : false}
      />
    </>
  );
};

export default SendSupplier;
