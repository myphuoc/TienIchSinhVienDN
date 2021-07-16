import { Button, Card, Col, Empty, notification, PageHeader, Row, Slider, Spin } from 'antd';
import hostelApi from 'api/hostelApi';
import { getPrice } from 'helpers/UtilsHelper';
import React, { useEffect, useState } from 'react';
import AddHostelModal from './AddHostelModal';
import './Hostels.scss';
import { PlusOutlined } from '@ant-design/icons';
import Hostel from './Hostel';
import { useSelector } from 'react-redux';

const marks = {
  0: getPrice(0),
  5000000: getPrice(5000000),
  10000000: getPrice(10000000),
};

const Hostels = () => {
  const { isAuthenticated } = useSelector(state => state.auth)
  const [filters, setFilters] = useState({ prices: [0, 10000000] })

  const [hostels, setHostels] = useState([])
  const [loading, setLoading] = useState(false)
  const [isShowAddModal, setIsShowAddModal] = useState(false)

  const [minPrice, maxPrice] = filters.prices
  const filteredData = hostels.filter(_ => _.roomPrice >= minPrice && _.roomPrice <= maxPrice)

  const getHostels = async () => {
    setLoading(true)
    await hostelApi.getHostels()
      .then(res => setHostels(res))
    setLoading(false)
  }

  useEffect(() => {
    getHostels()
  }, [])

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
          <PageHeader title="PHÒNG TRỌ" style={{ paddingLeft: 0 }} />
        </Col>
        <Col xs={10} className="d-flex justify-content-end">
          <AddHostelModal
            isVisible={isShowAddModal}
            toggle={() => setIsShowAddModal(!isShowAddModal)}
            callback={getHostels}
          />
          <Button size="large" type="primary" onClick={handleBtnAddClicked}><PlusOutlined /> ĐĂNG BÀI</Button>
        </Col>
      </Row>
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <h4>Giá từ {getPrice(minPrice)} đến {getPrice(maxPrice)}</h4>
            <Slider
              range
              marks={marks}
              step={100000}
              defaultValue={[0, 10000000]}
              max={10000000}
              onAfterChange={(val) => setFilters({ ...filters, prices: val })}
            />
          </Col>
        </Row>
      </Card>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          {filteredData && filteredData.map((hostel, index) => (<Hostel key={index} data={hostel} />))}
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

export default Hostels;