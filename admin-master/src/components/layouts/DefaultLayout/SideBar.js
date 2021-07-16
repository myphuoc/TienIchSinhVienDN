import React from "react";
import { Layout, Menu, Drawer } from "antd";
import Icon from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useWindowSize } from "../../../hooks/windowHook";

const { Sider } = Layout;
const { SubMenu } = Menu;

const RenderMenu = (route) => {
  if (route.name)
    return route.children ? (
      <SubMenu
        key={route.name}
        icon={route.icon ? <Icon component={route.icon} /> : null}
        title={route.name}
      >
        {route.children.map((r) => RenderMenu(r))}
      </SubMenu>
    ) : (
      <Menu.Item
        key={route.path}
        icon={route.icon ? <Icon component={route.icon} /> : null}
      >
        <span>{route.name}</span>
        <Link to={route.path} />
      </Menu.Item>
    )
}

const SideBar = (props) => {
  const { collapsed, toggle, routes } = props;
  const windowSize = useWindowSize();

  const MenuContent = () => (
    <Menu theme="dark" mode="vertical">
      {routes.map((route) => RenderMenu(route))}
    </Menu>
  );

  if (windowSize.width < 768) {
    return (
      <Drawer
        visible={!collapsed}
        onClose={toggle}
        drawerStyle={{ backgroundColor: "#001529" }}
        maskStyle={{ color: "#fff" }}
        className="menu-drawer"
        placement="left"
      >
        <MenuContent />
      </Drawer>
    );
  }

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={230}
    >
      <div className="logo" />
      <MenuContent />
    </Sider>
  );
};

export default SideBar;
