import { Select } from 'antd';
import React from 'react';
import moment from 'moment';
import _ from 'lodash';

const { Option } = Select;

const MyTimePicker = ({ label, value, onChange }) => {
  const hour = value ? value.hour() : 0
  const minute = value ? value.minute() : 0

  const hours = _.range(0, 24)
  const minutes = _.range(0, 60)

  const handleSelect = (name, val) => {
    let time = moment(`${hour < 10 ? '0' : ''}${hour}:${minute < 10 ? '0' : ''}${minute}`, "HH:mm")
    if (name === "hour") {
      time = moment(`${val < 10 ? '0' : ''}${val}:${minute < 10 ? '0' : ''}${minute}`, "HH:mm")
    } else {
      time = moment(`${hour < 10 ? '0' : ''}${hour}:${val < 10 ? '0' : ''}${val}`, "HH:mm")
    }
    onChange && onChange(time)
  }

  return (
    <>
      <h4>{label || ""}</h4>
      <Select value={hour} style={{ width: 85 }} onChange={(val) => handleSelect("hour", val)}>
        <Option disabled>Hour</Option>
        {hours.map((h, i) => (<Option key={i} value={h}>{`${h < 10 ? '0' : ''}${h}`}</Option>))}
      </Select>{' : '}
      <Select value={minute} style={{ width: 85 }} onChange={(val) => handleSelect("minute", val)}>
        <Option disabled>Minute</Option>
        {minutes.map((m, i) => (<Option key={i} value={m}>{`${m < 10 ? '0' : ''}${m}`}</Option>))}
      </Select>
    </>
  )
}

export default MyTimePicker;