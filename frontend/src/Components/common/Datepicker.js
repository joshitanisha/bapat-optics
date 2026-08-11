import React, { useEffect, useState } from "react";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import { DateRangePicker } from "react-dates";
import moment from "moment";
import "moment/locale/en-au";
import { formatDate } from "../../utils/common";

const Datepicker = (props) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleDatesChange = ({ startDate, endDate }) => {
    if (startDate) {
     
      props.setValue("from", formatDate(startDate?._d));
    }
    if (endDate) {
      
      props.setValue("to", formatDate(endDate?._d));
    }
    setStartDate(startDate);
    setEndDate(endDate);

    if (!startDate && !endDate) {
      props.setValue("from", null);
      props.setValue("to", null);
    }
  };

  useEffect(() => {
    setStartDate(null);
    setEndDate(null);
  }, [props.reset]);

  // const formatDate = (date) => {
  //   return date ? date.format("MMMM DD, YYYY  h:mm A") : "";
  // };

  return (
    <div>
      <div className="date-range-picker-container">
        <p className="sub">Date Range</p>
        <DateRangePicker
          startDate={startDate}
          startDateId="start_date_id"
          endDate={endDate}
          endDateId="end_date_id"
          onDatesChange={handleDatesChange}
          focusedInput={focusedInput}
          onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
          showClearDates
          isOutsideRange={() => false}
          displayFormat="MMMM DD, YYYY h:mm A"
        />
      </div>
    </div>
  );
};

export default Datepicker;
