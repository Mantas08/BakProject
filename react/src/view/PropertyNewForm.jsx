import { useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import { useNavigate } from "react-router-dom";

export default function PropertyNewForm() {
  const navigate = useNavigate();
  const [property, setProperty] = useState({
    id: null,
    type: "",
    title: "",
    area: "",
    addres: "",
    image: null
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", property.title);
      formData.append("area", property.area);
      formData.append("type", property.type);
      formData.append("addres", property.addres);
      formData.append("image", property.image); // Append the image file

      const response = await axiosClient.post("/propertys", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setNotification("Būstas sėkmingai sukurtas");
      setLoading(false);
      navigate("/propertys");
    } catch (err) {
      const response = err.response;
      if (response && response.status === 422) {
        setErrors(response.data.errors);
      }
      setLoading(false);
    }
  };

  const handleImageChange = (ev) => {
    setProperty({ ...property, image: ev.target.files[0] });
  };

  return (
    <>
      <h1>Naujas būstas</h1>
      <div className="card animated fadeInDown">
        {loading && <div className="text-center">Kraunama...</div>}
        {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}
        <form onSubmit={onSubmit}>
          <input
            type="text"
            onChange={(ev) => setProperty({ ...property, title: ev.target.value })}
            placeholder="Pavadinimas"
          />
          <input
            type="number"
            onChange={(ev) => setProperty({ ...property, area: ev.target.value })}
            placeholder="Plotas"
          />
          <input
            type="text"
            onChange={(ev) => setProperty({ ...property, type: ev.target.value })}
            placeholder="Tipas"
          />
          <input
            type="text"
            onChange={(ev) => setProperty({ ...property, addres: ev.target.value })}
            placeholder="Adresas"
          />
          <input type="file" name="image" onChange={handleImageChange} accept="image/*" />
          <button className="btn-finance">Išsaugoti</button>
        </form>
      </div>
    </>
  );
}