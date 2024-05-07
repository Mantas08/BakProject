import React, { useState, useEffect } from "react";
import { Link, Navigate, Outlet } from "react-router-dom";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import "./notification.css";

export default function DefaultLayout() {
  const { user, token, setUser, setToken, notification } = useStateContext();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const onLogout = (ev) => {
    ev.preventDefault();
    axiosClient.post("/logout").then(() => {
      setUser({});
      setToken(null);
    });
  };

  useEffect(() => {
    if (token) {
      // Fetch user information
      axiosClient.get("/user")
        .then(({ data }) => {
          setUser(data);
          fetchNotifications(data.id); // Fetch notifications based on user ID
        })
        .catch(error => console.error('Error fetching user information:', error));
    }
  }, [token]); // Fetch user info whenever token changes

  const fetchNotifications = async (userId) => {
    try {
      const response = await axiosClient.get(`/notifications?user_id=${userId}`);
      if (Array.isArray(response.data.data)) {
        setNotifications(response.data.data);
        setUnreadCount(response.data.data.length); // Assuming all notifications are returned and count is handled externally
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
  
  const markNotificationAsRead = async (notificationId) => {
    try {
      await axiosClient.put(`/notifications/${notificationId}`);
      // Update the unread count
      setUnreadCount(prevCount => prevCount - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  const markAllNotificationsAsRead = async () => {
    try {
      const notificationIds = notifications.map(notification => notification.id);
      await axiosClient.put(`/notifications/mark-all-as-read`, { notificationIds });
      // Update the unread count to zero
      setUnreadCount(0);
      // Clear the notifications array
      setNotifications([]);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div id="defaultLayout">
      <aside>
        <img
          src="http://localhost:8000/storage/images/Logo2.png"
          alt="Logo"
          style={{ width: "200px", height: "200px", marginTop: "-70px", marginBottom: "-40px" }}
        />
        <Link to="/propertys">Būstai</Link>
        <Link to="/userReservations">Mano rezervacijos</Link>
      </aside>
      <div className="content">
        <header>
          <div className="notification-icon">
            <button type="button" className="icon-button" onClick={() => setShowNotifications(!showNotifications)}>
              <img
                src="http://localhost:8000/storage/images/bell_black.png"
                alt="Notification Icon"
                style={{ width: "20px", height: "20px" }} // Adjust width and height as needed
              />
              {unreadCount > 0 && <span className="icon-button__badge">{unreadCount}</span>}
            </button>
          </div>
          <div>
          <Link to={`/users/${user.id}`} style={{ textDecoration: 'none', color: 'black' }} className="btn-logout">{user.name}</Link> &nbsp; &nbsp;
            <a onClick={onLogout} className="btn-logout" href="#">
              Atsijungti
            </a>
          </div>
        </header>
        <main>
          {showNotifications && (
            <div className="notification-block">
              <button className="close-button" onClick={() => setShowNotifications(false)}>X</button>
              {notifications.map(notification => (
                <div className="notification-item" key={notification.id}>
                  {notification.message}
                </div>
              ))}
              <button style={{backgroundColor: "#0F1A20"}} className="btn-task" onClick={markAllNotificationsAsRead}>Pažymėti kaip perskaityta</button>
            </div>
          )}
          <Outlet />
        </main>
        {notification && (
          <div className="notification">{notification}</div>
        )}
      </div>
    </div>
  );
}
