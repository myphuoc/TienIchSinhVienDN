import { Button, Col, Form, Input, Modal, notification, Popconfirm, Row, Select, Spin } from 'antd';
import TextEditor from 'components/Editor';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import {
  ExclamationCircleOutlined,
  ExpandOutlined,
  FullscreenExitOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import constants from '../../../constants';
import postApi from 'api/postApi';
import './EditSharedPostModal.scss';
import { ImagePicker } from 'components/Picker';
import { destroy, upload } from 'helpers/StorageHelper';

const { Option } = Select;
const CATEGORIES = Object.values(constants.POST_CATEGORY)

const EditSharedPostModal = ({ isVisible, toggle, data, callback }) => {
  const [form] = Form.useForm()
  const ref = useRef()
  const [isExpand, setExpand] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentFeatured, setCurrentFeatured] = useState([])

  const handleSubmit = async () => {
    setLoading(true)
    const { id } = data
    const formData = await form.validateFields()
    let featured = currentFeatured
    let images = []
    if (formData.featured) {
      images = await upload(formData.featured, constants.COLLECTION.SHARED_EXPERIENCE)
      featured = images[0]
    }
    await postApi.updatePost(id, { ...formData, featured })
      .then(async () => {
        if (!currentFeatured) await destroy([data.featured])
        notification.success({ message: "Cập nhật thành công, vui lòng đợi quản trị viên phê duyệt!" })
        setExpand(false)
        toggle && toggle()
        callback && callback()
      })
      .catch(async () => {
        notification.error({ message: "Cập nhật không thành công!" })
        if (images.length > 0) await destroy(images)
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
    if (data) {
      const { featured, category, title, content } = data
      featured && setCurrentFeatured(featured)
      form.setFieldsValue({ category, title })
      setTimeout(() => {
        form.setFieldsValue({ content })
      }, 100)
    }
    !isVisible && form.resetFields()
  }, [isVisible, data])

  return (
    <Modal
      width={1000}
      title="CHIA SẺ KINH NGHIỆM"
      className={isExpand ? 'expanding' : ''}
      visible={isVisible}
      onOk={() => ref.current.click()}
      okText="Cập nhật"
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
            {currentFeatured && (
              <Col xs={24}>
                <p>Ảnh nổi bật
                  <span style={{ cursor: 'pointer', color: 'red', paddingLeft: 10 }}>
                    <Popconfirm
                      okText="Xoá"
                      cancelText="Huỷ"
                      title="Bạn có chắc muốn xoá ảnh này không?"
                      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                      onConfirm={() => setCurrentFeatured()}
                    >
                      (Xoá)
                    </Popconfirm>
                  </span>
                </p>
                <div className="small-image">
                  <a href={currentFeatured} target="_blank" rel="">
                    <img src={currentFeatured} width="100%" alt="" />
                  </a>
                </div>
              </Col>
            )}
            {!currentFeatured && (
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
                  <ImagePicker max={1} ratio={2} />
                </Form.Item>
              </Col>
            )}
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

export default EditSharedPostModal;