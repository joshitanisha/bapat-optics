import React from "react";

const FormValidation = (props) => {
  let msg = "";

  document
    .querySelectorAll(`${props.classname} .input-mandatory`)
    .forEach((element) => {
      if (element.value === "") {
        const formGroup = element.closest(".main-form-section");

        if (formGroup) {
          element.style.cssText =
            "border-radius: 5px; border:#FF0000 1px solid !important;";
          element.required = true;
          const errorSpan = formGroup.querySelector("span.error-message");
          if (errorSpan) {
            errorSpan.textContent = "Please fill the " + element.placeholder;
            errorSpan.style.color = "red";
          }
          msg = "Please fill the mandatory fields before saving.";
        }
      } else {
        const formGroup = element.closest(".main-form-section");
        if (formGroup) {
          element.style.cssText = "";
          element.required = false;
          const errorSpan = formGroup.querySelector("span.error-message");
          if (errorSpan) {
            errorSpan.textContent = "";
            errorSpan.style.color = "";
          }
        }
      }
    });

  if (msg) {
    return false;
  }

  return true;
};

const SelectValidation = (props) => {
  let msg = "";
  document
    .querySelectorAll(`${props.classname} div.input-mandatory`)
    .forEach((element) => {
      const selectInput = element.querySelector(
        "div input [name='country_id'],[name='state_id'],[name='city_id'],[name='country_id'],[name='days_id'],[name='country_id'],[name='days_id'],[name='blogtype_id'],[name='talent_pool_subcategory_id'],[name='talent_pool_category_id'],[name='skills_id'],[name='degree_id'],[name='university_type_id'],[name='role_type_id'],[name='role_subtype_id'],[name='university_id'],[name='degree_type_id'],[name='experience_type_id'],[name='roles_id'],[name='experience_in_year_id'],[name='skills_league'],[name='skills_name'],[name='qualification_id'],[name='authority_name_id'],[name='league_id'],[name='descipline_id'],[name='level_id'],[name='talent_id'],[name='category_descipline_id']"
      );

      const formGroup = element.closest(".main-form-section");
      if (selectInput?.value === "") {
        if (formGroup) {
          element.style.cssText =
            "border-radius: 5px; border:#FF0000 1px solid !important;";
          element.required = true;
          const errorSpan = formGroup.querySelector("span.error-message");
          if (errorSpan) {
            errorSpan.textContent = "Please Select";
            errorSpan.style.color = "red";
          }
          msg = "Please fill the mandatory fields before saving.";
        }
      } else {
        element.style.cssText = "";
        element.required = false;
        const errorSpan = formGroup.querySelector("span.error-message");
        if (errorSpan) {
          errorSpan.textContent = "";
          errorSpan.style.color = "";
        }
      }
    });

  if (msg) {
    return false;
  }

  return true;
};

export default { FormValidation, SelectValidation };
