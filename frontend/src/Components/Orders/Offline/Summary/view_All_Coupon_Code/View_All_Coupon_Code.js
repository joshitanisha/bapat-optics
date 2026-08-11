import React, { useContext, useEffect, useState } from "react";
import "./View_All_Coupon_Code.css";

import { Form, Modal } from "react-bootstrap";
import { getData } from "../../../../../utils/api";
import { Context } from "../../../../../utils/context";

function View_All_Coupon_Code({ handleApplyCoupon, setCouponCode, ...props }) {
  const [code, setCode] = useState("");

  const {
    getData,
    editStatusData,
    deleteData,
    ErrorNotify,
    Per_Page_Dropdown,
    postData,
    getDownloadDataExcel,
    isAllow,
    IMG_URL,
    setGlobalLoader,
  } = useContext(Context);

  const [allCoupons, setCouponData] = useState();

  const userWalletdata = async () => {
    const res = await getData(`/common/masters/all-coupon`);
    setCouponData(res?.data);
  };

  useEffect(() => {
    userWalletdata();
  }, []);

  return (
    <>
      <Modal
        {...props}
        size="lg"
        className="Cancel_Reason_Modal Modal-holder View_All_Coupon_Code_modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            All Coupon Code
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="content_holder">
            <div className="row">
              {allCoupons?.data?.map((val) => (
                <div className="col-md-12">
                  <div className="All_offers_sec">
                    <div className="mid-sec">
                      <div className="bannerdiv ">
                        <img
                          className="thirdoffer"
                          src={IMG_URL + val?.image}
                          alt="thirdoffer"
                        />
                        <div className="btnpos">
                          <div
                            className="codediv mb-1"
                            style={{ position: "relative" }}
                          >
                            <Form.Control
                              type="search"
                              placeholder="Enter Code"
                              value={val?.code}
                              // onChange={(e) => setCouponCode(e.target.value)}
                            />
                            <button
                              className="searchbtn"
                              type="button"
                              // onClick={() =>
                              //   handleCopy(val?.id, val?.code)
                              // }
                              onClick={() => {
                                handleApplyCoupon(val?.code);
                              }}
                              // onMouseLeave={() => setCopiedId(null)}
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default View_All_Coupon_Code;
