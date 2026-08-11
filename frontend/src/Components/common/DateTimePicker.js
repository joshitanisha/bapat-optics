// import * as React from "react";
// import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import dayjs from "dayjs";

// import { formatDate } from "../../utils/common";

// const DateTimePickerComponent = (props) => {
//   const [datetime, setDatetime] = React.useState(dayjs());

//   const handleDatesChange = (value) => {
//     // if (startDate) {
//     //   console.log(formatDate(startDate?._d));
//     //   props.setValue("from", formatDate(startDate?._d));
//     // }
//     // if (endDate) {
//     //   console.log(formatDate(endDate?._d));
//     //   props.setValue("to", formatDate(endDate?._d));
//     // }
//     setDatetime(value);
//     props.setValue(props.name, value.$d);
//   };

//   React.useEffect(() => {
//     setDatetime(dayjs());
//     // setStartDate(null);
//     // setEndDate(null);
//   }, [props.reset]);

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <DemoContainer
//         components={["DateTimePicker", "DateTimePicker", "DateTimePicker"]}
//       >
//         <DemoItem>
//           <DateTimePicker
//             className={`datetimepicker-holder form-control ${
//               props.errors[props.name] ? "is-invalid" : ""
//             }`}
//             {...props.register(props.name, {
//               required: "Date and Time is required",
//             })}
//             views={["year", "month", "day", "hours", "minutes", "seconds"]}
//             value={datetime}
//             onChange={(newValue) => {
//               handleDatesChange(newValue);
//             }}
//           />
//         </DemoItem>
//       </DemoContainer>
//     </LocalizationProvider>
//   );
// };

// export default DateTimePickerComponent;

import * as React from "react";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { formatDate, formatDateTime } from "../../utils/common";

dayjs.extend(utc);
dayjs.extend(timezone);

const DateTimePickerComponent = (props) => {
  const [datetime, setDatetime] = React.useState(dayjs().utc());

  const handleDatesChange = (value) => {
    const utcDate = value.utc();
  
    setDatetime(utcDate);
    props.setValue(props.name, utcDate.toDate());
  };

  React.useEffect(() => {
    setDatetime(dayjs().utc());
  }, [props.reset]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DateTimePicker"]}>
        <DemoItem>
          <DateTimePicker
            className={`datetimepicker-holder form-control ${
              props.errors[props.name] ? "is-invalid" : ""
            }`}
            {...props.register(props.name, {
              required: "Date and Time is required",
            })}
            views={["year", "month", "day"]}
            // views={["year", "month", "day", "hours", "minutes", "seconds"]}
            value={datetime}
            onChange={(newValue) => handleDatesChange(newValue)}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default DateTimePickerComponent;
