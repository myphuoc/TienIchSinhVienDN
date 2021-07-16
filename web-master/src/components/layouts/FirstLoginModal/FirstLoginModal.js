import React, { useState } from "react";

import { Modal } from "antd";

const FirstLoginModal = (props) => {
  const [visible, setVisible] = useState(true);

  const goToChangeProfilePage = () => {
    props.history.push(`${props.rolePath}/my-profile`);
    setVisible(false);
  };

  const onCancel = () => {
    setVisible(false);
  };

  return (
    <Modal
      title="Your first login"
      visible={props.visible && visible}
      onOk={goToChangeProfilePage}
      onCancel={onCancel}
      okText="Go to my profile page"
    >
      <p>
        Please go to your profile page to change your password, this will ensure
        that your account is secure!
      </p>
    </Modal>
  );
};

export default FirstLoginModal;
