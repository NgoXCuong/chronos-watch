import { AlignLeft } from "lucide-react";
import ReactQuill from "react-quill-new";
import FormSection from "../../Common/FormSection";

// Toolbar chỉ sinh thẻ/tag an toàn: không có color/background vì Quill sẽ nhét inline
// style làm hỏng dark mode (xem utils/sanitizeQuillHtml khi render trang client).
const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

const QUILL_FORMATS = [
  "header",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "list",
  "bullet",
  "indent",
  "align",
  "link",
  "image",
];

// products.description (TEXT) — lưu HTML hiển thị ở trang chi tiết
const ProductDescription = ({ form, setField }) => (
  <FormSection
    title="Mô tả chi tiết"
    hint="Dùng Heading/Bold để chia khối — màu chữ do giao diện tự áp"
    icon={AlignLeft}
    bodyClassName="space-y-2 p-4"
  >
    <div className="quill-luxury">
      <ReactQuill
        theme="snow"
        value={form.description}
        onChange={(value) => setField("description", value)}
        modules={QUILL_MODULES}
        formats={QUILL_FORMATS}
        placeholder="Cảm hứng thiết kế, chất liệu, điểm nổi bật... Nội dung này xuất hiện ở khối 'Mô tả' của trang sản phẩm."
      />
    </div>
  </FormSection>
);

export default ProductDescription;
