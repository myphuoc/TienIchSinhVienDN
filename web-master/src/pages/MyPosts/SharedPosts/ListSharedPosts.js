import { Button, Col, notification, Popconfirm, Row, Table, Tag } from 'antd';
import constants from '../../../constants';
import { getTime } from 'helpers/UtilsHelper';
import React, { useEffect, useState } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import postApi from 'api/postApi';
import EditSharedPostModal from './EditSharedPostModal';
import AddPostModal from 'pages/SharedExperiences/AddPostModal';

const ListSharedPosts = () => {
  const [isShowAddModal, setShowAddModal] = useState(false)
  const [isShowEditModal, setShowEditModal] = useState(false)
  const [id, setId] = useState(false)

  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState([])
  const { user: { uid } } = useSelector(state => state.auth)

  const handleDelete = async (id) => {
    await postApi.deletePost(id)
      .then(async () => {
        notification.success({ message: 'Xoá thành công!' })
        await getPosts()
      })
      .catch(() => {
        notification.error({ message: "Xoá không thành công!" })
      })
  }

  const handleRestore = async (id) => {
    await postApi.restorePost(id)
      .then(async () => {
        notification.success({ message: 'Đăng lại thành công! Vui lòng đợi quản trị viên phê duyệt!' })
        await getPosts()
      })
      .catch(() => {
        notification.error({ message: "Đăng lại không thành công!" })
      })
  }

  const getPosts = async () => {
    setLoading(true)
    await postApi.getPosts(true, uid).then(res => setPosts(res))
    setLoading(false)
  }

  useEffect(() => {
    uid && getPosts()
  }, [uid])

  const data = posts.map(_ => ({ ..._, key: _.id }))

  const columns = [
    {
      title: 'Thời Gian',
      dataIndex: 'createdAt',
      sorter: { compare: (a, b) => a.createdAt - b.createdAt },
      render: (val) => getTime(val, 'DD-MM-YYYY HH:mm')
    },
    {
      title: 'Thể loại',
      dataIndex: 'category',
      textWrap: 'word-break',
      sorter: { compare: (a, b) => a.category > b.category },
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      textWrap: 'word-break'
    },
    {
      title: 'Tình Trạng',
      dataIndex: 'status',
      sorter: { compare: (a, b) => a.status > b.status },
      render: (status) => {
        const color = constants.STATUS_COLOR(status)
        return (
          <Tag color={color}>
            {status.toUpperCase()}
          </Tag>
        )
      }
    },
    {
      width: 160,
      fixed: 'right',
      render: (_, record) => {
        const { id, status } = record
        return (
          <div style={{ width: 130, textAlign: 'center' }}>
            {status !== constants.STATUS.DELETED && (
              <div>
                <Button
                  type="primary"
                  onClick={() => {
                    setId(id)
                    setShowEditModal(true)
                  }}
                >
                  Sửa
                </Button>{' '}
                <Popconfirm
                  okText="Xoá"
                  cancelText="Huỷ"
                  title="Bài viết của bạn sẽ bị xoá vĩnh viễn sau 30 ngày. Bạn có chắc xoá bài viết này không?"
                  onConfirm={() => handleDelete(id)}
                  icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                >
                  <Button style={{ borderColor: 'red', backgroundColor: 'red', color: 'white' }}>Xoá</Button>
                </Popconfirm>
              </div>
            )}
            {status === constants.STATUS.DELETED && (
              <Button
                style={{ borderColor: 'orange', backgroundColor: 'orange', color: 'white' }}
                onClick={() => handleRestore(id)}
              >
                Đăng lại
              </Button>
            )}
          </div>
        )
      },
    },
  ];

  return (
    <div>
      <AddPostModal
        isVisible={isShowAddModal}
        toggle={() => setShowAddModal(false)}
        callback={getPosts}
      />
      <EditSharedPostModal
        isVisible={isShowEditModal}
        data={data.find(_ => _.id === id) || {}}
        toggle={() => setShowEditModal(false)}
        callback={getPosts}
      />
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <Table
            title={() => (
              <div className="d-flex justify-content__space-between">
                <h4>CHIA SẺ KINH NGHIỆM</h4>
                <Button className="btn-success" onClick={() => setShowAddModal(true)}>Thêm</Button>
              </div>
            )}
            bordered
            loading={loading}
            dataSource={data}
            columns={columns}
            scroll={{ x: 700 }}
            locale={{ emptyText: 'Không có dữ liệu' }}
          />
        </Col>
      </Row>
    </div>
  )
}

export default ListSharedPosts;