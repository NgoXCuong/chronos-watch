import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import { SectionTitle, EditorCard } from '../EditorUI';

const ProductDescription = ({ form, setForm, quillModules, quillFormats }) => {
    return (
        <EditorCard className="space-y-5">
            <SectionTitle icon={ImageIcon}>Mô tả chi tiết sản phẩm</SectionTitle>
            <div className="text-xs text-slate-400 -mt-2 mb-1">
                💡 Dùng <strong>Heading 1/2/3</strong> cho tiêu đề, <strong>B</strong> để in đậm, <strong>căn chỉnh</strong> cho text. 
                Không dùng màu chữ — màu được tự động áp dụng theo giao diện website.
            </div>
            <div className="quill-luxury">
                <ReactQuill
                    theme="snow"
                    value={form.description}
                    onChange={(val) => setForm(f => ({ ...f, description: val }))}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Viết mô tả sản phẩm ở đây... Dùng Heading để tạo tiêu đề, Bold để làm nổi bật, và chèn hình ảnh xen kẽ nội dung."
                />
            </div>
        </EditorCard>
    );
};

export default ProductDescription;
