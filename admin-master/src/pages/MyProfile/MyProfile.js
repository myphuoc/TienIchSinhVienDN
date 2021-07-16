import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  notification,
  PageHeader,
} from "antd";
import {
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined
} from "@ant-design/icons";
import authApi from "api/authApi";
import { getProfile } from "redux/auth/actions";

const MyProfile = () => {
  const { user } = useSelector((state) => state.auth)

  const [form] = Form.useForm()
  const dispatch = useDispatch()

  const [changingPassword, setChangingPassword] = useState(false)
  const [updatingProfile, setUpdatingProfile] = useState(false)

  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    if (oldPassword && password && confirmPassword) {
      setChangingPassword(true)
      await authApi.changePassword(oldPassword, password)
        .then(() => notification.success({ message: "Đổi mật khẩu thành công!" }))
        .catch((error) => notification.error({ message: error.message || "Đổi mật khẩu không thành công!" }))
      setChangingPassword(false)
    }
  }

  const handleUpdateProfile = async () => {
    const { fullname, phoneNumber } = await form.validateFields()
    const { uid } = user
    setUpdatingProfile(true)
    await authApi.updateProfile(uid, { fullname, phoneNumber })
      .then(() => {
        notification.success({ message: "Cập nhật thành công!" })
        dispatch(getProfile())
      })
      .catch(() => notification.error({ message: "Cập nhật không thành công!" }))
    setUpdatingProfile(false)
  }

  useEffect(() => {
    user && form.setFieldsValue({
      email: user.email,
      fullname: user.fullname,
      phoneNumber: user.phoneNumber || ''
    })
  }, [user])

  useEffect(() => {

  }, [form])

  return (
    <div>
      <PageHeader title="TÀI KHOẢN CỦA TÔI" style={{ paddingLeft: 0, paddingTop: 0 }} />
      <Row gutter={[24, 16]}>
        <Col xs={24} sm={12}>
          <Card title="THÔNG TIN TÀI KHOẢN">
            <Row justify="space-around" align="middle">
              <Col xs={24}>
                <Form
                  layout="vertical"
                  name="update-profile"
                  form={form}
                  onFinish={handleUpdateProfile}
                >
                  <Form.Item
                    label="Họ và Tên"
                    name="fullname"
                    rules={[
                      {
                        required: true,
                        message: "Họ tên là trường bắt buộc!",
                      }
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      type="text"
                      placeholder="Họ và Tên"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Địa chỉ email"
                    name="email"
                    rules={[{ required: true }]}
                  >
                    <Input
                      disabled={true}
                      prefix={<MailOutlined />}
                      type="text"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Số điện thoại"
                    name="phoneNumber"
                  >
                    <Input
                      prefix={<PhoneOutlined />}
                      type="tel"
                      placeholder="Số điện thoại"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      loading={updatingProfile}
                      type="primary"
                      htmlType="submit"
                      style={{ width: "100%", marginBottom: 15 }}
                    >
                      CẬP NHẬT
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card title="ĐỔI MẬT KHẨU">
            <Row justify="space-around" align="middle">
              <Col xs={24}>
                <Form
                  layout="vertical"
                  name="reset-password"
                  className="reset-password-form"
                  onFinish={handleChangePassword}
                >
                  <Form.Item
                    label="Mật khẩu hiện tại"
                    name="oldPassword"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập mật khẩu hiện tại!",
                      },
                    ]}
                  >
                    <Input
                      prefix={<LockOutlined />}
                      type="password"
                      placeholder="Mật khẩu hiện tại"
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Mật khẩu mới"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập mật khẩu mới!",
                      },
                      {
                        min: 8,
                        message: 'Mật khẩu phải chứa ít nhất 8 kí tự!'
                      }
                    ]}
                  >
                    <Input
                      prefix={<LockOutlined />}
                      type="password"
                      placeholder="Mật khẩu mới"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Xác nhận mật khẩu"
                    name="confirmPassword"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập xác nhận mật khẩu!",
                      },
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            "Mật khẩu không khớp!",
                          );
                        },
                      }),
                    ]}
                  >
                    <Input
                      prefix={<LockOutlined />}
                      type="password"
                      placeholder="Xác nhận mật khẩu"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      loading={changingPassword}
                      type="primary"
                      htmlType="submit"
                      style={{ width: "100%", marginBottom: 15 }}
                      disabled={
                        !oldPassword ||
                        !password ||
                        !confirmPassword ||
                        password !== confirmPassword
                      }
                    >
                      ĐỔI MẬT KHẨU
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MyProfile;
