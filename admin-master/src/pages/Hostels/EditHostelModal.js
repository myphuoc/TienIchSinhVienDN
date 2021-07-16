import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  notification,
  Popconfirm,
  Row,
  Spin
} from 'antd';
import {
  ExclamationCircleOutlined,
  CloseSquareOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import './EditHostelModal.scss';
import { getPrice } from 'helpers/UtilsHelper';
import React, { useEffect, useRef, useState } from 'react';
import { ImagePicker } from 'components/Picker';
import { destroy, upload } from 'helpers/StorageHelper';
import hostelApi from 'api/hostelApi';
import constants from '../../constants';

const EditHostelModal = ({ isVisible, toggle, callback, data }) => {
  const [form] = Form.useForm()
  const ref = useRef()

  const [loading, setLoading] = useState(false)
  const [currentImages, setCurrentImages] = useState([])

  const handleSubmit = async () => {
    const { id, images } = data
    setLoading(true)
    const formData = await form.validateFields()
    const newImages = await upload(formData.files, constants.COLLECTION.HOSTEL)
    await hostelApi.updateHostel(id, {
      address: formData.address,
      roomPrice: formData.roomPrice,
      electricPrice: formData.electricPrice,
      waterPrice: formData.waterPrice,
      phoneNumber: formData.phoneNumber,
      facebookUrl: formData.facebookUrl || '',
      images: [...currentImages, ...newImages],
    }).then(async () => {
      await destroy(images.filter(_ => !currentImages.includes(_)))
      notification.success({ message: "Cập nhật thành công!" })
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
      const { address, roomPrice, waterPrice, electricPrice, facebookUrl, phoneNumber, images } = data
      images && setCurrentImages(images)
      form.setFieldsValue({ address, roomPrice, waterPrice, electricPrice, facebookUrl, phoneNumber })
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
            <ImagePicker />
          </Form.Item>
          <Button htmlType="submit" style={{ display: 'none' }} ref={ref} />
        </Form>
      </Spin>
    </Modal>
  )
}

export default EditHostelModal;