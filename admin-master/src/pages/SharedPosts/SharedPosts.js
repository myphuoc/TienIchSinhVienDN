import { Button, Col, notification, Popconfirm, Row, Table, Tag } from 'antd';
import constants from '../../constants';
import { getTime } from 'helpers/UtilsHelper';
import React, { useEffect, useState } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import EditSharedPostModal from './EditSharedPostModal';
import ApproveModal from 'pages/ApproveModal';
import postApi from 'api/postApi';
import AddPostModal from './AddPostModal';

const ListSharedPosts = () => {
  const [isShowEditModal, setShowEditModal] = useState(false)
  const [isShowAddModal, setShowAddModal] = useState(false)
  const [isShowApproveModal, setShowApproveModal] = useState(false)
  const [id, setId] = useState(false)

  const [loading, setLoading] = useState(false)
  const [approvingLoading, setApprovingLoading] = useState(false)
  const [posts, setPosts] = useState([])

  const handleApprove = async () => {
    setApprovingLoading(true)
    await postApi.updatePost(id, { status: constants.STATUS.APPROVED })
      .then(async () => {
        notification.success({ message: 'Duyệt thành công!' })
        setShowApproveModal(false)
        await getPosts()
      })
      .catch(() => {
        notification.error({ message: "Duyệt không thành công!" })
      })
    setApprovingLoading(false)
  }

  const handleDecline = async () => {
    setApprovingLoading(true)
    await postApi.updatePost(id, { status: constants.STATUS.REJECTED })
      .then(async () => {
        notification.success({ message: 'Xoá thành công!' })
        setShowApproveModal(false)
        await getPosts()
      })
      .catch(() => {
        notification.error({ message: "Xoá không thành công!" })
      })
    setApprovingLoading(false)
  }

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
        notification.success({ message: 'Đăng lại thành công!' })
        await getPosts()
      })
      .catch(() => {
        notification.error({ message: "Đăng lại không thành công!" })
      })
  }

  const getPosts = async () => {
    setLoading(true)
    await postApi.getPosts(true).then(res => setPosts(res))
    setLoading(false)
  }

  useEffect(() => {
    getPosts()
  }, [])

  const data = posts.map(_ => ({ ..._, key: _.id }))

  const columns = [
    {
      title: 'Thời Gian',
      dataIndex: 'createdAt',
      sorter: { compare: (a, b) => a.createdAt - b.createdAt },
      render: (val) => getTime(val, 'DD-MM HH:mm')
    },
    {
      title: 'Đăng Bởi',
      dataIndex: 'createdBy',
      render: (user) => user.fullname
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
      width: 250,
      fixed: 'right',
      render: (_, record) => {
        const { id, status } = record
        return (
          <div style={{ textAlign: 'center' }}>
            {status !== constants.STATUS.DELETED && (
              <div>
                {status === constants.STATUS.PENDING && (
                  <Button
                    className="btn-success m-1"
                    onClick={() => {
                      setId(id)
                      setShowApproveModal(true)
                    }}
                  >
                    Duyệt
                  </Button>
                )}
                <Button
                  className="m-1"
                  type="primary"
                  onClick={() => {
                    setId(id)
                    setShowEditModal(true)
                  }}
                >
                  Sửa
                </Button>
                <Popconfirm
                  className="m-1"
                  okText="Xoá"
                  cancelText="Huỷ"
                  title="Bài viết của bạn sẽ bị xoá vĩnh viễn sau 30 ngày. Bạn có chắc xoá bài viết này không?"
                  onConfirm={() => handleDelete(id)}
                  icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                >
                  <Button className="btn-danger">Xoá</Button>
                </Popconfirm>
              </div>
            )}
            {status === constants.STATUS.DELETED && (
              <Button
                className="btn-warning"
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
      {id && (
        <ApproveModal
          loading={approvingLoading}
          isVisible={isShowApproveModal}
          handleApprove={handleApprove}
          handleDecline={handleDecline}
          toggle={() => setShowApproveModal(false)}
        >
          {/* <Stuff data={data.find(_ => _.id === id)} /> */}
        </ApproveModal>
      )}
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <Table
            title={() => (
              <div className="d-flex justify-content__space-between">
                <h4>BÀI ĐĂNG</h4>
                <Button className="btn-success" onClick={() => setShowAddModal(true)} >Thêm</Button>
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