import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  notification,
  Popconfirm,
  Row,
  Select,
  Spin
} from 'antd';
import {
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
  CloseSquareOutlined
} from '@ant-design/icons';
import { getPrice } from 'helpers/UtilsHelper';
import React, { useEffect, useRef, useState } from 'react';
import { ImagePicker } from 'components/Picker';
import { destroy, upload } from 'helpers/StorageHelper';
import TextArea from 'antd/lib/input/TextArea';
import constants from '../../../constants';
import sellingApi from 'api/sellingApi';

const { Option } = Select;
const CATEGORIES = Object.values(constants.SELL_CATEGORY)

const EditStuffModal = ({ isVisible, toggle, callback, data }) => {
  const [form] = Form.useForm()
  const ref = useRef()

  const [loading, setLoading] = useState(false)
  const [currentImages, setCurrentImages] = useState([])

  const handleSubmit = async () => {
    const { id, images } = data
    setLoading(true)
    const formData = await form.validateFields()
    const newImages = await upload(formData.files, constants.COLLECTION.SELLING)
    await sellingApi.updateStuff(id, {
      category: formData.category,
      name: formData.name,
      description: formData.description || '',
      price: formData.price,
      phoneNumber: formData.phoneNumber,
      facebookUrl: formData.facebookUrl || '',
      images: [...currentImages, ...newImages]
    }).then(async () => {
      await destroy(images.filter(_ => !currentImages.includes(_)))
      notification.success({ message: "Cập nhật thành công, vui lòng đợi phê duyệt từ quản trị viên!" })
      callback && callback()
      toggle && toggle()
    }).catch(async () => {
      notification.error({ message: "Cập nhật không thành công!" })
      if (newImages.length) await destroy(newImages)
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
      const { category, name, description, price, facebookUrl, phoneNumber, images } = data
      images && setCurrentImages(images)
      form.setFieldsValue({ category, name, description, price, facebookUrl, phoneNumber })
    }
    !isVisible && form.resetFields()
  }, [isVisible, data])

  return (
    <Modal
      title="BÁN HÀNG"
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
          {currentImages && (
            <Row gutter={[8, 8]}>
              {currentImages.map((img, index) => (
                <Col key={index}>
                  <div className="small-image">
                    <Popconfirm
                      okText="Xoá"
                      cancelText="Huỷ"
                      title="Bạn có chắc muốn xoá ảnh này không?"
                      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                      onConfirm={() => setCurrentImages(currentImages.filter(_ => _ !== img))}
                    >
                      <CloseSquareOutlined className="icon-delete-image" />
                    </Popconfirm>
                    <a href={img} target="_blank" rel="">
                      <img src={img} width="100%" alt="" />
                    </a>
                  </div>
                </Col>
              ))}
            </Row>
          )}
          <Form.Item
            name="files"
            label="Hình ảnh"
            rules={[
              {
                required: currentImages && currentImages.length === 0 || false,
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

export default EditStuffModal;