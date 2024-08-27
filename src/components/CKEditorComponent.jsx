import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CKEditorComponent = ({ data, setData }) => {
    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setData(data);
    };

    return (
        <div>
            <CKEditor
                editor={ClassicEditor}
                data={data}
                onChange={handleEditorChange}
                config={{
                    toolbar: ['bold', 'italic', 'link', 'bulletedList', 'numberedList', 'undo', 'redo'],
                }}
            />
        </div>
    );
};

export default CKEditorComponent;
