import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/auth/actions";
import {
  Layout,
  Row,
  Col,
  Dropdown,
  Button,
  Avatar,
  Menu,
} from "antd";

import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  CaretDownOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { getFirstWordOfName } from "helpers/UtilsHelper";

const Header = (props) => {
  const { toggle, collapsed } = props;
  const dispatch = useDispatch();
  const { user: { fullname } } = useSelector((state) => state.auth);

  const contentDropdown = (
    <Menu style={{ padding: 10, width: 200 }}>
      <span className="sm-none">
      </span>
      <Menu.Divider className="sm-none" />
      <Menu.Item>
        <UserOutlined />
        <span><Link to='/my-profile'>Tài khoản của tôi</Link></span>
      </Menu.Item>
      <Menu.Item onClick={() => dispatch(logout())}>
        <LogoutOutlined />
        <span>Đăng xuất</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Layout.Header
        className="site-layout-background"
        style={{ paddingLeft: 0, paddingRight: 15 }}
      >
        <Row>
          <Col xs={6} sm={6} md={10} lg={4} xl={4}>
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: toggle,
              },
            )}
          </Col>
          <Col xs={18} sm={18} md={14} lg={20} xl={20}>
            <div style={{ position: "absolute", right: "0" }}>
              <Dropdown overlay={contentDropdown} trigger={["click"]}>
                <Button
                  size="large"
                  style={{
                    border: "none",
                    overflow: "none",
                    boxShadow: "none",
                  }}
                >
                  <Avatar
                    src={null}
                    style={{
                      margin: "auto",
                      backgroundColor: "#00e8ba",
                      border: "1px solid #ccc",
                    }}
                  >
                    {getFirstWordOfName(fullname)}
                  </Avatar>
                  <span className="username xs-none">
                    {fullname}
                  </span>
                  <CaretDownOutlined />
                </Button>
              </Dropdown>
            </div>
          </Col>
        </Row>
      </Layout.Header>
    </>
  );
};

export default Header;
