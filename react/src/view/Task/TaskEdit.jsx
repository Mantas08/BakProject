import React, { useState, useEffect } from "react";
import axiosClient from "../../axios-client.js";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function TaskEdit() {
  const navigate = useNavigate();
  const { id } = useParams(); // Task ID

  const [users, setUsers] = useState([]);
  const [task, setTask] = useState({
    name: "",
    description: "",
    start_date: new Date(),
    end_date: new Date(),
    relevance: "",
    status: "",
    property_id_task: id,
    user_id_task: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    axiosClient
      .get(`/turi?property_id_turi=${id}`)
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setUsers(
            response.data.data.map((user) => ({
              value: user.user_id,
              label: user.user_name,
            }))
          );
        } else {
          console.error("Response data is not an array:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [id]);

  useEffect(() => {
    axiosClient
      .get(`/tasks/${id}`)
      .then(({ data }) => {
        const { name, description, start_date, end_date, relevance, status, user_id_task } = data;
        setTask({
          name,
          description,
          start_date: start_date ? new Date(start_date) : new Date(),
          end_date: end_date ? new Date(end_date) : new Date(),
          relevance,
          status,
          property_id_task: id,
          user_id_task
        });
      })
      .catch((error) => {
        console.error("Error fetching task:", error);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleUserChange = (selectedOption) => {
    setTask({ ...task, user_id_task: selectedOption.value });
  };

  const handleRelevanceChange = (selectedOption) => {
    setTask({ ...task, relevance: selectedOption.value });
  };

  const handleStatusChange = (selectedOption) => {
    setTask({ ...task, status: selectedOption.value });
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    setLoading(true);

    axiosClient
      .put(`/tasks/${id}`, task)
      .then(() => {
        setLoading(false);
        navigate(`/taskList/${id}`);
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
      <h1>Edit Task</h1>
      <div className="card animated fadeInDown">
        {loading && <div className="text-center">Loading...</div>}
        {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}
        <form onSubmit={onSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={task.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Description:</label>
            <input
              type="text"
              name="description"
              value={task.description}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Start Date:</label>
            <DatePicker
              selected={task.start_date}
              onChange={(date) => setTask({ ...task, start_date: date })}
            />
          </div>
          <div>
            <label>End Date:</label>
            <DatePicker
              selected={task.end_date}
              onChange={(date) => setTask({ ...task, end_date: date })}
            />
          </div>
          <div>
            <label>Relevance:</label>
            <Select
              value={task.relevance}
              onChange={handleRelevanceChange}
              options={[
                { value: "important", label: "Important" },
                { value: "less_important", label: "Less Important" },
                { value: "irrelevant", label: "Irrelevant" },
              ]}
            />
          </div>
          <div>
            <label>Status:</label>
            <Select
              value={task.status}
              onChange={handleStatusChange}
              options={[
                { value: "in progress", label: "In progress" },
                { value: "performed", label: "Performed" },
                { value: "stopped", label: "Stopped" },
                { value: "delayed", label: "Delayed" },
                { value: "canceled", label: "Canceled" },
              ]}
            />
          </div>
          <div>
            <label>User:</label>
            <Select
              options={users}
              value={users.find((user) => user.value === task.user_id_task)}
              onChange={handleUserChange}
              placeholder="Select User"
            />
          </div>
          <button type="submit" className="btn">
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
}
