import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import GlobalLoader from "./Components/GlobalLoader/GlobalLoader.js";
// import { useContext } from "react";
// import { Context } from "./utils/context";
import Login from "./Components/Login/Login";
import ForgetPassword from "./Components/Login/LoginPage/ForgetPassword";

// Dashboard

import Dashboard from "./Components/DashBoard/DashBoard";
import Sidebar from "./Components/Sidebar/Sidebar";
import Header from "./Components/Header/Header";
import AdvanceDashboard from "./Components/DashBoard/AdvanceDashboard/AdvanceDashboard2";
import { Context } from "./utils/context";
import SellerDetails from "./Components/sellerDetails/Table";
import Profile from "./Components/profile/Profile";

import Role from "./Components/EmployeeManagement/Role/Table";
import EmployeeDetails from "./Components/EmployeeManagement/EmployeeDetails/Table";
import Employee from "./Components/EmployeeManagement/Employee/Tables";

import Offered_Product from "./Components/BapatBenefit/Benefits/Tables";

import Eyeq from "./Components/BapatEyeq/Eyeq/Tables";

import ProductRequests from "./Components/Products/ProductRequests/Table";
import ProductRatings from "./Components/Products/ProductRatings/Tables";
import OfferedProducts from "./Components/Products/Offered_Products/Tables";
import OfferedFoods from "./Components/Foods/Offered_Food/Tables";

// import Orders from "./Components/OrderManagments/Orders/Table";
// import CancelOrders from "./Components/OrderManagments/CancelOrders/Table";
// import OrdersToRefund from "./Components/OrderManagments/OrderToRefund/Table";
// import ReturnOrders from "./Components/OrderManagments/ReturnOrders/Table";
// import SingleOrder from "./Components/OrderManagments/singleOrder/Table";

// Settings

import Homebanner from "./Components/settings/HomeBanner/Tables";
import Storebanner from "./Components/settings/StoreBanner/Tables";
import AdvertisementBanner from "./Components/settings/AdvertismentBanner/Tables";
import FaqCategory from "./Components/settings/FaqCategory/Tables";
import Faqs from "./Components/settings/Faq/Tables";
import AboutUs from "./Components/settings/AboutUs/Tables";
import TermsAndCondition from "./Components/settings/TermsAndConditions/Tables";
import PrivacyPolicy from "./Components/settings/PrivacyPolicy/Tables";

import Refund_Policy from "./Components/settings/Refund_Policy/Tables";

import Help from "./Components/settings/ShippingPolicy/Tables.js";
import SocialLink from "./Components/settings/SocialLinks/Tables";
import AppSetup from "./Components/settings/AppSetup/Tables";
import AppSetup_edit from "./Components/settings/AppSetup/Edit";

// Categories
import ProductCategory from "./Components/Products/Product_Category/Tables";
import LensType from "./Components/Products/Lens_Type/Tables";
import LensCategory from "./Components/Products/Lens_Category/Tables";
import ProductSubCategory from "./Components/Products/Product_Sub_Category/Tables";
import ProductChildCategory from "./Components/Products/Product_Child_Category/Tables";
import Product from "./Components/Products/Product/Table";
import ProductCreate from "./Components/Products/Product/Create/Create";
import LensCreate from "./Components/Products/Product/LensCreate/LensCreate";
import LensEdit from "./Components/Products/Product/LensEdit/LensEdit";
import ProductEdit from "./Components/Products/Product/Edit/Edit";
import RatingReview from "./Components/Products/ProductRatings/Tables";

import Shape from "./Components/Products/Shape/Tables";
import Material from "./Components/Products/Material/Tables";
import Colour from "./Components/Products/Colour/Tables";
import Offer from "./Components/Products/Offer/Tables";
import Face_Width from "./Components/Products/Face_Width/Tables";

import FoodCreate from "./Components/Foods/Foods/Create/Create";
import FoodEdit from "./Components/Foods/Foods/Edit/Edit";
import FoodView from "./Components/Foods/Foods/View/View";

// import FoodAddOnCategory from "./Components/Foods/Food_Add_On_category/Tables";
// import FoodAddOns from "./Components/Foods/Food_Add_On/Tables";

