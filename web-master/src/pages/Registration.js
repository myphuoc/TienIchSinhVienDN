import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../redux/auth/actions";
import { Form, Input, Button, Card } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import Loading from "../components/Loading";
import ErrorSummary from "../components/ErrorSummary";
import { Link, Redirect } from "react-router-dom";
import "./Registration.scss";

const Registration = () => {
  const dispatch = useDispatch()
  const { isAuthenticated, loading, errors } = useSelector((state) => state.auth)

  const errorFromServer =
    errors && errors.response
      ? errors.response.data
      : errors.message
        ? { Null: errors.message }
        : {}

  const onFinish = ({ fullname, email, password }) => {
    dispatch(signup(fullname, email, password))
  }

  if (isAuthenticated)
    return <Redirect to="" />

  return (
    <div className="signup-page">
      {loading ? <Loading /> : ""}
      <Card style={{ width: 360 }} className="box-shadow">
        <h3>Đăng ký tài khoản</h3>
        <Form
          name="normal_signup"
          className="signup-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="fullname"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ tên đầy đủ!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Tên đầy đủ"
            />
          </Form.Item>
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
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }, { min: 8, message: "Mật khẩu phải chứa ít nhất 8 kí tự!" }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Mật khẩu"
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập lại mật khẩu!',
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('Mật khẩu không khớp!');
                },
              })
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Nhập lại mật khẩu"
            />
          </Form.Item>
          <Form.Item>
            <Link className="signup-form-forgot" to="/login">
              Bạn đã có tài khoản?
            </Link>
          </Form.Item>
          <ErrorSummary error={errorFromServer} />
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="signup-form-button"
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Registration;
