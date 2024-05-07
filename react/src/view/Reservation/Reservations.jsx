import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider.jsx";
import moment from "moment";
import 'moment/locale/lt';
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axiosClient from "../../axios-client.js";
import './calender.css'; // Import custom styles

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification, user } = useStateContext();
  const { id } = useParams();
  const localizer = momentLocalizer(moment);
  moment.locale('lt');

  useEffect(() => {
    getReservations();
  }, []);

  const onDeleteClick = (reservationId) => {
    if (!window.confirm("Are you sure you want to delete this Reservation?")) {
      return;
    }
    axiosClient
      .delete(`/reservations/${reservationId}`)
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
      .get(`/reservations?property_id=${id}`)
      .then(({ data }) => {
        setLoading(false);
        setReservations(data.data);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching reservations:", error);
      });
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    let style = {
      backgroundColor: event.user_id === user.id ? '#826251' : '#3174ad', // Color based on ownership
      color: '#fff',
      borderRadius: '5px',
      border: 'none',
      boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)',
      padding: '5px 10px',
      cursor: 'pointer'
    };
    return {
      style: style
    };
  };

  const handleEventClick = (event) => {
    if (event.user_id === user.id) {
      onDeleteClick(event.id);
    }
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
        <h1>Rezervacijos</h1>
        <Link className="btn-add" to={`/reservation/new/${id}`}>
          Pridėti naują
        </Link>
      </div>
      <div className="card animated fadeInDown">
        <Calendar
          localizer={localizer}
          events={reservations.map((r) => ({
            id: r.id,
            start: new Date(r.start_date),
            end: new Date(r.end_date),
            title: `${r.user_name}`,
            user_id: r.user_id
          }))}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, margin: "50px" }}
          className="custom-calendar" // Add custom class name
          culture="lt"
          eventPropGetter={eventStyleGetter} // Customize event style
          selectable={true}
          onSelectEvent={handleEventClick} // Handle event click
        />
        <p>Jei norite ištrinti rezervaciją, kalendoriuje spustelėkite savo rezervaciją...</p>
      </div>
    </div>
  );
}
