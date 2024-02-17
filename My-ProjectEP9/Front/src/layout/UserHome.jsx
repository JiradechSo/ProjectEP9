import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import WareHouseEdit from "../components/WareHouseEdit";
import WareHouseCard from "../components/WareHouseCard";

export default function UserHome() {
  const [house, setHouse] = useState([]);
  const [editIdx, setEditIdx] = useState(-1)
  const [trigger, setTrigger] = useState(false)

  useEffect(() => {
    const run = async () => {
      let token = localStorage.getItem("token");
      const rs = await axios.get("http://localhost:8889/ware", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHouse(rs.data.ware);
    };
    run();
  }, [trigger]);

  const openModal = (id) => {
    let idx = house.findIndex( el=> el.id === id)
    setEditIdx(idx)
    document.getElementById("my_modal_2").showModal()
  }

  const closeModal = () => {
    document.getElementById("my_modal_2").close()
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="text-center text-3xl mt-4 text-blue-700 font-bold">WareHouse</div>
      <div className="flex justify-end mr-5 mb-2">
        <Link to="/new">
          <button className="btn bg-blue-700 text-white btn-info pl-16 pr-16 mt-2">New Room</button>
        </Link>
      </div>
      <WareHouseEdit el={house[editIdx]} closeModal={closeModal} setTrigger={setTrigger}/>
      <div className="grid grid-cols-3 gap-3">
        {house.map((el) => (
          <WareHouseCard key={el.id} el={el} openModal={openModal} setTrigger={setTrigger}/>
        ))}
      </div>
    </div>
  );
}
