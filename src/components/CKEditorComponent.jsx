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
                    toolbar: {
                        items: [
                            'undo', 'redo',          // Undo/Redo actions
                            '|',
                            'heading',               // Headings
                            '|',
                            'bold', 'italic', 'strikethrough', // Basic text styling
                            'link',                  // Insert links
                            'blockQuote',            // Block quote
                            '|',
                            'bulletedList', 'numberedList', // List options
                            '|',
                            'insertTable',           // Insert tables
                            'mediaEmbed',            // Embed media
                            '|',
                            'outdent', 'indent',     // Indentation options
                            '|',
                            'removeFormat',          // Remove formatting
                            '|',
                            'uploadImage',           // Image upload (basic image upload)
                        ],
                        shouldNotGroupWhenFull: true // Optional grouping behavior
                    },
                    image: {
                        toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side']
                    },
                    table: {
                        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
                    },
                }}
            />
        </div>
    );
};

export default CKEditorComponent;
