import { Card, Col, notification, PageHeader, Row, Select, Spin } from 'antd';
import Button from 'antd/lib/button/button';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSharedPosts } from 'redux/sharedPosts/actions';
import AddPostModal from './AddPostModal';
import './SharedExperiences.scss';
import SharedPost from './SharedPost';
import { PlusOutlined } from "@ant-design/icons";
import constants from '../../constants';

const { Option } = Select;
const CATEGORIES = Object.values(constants.POST_CATEGORY)

const SharedExperiences = () => {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector(state => state.auth)
  const [filters, setFilters] = useState({ categories: CATEGORIES })
  const [isShowAddPostModal, setShowAddPostModal] = useState(false)
  const { loading, posts } = useSelector(state => state.sharedPosts)

  const filteredData = posts.filter(_ => filters.categories.length ? (filters.categories.includes(_.category)) : true)

  useEffect(() => {
    dispatch(getSharedPosts)
  }, [dispatch, isAuthenticated])

  const handleChange = (categories) => {
    setFilters({ ...filters, categories })
  }

  const handleBtnAddClicked = () => {
    if (isAuthenticated) {
      setShowAddPostModal(true)
    } else {
      notification.warn({ message: 'Vui lòng đăng ký tài khoản hoặc đăng nhập để viết bài!' })
    }
  }

  return (
    <>
      <Row>
        <Col xs={14}>
          <PageHeader title="KINH NGHIỆM" style={{ paddingLeft: 0 }} />
        </Col>
        <Col xs={10} className="d-flex justify-content-end">
          <AddPostModal
            isVisible={isShowAddPostModal}
            toggle={() => setShowAddPostModal(false)}
          />
          <Button size="large" type="primary" onClick={handleBtnAddClicked}><PlusOutlined /> ĐĂNG BÀI</Button>
        </Col>
      </Row>
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Select
              size="large"
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Chọn thể loại"
              value={filters.categories}
              onChange={handleChange}
            >
              {CATEGORIES.map((item, index) => (<Option key={index} value={item}>{item}</Option>))}
            </Select>
          </Col>
        </Row>
      </Card>
      <Spin spinning={loading}>
        <Row gutter={[24, 24]} style={{ minHeight: '100%' }}>
          <Col xs={24}>
            {filteredData && filteredData.length > 0 && (
              <Card>
                <Row gutter={[24, 24]}>
                  {filteredData.map((item, index) => (
                    <SharedPost onCategorySelected={(category) => setFilters({ ...filters, categories: [category] })} key={index} post={item} />
                  ))}
                </Row>
              </Card>
            )}
          </Col>
        </Row>
      </Spin>
    </>
  )
}

export default SharedExperiences;