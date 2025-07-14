// src/Components/ProductsPage/AddProductModal.jsx
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import s from "./AddProductModal.module.scss";

const AddProductModal = ({ onClose, onProductAdded }) => {
  const { t } = useTranslation();
  const token = useSelector((state) => state.user?.loginInfo?.token);
  const user = useSelector((state) => state.user?.loginInfo);
  const isSignedIn = useSelector((state) => state.user?.loginInfo?.isSignIn);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    condition: "",
    locations: "",
    categoryId: ""
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      setError("Chỉ chấp nhận file ảnh (JPEG, PNG, GIF)");
      return;
    }

    // Validate file size (max 5MB per file)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      setError("Kích thước file không được vượt quá 5MB");
      return;
    }

    setSelectedFiles(files);
    setError("");

    // Create preview URLs
    const previews = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    // Revoke URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index].url);

    setSelectedFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const uploadImages = async (productId) => {
    if (selectedFiles.length === 0) return;

    setUploadProgress("Đang upload ảnh...");

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch(`https://localhost:7235/api/ProductImage/upload-to-cloud/${productId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Không set Content-Type khi upload file, để browser tự set
        },
        body: formData
      });

      //   console.log('Upload response status:', response.status);
      //   console.log('Upload response ok:', response.ok);

      if (!response.ok) {
        // Lấy chi tiết lỗi từ server
        let errorMessage = 'Không thể upload ảnh';
        try {
          const errorData = await response.text();
          console.log('Upload error response:', errorData);
          errorMessage = errorData || errorMessage;
        } catch (e) {
          console.log('Could not read upload error response:', e);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      return result;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log("=== SUBMIT STARTED ===");
    // console.log("Token:", token);
    // console.log("isSignedIn:", isSignedIn);
    // console.log("FormData:", formData);

    setIsSubmitting(true);
    setError("");
    setUploadProgress("");

    if (!token || !isSignedIn) {
      console.log("No token or not signed in");
      setError("Bạn cần đăng nhập để thêm sản phẩm");
      setIsSubmitting(false);
      return;
    }

    try {
      // Step 1: Create product
      //   console.log("Step 1: Creating product...");
      setUploadProgress("Đang tạo sản phẩm...");

      const payload = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        categoryId: parseInt(formData.categoryId) || 0
      };

      //   console.log("Payload to send:", payload);

      const productResponse = await fetch("https://localhost:7235/api/Product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      });

      //   console.log("Response status:", productResponse.status);
      //   console.log("Response ok:", productResponse.ok);

      if (!productResponse.ok) {
        let errorMessage = "Không thể tạo sản phẩm";

        if (productResponse.status === 401) {
          errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
        } else if (productResponse.status === 403) {
          errorMessage = "Bạn không có quyền thêm sản phẩm";
        } else {
          try {
            const errorData = await productResponse.text();
            console.log("Error response data:", errorData);
            errorMessage = errorData || errorMessage;
          } catch (textError) {
            console.log("Could not read error response:", textError);
          }
        }

        throw new Error(errorMessage);
      }


      // Trong AddProductModal.jsx - Sửa phần success
      const createdProduct = await productResponse.json();
      // console.log("=== CREATED PRODUCT RESPONSE ===");
      // console.log("Raw API response:", createdProduct);
      // console.log("Product ID:", createdProduct.id);
      // console.log("Product Title:", createdProduct.title);
      // console.log("Product Price:", createdProduct.price);
      // console.log("Product CategoryId:", createdProduct.categoryId);
      // console.log("Product Description:", createdProduct.description);
      // console.log("Product Condition:", createdProduct.condition);
      // console.log("Product Locations:", createdProduct.locations);

      // Step 2: Upload images if any
      if (selectedFiles.length > 0) {
        console.log("Step 2: Uploading images...");
        try {
          await uploadImages(createdProduct.id);
          setUploadProgress("Upload ảnh thành công!");
        } catch (uploadError) {
          console.warn("Image upload failed, but product was created:", uploadError);
          setUploadProgress("Sản phẩm đã được tạo, nhưng upload ảnh thất bại.");
        }
      }

      // Success
      // console.log("=== SUCCESS - CALLING onProductAdded ===");
      setUploadProgress("Thêm sản phẩm thành công!");

      // Gọi callback ngay lập tức
      onProductAdded();

    } catch (err) {
      console.error("=== ERROR ===");
      console.error("Error details:", err);
      console.error("Error message:", err.message);
      console.error("Error stack:", err.stack);

      setError(err.message || "Đã xảy ra lỗi khi thêm sản phẩm");
      setUploadProgress(""); // Clear progress message
    } finally {
      //   console.log("=== FINALLY BLOCK ===");
      //   console.log("Setting isSubmitting to false");
      setIsSubmitting(false);
    }
  };

  // Cleanup preview URLs on unmount - FIX: sử dụng useEffect thay vì useState
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => {
        URL.revokeObjectURL(preview.url);
      });
    };
  }, [imagePreviews]);

  // Show login required message
  if (!token) {
    return (
      <div className={s.modalOverlay} onClick={onClose}>
        <div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
          <div className={s.modalHeader}>
            <h2>{t("auth.loginRequired", "Yêu cầu đăng nhập")}</h2>
            <button className={s.closeButton} onClick={onClose}>
              ×
            </button>
          </div>
          <div className={s.loginRequired}>
            <p>Bạn cần đăng nhập để thêm sản phẩm mới.</p>
            <div className={s.formActions}>
              <button className={s.cancelButton} onClick={onClose}>
                {t("common.close", "Đóng")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={s.modalOverlay} onClick={onClose}>
      <div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={s.modalHeader}>
          <h2>{t("products.addProduct", "Thêm sản phẩm mới")}</h2>
          <button className={s.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <form className={s.form} onSubmit={handleSubmit}>
          <div className={s.formGroup}>
            <label htmlFor="title">
              {t("products.title", "Tiêu đề")} <span className={s.required}>*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder={t("products.titlePlaceholder", "Nhập tiêu đề sản phẩm")}
            />
          </div>

          <div className={s.formGroup}>
            <label htmlFor="description">
              {t("products.description", "Mô tả")}
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              placeholder={t("products.descriptionPlaceholder", "Nhập mô tả sản phẩm")}
            />
          </div>

          <div className={s.formRow}>
            <div className={s.formGroup}>
              <label htmlFor="price">
                {t("products.price", "Giá")} <span className={s.required}>*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div className={s.formGroup}>
              <label htmlFor="categoryId">
                {t("products.category", "Danh mục")}
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
              >
                <option value="">Chọn danh mục</option>
                <option value="1">Laptop</option>
                <option value="2">Smartwatch</option>
                <option value="3">Phone</option>
              </select>
            </div>
          </div>

          <div className={s.formGroup}>
            <label htmlFor="condition">
              {t("products.condition", "Tình trạng")}
            </label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
            >
              <option value="">{t("products.selectCondition", "Chọn tình trạng")}</option>
              <option value="new">Mới</option>
              <option value="used">Đã sử dụng</option>
              <option value="refurbished">Tân trang</option>
            </select>
          </div>

          <div className={s.formGroup}>
            <label htmlFor="locations">
              {t("products.locations", "Vị trí")}
            </label>
            <input
              type="text"
              id="locations"
              name="locations"
              value={formData.locations}
              onChange={handleInputChange}
              placeholder={t("products.locationsPlaceholder", "Nhập vị trí")}
            />
          </div>

          {/* Image Upload Section */}
          <div className={s.formGroup}>
            <label htmlFor="images">
              {t("products.images", "Ảnh sản phẩm")}
            </label>
            <div className={s.imageUpload}>
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className={s.fileInput}
              />
              <label htmlFor="images" className={s.fileLabel}>
                <span className={s.uploadIcon}>📷</span>
                <span>Chọn ảnh (có thể chọn nhiều file)</span>
                <span className={s.fileHint}>JPEG, PNG, GIF - Tối đa 5MB mỗi file</span>
              </label>
            </div>
          </div>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className={s.imagePreviewContainer}>
              <h4>Ảnh đã chọn ({imagePreviews.length}):</h4>
              <div className={s.imagePreviewGrid}>
                {imagePreviews.map((preview, index) => (
                  <div key={index} className={s.imagePreview}>
                    <img src={preview.url} alt={preview.name} />
                    <button
                      type="button"
                      className={s.removeImage}
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                    <span className={s.imageName}>{preview.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Message */}
          {uploadProgress && (
            <div className={s.uploadProgress}>
              {uploadProgress}
            </div>
          )}

          {error && (
            <div className={s.error}>
              {error}
            </div>
          )}

          <div className={s.formActions}>
            <button
              type="button"
              className={s.cancelButton}
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t("common.cancel", "Hủy")}
            </button>
            <button
              type="submit"
              className={s.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? t("common.adding", "Đang thêm...")
                : t("products.addProduct", "Thêm sản phẩm")
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;