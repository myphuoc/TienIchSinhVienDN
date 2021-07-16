import React from "react";
import _ from "lodash";
import { Typography, Alert } from "antd";
import cons from "../../constants";
import "./ErrorSummary.scss";

const { Text } = Typography;
const ErrorSummary = (props) => {
  const { error } = props;

  if (_.isEmpty(error)) {
    return "";
  }
  try {
    let errors = [];
    for (let field in error) {
      const mapError = cons.ERRORS_MESSAGE[field];
      if (mapError) {
        errors.push(
          mapError.message && (
            <li key={field}>
              <b>{field}:</b> {mapError.message}
            </li>
          ),
        );
      } else {
        errors.push(
          <li key={field}>
            {field === "Null" || field === "nonFieldErrors" ? (
              ""
            ) : (
              <b>{field}:</b>
            )}{" "}
            {Array.isArray(error[field]) ? error[field][0] : error[field]}
          </li>,
        );
      }
    }
    return (
      <Alert
        message="Error"
        description={
          <Text type="danger">
            <ul>{errors}</ul>
          </Text>
        }
        type="error"
        showIcon
        style={{ color: "red !important" }}
        className="alert-error"
      />
    );
  } catch (error) {
    return (
      <Alert
        message="Error"
        description={<Text type="danger">{String(error)}</Text>}
        type="error"
        showIcon
        className="alert-error"
      />
    );
  }
};
export default ErrorSummary;
