import { Button, Col, Tag } from 'antd';
import './SharedPost.scss';
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightOutlined } from '@ant-design/icons';
import constants from '../../constants';

const SharedPost = ({ post, onCategorySelected }) => {
  const { id, featured, category, title, content } = post

  const getColor = (category) => {
    switch (category) {
      case constants.POST_CATEGORY.TRAVEL:
        return "pink"
      case constants.POST_CATEGORY.LEARNING_EXPERIENCE:
        return "success"
      case constants.POST_CATEGORY.LIFE_EXPERIENCE:
        return "warning"
      default:
        return "default"
    }
  }

  return (
    <Col xs={24} lg={24}>
      <div className="shared-post">
        <div className="post-featured">
          <Link to={`/experiences/${id}`}>
            <img src={featured} alt={title} />
          </Link>
        </div>
        <div className="post-content-container" >
          <Link to={`/experiences/${id}`}>
            <h2>{title}</h2>
          </Link>
          <hr />
          <div className="post-content" dangerouslySetInnerHTML={{ __html: content }} />
          <Link style={{ position: 'absolute', zIndex: 1000, bottom: 10, right: 20, backgroundColor: 'red' }} to={`/experiences/${id}`}>
            <Button type="dashed">
              Đọc tiếp <ArrowRightOutlined />
            </Button>
          </Link>
          <Tag color={getColor(category)} className="post-category" onClick={() => onCategorySelected && onCategorySelected(category)}>{category}</Tag>
        </div>
      </div>
    </Col>
  )
}

export default SharedPost;