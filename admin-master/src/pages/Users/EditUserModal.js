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
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import './EditUserModal.scss';
import React, { useEffect, useRef, useState } from 'react';
import userApi from 'api/userApi';

const { Option } = Select;

const EditUserModal = ({ isVisible, toggle, callback, data }) => {
  const [form] = Form.useForm()
  const ref = useRef()

  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    const { id } = data
    setLoading(true)
    const formData = await form.validateFields()
    await userApi.updateUser(id, {
      fullname: formData.fullname,
      phoneNumber: formData.phoneNumber,
      isAdmin: formData.isAdmin,
    }).then(() => {
      notification.success({ message: "Cập nhật thành công!" })
      callback && callback()
      toggle && toggle()
    }).catch(() => {
      notification.error({ message: "Cập nhật không thành công!" })
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
    if (data) {
      const { fullname, email, phoneNumber, isAdmin } = data
      form.setFieldsValue({ fullname, email, phoneNumber, isAdmin })
    }
    !isVisible && form.resetFields()
  }, [isVisible, data])

  return (
    <Modal
      title="ĐĂNG PHÒNG TRỌ"
      visible={isVisible}
      onOk={() => ref.current.click()}
      okText="Cập nhật"
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
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24]}>
            <Col xs={24} sm={12}>
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
            <Col xs={24} sm={12}>
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

export default EditUserModal;