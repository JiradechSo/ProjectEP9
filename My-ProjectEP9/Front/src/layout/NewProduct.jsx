import axios from "axios";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function ProductForm() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const warehouseId = queryParams.get("warehouseId");

  const [input, setInput] = useState({
    name: "",
    imageUrl: "",
  });

  const handleImageChange = async (e) => {
    const token = localStorage.getItem("token");
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("imageUrl", file);
  
    try {
      const response = await axios.post(
        "http://localhost:8889/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // ตรวจสอบ URL ที่ส่งกลับมาจากเซิร์ฟเวอร์
      console.log("Uploaded image URL:", response.data.imageUrl);
  
      const imageUrl = `http://localhost:8889/${response.data.imageUrl}`;
      setInput((prev) => ({ ...prev, imageUrl: imageUrl }));
    } catch (error) {
      console.error("Error uploading imageUrl: ", error);
    }
  };

  const hdlChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:8889/product/?WarehouseId=${warehouseId}`,
        input,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Product created successfully");
      // อื่นๆที่คุณต้องการทำหลังจากสร้างสินค้า
    } catch (error) {
      console.error("Error creating product: ", error);
      alert("Failed to create product");
    }
  };

  return (
    <form
      className="flex flex-col min-w-[600px] border rounded w-5/6 mx-auto p-4 gap-6"
      onSubmit={hdlSubmit}
    >
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Product</span>
        </div>
        <input
          type="text"
          placeholder="name"
          className="input input-bordered w-full"
          name="name"
          value={input.name}
          onChange={hdlChange}
        />
      </label>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Product Image</span>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </label>
      {input.imageUrl && (
        <img src={input.imageUrl} alt="Product" className="w-full h-auto mb-4 rounded-lg" />
      )}
      <button type="submit" className="btn btn-primary">
        Add new
      </button>
    </form>
  );
}
