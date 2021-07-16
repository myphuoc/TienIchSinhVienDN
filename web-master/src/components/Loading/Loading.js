import React from "react";
import { Spin } from "antd";
import "./Loading.scss";
const Loading = (props) => {
  return (
    <div className="page-loading">
      <Spin tip={props.tip !== false ? "Đang tải..." : ""} />
    </div>
  );
};
export default Loading;
