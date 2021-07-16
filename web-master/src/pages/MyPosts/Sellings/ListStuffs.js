import { Button, Col, notification, Popconfirm, Row, Table, Tag } from 'antd';
import constants from '../../../constants';
import { getPrice, getTime } from 'helpers/UtilsHelper';
import React, { useEffect, useState } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import sellingApi from 'api/sellingApi';
import EditStuffModal from './EditStuffModal';
import SellStuffModal from 'pages/Sellings/SellStuffModal';

const ListStuffs = () => {
  const [isShowAddModal, setShowAddModal] = useState(false)
  const [isShowEditModal, setShowEditModal] = useState(false)
  const [id, setId] = useState(false)

  const [loading, setLoading] = useState(false)
  const [stuffs, setStuffs] = useState([])
  const { user: { uid } } = useSelector(state => state.auth)

  const handleHidePost = async (id) => {
    await sellingApi.hideStuff(id)
      .then(async () => {
        notification.success({ message: 'Ẩn bài thành công!' })
        await getStuffs()
      })
      .catch(() => {
        notification.error({ message: "Ẩn bài không thành công!" })
      })
  }

  const handleDelete = async (id) => {
    await sellingApi.deleteStuff(id)
      .then(async () => {
        notification.success({ message: 'Xoá thành công!' })
        await getStuffs()
      })
      .catch(() => {
        notification.error({ message: "Xoá không thành công!" })
      })
  }

  const handleRestore = async (id) => {
    await sellingApi.restoreStuff(id)
      .then(async () => {
        notification.success({ message: 'Đăng lại thành công! Vui lòng đợi quản trị viên phê duyệt!' })
        await getStuffs()
      })
      .catch(() => {
        notification.error({ message: "Đăng lại không thành công!" })
      })
  }

  const getStuffs = async () => {
    setLoading(true)
    await sellingApi.getStuffs(true, uid).then(res => setStuffs(res))
    setLoading(false)
  }

  useEffect(() => {
    uid && getStuffs()
  }, [uid])

  const data = stuffs.map(_ => ({ ..._, key: _.id }))

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
      title: 'Tên',
      dataIndex: 'name',
      textWrap: 'word-break'
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      textWrap: 'word-break'
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      sorter: { compare: (a, b) => a.price - b.price },
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
      <SellStuffModal
        isVisible={isShowAddModal}
        toggle={() => setShowAddModal(false)}
        callback={getStuffs}
      />
      <EditStuffModal
        isVisible={isShowEditModal}
        data={data.find(_ => _.id === id) || {}}
        toggle={() => setShowEditModal(false)}
        callback={getStuffs}
      />
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <Table
            title={() => (
              <div className="d-flex justify-content__space-between">
                <h4>MẶT HÀNG</h4>
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

export default ListStuffs;