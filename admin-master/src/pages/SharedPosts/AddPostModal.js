import { Button, Col, Form, Input, Modal, notification, Row, Select, Spin } from 'antd';
import TextEditor from 'components/Editor';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import {
  ExclamationCircleOutlined,
  ExpandOutlined,
  FullscreenExitOutlined
} from '@ant-design/icons';
import constants from '../../constants';
import postApi from 'api/postApi';
import { useSelector } from 'react-redux';
import { ImagePicker } from 'components/Picker';
import { destroy, upload } from 'helpers/StorageHelper';

const { Option } = Select;
const CATEGORIES = Object.values(constants.POST_CATEGORY)

const AddPostModal = ({ isVisible, toggle, callback }) => {
  const [form] = Form.useForm()
  const ref = useRef()
  const [isExpand, setExpand] = useState(false)
  const [loading, setLoading] = useState(false)

  const { user } = useSelector(state => state.auth)

  const handleSubmit = async () => {
    setLoading(true)
    const data = await form.validateFields()
    const images = await upload(data.featured, constants.COLLECTION.SHARED_EXPERIENCE)
    await postApi.addPost({ ...data, featured: images[0], createdBy: user })
      .then(() => {
        notification.success({ message: "Đăng bài thành công!" })
        setExpand(false)
        toggle && toggle()
        callback && callback()
      })
      .catch(async () => {
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
        onOk: () => {
          setExpand(false)
          toggle && toggle()
        },
        cancelText: 'Huỷ',
      })
    } else {
      setExpand(false)
      toggle && toggle()
    }
  }

  useEffect(() => {
    form.resetFields()
  }, [isVisible])

  return (
    <Modal
      width={1000}
      title="CHIA SẺ KINH NGHIỆM"
      className={isExpand ? 'expanding' : ''}
      visible={isVisible}
      onOk={() => ref.current.click()}
      okText="Đăng bài"
      cancelText="Huỷ"
      onCancel={handleClose}
    >
      <div className="expandable" onClick={() => setExpand(!isExpand)}>
        {isExpand ? <FullscreenExitOutlined /> : <ExpandOutlined />}
      </div>
      <Spin spinning={loading}>
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Row gutter={[24, 24]}>
            <Col xs={24}>
              <Row gutter={[24]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="title"
                    label="Tiêu đề"
                    rules={[
                      {
                        required: true,
                        message: "Tiêu đề là trường bắt buộc"
                      }
                    ]}
                  >
                    <Input placeholder="Tiêu đề bài viết" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="category"
                    label="Thể loại"
                    rules={[
                      {
                        required: true,
                        message: "Thể loại bài viết là trường bắt buộc"
                      }
                    ]}
                  >
                    <Select>
                      {CATEGORIES.map((item, index) => (<Option key={index} value={item}>{item}</Option>))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Button htmlType="submit" style={{ display: 'none' }} ref={ref} />
            </Col>
            <Col xs={24}>
              <Form.Item
                name="featured"
                label="Ảnh nổi bật"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ảnh nổi bật!"
                  }
                ]}
              >
                <ImagePicker ratio={2} max={1} />
              </Form.Item>
            </Col>
            <Col xs={24} className={isExpand ? 'expanding' : ''}>
              <Form.Item
                name="content"
                rules={[
                  {
                    required: true,
                    message: "Bài đăng phải có nội dung!"
                  },
                  {
                    min: 300,
                    message: "Bài đăng quá ngắn! Nội dung bài đăng phải chứa ít nhất 300 kí tự!"
                  }
                ]}
              >
                <TextEditor />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  )
}

export default AddPostModal;