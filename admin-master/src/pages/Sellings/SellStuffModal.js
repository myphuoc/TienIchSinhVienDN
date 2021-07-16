import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Select,
  Spin
} from 'antd';
import {
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { getPrice } from 'helpers/UtilsHelper';
import React, { useEffect, useRef, useState } from 'react';
import { ImagePicker } from 'components/Picker';
import { destroy, upload } from 'helpers/StorageHelper';
import { useSelector } from 'react-redux';
import TextArea from 'antd/lib/input/TextArea';
import constants from '../../constants';
import sellingApi from 'api/sellingApi';

const { Option } = Select;
const CATEGORIES = Object.values(constants.SELL_CATEGORY)

const SellStuffModal = ({ isVisible, toggle, callback }) => {
  const [form] = Form.useForm()
  const ref = useRef()
  const { user } = useSelector(state => state.auth)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const data = await form.validateFields()
    const images = await upload(data.files, constants.COLLECTION.SELLING)
    await sellingApi.addStuff({
      category: data.category,
      name: data.name,
      description: data.description || '',
      price: data.price,
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
      title="BÁN HÀNG"
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
            name="name"
            label="Tên mặt hàng"
            rules={[
              {
                required: true,
                message: "Tên mặt hàng là trường bắt buộc"
              }
            ]}
          >
            <Input placeholder="Tên mặt hàng" />
          </Form.Item>
          <Row gutter={[24]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="category"
                label="Loại mặt hàng"
                rules={[
                  {
                    required: true,
                    message: "Loại mặt hàng là trường bắt buộc"
                  }
                ]}
              >
                <Select>
                  {CATEGORIES.map((item, index) => (<Option key={index} value={item}>{item}</Option>))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="price"
                label="Giá"
                rules={[
                  {
                    required: true,
                    message: "Giá là trường bắt buộc"
                  }
                ]}
              >
                <Input type="number" min={0} placeholder={getPrice(200000)} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="phoneNumber"
                label="Số điện thoại liên hệ"
                rules={[
                  {
                    required: true,
                    message: "Số điện thoại liên hệ là trường bắt buộc"
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
            name="description"
            label="Mô tả"
          >
            <TextArea showCount maxLength={100} rows={3} />
          </Form.Item>
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
            <ImagePicker ratio={1} />
          </Form.Item>
          <Button htmlType="submit" style={{ display: 'none' }} ref={ref} />
        </Form>
      </Spin>
    </Modal>
  )
}

export default SellStuffModal;