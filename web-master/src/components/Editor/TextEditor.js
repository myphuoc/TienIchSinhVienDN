import React from 'react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';

const config = {
  toolbar: [
    'heading', '|',
    'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor', '|',
    'alignment', '|',
    'bold', 'italic', '|',
    'link', 'insertTable', '|',
    'outdent', 'indent', '|',
    'bulletedList', 'numberedList', '|',
    'code', 'codeBlock', '|',
    'uploadImage', 'blockQuote', '|',
    'undo', 'redo'
  ],
  image: {
    toolbar: [
      'imageStyle:full',
      'imageStyle:side',
      '|',
      'imageTextAlternative'
    ]
  },
};

const TextEditor = ({ value, onChange }) => {

  return (
    <>
      <CKEditor
        editor={Editor}
        config={config}
        data={value}
        onChange={(_, editor) => onChange && onChange(editor.getData())}
      />
    </>
  )
}

export default TextEditor;