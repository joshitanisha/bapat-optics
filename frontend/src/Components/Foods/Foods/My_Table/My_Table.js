import React, { useContext } from "react";
import { useState, useEffect } from "react";
import "./My_Table.css"
import Select from "react-select";
import { Table, Button, Form } from "react-bootstrap";
import { Context } from "../../../../utils/context";
import { deleteData, editStatusData, postData } from "../../../../utils/api";
import { Link } from "react-router-dom";
import { ApprovalStatus, RoleId } from "../../../../utils/common";
import ModalDelete from "../../../common/ModelDelete";
import LinkProductsModel from "../LinkProductsModel";

function My_Table({
  data, getDataAll, OrderByOptions, user, reset, setonPageChange, store_id, setStoreId, vendors, paramid, setChangeStatus,
  sortOrder, setSortOrder, resultsPerPageOptions, perPage, setperPage, setReset, hideFilter, setHideFilter, option, setStoreCategory, storeCategories,
  storeCategory,
}) {

  const {
    IMG_URL,
    ErrorNotify,
  } = useContext(Context);

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "20px",
      borderColor: "#ddd",
      boxShadow: "none",
      fontSize: "15px",
      "&:hover": {
        borderColor: "#aaa",
      },
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#000",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "10px",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#f0f0f0" : "#fff",
      color: "#000",
      fontSize: "15px",
      "&:hover": {
        backgroundColor: "#eee",
      },
    }),
  };

  const calculateTimeAgo = (date) => {
    const createdAt = new Date(date);
    const now = new Date();
    const diffInMilliseconds = now - createdAt;

    const diffInMinutes = Math.floor(diffInMilliseconds / 60000);
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    if (diffInDays >= 1) {
      return `${diffInDays} Day${diffInDays > 1 ? 's' : ''} Ago`;
    } else if (diffInHours >= 1) {
      return `${diffInHours} Hour${diffInHours > 1 ? 's' : ''} Ago`;
    } else {
      return `${diffInMinutes} Min Ago`;
    }
  };

  console.log("option", option);

  const formatTimeInIST = (date) => {
    const createdAt = new Date(date);
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    const istTime = createdAt.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', ...options });
    // setFormattedTime(`${istTime} IST`);
    return istTime
  };

  const ChangeStoreStatus = async (id, option) => {
    try {
      // Send the POST request to update the store's status
      await postData(`/admin/products/status/${id}`, { approval_status_id: option });

      // Refresh the data after updating the store's status
      await getDataAll();
    } catch (error) {
      console.error("Error updating store status:", error);
    }
  };

  const [showModel, setShowModel] = useState(0);

  // Delete module
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDeleteId, setRecordToDeleteId] = useState(null);
  const [recordToDeleteName, setRecordToDeleteName] = useState(null);

  const showDeleteRecord = async (id, name) => {
    setShowDeleteModal(true);
    setRecordToDeleteId(id);
    setRecordToDeleteName(name);
  };

  const handleDeleteRecord = async () => {
    setShowDeleteModal(false);
    if (recordToDeleteId) {
      const response = await deleteData(`/admin/products/${recordToDeleteId}`);
      if (response?.success) {
        getDataAll();
      }

      ErrorNotify(recordToDeleteName);

      setRecordToDeleteId(null);
      setRecordToDeleteName(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setRecordToDeleteId(null);
    setRecordToDeleteName(null);
  };

  const ChangeStatus = async (id) => {
    const response = await editStatusData(`/admin/products/${id}`);
    setChangeStatus(response);
  };

  const ChangeTopPick = async (id) => {
    const response = await editStatusData(`/admin/products/top-pick/${id}`);
    setChangeStatus(response);
  };

  return (
    <section className="pending-table_holder">
      {/* Quick Filters Section */}
      <div className="quick-filters">
        <span className="quick-filters__label">Quick Filters:</span>
        <div className="quick-filters__tabs mb-3">
          <Button
            className={storeCategory === '' ? "quick-filters__tab quick-filters__tab--active" : "quick-filters__tab"}
            onClick={() => setStoreCategory("")}
          >
            All Foods
          </Button>
          {storeCategories && storeCategories.map((category) => {
            return (
              <Button
                key={category?.value}
                className={storeCategory === category?.value ? "quick-filters__tab quick-filters__tab--active" : "quick-filters__tab"}
                onClick={() => { setStoreCategory(category?.value); setonPageChange(1); }}

              >
                {category?.label}
              </Button>
            );
          })}

        </div>
      </div>

      <div className="filters-section">
        <div className="filters-section__label">
          <div className="row">
            <div className="col-xxl-2 col-xl-2 col-lg-4 col-md-6 col-sm-6 col-12">
              <Button className="hide_btn"
                onClick={() => {
                  setHideFilter(!hideFilter)
                  setStoreCategory("");
                  setSortOrder({ value: "DESC", label: "Sort-by date (Descending)" });
                  setperPage({ value: 25, label: "Results per page: 25" });
                  setReset()
                }}
              > {!hideFilter ? "Hide Filter" : "Show Filter"}
              </Button>
            </div>
          </div>

          <h6>
            <span>{data?.data?.total} Foods</span>
            {/* Last 30 Days */}
          </h6>
        </div>
        {!hideFilter &&
          <div className="filters-section__controls">
            <Select
              options={OrderByOptions}
              // defaultValue={OrderByOptions[0]}
              value={sortOrder}
              onChange={(e) => setSortOrder(e)}
              className="filters-section__dropdown"
              classNamePrefix="react-select"
              styles={customSelectStyles}
            />
            {/* Results per page dropdown */}
            <Select
              options={resultsPerPageOptions}
              // defaultValue={resultsPerPageOptions[0]}
              value={perPage}
              onChange={(e) => setperPage(e)}
              className="filters-section__dropdown"
              classNamePrefix="react-select"
              styles={customSelectStyles}
            />

            {user && user?.role_id === RoleId.Admin && (
              <Select
                options={vendors}
                value={store_id ? vendors.find((vendor) => vendor.value === store_id) : null}
                onChange={(e) => setStoreId(e?.value)}
                className="filters-section__dropdown"
                classNamePrefix="react-select"
                styles={customSelectStyles}
                placeholder="Select  store name"
              />
            )}

            <Button
              variant="outline-secondary"
              className="filters-section__btn active"
              onClick={() => { setonPageChange(1); getDataAll() }}
            >
              Set Table Preferences
            </Button>
            <Button variant="outline-secondary" className="filters-section__btn"
              onClick={() => {
                setStoreCategory("");
                setStoreId("");
                setSortOrder({ value: "DESC", label: "Sort-by date (Descending)" });
                setperPage({ value: 25, label: "Results per page: 25" });
                setonPageChange(1);
                setReset(!reset);
              }}
            >
              Refresh
            </Button>
          </div>
        }
      </div>

      {/* Table Section */}
      <div className="pending-table ">
        <Table striped bordered hover className="order-table" responsive>
          <thead>
            <tr>
              <th>Creation Date</th>
              <th>Product details</th>
              <th>Store details</th>
              <th>Image</th>
              <th>Categories</th>
              <th>Description</th>
              <th>Often Ordered With</th>
              {user && user?.role_id === RoleId.Vendor &&
                <th>Status</th>
              }
              <th>Action</th>
            </tr>
          </thead>
          <tbody>

            {data?.data?.data?.map((item, index) =>
              <tr key={index}>

                <td className="order-date">
                  <div className="order-id">{calculateTimeAgo(item?.createdAt)}</div>
                  <div className="order-info">
                    <span>{new Date(item?.createdAt).toISOString().split('T')[0]}</span>
                  </div>
                  <div className="order-info">
                    <span>{formatTimeInIST(item?.createdAt)} IST</span>
                  </div>
                </td>

                {/* Owner Details */}
                <td className="order-details">
                  <div className="order-id text-highlight">
                    {/* {item?.invoice_number} */}
                  </div>
                  <div className="order-info">
                    <span className="text-highlight">{item?.name}</span>
                  </div>
                  <div className="order-info">
                    <span>{item?.price} / {item?.Unit?.name}</span>
                  </div>
                  {/* <div className="order-info">
                    <div className="order-id">Brand</div>
                    <span>{item?.Brand?.name}</span>
                  </div> */}
                </td>

                {/* Store Details */}
                <td className="order-details">
                  <div className="order-info">
                    <span className="text-highlight">{item?.Store_Detail?.store_name}</span>
                  </div>
                  <div className="order-info">
                    <span>{item?.Store_Detail?.website}</span>
                  </div>
                </td>

                <td>
                  <img
                    src={IMG_URL + item?.image}
                    alt="Product"
                    className="product-image"
                  />
                </td>

                <td className="order-details">
                  {/* <div className="order-info">
                    <span className="text-highlight">{item?.Store_Detail?.store_name}</span>
                  </div> */}
                  <div className="order-info">
                    <span>{item?.p_category?.name}
                      {/* ({item?.p_category?.Item_Type?.name}) */}
                    </span>
                  </div>
                  <div className="order-info">
                    <span>{item?.p_sub_category?.name} </span>
                  </div>
                  {/* <div className="order-info">
                    <div className="order-id">Manufacturer</div>
                    <span>{item?.manufacturer} </span>
                  </div> */}
                </td>

                <td>
                  <div className="order-info">
                    <div className="variant-info">
                      <span className="text-highlight">{item?.Product_Variants?.length} Variants</span>
                    </div>
                    {/* {item?.Product_Variants?.map((product, index) => (
                      <div key={product?.id || index} >
                        <div className="variant-info">
                          <span className="text-highlight">{product?.name}</span>
                        </div>
                        <div className="order-info">
                          <span>{product?.price}</span>
                        </div>
                        <div className="order-info">
                          <span>{product?.mrp}</span>
                        </div>
                        <div className="order-info">
                          <span>{product?.description}</span>
                        </div>

                      </div>
                    ))} */}
                  </div>
                </td>
                <td>
                  {item?.Often_Ordered_Withs?.map((item) => (
                    <div key={item?.id} className="order-info">
                      <span className="text-highlight"> {item?.linked_product?.name}</span>
                    </div>
                  ))}

                  {user?.role_id === RoleId?.Vendor &&
                    <Button
                      className="action-btn my-1"
                      onClick={() =>
                        setShowModel(item?.id)
                      }
                      style={{ marginTop: "auto" }}
                    >
                      Edit
                    </Button>
                  }
                </td>

                {user && user?.role_id === RoleId.Vendor &&
                  <td>
                    <td>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          checked={item?.status}
                          onChange={() => {
                            ChangeStatus(item?.id);
                          }}
                          id={`flexSwitchCheckDefault${item?.id}`}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`flexSwitchCheckDefault${item?.id}`}
                        >
                          {item?.status ? "Active" : "Inactive"}
                        </label>
                      </div>


                      <label
                        className="form-check-label"
                        htmlFor={`flexSwitchCheckDefault${item?.id}`}
                      >
                        Top Pick ?
                      </label>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          checked={item?.top_pick}
                          onChange={() => {
                            ChangeTopPick(item?.id);
                          }}
                          id={`flexSwitchCheckDefault${item?.id}`}
                        />
                      </div>
                    </td>

                  </td>
                }

                <td>

                  {user && user?.role_id === RoleId.Admin &&
                    <select
                      className={item?.approval_status_id === ApprovalStatus.Approved ? "status-holder shipped" : "status-holder Unshipped"}
                      onChange={(e) => ChangeStoreStatus(item?.id, e.target.value)}
                      value={item?.Approval_Status?.id}
                    >
                      <option value={ApprovalStatus.Pending}>Inactive</option>
                      <option value={ApprovalStatus.Approved}>Approved</option>
                      <option value={ApprovalStatus.Rejected}>Rejected</option>
                    </select>
                  }

                  {user && user?.role_id === RoleId.Vendor ?
                    <>
                      <div className="my-1">
                        <Link to={`/food/edit/${item?.id}`}>
                          <Button className="action-btn active">
                            Edit
                          </Button>
                        </Link>

                      </div>
                      <div className="my-1">

                        <Button className="action-btn " onClick={() => showDeleteRecord(item?.id, item?.name)}>
                          Delete
                        </Button>
                      </div>
                    </>
                    :
                    <div className="my-1">
                      <Link to={`/food/view/${item?.id}`}>
                        <Button className="action-btn active">
                          View
                        </Button>
                      </Link>
                    </div>

                  }

                </td>
              </tr>
            )}

          </tbody>
        </Table>
      </div>
      <LinkProductsModel
        show={showModel}
        handleClose={() => {
          setShowModel(0);
          getDataAll();
        }}
      />
      <ModalDelete
        show={showDeleteModal}
        handleDeleteRecord={handleDeleteRecord}
        handleDeleteCancel={handleDeleteCancel}
      />
    </section>
  );
}

export default My_Table;
