import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider.jsx";
import axiosClient from "../../axios-client.js";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from 'react-modal';
import "./taskprofile.css"; // Import your CSS file for styling

Modal.setAppElement('#root'); // Set the root element for React Modal

export default function TaskProfile() {
  const { id } = useParams();
  const { setNotification } = useStateContext();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    getTask();
  }, []);

  const getTask = () => {
    setLoading(true);
    axiosClient
      .get(`/tasks/${id}`)
      .then(({ data }) => {
        setLoading(false);
        // Format dates before setting task
        const formattedTask = {
          ...data.data,
          start_date: data.data.start_date ? new Date(data.data.start_date) : null,
          end_date: data.data.end_date ? new Date(data.data.end_date) : null
        };
        setTask(formattedTask);
        fetchUsers(formattedTask);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching task:", error);
      });
  };

  const fetchUsers = (task) => {
    console.log("task:", task);
    axiosClient
      .get(`/turi?property_id_turi=${task.property_id_task}`)
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
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleUserChange = (selectedOption) => {
    setTask((prevTask) => ({
      ...prevTask,
      user_name: selectedOption.label,
      user_id: selectedOption.value,
    }));
  };

  const handleDateChange = (date, field) => {
    console.log("date");
    setTask((prevTask) => ({
      ...prevTask,
      [field]: date,
    }));
  };

  const handleRelevanceChange = (selectedOption) => {
    console.log("relevence", selectedOption);
    setTask((prevTask) => ({
      ...prevTask,
      relevance: selectedOption.value,
    }));
  };

  const handleStatusChange = (selectedOption) => {
    console.log("status");
    setTask((prevTask) => ({
      ...prevTask,
      status: selectedOption.value,
    }));
  };



  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true);
    console.log("Current task state:", task); // Log the current task state
    const payload = {
      name: task.name,
      description: task.description,
      start_date: task.start_date,
      end_date: task.end_date,
      relevance: task.relevance,
      status: task.status,
      property_id_task: task.property_id_task,
      user_id_task: task.user_id,
    };
    console.log("Constructed payload:", payload); // Log the constructed payload
    axiosClient
      .put(`/tasks/${id}`, payload)
      .then(() => {
        console.log("after axios")
        setLoading(false);
        setEditing(false);
        setNotification("Task updated successfully");
      })
      .catch((error) => {
        setLoading(false);
        setErrors(error.response.data.errors);
      });

  };
  return (
    <div className="task-profile-container">
      <div className="header">
        <h1>Užduotis: {task ? task.name : ""}</h1>
        <button className="btn-task" onClick={handleEdit}>
          Redaguoti
        </button>
      </div>
      <div className="card-container">
        {loading ? (
          <div className="text-center">Kraunama...</div>
        ) : task ? (
          <div className="card">
            <div className="card-header"></div>
            <div className="card-body">
              <p><strong>Aprašymas:</strong> {task.description}</p>
              <p><strong>Pradžios data:</strong> {task.start_date ? task.start_date.toLocaleDateString() : ""}</p>
              <p><strong>Pabaigos data:</strong> {task.end_date ? task.end_date.toLocaleDateString() : ""}</p>
              <p><strong>Svarbumas:</strong> {task.relevance}</p>
              <p><strong>Būsena:</strong> {task.status}</p>
              <p><strong>Priskirtas naudotojas:</strong> {task.user_name}</p>
            </div>
          </div>
        ) : null}
      </div>
      <Modal
        isOpen={editing}
        onRequestClose={() => setEditing(false)}
        contentLabel="Edit Task"
        className="modal"
        overlayClassName="overlay"
      >
        <div className="edit-form">
          <h2>Redaguoti</h2>
          <form>
            <div className="form-group">
              <label><strong>Aprašymas:</strong></label>
              <input
                type="text"
                name="description"
                value={task ? task.description : ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label><strong>Pradžios data:</strong></label>
              <DatePicker
                selected={task ? task.start_date : null}
                onChange={(date) => handleDateChange(date, "start_date")}
              />
            </div>
            <div className="form-group">
              <label><strong>Pabaigos data:</strong></label>
              <DatePicker
                selected={task ? task.end_date : null}
                onChange={(date) => handleDateChange(date, "end_date")}
              />
            </div>
            <div className="form-group">
              <label><strong>Svarbumas:</strong></label>
              <Select
                value={{ value: task ? task.relevance : "", label: task ? task.relevance : "" }}
                onChange={handleRelevanceChange}
                options={[
                  { value: "Labai Svarbi", label: "labai svarbi" },
                  { value: "Svarbi", label: "Svarbi" },
                  { value: "Nesvarbi", label: "Nesvarbi" }
                ]}
              />
            </div>
            <div className="form-group">
              <label><strong>Būsena:</strong></label>
              <Select
                value={{ value: task ? task.status : "", label: task ? task.status : "" }}
                onChange={handleStatusChange}
                options={[
                  { value: "Vykdoma", label: "Vykdoma" },
                  { value: "Atlikta", label: "Atlikta" },
                  { value: "Sustabdyta", label: "Sustabdyta" },
                  { value: "Atidėta", label: "Atidėta" },
                  { value: "Atšaukta", label: "Atšaukta" }
                ]}
              />
            </div>
            <div className="form-group">
              <label><strong>Naudotojas:</strong></label>
              <Select
                options={users}
                value={users.find(user => user.value === task.user_id_task)}
                onChange={handleUserChange}
                placeholder="Pasirinkti naudotoją"
              />
            </div>
            <div className="form-actions">
              <button className="btn-task" onClick={handleSave} style={{marginRight: "5px"}}>
                Išsaugoti
              </button>
              <button className="btn-delete" onClick={() => setEditing(false)}>
                Atšaukti
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}