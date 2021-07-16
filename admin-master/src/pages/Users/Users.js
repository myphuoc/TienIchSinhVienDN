import { Button, Col, notification, Popconfirm, Row, Table, Tag } from 'antd';
import constants from '../../constants';
import React, { useEffect, useState } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import EditUserModal from './EditUserModal';
import AddUserModal from './AddUserModal';
import userApi from 'api/userApi';

const ListUsers = () => {
  const [isShowAddModal, setShowAddModal] = useState(false)
  const [isShowEditModal, setShowEditModal] = useState(false)
  const [id, setId] = useState()

  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])

  const handleDelete = async (id) => {
    const user = users.find(_ => _.id === id)
    if (!user.isSuperAdmin) {
      await userApi.banUser(id)
        .then(async () => {
          notification.success({ message: 'Khoá thành công!' })
          await getUsers()
        })
        .catch(() => {
          notification.error({ message: "Khoá không thành công!" })
        })
    } else {
      notification.warn({ message: "Bạn không thể xoá tài khoản quản trị hệ thống!" })
    }
  }

  const handleRestore = async (id) => {
    await userApi.restoreUser(id)
      .then(async () => {
        notification.success({ message: 'Mở khoá thành công!' })
        await getUsers()
      })
      .catch(() => {
        notification.error({ message: "Mở khoá không thành công!" })
      })
  }

  const getUsers = async () => {
    setLoading(true)
    await userApi.getUsers().then(res => setUsers(res))
    setLoading(false)
  }

  useEffect(() => {
    getUsers()
  }, [])

  const data = users.map(_ => ({ ..._, key: _.id }))

  const columns = [
    {
      title: 'Họ Tên',
      dataIndex: 'fullname',
      textWrap: 'word-break'
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'SĐT',
      dataIndex: 'phoneNumber',
    },
    {
      title: 'Phân Quyền',
      dataIndex: '',
      render: (_, record) => {
        const { isAdmin, isSuperAdmin } = record
        return (
          <>
            <Tag color={isAdmin ? "green" : "blue"}>{isAdmin ? "Quản trị viên" : "Người Dùng"}</Tag>
            {isSuperAdmin && <Tag color="geekblue">Quản trị hệ thống</Tag>}
          </>
        )
      }
    },
    {
      title: 'Tình Trạng',
      dataIndex: 'isActive',
      render: (isActive) => <Tag color={isActive ? "green" : "red"}>{isActive ? "Hoạt động" : "Đã bị khoá"}</Tag>
    },
    {
      width: 160,
      fixed: 'right',
      render: (_, record) => {
        const { id, isActive } = record
        return (
          <div style={{ textAlign: 'center' }}>
            {isActive && (
              <div>
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
                  title="Bạn có chắc muốn khoá tài khoản này không?"
                  onConfirm={() => handleDelete(id)}
                  icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                >
                  <Button className="btn-danger">Khoá</Button>
                </Popconfirm>
              </div>
            )}
            {!isActive && (
              <Button
                className="btn-warning"
                onClick={() => handleRestore(id)}
              >
                Mở khoá
              </Button>
            )}
          </div>
        )
      },
    },
  ];

  return (
    <div>
      <AddUserModal
        isVisible={isShowAddModal}
        toggle={() => setShowAddModal(false)}
        callback={getUsers}
      />
      <EditUserModal
        isVisible={isShowEditModal}
        data={data.find(_ => _.id === id) || {}}
        toggle={() => setShowEditModal(false)}
        callback={getUsers}
      />
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <Table
            title={() => (
              <div className="d-flex justify-content__space-between">
                <h4>NGƯỜI DÙNG</h4>
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

export default ListUsers;