// import StoreCategory from "./Components/Stores/Store_Category/Tables";
// import StoreSubCategory from "./Components/Stores/Store_Sub_Category/Tables";
// import StoreChildCategory from "./Components/Stores/Store_Child_Category/Tables";
// import RestaurantCategory from "./Components/Stores/Restaurant_Category/Tables";
// import Stores from "./Components/Stores/Stores/Table";

// import CategoryRequest from "./Components/Stores/Category_Request/Tables";
// import SubCategoryRequest from "./Components/Stores/Sub_Category_Request/Tables";

import Customers from "./Components/Customers/Customers/Tables";
import Customers_view from "./Components/Customers/Customers/Edit";

import DeliveryBoy from "./Components/DeliveryBoyManagement/DeliveryBoy/Tables";

import DeliveryBoyRatings from "./Components/DeliveryBoyManagement/DeliveryBoyRatings/Tables";

// import FoodCategory from "./Components/Foods/Food_Category/Tables";
// import FoodSubCategory from "./Components/Foods/Food_Sub_Category/Tables";
// import FoodChildCategory from "./Components/Foods/Food_Child_Category/Tables";
// import Foods from "./Components/Foods/Foods/Table";

// import Transactions from "./Components/reports/Transactions/Tables";

import Brands from "./Components/Masters/Brands/Tables";
import PaymentType from "./Components/Masters/PaymentType/Tables";
import Units from "./Components/Masters/Units/Tables";

import Collection_Center from "./Components/Masters/collectioncenter/Tables";
import Review_Reason from "./Components/Masters/reviewreason/Tables";

import Coupon from "./Components/Masters/Coupons/Tables";
import Coupon_edit from "./Components/Masters/Coupons/Edit";
import MyWallet from "./Components/wallet/wallet/Tables";
import GalleyImages from "./Components/Masters/GalleryImages/Tables";

import CancelReason from "./Components/Masters/CancelReasons/Tables";
import ReturnReason from "./Components/Masters/ReturnReasons/Tables";
import RejectReasons from "./Components/Masters/RejectedReasons/Tables";

// Location
import Country from "./Components/Masters/Country/Tables";
import State from "./Components/Masters/State/Tables";
import City from "./Components/Masters/City/Tables";
import Pincode from "./Components/Masters/Pincode/Tables";
import Area from "./Components/Masters/Area/Tables";

import CountryCode from "./Components/Masters/CountryCodes/Tables";

import { IDS } from "./utils/common";
import PageNotFound from "../src/Components/PageNotFound/PageNotFound";
// import Schedule_Pickup from "./Components/OrderManagments/Orders/Schedule_Pickup/Schedule_Pickup";

// import Product_Orders from "./Components/Orders/product_order/Table";
// import SchedulePickup from "./Components/Orders/product_order/Schedule_Pickup/Schedule_Pickup";
import { getData } from "./utils/api";

import Orders_Table from "./Components/Orders/Orders_Table/Table";
import Order from "./Components/Orders/Offline/Order";
import CancelOrder from "./Components/Orders/CancelOrder/CancelOrder.js";
import TimeSlot from "./Components/Masters/TimeSlot/Tables";
// import PurchaseProduct from "./";
import PurchaseProduct from "./Components/PurchaseOrder/PurchaseOrder/Tables";
import PurchaseProduct_edit from "./Components/PurchaseOrder/PurchaseOrder/Edit";
import PurchaseProduct_compare from "./Components/PurchaseOrder/PurchaseOrder/EditReceiving";

import ReceivingOrder from "./Components/PurchaseOrder/ReceivingOrder/Tables";
import ReceivingOrder_edit from "./Components/PurchaseOrder/ReceivingOrder/Edit";

import ProductStock from "./Components/Products/ProductStock/Tables";
import ProductInventory from "./Components/Products/ProductStock/Inventory";

import ProductBarcode from "./Components/Products/ProductBarcode/Tables.js";

import Supplier from "./Components/PurchaseOrder/Supplier/Tables";

import Miscellaneous_Reason from "./Components/Miscellaneous/Miscellaneous_Reason/Tables";
import Miscellaneous_Data from "./Components/Miscellaneous/Miscellaneous_Data/Tables";

