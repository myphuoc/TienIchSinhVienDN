import React from 'react';
import { Card, Carousel, Col, Row, Tag } from 'antd';
import {
  FacebookOutlined,
  PhoneOutlined,
  IdcardOutlined,
  DollarCircleOutlined,
  ProfileOutlined,
  FieldTimeOutlined,
  FolderOpenOutlined
} from '@ant-design/icons';
import { getPrice, getTimeUtilNow } from 'helpers/UtilsHelper';
import constants from '../../constants';

const SellingStuff = ({ data, onCategorySelected }) => {
  const {
    category,
    name,
    description,
    price,
    phoneNumber,
    facebookUrl,
    images,
    createdAt,
    createdBy
  } = data

  const getColor = (category) => {
    switch (category) {
      case constants.SELL_CATEGORY.CLOTHES:
        return "pink"
      case constants.SELL_CATEGORY.HOUSEWARE:
        return "warning"
      case constants.SELL_CATEGORY.LEARNING_TOOL:
        return "green"
      default:
        return "default"
    }
  }

  return (
    <Col xs={24} sm={12} lg={8} xl={6}>
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
            <p><FolderOpenOutlined /> Thể loại: <Tag className="clickable" color={getColor(category)} onClick={() => onCategorySelected([category])}>{category}</Tag></p>
            <p><IdcardOutlined /> Tên: <strong>{name}</strong></p>
            <p><DollarCircleOutlined /> Giá: <strong className="room-price">{getPrice(price)}</strong></p>
            <p><PhoneOutlined /> SĐT: <a href={`tel:${phoneNumber}`}>{phoneNumber}</a></p>
            {facebookUrl && (<p><FacebookOutlined /> Facebook: <a target="_blank" rel="noopener noreferrer" href={facebookUrl}>{createdBy.fullname || facebookUrl}</a></p>)}
            {description && (<p className="room-description"><ProfileOutlined /> Mô tả: {description}</p>)}
          </div>
        </Row>
      </Card>
    </Col>
  )
}

export default SellingStuff;