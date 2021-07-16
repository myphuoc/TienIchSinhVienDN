import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { login } from "../redux/auth/actions";

import { Form, Input, Button, Card } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import Loading from "../components/Loading";
import ErrorSummary from "../components/ErrorSummary";
import { Link } from "react-router-dom";

import "./Login.scss";

const Login = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const errors = useSelector((state) => state.auth.errors);

  const errorFromServer =
    errors && errors.response
      ? errors.response.data
      : errors.message
        ? { Null: errors.message }
        : {};
  const onFinish = ({ email, password }) => {
    dispatch(login(email, password));
  };

  return (
    <div className="login-page">
      {loading ? <Loading /> : ""}
      <Card style={{ width: 360 }} className="box-shadow">
        <h3>Đăng nhập</h3>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ email!" }]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Mật khẩu"
            />
          </Form.Item>
          <ErrorSummary error={errorFromServer} />
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
