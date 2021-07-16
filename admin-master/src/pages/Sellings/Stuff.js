import React from 'react';
import { Card, Carousel, Col, Row } from 'antd';
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

const Stuff = ({ data, onCategorySelected }) => {
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

  return (
    <Col xs={24}>
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
            <p><FolderOpenOutlined /> Thể loại: <strong onClick={() => onCategorySelected([category])} style={{ color: 'blue', cursor: 'pointer' }}>{category}</strong></p>
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

export default Stuff;