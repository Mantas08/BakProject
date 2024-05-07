import { useState, useEffect } from "react";
import axiosClient from "../axios-client.js";
import { useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function PropertyUpdateForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [property, setProperty] = useState({
    id: null,
    type: '',
    title: '',
    area: '',
    addres: '',
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
      formData.append("_method", "put"); // Append '_method' parameter

      const response = await axiosClient.post(`/propertys/${id}`, formData, { // Change axios method to POST
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setNotification("Būstas buvo sėkmingai atnaujintas");
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
  
  useEffect(() => {
    setLoading(true);
    axiosClient.get(`/propertys/${id}`)
      .then(({data}) => {
        setLoading(false);
        setProperty(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  const handleImageChange = (ev) => {
    setProperty({ ...property, image: ev.target.files[0] });
  };

  return (
    <>
      <h1>Redaguoti būstą: {property.title}</h1>
      <div className="card animated fadeInDown">
        {loading && (
          <div className="text-center">
            Kraunama...
          </div>
        )}
        {errors && (
          <div className="alert">
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}
        {!loading && (
           <form onSubmit={onSubmit}>
           <input value={property.title} onChange={ev => setProperty({ ...property, title: ev.target.value })} placeholder="Pavadinimas" />
           <input value={property.area} onChange={ev => setProperty({ ...property, area: ev.target.value })} placeholder="Plotas" />
           <input value={property.type} onChange={ev => setProperty({ ...property, type: ev.target.value })} placeholder="Tipas" />
           <input value={property.addres} onChange={ev => setProperty({ ...property, addres: ev.target.value })} placeholder="Adresas " />
           <input type="file" name="image" onChange={handleImageChange} accept="image/*" />
           <button className="btn-task">Išsaugoti</button>
         </form>
        )}
      </div>
    </>
  );
}
