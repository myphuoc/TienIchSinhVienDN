import React from 'react';
import ImgCrop from 'antd-img-crop';
import { Upload } from 'antd';

const ImagePicker = ({ ratio, value, onChange, max = 4 }) => {

  const handleChange = ({ fileList: files }) => {
    onChange(files)
  }

  const handlePreview = async file => {
    let src = file.url
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj)
        reader.onload = () => resolve(reader.result)
      });
    }
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow.document.write(image.outerHTML)
  }

  return (
    <ImgCrop
      rotate
      aspect={ratio || 16 / 9}
    >
      <Upload
        action="https://run.mocky.io/v3/442644a1-eda0-4780-9ee2-02c54691fb3f"
        listType="picture-card"
        fileList={value}
        onChange={handleChange}
        onPreview={handlePreview}
      >
        {!value ? '+ Thêm ảnh' : (value.length < max && '+ Thêm ảnh')}
      </Upload>
    </ImgCrop>
  )
}

export default ImagePicker;