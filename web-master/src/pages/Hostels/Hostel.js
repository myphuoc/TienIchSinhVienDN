import React from 'react';
import { Card, Carousel, Col, Row } from 'antd';
import {
  FacebookOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  DollarCircleOutlined,
  ProfileOutlined,
  FieldTimeOutlined
} from '@ant-design/icons';
import { getPrice, getTimeUtilNow } from 'helpers/UtilsHelper';

const Hostel = ({ data }) => {
  const {
    description,
    address,
    roomPrice,
    waterPrice,
    electricPrice,
    phoneNumber,
    facebookUrl,
    images,
    createdAt,
    createdBy
  } = data

  return (
    <Col xs={24} md={12} xl={8}>
      <Card style={{ height: "100%" }}>
        <Carousel
          autoplay
          autoplaySpeed={5000}
          pauseOnHover
          arrows
          draggable
        >
          {images && images.map((img, i) => (
            <a key={i} target="_blank" rel="noopener noreferrer" href={img}>
              <img src={img} width="100%" alt="" />
            </a>
          ))}
        </Carousel>
        <Row>
          <div className="room-info">
            <p><FieldTimeOutlined /> Đăng bởi <strong style={{ color: 'blue' }}>{createdBy.fullname || "Chưa đặt tên"}</strong> ({getTimeUtilNow(createdAt)})</p>
            <p><EnvironmentOutlined /> Địa chỉ: <strong>{address}</strong></p>
            <p><DollarCircleOutlined /> Giá phòng: <strong className="room-price">{getPrice(roomPrice)}</strong>/tháng</p>
            <p><DollarCircleOutlined /> Tiền điện: {getPrice(electricPrice)}/kWh</p>
            <p><DollarCircleOutlined /> Tiền nước: {getPrice(waterPrice)}/m3</p>
            <p><PhoneOutlined /> SĐT: <a href={`tel:${phoneNumber}`}>{phoneNumber}</a></p>
            {facebookUrl && (<p><FacebookOutlined /> Facebook: <a target="_blank" rel="noopener noreferrer" href={facebookUrl}>{createdBy.fullname || facebookUrl}</a></p>)}
            {description && (<p className="room-description"><ProfileOutlined /> Mô tả: {description}</p>)}
          </div>
        </Row>
      </Card>
    </Col>
  )
}

export default Hostel;