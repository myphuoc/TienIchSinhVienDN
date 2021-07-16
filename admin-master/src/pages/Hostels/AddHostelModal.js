import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Spin
} from 'antd';
import {
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { getPrice } from 'helpers/UtilsHelper';
import React, { useEffect, useRef, useState } from 'react';
import { ImagePicker } from 'components/Picker';
import { destroy, upload } from 'helpers/StorageHelper';
import hostelApi from 'api/hostelApi';
import { useSelector } from 'react-redux';
import constants from '../../constants';

const AddHostelModal = ({ isVisible, toggle, callback }) => {
  const [form] = Form.useForm()
  const ref = useRef()

  const { user } = useSelector(state => state.auth)

  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const data = await form.validateFields()
    const images = await upload(data.files, constants.COLLECTION.HOSTEL)
    await hostelApi.addHostel({
      address: data.address,
      roomPrice: data.roomPrice,
      electricPrice: data.electricPrice,
      waterPrice: data.waterPrice,
      phoneNumber: data.phoneNumber,
      facebookUrl: data.facebookUrl || '',
      images,
      createdBy: user
    }).then(() => {
      notification.success({ message: "Đăng bài thành công!" })
      callback && callback()
      toggle && toggle()
    }).catch(async () => {
      notification.error({ message: "Đăng bài không thành công!" })
      if (images.length) await destroy(images)
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
      title="ĐĂNG PHÒNG TRỌ"
      visible={isVisible}
      onOk={() => ref.current.click()}
      okText="Đăng bài"
      cancelText="Huỷ"
      onCancel={handleClose}
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[
              {
                required: true,
                message: "Địa chỉ là trường bắt buộc"
              }
            ]}
          >
            <Input placeholder="88 Tên Đường, Tên Quận/Huyện, Tên Phố/Tỉnh" />
          </Form.Item>
          <Row gutter={[24]}>
            <Col xs={24} sm={8}>
              <Form.Item
                name="roomPrice"
                label="Giá phòng"
                rules={[
                  {
                    required: true,
                    message: "Giá phòng là trường bắt buộc"
                  }
                ]}
              >
                <Input type="number" min={0} placeholder={`${getPrice(1000000)}/tháng`} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="electricPrice"
                label="Giá điện"
                rules={[
                  {
                    required: true,
                    message: "Giá điện là trường bắt buộc"
                  }
                ]}
              >
                <Input type="number" min={0} placeholder={`${getPrice(3000)}/kWh`} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="waterPrice"
                label="Giá nước"
                rules={[
                  {
                    required: true,
                    message: "Giá nước là trường bắt buộc"
                  }
                ]}
              >
                <Input type="number" min={0} placeholder={`${getPrice(7000)}/m3`} />
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
                    required: true,
                    message: "Số điện thoại là trường bắt buộc"
                  },
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
                name="facebookUrl"
                label="Liên kết Facebook"
              >
                <Input type="text" placeholder="https://fb.com/1000****52" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="files"
            label="Hình ảnh"
            rules={[
              {
                required: true,
                message: "Vui lòng tải lên hình ảnh"
              }
            ]}
          >
            <ImagePicker />
          </Form.Item>
          <Button htmlType="submit" style={{ display: 'none' }} ref={ref} />
        </Form>
      </Spin>
    </Modal>
  )
}

export default AddHostelModal;