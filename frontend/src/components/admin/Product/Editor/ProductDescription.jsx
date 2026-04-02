import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import { SectionTitle, EditorCard } from '../EditorUI';

const ProductDescription = ({ form, setForm, quillModules }) => {
    return (
        <EditorCard className="space-y-5">
            <SectionTitle icon={ImageIcon}>Mô tả chi tiết sản phẩm</SectionTitle>
            <div className="quill-luxury">
                <ReactQuill
                    theme="snow"
                    value={form.description}
                    onChange={(val) => setForm(f => ({ ...f, description: val }))}
                    modules={quillModules}
                    placeholder="Viết mô tả sản phẩm ở đây... Bạn có thể chèn hình ảnh minh hoạ vào giữa các dòng."
                />
            </div>
        </EditorCard>
    );
};

export default ProductDescription;
