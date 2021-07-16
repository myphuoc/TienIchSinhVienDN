import React, { useState, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Layout } from "antd";

import { routes } from "../../../routes";
import Header from "./Header";
import SideBar from "./SideBar";

import "./DefaultLayout.scss";
import { useSelector } from "react-redux";

const RenderRoute = (route, isAuthenticated) => {
  if (route.children)
    return route.children.map(r => RenderRoute(r))
  if (!isAuthenticated && route.isAuthenticated) {
    return
  }
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
  const { isAuthenticated } = useSelector(state => state.auth)

  function toggle() {
    setCollapsed(!collapsed);
  }

  return (
    <Layout>
      <SideBar collapsed={collapsed} routes={routes} toggle={toggle} />
      <Layout className="site-layout">
        <Header routes={routes} toggle={toggle} collapsed={collapsed} {...props} />
        <Layout.Content className="site-layout-background" >
          <Suspense fallback={loading()}>
            <Switch>
              {routes.map((route) => RenderRoute(route, isAuthenticated))}
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
