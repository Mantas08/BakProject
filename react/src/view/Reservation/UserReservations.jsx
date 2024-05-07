
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider.jsx";
import axiosClient from "../../axios-client.js";

export default function UserReservations() {
  const [reservation, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const {user} = useStateContext();

  useEffect(() => {
    getReservations();
  }, []);

  const onDeleteClick = (reservation) => {
    if (!window.confirm("Are you sure you want to delete this Reservation?")) {
      return;
    }
    axiosClient
      .delete(`/reservations/${reservation.id}`)
      .then(() => {
        setNotification("Reservation was successfully deleted");
        getReservations();
      })
      .catch((error) => {
        console.error("Error deleting Reservation:", error);
      });
  };

  const getReservations = () => {
    setLoading(true);
    axiosClient
      .get(`/reservations?user_id=${user.id}`)
      .then(({ data }) => {
        setLoading(false);
        setReservations(data.data);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching reservations:", error);
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
        <h1>Reservations</h1>
        <Link className="btn-add" to="/reservations/new">
          Add new
        </Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Property ID</th>
              <th>Property Title</th>
              <th>User ID</th>
              <th>User Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          {loading ? (
            <tbody>
              <tr>
                <td colSpan="6" className="text-center">
                  Loading...
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {reservation.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.start_date}</td>
                  <td>{u.end_date}</td>
                  <td>{u.property_id}</td>
                  <td>{u.property_title}</td>
                  <td>{u.user_id}</td>
                  <td>{u.user_name}</td>
                  <td>
                    <Link
                      className="btn-edit"
                      to={`/reservations/${u.id}`} // Ensure correct path
                    >
                      Edit
                    </Link>
                    &nbsp;
                    <button
                      className="btn-delete"
                      onClick={(ev) => onDeleteClick(u)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}