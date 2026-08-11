import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Form,
  InputGroup,
} from "react-bootstrap";
import "./Profile.css";
import Select from "react-select";
import Header from "../Header/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router-dom";
import { Context } from "../../utils/context";
import { useForm, Controller } from "react-hook-form";
import classNames from "classnames";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ModalSave from "../common/ModelSave";
import { useNavigate } from "react-router";
import PhoneInput from "react-phone-input-2";
import { putData } from "../../utils/api";
import AddOffCanvance from "./Add";
import AddSubCanvance from "./AddSubCat";
import { ItemType } from "../../utils/common";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();
  const {
    getData,
    editStatusData,
    deleteData,
    ErrorNotify,
    isAllow,
    Per_Page_Dropdown,
    Select2Data,
    usertype,
    IMG_URL,
    postData,
  } = useContext(Context);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    getValues,
    setValue,
  } = useForm();

  const imageFile = watch("image");
  const imageFile1 = watch("banner_image");
  const user_id = watch("user_id");
  const s_category_id = watch("s_category_id");

  const [showModal, setShowModal] = useState({
    code: 0,
    message: "",
  });
  const [show, setShowAdd] = useState(false);
  const [showSub, setShowSub] = useState(false);

  const Select3Data = async (data, name) => {
    const result = data.map((data) => ({
      value: data?.id,
      label: data?.name,
      name: name,
      p_category_id: data?.p_category_id,
    }));
    return result;
  };

  const onSubmit = async (data) => {
    try {
      const DataToSend = new FormData();
      DataToSend.append("name", data?.name);
      DataToSend.append("email", data?.email);
      DataToSend.append("contact_no", data?.contact_no);
      DataToSend.append("password", data?.password);
      DataToSend.append("store_name", data?.store_name);
      DataToSend.append("legal_name", data?.legal_name);
      DataToSend.append("website", data?.website);
      DataToSend.append("lat", data?.lat);
      DataToSend.append("long", data?.long);

      DataToSend.append("area", data?.area);
      DataToSend.append("address", data?.address);
      DataToSend.append("open_time", data?.open_time);
      DataToSend.append("close_time", data?.close_time);
      DataToSend.append("processing_time", data?.processing_time);
      DataToSend.append("delivery_time", data?.delivery_time);
      DataToSend.append("commission", data?.commission);
      DataToSend.append("tax_no", data?.tax_no);
      DataToSend.append("minimum_order_value", data?.minimum_order_value);

      if (data?.country_id) {
        DataToSend.append("country_id", data?.country_id?.value);
      }

      if (data?.state_id) {
        DataToSend.append("state_id", data?.state_id?.value);
      }

      if (data?.city_id) {
        DataToSend.append("city_id", data?.city_id?.value);
      }

      if (data?.pincode_id) {
        DataToSend.append("pincode_id", data?.pincode_id?.value);
      }
      if (data?.restaurant_category_id?.value) {
        DataToSend.append(
          "restaurant_category_id",
          data?.restaurant_category_id?.value
        );
      }

      if (data?.image) {
        DataToSend.append("image", data?.image[0]);
      }

      if (data?.banner_image) {
        DataToSend.append("banner_image", data?.banner_image[0]);
      }

      if (Array.isArray(data?.p_category_id)) {
        console.log("data?.p_category_id", data?.p_category_id);

        data.p_category_id.forEach((category) => {
          DataToSend.append(`p_category_id`, category?.value);
        });
      }

      if (Array.isArray(data?.payment_type_id)) {
        data.payment_type_id.forEach((paymentType, i) => {
          DataToSend.append(`payment_type_id`, paymentType?.value);
        });
      }

      if (Array.isArray(data?.service_id)) {
        data.service_id.forEach((service, i) => {
          DataToSend.append(`service_id`, service?.value);
        });
      }

      if (Array.isArray(data?.brand_id)) {
        data.brand_id.forEach((brand, i) => {
          DataToSend.append(`brand_id`, brand?.value);
        });
      }

      if (Array.isArray(data?.p_sub_category_id)) {
        const p_sub_cat = data.p_sub_category_id.map((subCategory) => {
          return subCategory;
        });

        DataToSend.append("p_sub_category_id", JSON.stringify(p_sub_cat));
      }

      console.log("DataToSend", data);

      const response = await putData("/admin/store/my-store", DataToSend);

      if (response?.success) {
        await setShowModal({ code: response.code, message: response.message });
        await GetEditData();
        reset();
      } else {
        await setShowModal({ code: response?.code, message: response?.errors });
      }
      setTimeout(() => {
        setShowModal(0);
        // navigate("/products");
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [pincodes, setPincodes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [payment_methods, setPaymentMethods] = useState([]);
  const [services, setServices] = useState([]);
  const [brands, setBrands] = useState([]);
  const [deliveryRange, setDeliveryRange] = useState(0);
  const [restaurantCategories, setRestaurantCategories] = useState([]);

  console.log("categories", categories);

  const getAllCountries = async () => {
    const response = await getData(`/common/masters/all-country`);
    if (response?.success) {
      setCountries(await Select2Data(response?.data, "country_id"));
    }
  };
  const getAllStates = async (id) => {
    const response = await getData(`/common/masters/all-state/${id}`);
    if (response?.success) {
      setStates(await Select2Data(response?.data, "state_id"));
    }
  };
  const getAllCities = async (id) => {
    const response = await getData(`/common/masters/all-city/${id}`);
    if (response?.success) {
      setCities(await Select2Data(response?.data, "city_id"));
    }
  };
  const getAllPincodes = async (id) => {
    const response = await getData(`/common/masters/all-pincode/${id}`);
    if (response?.success) {
      setPincodes(await Select2Data(response?.data, "pincode_id"));
    }
  };
  const getAllRestaurantCategories = async () => {
    const response = await getData(`/common/masters/all-restaurant-categories`);
    if (response?.success) {
      setRestaurantCategories(
        await Select2Data(response?.data, "restaurant_category_id")
      );
    }
  };
  const getAllCategories = async () => {
    let response;
    console.log("getValues(s_category_id.value)", s_category_id);

    if (s_category_id?.value === 1) {
      response = await getData(`/common/masters/all-f-category`);
    } else {
      response = await getData(`/common/masters/all-p-category`);
    }
    if (response?.success) {
      setCategories(await Select2Data(response?.data, "p_category_id"));
    }
  };
  const getAllSubCategories = async (selectedCategories) => {
    let categoryValues = [];
    if (Array.isArray(selectedCategories)) {
      categoryValues = selectedCategories.map((category) => category?.value);
    }

    const response = await postData("/common/masters/all-p-sub-categories", {
      p_category_id: categoryValues,
    });

    if (response?.success) {
      setSubCategories(await Select3Data(response?.data, "p_sub_category_id"));
    }
  };

  const getAllPaymentMethods = async () => {
    const response = await getData("/common/masters/all-payment-methods");
    if (response?.success) {
      setPaymentMethods(await Select2Data(response?.data, "payment_type_id"));
    }
  };

  const getAllRestaurantServices = async () => {
    const response = await getData("/common/masters/all-restaurant-services");
    if (response?.success) {
      setServices(await Select2Data(response?.data, "service_id"));
    }
  };

  const getAllBrands = async () => {
    const response = await getData("/common/masters/all-brands");
    if (response?.success) {
      setBrands(await Select2Data(response?.data, "brand_id"));
    }
  };

  useEffect(() => {
    getAllCountries();
    getAllCategories();
    getAllPaymentMethods();
    getAllRestaurantCategories();
    getAllRestaurantServices();
    getAllBrands();
  }, []);
  useEffect(() => {
    getAllCategories();
  }, [s_category_id]);

  const GetEditData = async () => {
    const response = await getData(`/admin/store/my-store`);
    setDeliveryRange(response?.data?.delivery_range);
    reset(response?.data);
  };

  const [categoryList, setCategoryList] = useState([]);

  const GetMyCategoryList = async () => {
    const response = await getData(`/admin/store/my-store/my-categories`);
    setCategoryList(response?.data);
  };

  const [subCategoryList, setSubCategoryList] = useState([]);

  const GetMySubCategoryList = async () => {
    const response = await getData(`/admin/store/my-store/my-sub-categories`);
    setSubCategoryList(response?.data);
  };

  useEffect(() => {
    GetEditData();
    GetMyCategoryList();
    GetMySubCategoryList();
  }, [show, showSub]);

  const apiKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
  const [address, setAddress] = useState(null); // Store address details
  const mapRef = useRef(null);

  useEffect(() => {
    // Ensure Google Maps API is loaded
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;
    window.initMap = initMap;
    document.head.appendChild(script);

    // Cleanup the script on component unmount
    return () => {
      document.head.removeChild(script);
    };
  }, [getValues("lat"), getValues("long")]);

  // Initialize the Google Map
  const initMap = () => {
    const defaultCoords = { lat: 18.51222785666292, lng: 73.87566681741158 };
    if (getValues("lat") && getValues("long")) {
      defaultCoords.lat = parseFloat(getValues("lat"));
      defaultCoords.lng = parseFloat(getValues("long"));
      loadMap(defaultCoords);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          loadMap(userCoords);
        },
        (error) => {
          console.warn("Geolocation failed:", error.message);
          loadMap(defaultCoords);
        }
      );
    }
  };

  const loadMap = (coords) => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: coords,
      zoom: 11,
    });

    // Create marker at initial location
    let marker = new window.google.maps.Marker({
      position: coords,
      map: map,
      title: "Current Location",
    });

    // Draw a 7km radius circle around the coords
    let circle = new window.google.maps.Circle({
      map: map,
      center: coords,
      radius: deliveryRange * 1000, // Radius in meters (7 km)
      fillColor: "#FF0000", // light blue
      fillOpacity: 0.2,
      strokeColor: "#FF0000",
      strokeOpacity: 1,
      strokeWeight: 3,
      clickable: true,
    });

    // Add click listener to update marker and circle
    map.addListener("click", (event) => {
      const clickedLocation = event.latLng;
      const lat = clickedLocation.lat();
      const lng = clickedLocation.lng();

      const newCoords = { lat, lng };

      marker.setPosition(clickedLocation);
      marker.setTitle("Clicked Location");

      circle.setCenter(newCoords); // move circle center too

      reverseGeocode(lat, lng); // Optional: Update address
    });
  };

  // Reverse geocoding function to get full address
  const reverseGeocode = async (lat, lng) => {
    try {
      // Replace with your Google Maps API key
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );

      if (response.data.status === "OK") {
        // Get the formatted address and other details
        const addressDetails = response.data.results[0];

        await setAddress(addressDetails); // Save address data in state
        await setValue("address", addressDetails?.formatted_address);
        await setValue("lat", lat);
        await setValue("long", lng);
      } else {
        console.error("Error fetching address:", response.data.status);
      }
    } catch (error) {
      console.error("Geocoding API error:", error);
    }
  };

  console.log(deliveryRange, "deliveryRange");

  return (
    <>
      <Header title={"My Store"} link={"/employee/employee_details"} />
      <section className="Create">
        {/* back button start */}
        {/* <div className="back_btn_holder">
          <FontAwesomeIcon
            className="back-btn"
            icon={faAngleLeft}
            onClick={() => navigate("/products")}
          />{" "}
          Back
        </div> */}
        {/* back button end */}

        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* 2. Package Details start */}
          <div className="oder-detail-holder mb-3">
            <div className="heading-holder mt-3">
              <h6>1. Profile</h6>
            </div>
            <div className="package-details-section">
              {/* Package Weight */}

              <Row className="detail-row">
                <Col md={4}>
                  <div className="detail-label">Name</div>
                </Col>
                <Col lg={4} md={4}>
                  <div className="">
                    <Form.Control
                      type="text"
                      name={`name`}
                      placeholder="Name"
                      className={classNames("", {
                        "is-invalid": errors?.name, // Adjusted error checking
                      })}
                      {...register(`name`, {
                        required: "name is required",
                      })}
                    />
                  </div>
                  {errors.name && (
                    <span className="text-danger">{errors.name.message}</span>
                  )}
                </Col>
              </Row>

              <Row className="detail-row">
                <Col md={4}>
                  <div className="detail-label">Email</div>
                </Col>
                <Col lg={4} md={4}>
                  <div className=" ">
                    <Form.Control
                      type="text"
                      name="email"
                      placeholder="Email"
                      className={classNames("", {
                        "is-invalid": errors?.email,
                      })}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value:
                            /^([A-Za-z0-9_\-\.])+\@(?!(?:[A-Za-z0-9_\-\.]+\.)?([A-Za-z0-9_\-\.]+)\.\2)([A-Za-z0-9_\-\.]+\.)+([A-Za-z]{2,4})$/,
                          message: "Invalid Email address",
                        },
                        validate: (value) => {
                          // Extract the domain and TLD
                          const domainPattern =
                            /^([A-Za-z0-9_\-\.])+\@(?!(?:[A-Za-z0-9_\-\.]+\.)?([A-Za-z0-9_\-\.]+)\.\2)([A-Za-z0-9_\-\.]+\.)+([A-Za-z]{2,4})$/;
                          const match = value.match(domainPattern);
                          if (match) {
                            const domainParts = match[1].split(".");
                            const tld = match[2];

                            // Ensure the domain and TLD are not the same
                            if (domainParts[domainParts.length - 1] === tld) {
                              return "Domain and top-level domain must be different";
                            }
                          }
                          return true;
                        },
                      })}
                      onKeyDown={(e) => {
                        if (e.key === " ") {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                  {errors.email && (
                    <span className="text-danger"> {errors.email.message}</span>
                  )}
                </Col>
              </Row>

              <Row className="detail-row">
                <Col md={4}>
                  <div className="detail-label">Mobile No</div>
                </Col>
                <Col lg={4} md={4}>
                  <div className="d-flex align-items-center">
                    <Form.Control
                      type="text"
                      name={`contact_no`}
                      placeholder="Mobile Number"
                      className={classNames("", {
                        "is-invalid": errors?.contact_no,
                      })}
                      {...register(`contact_no`, {
                        required: "Mobile Number is required",
                        validate: (value) =>
                          value.length === 10 ||
                          " Contact number must be exactly 10 digits",
                      })}
                      onKeyDown={(e) => {
                        const { key } = e;
                        const value = e.target.value;
                        if (key === "ArrowLeft" || key === "ArrowRight") {
                          return;
                        }
                        if (
                          !/[0-9]/.test(key) &&
                          key !== "Backspace" &&
                          key !== "Tab"
                        ) {
                          e.preventDefault();
                        }
                        if (
                          value?.length >= 10 &&
                          key !== "Backspace" &&
                          key !== "Tab"
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                  {errors.contact_no && (
                    <span className="text-danger">
                      {errors.contact_no.message}
                    </span>
                  )}
                </Col>
              </Row>

              <Row className="detail-row">
                <Col md={4}>
                  <div className="detail-label">Password</div>
                </Col>
                <Col lg={4} md={4}>
                  <div className="d-flex align-items-center">
                    <Form.Control
                      type="name"
                      name="password"
                      placeholder="Password"
                      className={classNames("", {
                        "is-invalid": errors?.password,
                      })}
                      {...register("password", {
                        // required: "Password is required",
                      })}
                    />
                  </div>
                  {errors.password && (
                    <span className="text-danger">
                      {errors.password.message}
                    </span>
                  )}
                </Col>
              </Row>
              <Row className="detail-row">
                <Col md={4}>
                  <div className="detail-label">Confirm Password</div>
                </Col>
                <Col lg={4} md={4}>
                  <div className="d-flex align-items-center">
                    <Form.Control
                      type="name"
                      name="confirm_password"
                      placeholder="Confirm Password"
                      className={classNames("", {
                        "is-invalid": errors?.confirm_password,
                      })}
                      {...register("confirm_password", {
                        // required: "Confirm password is required",
                        validate: (value) =>
                          value === watch("password") ||
                          "Passwords does not match",
                      })}
                    />
                  </div>
                  {errors.confirm_password && (
                    <span className="text-danger">
                      {errors.confirm_password.message}
                    </span>
                  )}
                </Col>
              </Row>
            </div>
          </div>
          {/* 2. Package Details end */}

          {/* 3. Pickup Slot Details start */}
          <div className="oder-detail-holder mb-3">
            <div className="heading-holder mt-3">
              <h6>2.Store Details</h6>
            </div>
            <div className="package-details-section">
              <Row>
                <Col>
                  {getValues("s_category_id.value") === 1 && (
                    <Row className="detail-row">
                      <Col md={6}>
                        <div className="detail-label">Restaurant Category</div>
                      </Col>
                      <Col lg={6} md={6} sm={6}>
                        <div className="align-items-center">
                          <Controller
                            className="select-contoller"
                            name={`restaurant_category_id`} // name of the field
                            control={control}
                            placeholder="Select Restaurant Category"
                            rules={{
                              required: "Select Restaurant Category",
                            }}
                            render={({
                              field: { onChange, onBlur, value, ref },
                            }) => (
                              <Select
                                styles={{
                                  control: (baseStyles) => ({
                                    ...baseStyles,
                                    borderColor: errors?.restaurant_category_id
                                      ? "red"
                                      : baseStyles.borderColor,
                                  }),
                                }}
                                // {...field}
                                options={restaurantCategories}
                                onChange={(selectedValue) => {
                                  onChange(selectedValue);
                                }}
                                onBlur={onBlur}
                                value={value}
                                ref={ref}
                              />
                            )}
                          />
                        </div>
                        {errors.restaurant_category_id && (
                          <span className="text-danger">
                            {errors.restaurant_category_id.message}
                          </span>
                        )}
                      </Col>
                    </Row>
                  )}

                  <Row className="detail-row">
                    <Col md={6}>
                      <div className="detail-label">Store Name</div>
                    </Col>
                    <Col lg={6} md={6}>
                      <div className="d-flex align-items-center">
                        <Form.Control
                          type="text"
                          name={`store_name`}
                          placeholder="Store name.."
                          className={classNames("", {
                            "is-invalid": errors?.store_name, // Adjusted error checking
                          })}
                          {...register(`store_name`, {
                            required: "Store name is required",
                          })}
                        />
                      </div>
                      {errors.store_name && (
                        <span className="text-danger">
                          {errors.store_name.message}
                        </span>
                      )}
                    </Col>
                  </Row>

                  <Row className="detail-row">
                    <Col md={6}>
                      <div className="detail-label">Legal Name</div>
                    </Col>
                    <Col lg={6} md={6}>
                      <div className="d-flex align-items-center">
                        <Form.Control
                          type="text"
                          name={`legal_name`}
                          placeholder="Legal name.."
                          className={classNames("", {
                            "is-invalid": errors?.legal_name, // Adjusted error checking
                          })}
                          {...register(`legal_name`, {
                            required: "Legal name is required",
                          })}
                        />
                      </div>
                      {errors.legal_name && (
                        <span className="text-danger">
                          {errors.legal_name.message}
                        </span>
                      )}
                    </Col>
                  </Row>

                  <Row className="detail-row">
                    <Col md={6}>
                      <div className="detail-label">Logo</div>
                    </Col>
                    <Col lg={6} md={6}>
                      <div className="d-flex align-items-center">
                        <Form.Control
                          className={classNames("", {
                            "is-invalid": errors?.image,
                          })}
                          type="file"
                          {...register("image", {
                            // validate: async (value) => {
                            //   if (typeof value !== "string") {
                            //     const fileTypes = ["jpg", "png", "jpeg"];
                            //     const fileType = value[0].name?.split(".")[1];
                            //     if (!fileTypes.includes(fileType)) {
                            //       return `please upload a valid file format. (${fileTypes})`;
                            //     }
                            //     const sizes = await getDimension(value[0]);
                            //     if (
                            //       sizes.width !== 420 &&
                            //       sizes.height !== 520
                            //     ) {
                            //       return "Image width and height must be 420 px and 520 px";
                            //     }
                            //     const fileSize = Math.round(
                            //       value[0].size / 1024
                            //     );
                            //     if (fileSize > 500) {
                            //       return "file size must be lower than 500kb";
                            //     }
                            //   }
                            // },
                          })}
                          accept=".jpg, .jpeg, .png"
                        />
                      </div>
                      {errors.image && (
                        <span className="text-danger">
                          {errors.image.message}
                        </span>
                      )}
                    </Col>
                  </Row>

                  <Row className="detail-row">
                    <Col md={6}>
                      <div className="detail-label">Banner Image</div>
                    </Col>
                    <Col lg={6} md={6}>
                      <div className="d-flex align-items-center">
                        <Form.Control
                          className={classNames("", {
                            "is-invalid": errors?.banner_image,
                          })}
                          type="file"
                          {...register("banner_image", {
                            // validate: async (value) => {
                            //   if (typeof value !== "string") {
                            //     const fileTypes = ["jpg", "png", "jpeg"];
                            //     const fileType = value[0].name?.split(".")[1];
                            //     if (!fileTypes.includes(fileType)) {
                            //       return `please upload a valid file format. (${fileTypes})`;
                            //     }
                            //     const sizes = await getDimension(value[0]);
                            //     if (
                            //       sizes.width !== 420 &&
                            //       sizes.height !== 520
                            //     ) {
                            //       return "banner_image width and height must be 420 px and 520 px";
                            //     }
                            //     const fileSize = Math.round(
                            //       value[0].size / 1024
                            //     );
                            //     if (fileSize > 500) {
                            //       return "file size must be lower than 500kb";
                            //     }
                            //   }
                            // },
                          })}
                          accept=".jpg, .jpeg, .png"
                        />
                      </div>
                      {errors.banner_image && (
                        <span className="text-danger">
                          {errors.banner_image.message}
                        </span>
                      )}
                    </Col>
                  </Row>

                  <Row className="detail-row">
                    <Col md={6}>
                      <div className="detail-label">Website</div>
                    </Col>
                    <Col lg={6} md={6}>
                      <div className="d-flex align-items-center">
                        <Form.Control
                          type="text"
                          name={`website`}
                          placeholder="Website.."
                          className={classNames("", {
                            "is-invalid": errors?.website, // Adjusted error checking
                          })}
                          {...register(`website`, {
                            required: "Website is required",
                          })}
                        />
                      </div>
                      {errors.website && (
                        <span className="text-danger">
                          {errors.website.message}
                        </span>
                      )}
                    </Col>
                  </Row>

                  <Row className="detail-row">
                    <div className="col-xxl-6 col-xl-4  col-lg-5  col-md-3 col-5 mb-3">
                      <Form.Label>Commision</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          name="commission"
                          placeholder="Commission..."
                          className={classNames("", {
                            "is-invalid": errors?.commission, // Adjusted error checking
                          })}
                          {...register("commission", {
                            required: "Commission is required",
                          })}
                          onKeyDown={(e) => {
                            const validKeys = /^[0-9]$/i.test(e.key);
                            const arrowKeys = [
                              "ArrowUp",
                              "ArrowDown",
                              "ArrowLeft",
                              "ArrowRight",
                            ];
                            const isBackspace = e.key === "Backspace";

                            const currentValue = e.target.value;
                            // Prevent more than 2 digits
                            if (currentValue.length >= 2 && validKeys) {
                              e.preventDefault();
                            }

                            // Allow only numbers, arrow keys, and backspace
                            if (
                              !validKeys &&
                              !arrowKeys.includes(e.key) &&
                              !isBackspace
                            ) {
                              e.preventDefault();
                            }
                          }}
                        />
                        <InputGroup.Text>%</InputGroup.Text>
                      </InputGroup>

                      {errors.commission && (
                        <span className="text-danger">
                          {errors.commission.message}
                        </span>
                      )}
                    </div>

                    <div className="col-xxl-6 col-xl-4  col-lg-5  col-md-3 col-5 mb-3">
                      <Form.Label>Tax No.</Form.Label>
                      <Form.Control
                        type="text"
                        name={`tax_no`}
                        placeholder="tax_no.."
                        className={classNames("", {
                          "is-invalid": errors?.tax_no, // Adjusted error checking
                        })}
                        {...register(`tax_no`, {
                          required: "tax_no is required",
                        })}
                      />
                      {errors.tax_no && (
                        <span className="text-danger">
                          {errors.tax_no.message}
                        </span>
                      )}
                    </div>

                    <div className="col-xxl-6 col-xl-4  col-lg-5  col-md-3 col-5 mb-3">
                      <Form.Label>Minimum Order Value.</Form.Label>
                      <Form.Control
                        type="number"
                        name={`minimum_order_value`}
                        placeholder="minimum order value.."
                        className={classNames("", {
                          "is-invalid": errors?.minimum_order_value, // Adjusted error checking
                        })}
                        {...register(`minimum_order_value`, {
                          required: "minimum_order_value is required",
                        })}
                      />
                      {errors.minimum_order_value && (
                        <span className="text-danger">
                          {errors.minimum_order_value.message}
                        </span>
                      )}
                    </div>

                    <div className="col-xxl-12 col-xl-4  col-lg-5  col-md-3 col-5 mb-3">
                      <div
                        id="map"
                        ref={mapRef}
                        style={{ width: "80%", height: "400px" }}
                      ></div>
                    </div>

                    <div className="col-xxl-6 col-xl-4  col-lg-5  col-md-3 col-5 mb-3">
                      <Form.Label>Latitude</Form.Label>
                      <Form.Control
                        type="text"
                        name="lat"
                        placeholder="Latitude.."
                        className={classNames("", {
                          "is-invalid": errors?.lat, // Adjusted error checking
                        })}
                        {...register("lat", {
                          required: "Latitude is required",
                          pattern: {
                            value: /^-?([1-8]?[0-9]|90)\.([0-9])?$/, // Regular expression for valid latitude format
                            message: "Invalid latitude format", // Message for invalid format
                          },
                          validate: {
                            range: (value) => {
                              const lat = parseFloat(value);
                              return (
                                (lat >= -90 && lat <= 90) ||
                                "Latitude must be between -90 and 90"
                              ); // Range check
                            },
                          },
                        })}
                      />
                      {errors.lat && (
                        <span className="text-danger">
                          {errors.lat.message}
                        </span>
                      )}
                    </div>

                    <div className="col-xxl-6 col-xl-4  col-lg-5  col-md-3 col-5 mb-3">
                      <Form.Label>Longitude</Form.Label>
                      <Form.Control
                        type="text"
                        name="long"
                        placeholder="Longitude.."
                        className={classNames("", {
                          "is-invalid": errors?.long, // Adjusted error checking
                        })}
                        {...register("long", {
                          required: "Longitude is required",
                          pattern: {
                            value:
                              /^-?((1[0-7][0-9])|([0-9]?[0-9]))(\.[0-9])?$/, // Regular expression for valid longitude format
                            message: "Invalid longitude format", // Message for invalid format
                          },
                          validate: {
                            range: (value) => {
                              const longitude = parseFloat(value);
                              return (
                                (longitude >= -180 && longitude <= 180) ||
                                "Longitude must be between -180 and 180"
                              ); // Range check
                            },
                          },
                        })}
                      />
                      {errors.long && (
                        <span className="text-danger">
                          {errors.long.message}
                        </span>
                      )}
                    </div>
                  </Row>

                  <Row className="detail-row ">
                    <div className="col-xxl-3 col-xl-4  col-lg-5  col-md-3 col-5 mb-3">
                      <Form.Label>Country</Form.Label>
                      <Controller
                        className="select-contoller"
                        name={`country_id`} // name of the field
                        control={control}
                        rules={{
                          required: "Select country",
                        }}
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => (
                          <Select
                            styles={{
                              control: (baseStyles) => ({
                                ...baseStyles,
                                borderColor: errors?.country_id
                                  ? "red"
                                  : baseStyles.borderColor,
                              }),
                            }}
                            // {...field}
                            options={countries}
                            onChange={(selectedValue) => {
                              onChange(selectedValue);
                              setValue("state_id", "");
                              setValue("city_id", "");
                              setValue("pincode_id", "");
                              getAllStates(selectedValue?.value);
                            }}
                            onBlur={onBlur}
                            value={value}
                            ref={ref}
                          />
                        )}
                      />
                      {errors.country_id && (
                        <span className="text-danger">
                          {errors.country_id.message}
                        </span>
                      )}
                    </div>

                    <div className="col-xxl-3 col-xl-4  col-lg-5  col-md-3 col-5 mb-3">
                      <Form.Label>State</Form.Label>
                      <Controller
                        className="select-contoller"
                        name={`state_id`} // name of the field
                        control={control}
                        rules={{
                          required: "Select State",
                        }}
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => (
                          <Select
                            styles={{
                              control: (baseStyles) => ({
                                ...baseStyles,
                                borderColor: errors?.state_id
                                  ? "red"
                                  : baseStyles.borderColor,
                              }),
                            }}
                            // {...field}
                            options={states}
                            onChange={(selectedValue) => {
                              onChange(selectedValue);
                              setValue("city_id", "");
                              setValue("pincode_id", "");
                              getAllCities(selectedValue?.value);
                            }}
                            onBlur={onBlur}
                            value={value}
                            ref={ref}
                          />
                        )}
                      />
                      {errors.state_id && (
                        <span className="text-danger">
                          {errors.state_id.message}
                        </span>
                      )}
                    </div>

                    <div className="col-xxl-3 col-xl-4  col-lg-5  col-md-3 col-5 mb-3">
                      <Form.Label>City</Form.Label>
                      <Controller
                        className="select-contoller"
                        name={`city_id`} // name of the field
                        control={control}
                        rules={{
                          required: "Select City",
                        }}
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => (
                          <Select
                            styles={{
                              control: (baseStyles) => ({
                                ...baseStyles,
                                borderColor: errors?.city_id
                                  ? "red"
                                  : baseStyles.borderColor,
                              }),
                            }}
                            // {...field}
                            options={cities}
                            onChange={(selectedValue) => {
                              onChange(selectedValue);
                              setValue("pincode_id", "");
                              getAllPincodes(selectedValue?.value);
                            }}
                            onBlur={onBlur}
                            value={value}
                            ref={ref}
                          />
                        )}
                      />
                      {errors.city_id && (
                        <span className="text-danger">
                          {errors.city_id.message}
                        </span>
                      )}
                    </div>

                    <div className="col-xxl-3 col-xl-4  col-lg-5  col-md-3 col-5 mb-3">
                      <Form.Label>Pincode</Form.Label>
                      <Controller
                        className="select-contoller"
                        name={`pincode_id`} // name of the field
                        control={control}
                        rules={{
                          required: "Select Pincode",
                        }}
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => (
                          <Select
                            styles={{
                              control: (baseStyles) => ({
                                ...baseStyles,
                                borderColor: errors?.pincode_id
                                  ? "red"
                                  : baseStyles.borderColor,
                              }),
                            }}
                            // {...field}
                            options={pincodes}
                            onChange={(selectedValue) => {
                              onChange(selectedValue);
                              // getAllStates(selectedValue?.value);
                            }}
                            onBlur={onBlur}
                            value={value}
                            ref={ref}
                          />
                        )}
                      />
                      {errors.pincode_id && (
                        <span className="text-danger">
                          {errors.pincode_id.message}
                        </span>
                      )}
                    </div>
                  </Row>

                  <Row className="detail-row">
                    <div className="col-xxl-12 col-xl-12  col-lg-12  col-md-12 col-12 mb-2">
                      <Form.Label>Area</Form.Label>
                      <Form.Control
                        type="text"
                        name={`area`}
                        placeholder="area.."
                        className={classNames("", {
                          "is-invalid": errors?.area, // Adjusted error checking
                        })}
                        {...register(`area`, {
                          required: "area is required",
                        })}
                      />
                      {errors.area && (
                        <span className="text-danger">
                          {errors.area.message}
                        </span>
                      )}
                    </div>

                    <div className="col-xxl-12 col-xl-12  col-lg-12  col-md-12 col-12 mb-2">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        type="text"
                        name={`address`}
                        placeholder="address.."
                        className={classNames("", {
                          "is-invalid": errors?.address, // Adjusted error checking
                        })}
                        {...register(`address`, {
                          required: "address is required",
                        })}
                      />
                      {errors.address && (
                        <span className="text-danger">
                          {errors.address.message}
                        </span>
                      )}
                    </div>
                  </Row>
                  <Row className="detail-row">
                    <div className="col-xxl-3 col-xl-4 col-lg-5 col-md-3 col-5 mb-3">
                      <Form.Label>Open Time</Form.Label>
                      <Form.Control
                        type="time"
                        name="open_time"
                        placeholder="open time.."
                        className={classNames("", {
                          "is-invalid": errors?.open_time,
                        })}
                        {...register("open_time", {
                          required: "Open time is required",
                        })}
                      />
                      {errors.open_time && (
                        <span className="text-danger">
                          {errors.open_time.message}
                        </span>
                      )}
                    </div>

                    <div className="col-xxl-3 col-xl-4 col-lg-5 col-md-3 col-5 mb-3">
                      <Form.Label>Close Time</Form.Label>
                      <Form.Control
                        type="time"
                        name="close_time"
                        placeholder="close time.."
                        className={classNames("", {
                          "is-invalid": errors?.close_time,
                        })}
                        {...register("close_time", {
                          required: "Close time is required",
                          validate: {
                            greaterThanOpenTime: (value) => {
                              const openTime = getValues("open_time");

                              // Convert times to Date objects
                              const openDate = new Date(
                                `1970-01-01T${openTime}:00`
                              );
                              const closeDate = new Date(
                                `1970-01-01T${value}:00`
                              );

                              if (closeDate <= openDate) {
                                return "Close time must be greater than open time";
                              }
                            },
                          },
                        })}
                      />
                      {errors.close_time && (
                        <span className="text-danger">
                          {errors.close_time.message}
                        </span>
                      )}
                    </div>

                    <div className="col-xxl-3 col-xl-4  col-lg-5  col-md-3 col-5 mb-3">
                      <Form.Label>Processing Time (in Mins)</Form.Label>
                      <Form.Control
                        type="number"
                        name={`processing_time`}
                        placeholder="Processing time (in Mins)"
                        className={classNames("", {
                          "is-invalid": errors?.processing_time, // Adjusted error checking
                        })}
                        {...register(`processing_time`, {
                          required: "Processing time is required",
                        })}
                      />
                      {errors.processing_time && (
                        <span className="text-danger">
                          {errors.processing_time.message}
                        </span>
                      )}
                    </div>

                    <div className="col-xxl-3 col-xl-4  col-lg-5  col-md-3 col-5 mb-3">
                      <Form.Label>Delivery Time (in Mins)</Form.Label>
                      <Form.Control
                        type="number"
                        name={`delivery_time`}
                        placeholder="Delivery time  (in Mins)"
                        className={classNames("", {
                          "is-invalid": errors?.delivery_time, // Adjusted error checking
                        })}
                        {...register(`delivery_time`, {
                          required: "Delivery time is required",
                        })}
                      />
                      {errors.delivery_time && (
                        <span className="text-danger">
                          {errors.delivery_time.message}
                        </span>
                      )}
                    </div>
                  </Row>
                </Col>

                <Col lg={4} md={4} className="ms-5 ">
                  {typeof getValues("image") == "string" ? (
                    <>
                      <Form.Label>Logo</Form.Label>
                      <div className="image-preview-container">
                        <img
                          src={IMG_URL + getValues("image")}
                          className="image-preview"
                          alt="Category Preview"
                        />
                      </div>
                    </>
                  ) : (
                    imageFile &&
                    imageFile?.length > 0 && (
                      <>
                        <Form.Label>Logo</Form.Label>
                        <div className="image-preview-container">
                          <img
                            // src={URL.createObjectURL(getValues("image")[0])}
                            src={URL?.createObjectURL(imageFile[0])}
                            className="image-preview"
                            alt="Category Preview"
                          />
                        </div>
                      </>
                    )
                  )}

                  {typeof getValues("banner_image") == "string" ? (
                    <>
                      <Form.Label>banner</Form.Label>
                      <div className="image-preview-container ">
                        <img
                          src={IMG_URL + getValues("banner_image")}
                          className="image-preview"
                          alt="Category Preview"
                        />
                      </div>
                    </>
                  ) : (
                    imageFile1 &&
                    imageFile1?.length > 0 && (
                      <>
                        <Form.Label>banner</Form.Label>
                        <div className="image-preview-container mt-5">
                          <img
                            // src={URL.createObjectURL(getValues("image")[0])}
                            src={URL?.createObjectURL(imageFile1[0])}
                            className="image-preview"
                            alt="Category Preview"
                          />
                        </div>
                      </>
                    )
                  )}
                </Col>
              </Row>
            </div>
          </div>
          {/* 3. Pickup Slot Details end */}

          <div className="oder-detail-holder mb-3">
            <div className="heading-holder mt-3">
              <h6>3. Other Details</h6>
            </div>
            <div className="package-details-section">
              <div className="col-xxl-12 col-xl-12  col-lg-12  col-md-12 col-12 mb-2">
                <Form.Label>Product Categories</Form.Label>
                <Controller
                  className="select-contoller"
                  name={`p_category_id`} // name of the field
                  control={control}
                  rules={{
                    required: "Select Product Categories",
                  }}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <Select
                      isMulti
                      styles={{
                        control: (baseStyles) => ({
                          ...baseStyles,
                          borderColor: errors?.p_category_id
                            ? "red"
                            : baseStyles.borderColor,
                        }),
                      }}
                      // {...field}
                      options={categories}
                      onChange={(selectedValue) => {
                        onChange(selectedValue);
                        setValue("p_sub_category_id", "");
                        getAllSubCategories(selectedValue);
                      }}
                      onBlur={onBlur}
                      value={value}
                      ref={ref}
                    />
                  )}
                />
                {errors.p_category_id && (
                  <span className="text-danger">
                    {errors.p_category_id.message}
                  </span>
                )}
              </div>

              {getValues("s_category_id.value") !== 1 && (
                <div className="col-xxl-12 col-xl-12  col-lg-12  col-md-12 col-12 mb-2">
                  <Form.Label>Product Sub Categories</Form.Label>
                  <Controller
                    className="select-contoller"
                    name={`p_sub_category_id`} // name of the field
                    control={control}
                    rules={{
                      required: "Select Sub Product Categories",
                    }}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <Select
                        isMulti
                        styles={{
                          control: (baseStyles) => ({
                            ...baseStyles,
                            borderColor: errors?.p_sub_category_id
                              ? "red"
                              : baseStyles.borderColor,
                          }),
                        }}
                        // {...field}
                        options={subCategories}
                        onChange={(selectedValue) => {
                          onChange(selectedValue);
                          // getAllSubCategories(selectedValue);
                        }}
                        onBlur={onBlur}
                        value={value}
                        ref={ref}
                      />
                    )}
                  />
                  {errors.p_sub_category_id && (
                    <span className="text-danger">
                      {errors.p_sub_category_id.message}
                    </span>
                  )}
                </div>
              )}

              <div className="col-xxl-12 col-xl-12  col-lg-12  col-md-12 col-12 mb-2">
                <Form.Label>Payment Types</Form.Label>
                <Controller
                  className="select-contoller"
                  name={`payment_type_id`} // name of the field
                  control={control}
                  rules={{
                    required: "Select Payment Types",
                  }}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <Select
                      isMulti
                      styles={{
                        control: (baseStyles) => ({
                          ...baseStyles,
                          borderColor: errors?.payment_type_id
                            ? "red"
                            : baseStyles.borderColor,
                        }),
                      }}
                      // {...field}
                      options={payment_methods}
                      onChange={(selectedValue) => {
                        onChange(selectedValue);
                        // getAllStates(selectedValue?.value);
                      }}
                      onBlur={onBlur}
                      value={value}
                      ref={ref}
                    />
                  )}
                />
                {errors.payment_type_id && (
                  <span className="text-danger">
                    {errors.payment_type_id.message}
                  </span>
                )}
              </div>

              {getValues("s_category_id.value") !== 1 && (
                <div className="col-xxl-12 col-xl-12  col-lg-12  col-md-12 col-12 mb-2">
                  <Form.Label>Brands</Form.Label>
                  <Controller
                    className="select-contoller"
                    name={`brand_id`} // name of the field
                    control={control}
                    rules={{
                      required: "Select Brands",
                    }}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <Select
                        isMulti
                        styles={{
                          control: (baseStyles) => ({
                            ...baseStyles,
                            borderColor: errors?.brand_id
                              ? "red"
                              : baseStyles.borderColor,
                          }),
                        }}
                        // {...field}
                        options={brands}
                        onChange={(selectedValue) => {
                          onChange(selectedValue);
                          // getAllStates(selectedValue?.value);
                        }}
                        onBlur={onBlur}
                        value={value}
                        ref={ref}
                      />
                    )}
                  />
                  {errors.brand_id && (
                    <span className="text-danger">
                      {errors.brand_id.message}
                    </span>
                  )}
                </div>
              )}

              {getValues("s_category_id.value") === 1 && (
                <div className="col-xxl-12 col-xl-12  col-lg-12  col-md-12 col-12 mb-2">
                  <Form.Label>Services</Form.Label>
                  <Controller
                    className="select-contoller"
                    name={`service_id`} // name of the field
                    control={control}
                    rules={{
                      required: "SelectServices",
                    }}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <Select
                        isMulti
                        styles={{
                          control: (baseStyles) => ({
                            ...baseStyles,
                            borderColor: errors?.service_id
                              ? "red"
                              : baseStyles.borderColor,
                          }),
                        }}
                        // {...field}
                        options={services}
                        onChange={(selectedValue) => {
                          onChange(selectedValue);
                          // getAllStates(selectedValue?.value);
                        }}
                        onBlur={onBlur}
                        value={value}
                        ref={ref}
                      />
                    )}
                  />
                  {errors.service_id && (
                    <span className="text-danger">
                      {errors.service_id.message}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* warning text-end */}
          <div className="d-flex justify-content-center">
            {/* <div className="text-center mt-4 mx-2">
              <button
                className="Back-button"
                type="submit"
                onClick={() => navigate("/products")}
              >
                {" "}
                Cancel
              </button>
            </div> */}

            <div className="text-center mt-4 mx-2">
              <button
                className="schedule-button"
                type="button"
                onClick={() => setShowAdd(true)}
              >
                Add New Category
              </button>
            </div>

            <div className="text-center mt-4 mx-2">
              <button
                className="schedule-button"
                type="button"
                onClick={() => setShowSub(true)}
              >
                Add New Sub Category
              </button>
            </div>

            <div className="text-center mt-4 mx-2">
              <button
                className="schedule-button"
                type="submit"
                // onClick={onSubmit}
              >
                Update
              </button>
            </div>
          </div>
        </Form>
        {/* 2. Category List Start */}
        {categoryList && categoryList?.length > 0 && (
          <div className="oder-detail-holder mb-3">
            <div className="heading-holder mt-3">
              <h6> Categories You Added</h6>
            </div>
            <div className="package-details-section">
              <Table striped bordered hover responsive center>
                <thead>
                  <tr className="">
                    <th className="sr">Sr. No.</th>
                    <th className="tax-name">Category </th>
                    <th className="tax-name">Image </th>
                    {/* <th className="active">Action</th> */}
                  </tr>
                </thead>
                <tbody>
                  {categoryList &&
                    categoryList?.map((d, index) => {
                      return (
                        <tr className="" key={index}>
                          <td>{index + 1}.</td>
                          <td className="width_dertails_name_div">{d?.name}</td>
                          <td>
                            {d?.image && (
                              <img
                                src={IMG_URL + d?.image}
                                alt="Image"
                               width="50"
                                          height="50"
                              />
                            )}
                          </td>

                          {/* {visible.col4 && (
                        <td>
                          <div className="d-flex">
                            {isAllow.includes(IDS.ProductCategory.Edit) ? (
                              <EditButton
                                handleShow1={handleShow1}
                                id={d?.id}
                              />
                            ) : (
                              <></>
                            )}
                            {isAllow.includes(
                              IDS.ProductCategory.Delete
                            ) ? (
                              <DeletButton
                                showDeleteRecord={showDeleteRecord}
                                id={d?.id}
                                name={d?.name}
                              />
                            ) : (
                              <></>
                            )}
                          </div>
                        </td>
                      )} */}
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </div>
          </div>
        )}
        {/* 2. Category List end */}

        {/* 2. Sub Category List Start */}
        {subCategoryList && subCategoryList?.length > 0 && (
          <div className="oder-detail-holder mb-3">
            <div className="heading-holder mt-3">
              <h6>Sub Categories You Added</h6>
              <sup className="text text-danger">
                Get Sub Category Accepted Quickly By Adding the category in your
                list!
              </sup>
            </div>
            <div className="package-details-section">
              <Table striped bordered hover responsive center>
                <thead>
                  <tr className="">
                    <th className="sr">Sr. No.</th>
                    <th className="tax-name">Category </th>
                    <th className="tax-name">Sub Category </th>
                    <th className="tax-name">Image </th>
                    {/* <th className="active">Action</th> */}
                  </tr>
                </thead>
                <tbody>
                  {subCategoryList &&
                    subCategoryList?.map((d, index) => {
                      return (
                        <tr className="" key={index}>
                          <td>{index + 1}.</td>
                          <td>{d?.p_category?.name}</td>
                          <td className="width_dertails_name_div">{d?.name}</td>
                          <td>
                            {d?.image && (
                              <img
                                src={IMG_URL + d?.image}
                                alt="Image"
                             width="50"
                                          height="50"
                              />
                            )}
                          </td>

                          {/* {visible.col4 && (
                        <td>
                          <div className="d-flex">
                            {isAllow.includes(IDS.ProductCategory.Edit) ? (
                              <EditButton
                                handleShow1={handleShow1}
                                id={d?.id}
                              />
                            ) : (
                              <></>
                            )}
                            {isAllow.includes(
                              IDS.ProductCategory.Delete
                            ) ? (
                              <DeletButton
                                showDeleteRecord={showDeleteRecord}
                                id={d?.id}
                                name={d?.name}
                              />
                            ) : (
                              <></>
                            )}
                          </div>
                        </td>
                      )} */}
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </div>
          </div>
        )}
        {/* 2. Category List end */}
        <ModalSave
          message={showModal.message}
          showErrorModal={showModal.code ? true : false}
        />
        <AddOffCanvance
          handleClose={() => setShowAdd(false)}
          setShow={setShowAdd}
          show={show}
          item_type_id={
            getValues("is_restaurant_flow") ? ItemType?.Food : ItemType?.Product
          }
        />
        <AddSubCanvance
          handleClose={() => setShowSub(false)}
          setShow={setShowSub}
          triggerIt={show}
          show={showSub}
          user_id={user_id}
          item_type_id={
            getValues("is_restaurant_flow") ? ItemType?.Food : ItemType?.Product
          }
        />
      </section>
    </>
  );
}

export default Profile;