import PackType from "./Components/Masters/PackType/Tables";
// Seller

import Blog from "./Components/Masters/Blog/Tables";
import ContactUs from "./Components/Masters/ContactUs/Tables";
import Career from "./Components/CareerForm/Career/Tables";
import Qualification from "./Components/CareerForm/Qualification/Tables";
import CareerApplications from "./Components/CareerForm/CareerApplications/Tables";

import Notification from "./Components/Masters/Notification/Tables";

import Admin_Notification from "./Components/Masters/Admin_Notification/Tables.js";

import Search_history from "./Components/Products/Search_history/Tables";

import OurMission from "./Components/AboutAs/OurMission/Tables";
import OurTeam from "./Components/AboutAs/OurTeam/Table";

import AppointmentReasons from "./Components/Masters/AppointmentReasons/Tables";
import AppointmentForm from "./Components/AppointmentForm/Tables";
import Subscriber from "./Components/Subscriber/Tables.js";
import Addon from "./Components/Products/Addon/Tables.js";

import SuplierReturn from "./Components/PurchaseOrder/SuplierReturn/Tables.js";

import ReturnOrder from "./Components/Orders/ReturnOrder/ReturnOrder.js";

import Gender from "./Components/Masters/Gender/Tables.js";

import AllBanner from "./Components/settings/AllBanner/Tables.js";

import HeaderNews from "./Components/Masters/HeaderNews/Tables.js";

import TrendingProduct from "./Components/settings/TrendingProduct/Tables.js";

import Coating from "./Components/Products/Coating/Tables.js";

