import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function Propertys() {
  const [propertys, setPropertys] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  useEffect(() => {
    getPropertys();
  }, []);

  const onDeleteClick = (property) => {
    if (!window.confirm("Are you sure you want to delete this property?")) {
      return;
    }
    axiosClient
      .delete(`/propertys/${property.id}`)
      .then(() => {
        setNotification("Property was successfully deleted");
        getPropertys();
      })
      .catch((error) => {
        console.error("Error deleting property:", error);
      });
  };

  const getPropertys = () => {
    setLoading(true);
    axiosClient
      .get("/propertys")
      .then(({ data }) => {
        setLoading(false);
        setPropertys(data.data);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching properties:", error);
      });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Būstai</h1>
        <Link className="btn-add" to="/propertys/new">
          Pridėti naują
        </Link>
      </div>
      <div className="card animated fadeInDown">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "space-around",
          }}
        >
          {loading ? (
            <p>Kraunama...</p>
          ) : propertys.length === 0 ? (
            <p>Būstų nerasta</p>
          ) : (
            propertys.map((property) => (
              <div
                key={property.id}
                style={{
                  width: "20%", // Adjusted width
                  padding: "5px",
                  border: "0px solid #ccc",
                  borderRadius: "10px",
                  //backgroundColor: "#0F1A20",
                }}
              >
                {property.image_url ? (
                  <img
                    src={`${property.image_url}`}
                    alt="Property Image"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "10%", // Make the image circular
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "200px",
                      backgroundColor: "#ccc", // Grey color
                      borderRadius: "10%", // Rounded corners
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "white", // Text color
                      textAlign: "center",
                    }}
                  >
                    Nėra nuotraukos
                  </div>
                )}
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "8px",
                    fontWeight: "bold",
                    fontSize: "calc(0.8em + 2px)",
                    color: "black",
                  }}
                >
                  {property.title}
                </div>
                <div style={{ textAlign: "center", marginTop: "5px" }}>
                  &nbsp;
                  <Link
                    className="btn-more"
                    to={`/propertys/${property.id}`}
                    style={{ marginLeft: "5px" }}
                  >
                    Daugiau
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
