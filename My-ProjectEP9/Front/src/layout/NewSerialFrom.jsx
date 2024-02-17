import axios from "axios";
import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function SerialForm() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get("productId");

  const [input, setInput] = useState({
    sn: "",
    note: "",
    dueDate: new Date().toISOString().split("T")[0],
  });

  const formatDate = (date) => {
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}T00:00:00.0Z`;
  };

  const hdlChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formattedDueDate = formatDate(new Date(input.dueDate));
      const response = await axios.post(
        `http://localhost:8889/serial/?ProductId=${productId}`,
        { ...input, dueDate: formattedDueDate },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Serial number added successfully");
    } catch (error) {
      console.error("Error adding serial number: ", error);
      alert("Failed to add serial number");
    }
  };

  return (
    <form
      className="flex flex-col min-w-[600px] border rounded w-5/6 mx-auto p-4 gap-6"
      onSubmit={hdlSubmit}
    >
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Serial Number</span>
        </div>
        <input
          type="text"
          placeholder="Serial Number"
          className="input input-bordered w-full"
          name="sn"
          value={input.sn}
          onChange={hdlChange}
        />
      </label>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Note</span>
        </div>
        <textarea
          placeholder="Note"
          className="textarea textarea-bordered w-full"
          name="note"
          value={input.note}
          onChange={hdlChange}
        ></textarea>
      </label>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Due Date</span>
        </div>
        <input
          type="date"
          className="input input-bordered w-full"
          name="dueDate"
          value={input.dueDate}
          onChange={hdlChange}
        />
      </label>
      <button type="submit" className="btn btn-primary">
        Add new
      </button>
    </form>
  );
}
