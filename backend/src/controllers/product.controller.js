import productService from "../services/product.service.js";

const productController = {
    getAll: async (req, res) => {
        try {
            const result = await productService.getAll(req.query);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getDetail: async (req, res) => {
        try {
            const product = await productService.getDetail(req.params.id_or_slug);
            res.json(product);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    },

    create: async (req, res) => {
        try {
            const data = { ...req.body };
            
            // Xử lý ảnh chính
            if (req.files && req.files.image) {
                data.image_url = req.files.image[0].path;
            }
            
            // Xử lý bộ sưu tập ảnh
            if (req.files && req.files.gallery) {
                data.image_gallery = req.files.gallery.map(file => file.path);
            }

            // Parse category_ids và specifications nếu được gửi qua form-data (string)
            if (typeof data.category_ids === 'string') {
                data.category_ids = JSON.parse(data.category_ids);
            }
            if (typeof data.specifications === 'string') {
                data.specifications = JSON.parse(data.specifications);
            }

            const product = await productService.create(data);
            res.status(201).json({
                message: "Tạo sản phẩm thành công!",
                product
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const data = { ...req.body };
            
            if (req.files && req.files.image) {
                data.image_url = req.files.image[0].path;
            }
            if (req.files && req.files.gallery) {
                data.image_gallery = req.files.gallery.map(file => file.path);
            }

            if (typeof data.category_ids === 'string') {
                data.category_ids = JSON.parse(data.category_ids);
            }
            if (typeof data.specifications === 'string') {
                data.specifications = JSON.parse(data.specifications);
            }

            const product = await productService.update(req.params.id, data);
            res.json({
                message: "Cập nhật sản phẩm thành công!",
                product
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            await productService.delete(req.params.id);
            res.json({ message: "Xóa sản phẩm thành công!" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

export default productController;
