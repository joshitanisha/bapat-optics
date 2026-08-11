import React from "react";
import Login from "../../Login/Login";
import Header from "../../Header/Header";
import Dashboard from "../DashBoard";
import AdvanceDashboard from "../AdvanceDashboard/AdvanceDashboard";
import Country from "../../Masters/Country/Tables";
import State from "../../Masters/State/Tables";
import City from "./Components/Masters/City/Tables";
import PoolSubscriber from "./Components/PoolSubscriber/Subscriber_list/Table";

// Talent Pool
import TalentPoolCategory from "./Components/TalentPool/TalentPoolCategory/Tables";
import TalentPoolSubcategory from "./Components/TalentPool/TalentPoolSubcategory/Tables";
import TalentPoolPlan from "./Components/TalentPool/TalentPoolPlan/Tables";

import Nationality from "./Components/Masters/Nationality/Tables";
import ExpericeInYears from "./Components/Masters/ExpericeInYears/Tables";
import ClientReview from "./Components/Masters/ClientReview/Tables";
import Language from "./Components/Masters/Language/Table";
import Shift from "./Components/Masters/Shift/Table";
import BlogType from "./Components/Masters/BlogType/Tables";
import Blog from "./Components/Masters/Blog/Tables";
import Degree from "./Components/Masters/Degree/Tables";
import University from "./Components/Masters/University/Table";
import ExperienceType from "./Components/Masters/ExperienceType/Table";
import ExperienceDurationInYears from "./Components/Masters/ExperienceDurationInYears/Table";
import ExperienceDurationInMonths from "./Components/Masters/ExperienceDurationInMonths/Table";
import SkillsSubType from "./Components/Masters/SkillsSubType/Table";
import SocialLinks from "./Components/Masters/SocialLink/Tables";
import Company from "./Components/Masters/Company/Table";
import ProjectType from "./Components/Masters/ProjectType/Table";
import JobType from "./Components/Masters/JobType/Tables";
import JobTitle from "./Components/Masters/JobTitle/Tables";
import Industry from "./Components/Masters/Industry/Tables";
import Sector from "./Components/Masters/Sector/Tables";
import CareerLevel from "./Components/Masters/CareerLevel/Tables";
import Qualification from "./Components/Masters/Qualification/Tables";
import EducationType from "./Components/Masters/EducationType/Tables";
import Skills from "./Components/Masters/Skills/Tables";
import { Route, Routes } from "react-router-dom";

import RecruitersList from "./Components/Recruiters/RecruitersList/Tables";
import ContactUsList from "./Components/Recruiters/ContactUSList/Tables";
const Home = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Header" element={<Header />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/advanceDashboard" element={<AdvanceDashboard />} />

        <Route path="/masters/country" element={<Country />} />

        <Route path="/masters/state" element={<State />} />

        <Route path="/masters/city" element={<City />} />

        <Route path="/masters/job_type" element={<JobType />} />

        <Route path="/masters/job_title" element={<JobTitle />} />

        <Route path="/masters/industry" element={<Industry />} />

        <Route path="/masters/sector" element={<Sector />} />

        <Route path="/masters/career_level" element={<CareerLevel />} />

        <Route path="/masters/qualification" element={<Qualification />} />

        <Route path="/masters/education_type" element={<EducationType />} />

        <Route path="/masters/skills" element={<Skills />} />

        <Route path="/masters/blog_type" element={<BlogType />} />

        <Route path="/masters/blog" element={<Blog />} />

        <Route path="/masters/client_review" element={<ClientReview />} />

        <Route path="/masters/nationality" element={<Nationality />} />

        <Route
          path="/masters/experience_in_year"
          element={<ExpericeInYears />}
        />

        <Route path="/masters/language" element={<Language />} />

        <Route path="/masters/shift" element={<Shift />} />

        <Route path="/masters/degree" element={<Degree />} />

        <Route path="/masters/university" element={<University />} />

        <Route path="/masters/experience_type" element={<ExperienceType />} />

        <Route
          path="/masters/experience_duration_in_years"
          element={<ExperienceDurationInYears />}
        />

        <Route
          path="/masters/experience_duration_in_months"
          element={<ExperienceDurationInMonths />}
        />

        <Route path="/masters/skills_subtype" element={<SkillsSubType />} />

        <Route path="/masters/social_links" element={<SocialLinks />} />

        <Route path="/masters/company" element={<Company />} />

        <Route path="/masters/project_type" element={<ProjectType />} />

        <Route
          path="/talent_pool/talent_pool_category"
          element={<TalentPoolCategory />}
        />

        <Route
          path="/talent_pool/talent_pool_subcategory"
          element={<TalentPoolSubcategory />}
        />

        <Route
          path="/talent_pool/talent_pool_plan"
          element={<TalentPoolPlan />}
        />

        <Route
          path="/recruiters/recruiters_list"
          element={<RecruitersList />}
        />

        <Route path="/recruiters/contact_us_list" element={<ContactUsList />} />

        <Route
          path="/recruiters/pool_subscriber"
          element={<PoolSubscriber />}
        />
      </Routes>
    </>
  );
};

export default Home;
