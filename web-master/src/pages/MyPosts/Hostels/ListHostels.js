import { Button, Col, notification, Popconfirm, Row, Table, Tag } from 'antd';
import hostelApi from 'api/hostelApi';
import constants from '../../../constants';
import { getPrice, getTime } from 'helpers/UtilsHelper';
import React, { useEffect, useState } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import EditHostelModal from './EditHostelModal';
import AddHostelModal from 'pages/Hostels/AddHostelModal';

const ListHostels = () => {
  const [isShowAddModal, setShowAddModal] = useState(false)
  const [isShowEditModal, setShowEditModal] = useState(false)
  const [id, setId] = useState()

  const [loading, setLoading] = useState(false)
  const [hostels, setHostels] = useState([])
  const { user: { uid } } = useSelector(state => state.auth)

  const handleHidePost = async (id) => {
    await hostelApi.hideHostel(id)
      .then(async () => {
        notification.success({ message: 'Ẩn bài thành công!' })
        await getHostels()
      })
      .catch(() => {
        notification.error({ message: "Ẩn bài không thành công!" })
      })
  }

  const handleDelete = async (id) => {
    await hostelApi.deleteHostel(id)
      .then(async () => {
        notification.success({ message: 'Xoá thành công!' })
        await getHostels()
      })
      .catch(() => {
        notification.error({ message: "Xoá không thành công!" })
      })
  }

  const handleRestore = async (id) => {
    await hostelApi.restoreHostel(id)
      .then(async () => {
        notification.success({ message: 'Đăng lại thành công! Vui lòng đợi quản trị viên phê duyệt!' })
        await getHostels()
      })
      .catch(() => {
        notification.error({ message: "Đăng lại không thành công!" })
      })
  }

  const getHostels = async () => {
    setLoading(true)
    await hostelApi.getHostels(true, uid).then(res => setHostels(res))
    setLoading(false)
  }

  useEffect(() => {
    uid && getHostels()
  }, [uid])

  const data = hostels.map(_ => ({ ..._, key: _.id }))

  const columns = [
    {
      title: 'Thời Gian',
      dataIndex: 'createdAt',
      sorter: { compare: (a, b) => a.createdAt - b.createdAt },
      render: (val) => getTime(val, 'DD-MM-YYYY HH:mm')
    },
    {
      title: 'Địa Chỉ',
      dataIndex: 'address',
      textWrap: 'word-break'
    },
    {
      title: 'Giá Phòng',
      dataIndex: 'roomPrice',
      sorter: { compare: (a, b) => a.roomPrice - b.roomPrice },
      render: (val) => getPrice(val)
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
      width: 230,
      fixed: 'right',
      render: (_, record) => {
        const { id, status } = record
        return (
          <div style={{ textAlign: 'center' }}>
            {status !== constants.STATUS.DELETED && (
              <div>
                {status === constants.STATUS.APPROVED && (
                  <>
                    <Popconfirm
                      okText="Đồng ý"
                      cancelText="Huỷ"
                      title="Ẩn bài viết này?"
                      onConfirm={() => handleHidePost(id)}
                      icon={<QuestionCircleOutlined style={{ color: 'orange' }} />}
                    >
                      <Button className="btn-warning">Ẩn bài</Button>
                    </Popconfirm>{' '}
                  </>
                )}
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
      <AddHostelModal
        isVisible={isShowAddModal}
        toggle={() => setShowAddModal(false)}
        callback={getHostels}
      />
      <EditHostelModal
        isVisible={isShowEditModal}
        data={data.find(_ => _.id === id) || {}}
        toggle={() => setShowEditModal(false)}
        callback={getHostels}
      />
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <Table
            title={() => (
              <div className="d-flex justify-content__space-between">
                <h4>PHÒNG TRỌ</h4>
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

export default ListHostels;