import { useState, useEffect } from "react";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../contexts/ContextProvider.jsx";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CreateReservation() {
  const navigate = useNavigate();
  const { id } = useParams(); // Property ID
  const { user } = useStateContext(); // Assuming you have user info in your context

  const [reservation, setReservation] = useState({
    startDate: new Date(),
    endDate: new Date(),
    propertyId: id,
    userId: user.id // Set the user ID from context
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [existingReservations, setExistingReservations] = useState([]);
  const { setNotification } = useStateContext();

  useEffect(() => {
    fetchExistingReservations();
  }, []);

  const fetchExistingReservations = () => {
    axiosClient
      .get(`/reservations?property_id=${id}`)
      .then(({ data }) => {
        setExistingReservations(data.data);
      })
      .catch((error) => {
        console.error("Error fetching existing reservations:", error);
      });
  };

  const isDateAvailable = (date) => {
    // Check if the date is available for reservation
    return !existingReservations.some((res) => {
      const resStartDate = new Date(res.start_date);
      const resEndDate = new Date(res.end_date);
      return date >= resStartDate && date <= resEndDate;
    });
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    setLoading(true);

    if (!isDateAvailable(reservation.startDate) || !isDateAvailable(reservation.endDate)) {
      setErrors({ date: ["Selected dates are not available."] });
      setLoading(false);
      return;
    }

    const payload = {
      start_date: reservation.startDate,
      end_date: reservation.endDate,
      property_id: reservation.propertyId,
      user_id: reservation.userId,
    };

    axiosClient
      .post('/reservations', payload)
      .then(() => {
        setNotification('Rezervacija sėkmingai sukurta');
        setLoading(false);
        navigate(`/reservation/${id}`); // Adjust the redirect as needed
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
        setLoading(false);
      });
  };

  return (
    <>
      <h1>Sukurti rezervaciją</h1>
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
          <div>
            <label>Pradžios data: </label>
            <DatePicker
              selected={reservation.startDate}
              onChange={(date) => setReservation((prevState) => ({ ...prevState, startDate: date }))}
              minDate={new Date()}
              filterDate={isDateAvailable} // Enable filtering of available dates
            />
          </div>
          <div>
            <label>Pabaigos data: </label>
            <DatePicker
              selected={reservation.endDate}
              onChange={(date) => setReservation((prevState) => ({ ...prevState, endDate: date }))}
              minDate={reservation.startDate}
              filterDate={isDateAvailable} // Enable filtering of available dates
            />
          </div>
          <button className="btn">Išsaugoti</button>
        </form>
      </div>
    </>
  );
}
