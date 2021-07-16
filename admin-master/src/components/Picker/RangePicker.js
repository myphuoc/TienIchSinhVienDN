import React from "react";
import { TimePicker } from 'antd';

const { RangePicker } = TimePicker;

const MyRangePicker = (props) => {
  return (
    <RangePicker
      {...props}
      format="HH:mm"
      onBlur={e => console.log(e.target)}
      onCalendarChange={val => console.log("onCalendarChange", val)}
    />
  );
};
export default MyRangePicker;
