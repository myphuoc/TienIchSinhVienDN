import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/auth/actions";
import {
  Layout,
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
  ReconciliationOutlined
} from "@ant-design/icons";
import { getFirstWordOfName } from "helpers/UtilsHelper";
import { useWindowSize } from "hooks/windowHook";

const Header = (props) => {
  const { routes, toggle, collapsed } = props;
  const dispatch = useDispatch();
  const { isAuthenticated, user: { fullname } } = useSelector((state) => state.auth);
  const windowSize = useWindowSize();

  const contentDropdown = (
    <Menu theme="light" style={{ padding: 10, width: 200 }}>
      <span className="sm-none">
      </span>
      <Menu.Divider className="sm-none" />
      <Menu.Item>
        <UserOutlined />
        <span><Link to='/my-profile'>Tài khoản của tôi</Link></span>
      </Menu.Item>
      <Menu.Item>
        <ReconciliationOutlined />
        <span><Link to='/my-posts'>Bài viết của tôi</Link></span>
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
        style={{ paddingLeft: 0, paddingRight: 0 }}
      >
        {windowSize.width < 769 ? (
          React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: toggle,
            },
          )
        ) : (
          <Menu theme="light" mode="horizontal" defaultSelectedKeys={['0']}>
            {routes.map((route, index) => (
              <Menu.Item key={index}>
                <Link to={route.path}>{route.name}</Link>
              </Menu.Item>
            ))}
          </Menu>
        )}
        <div style={{ position: "absolute", right: 20, top: 0 }}>
          {isAuthenticated ? (
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
          ) : (
            <>
              <Button>
                <Link to='/login'>Đăng nhập</Link>
              </Button>{' '}
              <Button type="primary">
                <Link to='/registration'>Đăng ký</Link>
              </Button>
            </>
          )}
        </div>
      </Layout.Header>
    </>
  );
};

export default Header;
