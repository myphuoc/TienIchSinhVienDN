import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Spin,
  Select
} from 'antd';
import {
  ExclamationCircleOutlined
} from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import { destroy, upload } from 'helpers/StorageHelper';
import userApi from 'api/userApi';
import { useSelector } from 'react-redux';
import constants from '../../constants';

const { Option } = Select;

const AddUserModal = ({ isVisible, toggle, callback }) => {
  const [form] = Form.useForm()
  const ref = useRef()

  const { user } = useSelector(state => state.auth)

  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const data = await form.validateFields()
    await userApi.addUser(data).then(() => {
      notification.success({ message: "Thêm tài khoản thành công!" })
      callback && callback()
      toggle && toggle()
    }).catch(async () => {
      notification.error({ message: "Thêm tài khoản không thành công!" })
    })
    setLoading(false)
  }

  const handleClose = () => {
    if (form.isFieldsTouched()) {
      Modal.confirm({
        title: 'Cảnh báo',
        icon: <ExclamationCircleOutlined />,
        content: 'Huỷ bỏ viết bài, mọi thay đổi sẽ không được lưu?',
        okText: 'Đồng ý',
        onOk: toggle,
        cancelText: 'Huỷ',
      })
    } else {
      toggle()
    }
  }

  useEffect(() => {
    !isVisible && form.resetFields()
  }, [isVisible])

  return (
    <Modal
      width={700}
      title="THÊM TÀI KHOẢN"
      visible={isVisible}
      onOk={() => ref.current.click()}
      okText="Thêm"
      cancelText="Huỷ"
      onCancel={handleClose}
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >

          <Row gutter={[24]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="fullname"
                label="Họ tên"
                rules={[
                  {
                    required: true,
                    message: "Họ tên là trường bắt buộc"
                  }
                ]}
              >
                <Input placeholder="Joiny Nguyen" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    message: "Email là trường bắt buộc"
                  }
                ]}
              >
                <Input placeholder="joiny.nguyen@gmail.com" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24]}>
            <Col xs={24} sm={8}>
              <Form.Item
                name="phoneNumber"
                label="Số điện thoại"
                rules={[
                  {
                    pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
                    message: "Vui lòng nhập SĐT đúng định dạng"
                  }
                ]}
              >
                <Input placeholder="0922 *** 222" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  {
                    required: true,
                    message: "Mật khẩu là trường bắt buộc"
                  },
                  {
                    min: 8,
                    message: "Mật khẩu phải chứa ít nhất 8 kí tự"
                  }
                ]}
              >
                <Input type="password" placeholder="**********" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="isAdmin"
                label="Phân Quyền"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn quyền"
                  }
                ]}
              >
                <Select>
                  <Option value={true}>Quản trị viên</Option>
                  <Option value={false}>Người dùng</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Button htmlType="submit" style={{ display: 'none' }} ref={ref} />
        </Form>
      </Spin>
    </Modal>
  )
}

export default AddUserModal;