import { Card, Col, Row } from 'antd';
import Loading from 'components/Loading';
import { getTimeUtilNow } from 'helpers/UtilsHelper';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { getSharedPosts } from 'redux/sharedPosts/actions';
import SideBarPost from './SideBarPost';

const SharedPostDetails = (props) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [loaded, setLoaded] = useState(false)
  const { loading, posts } = useSelector(state => state.sharedPosts)
  const post = posts.find(_ => _.id === props.match.params.id)

  useEffect(() => {
    const getPosts = () => {
      dispatch(getSharedPosts)
      setLoaded(true)
    }
    if ((!posts.length)) {
      !loaded ? getPosts() : history.replace('/experiences')
    } else {
      if (!posts.find(_ => _.id === props.match.params.id)) history.replace('/experiences')
    }
  }, [posts])

  const renderPost = ({ title, content, createdBy, createdAt }) => {
    return (
      <>
        <h2>{title}</h2>
        <hr />
        <h3>Đăng bởi <span color="blue"><strong>{createdBy.fullname || ''}</strong></span> - {getTimeUtilNow(createdAt)}</h3>
        <div style={{ maxWidth: 825 }} dangerouslySetInnerHTML={{ __html: content }} />
      </>
    )
  }

  const renderRelatedPosts = () => {
    if (post) {
      return posts.map((item, index) => {
        if (item.id !== post.id && item.category === post.category) return <SideBarPost key={index} post={item} />
      })
    }
  }

  return (
    <>
      {loading && (<Loading />)}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={15}>
          <Card style={{ height: '100%' }}>
            {post && renderPost(post)}
          </Card>
        </Col>
        <Col xs={24} lg={9}>
          <Card style={{ height: '100%' }}>
            <h2>Bài viết liên quan</h2>
            <Row gutter={[24, 24]}>
              {posts && renderRelatedPosts()}
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default SharedPostDetails;