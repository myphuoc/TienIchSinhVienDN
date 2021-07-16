import { Button, Col } from 'antd';
import './SideBarPost.scss';
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightOutlined } from '@ant-design/icons';

const SideBarPost = ({ post }) => {
  const { id, featured, title, content } = post

  return (
    <Col xs={24} lg={24}>
      <div className="sidebar-shared-post">
        <div className="post-featured">
          <Link to={`/experiences/${id}`}>
            <img src={featured} alt={title} />
          </Link>
        </div>
        <div className="post-content-container">
          <Link to={`/experiences/${id}`}>
            <h2>{title}</h2>
          </Link>
          <hr />
          <div className="post-content" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </Col>
  )
}

export default SideBarPost;