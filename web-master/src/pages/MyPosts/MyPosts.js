import React from "react";

import {
  Col,
  PageHeader, Row,
} from "antd";
import ListHostels from "./Hostels";
import ListStuffs from "./Sellings";
import ListSharedPosts from "./SharedPosts";
import { useSelector } from "react-redux";
import { Redirect } from "react-router";

const MyPosts = () => {
  const { isAuthenticated } = useSelector(state => state.auth)

  if (!isAuthenticated)
    return <Redirect to="" />

  return (
    <div>
      <PageHeader title="BÀI VIẾT CỦA TÔI" style={{ paddingLeft: 0, paddingTop: 0 }} />
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <ListHostels />
        </Col>
        <Col xs={24}>
          <ListStuffs />
        </Col>
        <Col xs={24}>
          <ListSharedPosts />
        </Col>
      </Row>
    </div>
  );
};

export default MyPosts;
