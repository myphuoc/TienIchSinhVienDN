import { Button, Card, Col, Empty, notification, PageHeader, Row, Select, Slider, Spin } from 'antd';
import { getPrice } from 'helpers/UtilsHelper';
import React, { useEffect, useState } from 'react';
import './Sellings.scss';
import { PlusOutlined } from '@ant-design/icons';
import SellingStuff from './SellingStuff';
import SellStuffModal from './SellStuffModal';
import sellingApi from 'api/sellingApi';
import constants from '../../constants';
import { useSelector } from 'react-redux';

const { Option } = Select;

const marks = {
  0: getPrice(0),
  2500000: getPrice(2500000),
  5000000: getPrice(5000000),
};

const CATEGORIES = Object.values(constants.SELL_CATEGORY)

const Sellings = () => {
  const { isAuthenticated } = useSelector(state => state.auth)
  const [filters, setFilters] = useState({ prices: [0, 5000000], categories: CATEGORIES })

  const [stuffs, setStuffs] = useState([])
  const [loading, setLoading] = useState(false)
  const [isShowAddModal, setIsShowAddModal] = useState(false)

  const [minPrice, maxPrice] = filters.prices
  const filteredData = stuffs.filter(_ => _.price >= minPrice && _.price <= maxPrice && (filters.categories.length ? (filters.categories.includes(_.category)) : true))

  const getStuffs = async () => {
    setLoading(true)
    await sellingApi.getStuffs()
      .then(res => setStuffs(res))
    setLoading(false)
  }

  useEffect(() => {
    getStuffs()
  }, [])

  const handleChange = (categories) => {
    setFilters({ ...filters, categories })
  }

  const handleBtnAddClicked = () => {
    if (isAuthenticated) {
      setIsShowAddModal(true)
    } else {
      notification.warn({ message: 'Vui lòng đăng ký tài khoản hoặc đăng nhập để viết bài!' })
    }
  }

  return (
    <div>
      <Row>
        <Col xs={14}>
          <PageHeader title="MUA BÁN" style={{ paddingLeft: 0 }} />
        </Col>
        <Col xs={10} className="d-flex justify-content-end">
          <SellStuffModal
            isVisible={isShowAddModal}
            toggle={() => setIsShowAddModal(!isShowAddModal)}
            callback={getStuffs}
          />
          <Button size="large" type="primary" onClick={handleBtnAddClicked}><PlusOutlined /> ĐĂNG BÀI</Button>
        </Col>
      </Row>
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12} className="d-flex justify-content-end">
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
          <Col xs={24} md={12}>
            <h4>Giá từ {getPrice(minPrice)} đến {getPrice(maxPrice)}</h4>
            <Slider
              range
              marks={marks}
              step={50000}
              defaultValue={[0, 5000000]}
              max={5000000}
              onAfterChange={(val) => setFilters({ ...filters, prices: val })}
            />
          </Col>
        </Row>
      </Card>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          {filteredData && filteredData.map((hostel, index) => (<SellingStuff onCategorySelected={handleChange} key={index} data={hostel} />))}
          {(!filteredData || !filteredData.length) && (
            <div style={{ width: '-webkit-fill-available', textAlign: 'center', padding: 50 }}>
              <Empty description="Không có bài đăng nào gần đây!" />
            </div>
          )}
        </Row>
      </Spin>
    </div>
  )
}

export default Sellings;