import PrescriptionMaster from "./Components/Masters/PrescriptionMaster/Tables.js";
const App = () => {
  const location = useLocation();
  const { isSidebarOpen, isAllow, signin } = useContext(Context);
  const [headerText, setHeaderText] = useState(location.pathname);

  const isLoginPage = location.pathname === "/";
  const isForgetPassword = location.pathname === "/forget-password";
console.log("isAllow =", isAllow);
console.log("IDS.Order.List =", IDS.Order.List);
console.log(
  "Order permission =",
  isAllow?.includes(IDS.Order.List)
);
  const isOrderPage = location.pathname === "/orders/order";

  useEffect(() => {
    setHeaderText(location.pathname);
  });

  const [urls, setUrls] = useState([]);
  useEffect(() => {
    setUrls([
      {
        path: "/",
        element: <Login />,
        status: true,
      },
      {
        path: "/forget-password",
        element: <ForgetPassword />,
        status: true,
      },
      {
        path: "/Header",
        element: <Header />,
        status: true,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
        status: true,
      },
      {
        path: "/advanceDashboard",
        element: <AdvanceDashboard />,
        status: true,
      },

      {
        path: "/employee/role",
        element: <Role />,
        status: isAllow?.includes(IDS.Role.List),
      },
      {
        path: "/profile",
        element: <Profile />,
        status: true,
      },

      {
        path: "/seller-detail",
        element: <SellerDetails />,
        status: true,
      },
      {
        path: "/employee/employee-detail",
        element: <Employee />,
        status: isAllow?.includes(IDS.User.List),
      },

       {
        path: "/setting/all-banner",
        element: <AllBanner />,
        status: isAllow?.includes(IDS.User.List),
      },

        {
        path: "/master/header-news",
        element: <HeaderNews />,
        status: isAllow?.includes(IDS.User.List),
      },

      {
        path: "/bapatbenefit/benefits",
        element: <Offered_Product />,
        status: isAllow?.includes(IDS.Offered_Product.List),
      },

      {
        path: "/bapateyeq/eyeq",
        element: <Eyeq />,
        status: isAllow?.includes(IDS.Eyeq.List),
      },

         {
        path: "/setting/trending-product",
        element: <TrendingProduct />,
        status: isAllow?.includes(IDS.Eyeq.List),
      },

      // {
      //   path: "/order-managements/orders",
      //   element: <Orders />,
      //   status: true,
      // },
      // {
      //   path: "/order-managements/single-order/:id",
      //   element: <SingleOrder />,
      //   status: true,
      // },
      // {
      //   path: "/order-managements/cancel-orders",
      //   element: <CancelOrders />,
      // },
      // {
      //   path: "/order-managements/order/refund",
      //   element: <OrdersToRefund />,
      //   status: true,
      // },
      // {
      //   path: "/order-managements/order/return",
      //   element: <ReturnOrders />,
      // },

      // {
      //   path: "/order-managements/order/schedule-pickup/:id",
      //   element: <Schedule_Pickup />,
      //   status: true,
      // },
      {
        path: "/product/category",
        element: <ProductCategory />,
        status: isAllow?.includes(IDS.ProductCategory.List),
      },
      {
        path: "/lens/type",
        element: <LensType />,
        status: isAllow?.includes(IDS.LensType.List),
      },
      {
        path: "/lens/category",
        element: <LensCategory />,
        status: isAllow?.includes(IDS.LensCategory.List),
      },
      {
        path: "/product/sub-category",
        element: <ProductSubCategory />,
        status: isAllow?.includes(IDS.ProductSubCategory.List),
      },
      {
        path: "/product/child-category",
        element: <ProductChildCategory />,
        status: isAllow?.includes(IDS.ProductChildCategory.List),
      },
      {
        path: "/products",
        element: <Product />,
        status: isAllow?.includes(IDS.Product.List),
      },
      {
        path: "/product/create",
        element: <ProductCreate />,
        status: isAllow?.includes(IDS.Product.Add),
      },
      {
        path: "/lens/create",
        element: <LensCreate />,
        status: isAllow?.includes(IDS.Product.Add),
      },
      {
        path: "/lens/edit/:id",
        element: <LensEdit />,
        status: isAllow?.includes(IDS.Product.Add),
      },
      {
        path: "/product/shapes",
        element: <Shape />,
        status: isAllow?.includes(IDS.Shape.List),
      },
      {
        path: "/product/material",
        element: <Material />,
        status: isAllow?.includes(IDS.Material.List),
      },
      {
        path: "/product/colour",
        element: <Colour />,
        status: isAllow?.includes(IDS.Colour.List),
      },
      {
        path: "/product/offer",
        element: <Offer />,
        status: isAllow?.includes(IDS.Offer.List),
      },
      {
        path: "/product/facewidth",
        element: <Face_Width />,
        status: isAllow?.includes(IDS.Face_Width.List),
      },
      // {
      //   path: "/food/create",
      //   element: <FoodCreate />,
      //   status: isAllow?.includes(IDS.Product.Add),
      // },
      // {
      //   path: "/food/edit/:id",
      //   element: <FoodEdit />,
      //   status: isAllow?.includes(IDS.Product.Edit),
      // },
      // {
      //   path: "/food/view/:id",
      //   element: <FoodView />,
      //   status: isAllow?.includes(IDS.Product.List),
      // },
      // {
      //   path: "/food/add-on-categories",
      //   element: <FoodAddOnCategory />,
      //   status: isAllow?.includes(IDS.FoodAddOnCategory.List),
      // },
      // {
      //   path: "/food/add-ons",
      //   element: <FoodAddOns />,
      //   status: isAllow?.includes(IDS.FoodAddOn.List),
      // },
      {
        path: "/product/edit/:id",
        element: <ProductEdit />,
        status: isAllow?.includes(IDS.Product.Edit),
      },
      {
        path: "/product/rating-reviews",
        element: <RatingReview />,
        status: isAllow?.includes(IDS.RatingReview.Edit),
      },

      

      {
        path: "/masters/payment-type",
        element: <PaymentType />,
        status: isAllow?.includes(IDS.PaymentType.List),
      },

      {
        path: "/masters/brands",
        element: <Brands />,
        status: isAllow?.includes(IDS.Brand.List),
      },
      {
        path: "/masters/blog",
        element: <Blog />,
        status: true,
      },

      {
        path: "/masters/units",
        element: <Units />,
        status: isAllow?.includes(IDS.Unit.List),
      },

      {
        path: "/masters/collectioncenter",
        element: <Collection_Center />,
        status: isAllow?.includes(IDS.Collection_Center.List),
      },
      {
        path: "/masters/reviewreason",
        element: <Review_Reason />,
        status: isAllow?.includes(IDS.Review_Reason.List),
      },

      {
        path: "/settings/location/country",
        element: <Country />,
        status: isAllow?.includes(IDS.Country.List),
      },
      {
        path: "/settings/master/time-slot",
        element: <TimeSlot />,
        status: isAllow?.includes(IDS.TimeSlot.List),
      },
      {
        path: "/settings/location/state",
        element: <State />,
        status: isAllow?.includes(IDS.State.List),
      },
      {
        path: "/settings/location/city",
        element: <City />,
        status: isAllow?.includes(IDS.City.List),
      },
      {
        path: "/settings/location/pincode",
        element: <Pincode />,
        status: isAllow?.includes(IDS.Pincode.List),
      },
      {
        path: "/settings/location/area",
        element: <Area />,
        // status: true,
        status: isAllow?.includes(IDS.Area.List),
      },
      {
        path: "/master/country-code",
        element: <CountryCode />,
        status: isAllow?.includes(IDS.CountryCode.List),
      },
      {
        path: "/settings/home-banner",
        element: <Homebanner />,
        status: isAllow?.includes(IDS.HomeBanner.List),
      },
      {
        path: "/settings/store-banner",
        element: <Storebanner />,
        status: isAllow?.includes(IDS.HomeBanner.List),
      },
      {
        path: "/settings/add-banner",
        element: <AdvertisementBanner />,
        status: isAllow?.includes(IDS.HomeBanner.List),
      },
      {
        path: "/settings/faq-categories",
        element: <FaqCategory />,
        status: isAllow?.includes(IDS.FaqCategory.List),
      },
      {
        path: "/settings/faqs",
        element: <Faqs />,
        status: isAllow?.includes(IDS.Faq.List),
      },
      {
        path: "/settings/about-us",
        element: <AboutUs />,
        status: isAllow?.includes(IDS.AboutUs.List),
      },
      {
        path: "/settings/terms-and-condition",
        element: <TermsAndCondition />,
        status: isAllow?.includes(IDS.TermsAndCondition.List),
      },
      {
        path: "/settings/privacy-policy",
        element: <PrivacyPolicy />,
        status: isAllow?.includes(IDS.PrivacyPolicy.List),
      },
      {
        path: "/settings/refund-policy",
        element: <Refund_Policy />,
        status: isAllow?.includes(IDS.Refund_Policy.List),
      },
      {
        path: "/settings/shipping-policy",
        element: <Help />,
        status: isAllow?.includes(IDS.Help.List),
      },
      {
        path: "/settings/social-links",
        element: <SocialLink />,
        status: isAllow?.includes(IDS.SocialLink.List),
      },
      {
        path: "/settings/app-setup",
        element: <AppSetup />,
        status: isAllow?.includes(IDS.AppSetup.List),
      },
      {
        path: "/settings/app-setup/edit/:id",
        element: <AppSetup_edit />,
        status: isAllow?.includes(IDS.AppSetup.List),
      },
      // {
      //   path: "/orders/all-orders",
      //   element: <Product_Orders />,
      //   status: isAllow?.includes(IDS.Order.List),
      // },
      {
        path: "/orders/all-orders",
        element: <Orders_Table />,
        status: isAllow?.includes(IDS.Order.List),
      },
      {
        path: "/orders/order",
        element: <Order />,
        status: true,
      },
      {
        path: "/orders/cancel-order",
        element: <CancelOrder />,
        status: isAllow?.includes(IDS.Order.List),
      },

      {
        path: "/orders/return-order",
        element: <ReturnOrder />,
        status: isAllow?.includes(IDS.Order.List),
      },
      // {
      //   path: "/orders/schedule-pickup/:id",
      //   element: <SchedulePickup />,
      //   status: isAllow?.includes(IDS.Order.List),
      // },
      {
        path: "/product/ratings/:id",
        element: <ProductRatings />,
        status: isAllow?.includes(IDS.RatingReview.List),
      },
      {
        path: "/customers",
        element: <Customers />,
        status: isAllow?.includes(IDS.Customer.List),
      },

      {
        path: "/customers/view/:id",
        element: <Customers_view />,
        status: isAllow?.includes(IDS.Customer.List),
      },

      {
        path: "/delivery-boy",
        element: <DeliveryBoy />,
        status: isAllow?.includes(IDS.User.List),
      },

      {
        path: "/delivery-boy/rating",
        element: <DeliveryBoyRatings />,
        status: isAllow?.includes(IDS.User.List),
      },
      {
        path: "/coupons/coupon",
        element: <Coupon />,
        status: isAllow?.includes(IDS.Coupon.List),
      },
      {
        path: "/coupons/edit/:id",
        element: <Coupon_edit />,
        status: isAllow?.includes(IDS.Coupon.Edit),
      },

      {
        path: "/my-wallet",
        element: <MyWallet />,
        status: isAllow?.includes(IDS.Wallet.List),
      },
      {
        path: "/image-gallery",
        element: <GalleyImages />,
        status: isAllow?.includes(IDS.GalleryImage.List),
      },

      {
        path: "/master/cancel-reason",
        element: <CancelReason />,
        status: isAllow?.includes(IDS.CancelReason.List),
      },
      {
        path: "/master/reject-reason",
        element: <RejectReasons />,
        status: isAllow?.includes(IDS.RejectReasons.List),
      },
      {
        path: "/master/return-reason",
        element: <ReturnReason />,
        status: isAllow?.includes(IDS.ReturnReason.List),
      },
      {
        path: "/product/offered-products",
        element: <OfferedProducts />,
        status: isAllow?.includes(IDS.OfferedProduct.List),
      },
      {
        path: "/foods/offered-foods",
        element: <OfferedFoods />,
        status: isAllow?.includes(IDS.OfferedProduct.List),
      },
      {
        path: "/purchase-product/purchase-product",
        element: <PurchaseProduct />,
        status: isAllow?.includes(IDS.OfferedProduct.List),
      },

      {
        path: "/purchase-product/edit/:id",
        element: <PurchaseProduct_edit />,
        status: isAllow?.includes(IDS.OfferedProduct.Edit),
      },

      {
        path: "/purchase-product/compare/:id",
        element: <PurchaseProduct_compare />,
        status: isAllow?.includes(IDS.OfferedProduct.Edit),
      },

      {
        path: "/purchase-product/receiving-order",
        element: <ReceivingOrder />,
        status: isAllow?.includes(IDS.OfferedProduct.List),
      },

      {
        path: "/purchase-product/supplier",
        element: <Supplier />,
        status: isAllow?.includes(IDS.OfferedProduct.List),
      },

      {
        path: "/purchase-product/supplier-return",
        element: <SuplierReturn />,
        status: isAllow?.includes(IDS.OfferedProduct.List),
      },

      {
        path: "/purchase-product/receiving-order/edit/:id",
        element: <ReceivingOrder_edit />,
        status: isAllow?.includes(IDS.OfferedProduct.Edit),
      },
      {
        path: "/product/product-stock",
        element: <ProductStock />,
        status: isAllow?.includes(IDS.OfferedProduct.List),
      },
      {
        path: "/product/inventory/:id",
        element: <ProductInventory />,
        status: isAllow?.includes(IDS.OfferedProduct.List),
      },

       {
        path: "/product/barcode",
        element: <ProductBarcode />,
        status: isAllow?.includes(IDS.OfferedProduct.List),
      },
      {
        path: "/miscellaneous/reason",
        element: <Miscellaneous_Reason />,
        status: isAllow?.includes(IDS.OfferedProduct.List),
      },
      {
        path: "/miscellaneous/data",
        element: <Miscellaneous_Data />,
        status: isAllow?.includes(IDS.OfferedProduct.List),
      },

      {
        path: "/master/packtype",
        element: <PackType />,
        status: isAllow?.includes(IDS.OfferedProduct.List),
      },

      {
        path: "/masters/contact_us",
        element: <ContactUs />,
        status: true,
      },

       {
        path: "/masters/gender",
        element: <Gender />,
        status: true,
      },
      {
        path: "/career",
        element: <Career />,
        status: true,
      },
      {
        path: "/career/career-application",
        element: <CareerApplications />,
        status: true,
      },
      ,
      {
        path: "/career/qualification",
        element: <Qualification />,
        status: true,
      },
      {
        path: "/master/notification",
        element: <Notification />,
        status: isAllow?.includes(IDS.OfferedProduct.List),
      },

      {
        path: "/master/admin-notification",
        element: <Admin_Notification />,
        status: isAllow?.includes(IDS.OfferedProduct.List),
      },

      {
        path: "/product/search-history",
        element: <Search_history />,
        status: isAllow?.includes(IDS.OfferedProduct.List),
      },

      {
        path: "/about-us/our-mission",
        element: <OurMission />,
        status: isAllow?.includes(IDS.OfferedProduct.List),
      },
      {
        path: "/about-us/our-team",
        element: <OurTeam />,
        status: isAllow?.includes(IDS.OfferedProduct.List),
      },

      {
        path: "/master/appointment-reason",
        element: <AppointmentReasons />,
        status: isAllow?.includes(IDS.Review_Reason.List),
      },

      {
        path: "/appointment-form",
        element: <AppointmentForm />,
        status: isAllow?.includes(IDS.Review_Reason.List),
      },

      {
        path: "/subscriber-form",
        element: <Subscriber />,
        status: isAllow?.includes(IDS.Review_Reason.List),
      },

      {
        path: "/product/addon",
        element: <Addon />,
        status: isAllow?.includes(IDS.Review_Reason.List),
      },
      
      {
        path: "/product/coating",
        element: <Coating />,
        status: isAllow?.includes(IDS.Review_Reason.List),
      },

        {
        path: "/master/prescription",
        element: <PrescriptionMaster />,
        status: isAllow?.includes(IDS.Review_Reason.List),
      },
    ]);
  }, [isAllow]);

  return (
    <>
     <GlobalLoader />
    <section className="desktop_container">
    <div
      className={`main ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
    >
      {isLoginPage && !signin ? (
        <Login />
      ) : isForgetPassword && !signin ? (
        <ForgetPassword />
      ) : (
        <div className=" row me-0 ms-0">
          {!isOrderPage && (
            <div
              className={`${
                isSidebarOpen
                  ? "sidebarHeadopen  sidebarHeadopen_sidebar col-xl-2 col-lg-2 col-md-1 col-1  p-0"
                  : "scale-in-hor-left sidebarHeadClose col-xl-1 col-md-1 col-1  p-0"
              }  pe-0`}
            >
              <div
                className={`${
                  isSidebarOpen
                    ? "sidebarHeadopen "
                    : "scale-in-hor-left sidebarHeadClose"
                }  pe-0`}
              >
                <Sidebar />
              </div>
            </div>
          )}

          <div
            className={`${
              isOrderPage
                ? "dashboradopen col-xl-12 col-lg-12 col-md-12 col-12 p-0"
                : isSidebarOpen
                ? "dashboradopen col-xl-10 col-lg-10 col-md-12 col-12 p-0"
                : "scale-in-hor-right dashboradopen  col-xl-11 col-md-11 col-11 p-0"
            }  ps-0`}
          >
            <div
              className={`${
                isSidebarOpen
                  ? "dashboradopen"
                  : "scale-in-hor-right dashboradopen"
              }  ps-0`}
            >
              <div className="allRoutesMain">
                <Routes>
                  {urls?.map((url) =>
                    url.status && (
                      <Route
                        key={url.path}
                        path={url.path}
                        element={url.element}
                      />
                    )
                  )}
                <Route
  path="*"
  element={
    <div
      style={{
        fontSize: "40px",
        color: "red",
        padding: "100px"
      }}
    >
      WILDCARD ROUTE
    </div>
  }
/>
                </Routes>
              </div>
              {/* <Home /> */}
            </div>
          </div>
        </div>
      )}
    </div>
    </section>
      <section className="mobile_container">
          <div className="logo">
            <div className="logo_holder">
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/favicon.png"
                }
                alt="vigyana-logo"
                className="vigyana-logo"
              />
            </div>
          </div>
          <h2>The page you are viewing is not compatible with mobile.</h2>
          <p>
            To access the page, please use a{" "}
            <strong>desktop/laptop</strong>.
          </p>
        </section>
    </>
  );
};

export default App;
