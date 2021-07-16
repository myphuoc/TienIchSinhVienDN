import {
  Button,
  Modal,
  Spin
} from 'antd';
import React, { } from 'react';

const ApproveModal = ({ isVisible, loading, toggle, handleApprove, handleDecline, children }) => {

  const footer = [
    <Button className="btn-warning" onClick={handleDecline} type="primary">Không duyệt</Button>,
    <Button className="btn-success" onClick={handleApprove} type="primary">Duyệt</Button>,
  ]

  return (
    <Modal
      width={400}
      title="DUYỆT BÀI ĐĂNG"
      visible={isVisible}
      onCancel={toggle}
      footer={footer}
    >
      <Spin spinning={loading}>
        {children}
      </Spin>
    </Modal>
  )
}

export default ApproveModal;