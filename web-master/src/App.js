import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import config from "./config";

// Firebase
import firebase from "firebase/app";

import DefaultLayout from "./components/layouts/DefaultLayout";
import Login from "./pages/Login";
import Registration from "pages/Registration";

import { notification } from "antd";

import "./App.scss";
import { getProfile } from "redux/auth/actions";

// Config notification
notification.config({
  top: 65,
});

firebase.initializeApp(config.firebaseConfig);
function App() {
  // Check auth
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isShowExpireAlert = useSelector(
    (state) => state.auth.isShowExpireAlert,
  );

  const dispatch = useDispatch()

  useEffect(() => {
    // Show notification when has expired
    if (isShowExpireAlert) {
      notification.warning({ message: "Your session has expired!" });
    }
    isAuthenticated && dispatch(getProfile())
  }, [isShowExpireAlert, isAuthenticated, dispatch]);

  return (
    <HashRouter>
      <Switch>
        <Route path="/login" render={(props) => <Login {...props} />} />
        <Route path="/registration" render={(props) => <Registration {...props} />} />
        <Route render={(props) => <DefaultLayout {...props} />} />
      </Switch>
    </HashRouter>
  );
}

export default App;
