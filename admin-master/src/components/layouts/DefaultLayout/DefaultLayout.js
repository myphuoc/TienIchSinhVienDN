import React, { useState, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Layout } from "antd";

import { routes } from "../../../routes";
import Header from "./Header";
import SideBar from "./SideBar";

import "./DefaultLayout.scss";

const RenderRoute = (route) => {
  if (route.children)
    return route.children.map(r => RenderRoute(r))
  return (
    <Route
      path={route.path}
      component={route.component}
      exact={route.exact}
      key={route.path}
    />
  )
}

const DefaultLayout = (props) => {
  const [collapsed, setCollapsed] = useState(true);

  function toggle() {
    setCollapsed(!collapsed);
  }

  return (
    <Layout>
      <SideBar collapsed={collapsed} routes={routes} toggle={toggle} />
      <Layout className="site-layout">
        <Header toggle={toggle} collapsed={collapsed} {...props} />
        <Layout.Content
          className="site-layout-background"
          style={{ margin: "24px 16px", padding: 24, minHeight: 280 }}
        >
          <Suspense fallback={loading()}>
            <Switch>
              {routes.map((route) => RenderRoute(route))}
              <Redirect to="/hostels" />
            </Switch>
          </Suspense>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

const loading = () => (
  <div className="animated fadeIn pt-3 text-center">Loading...</div>
);

export default DefaultLayout;
