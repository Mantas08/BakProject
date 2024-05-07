import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider.jsx";
import axiosClient from "../../axios-client.js";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const { id } = useParams();

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = () => {
    setLoading(true);
    axiosClient
      .get(`/tasks/filtered-by-property/${id}`) // Use the new route for filtered tasks
      .then(({ data }) => {
        setLoading(false);
        setTasks(data.data);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching task:", error);
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
        <h1>Užduotys</h1>
        <Link className="btn-add" to={`/task/new/${id}`}>
          Pridėti naują
        </Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>Pavadinimas</th>
              <th>Būsena</th>
              <th>Daugiau informacijos</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center">
                  Kraunama...
                </td>
              </tr>
            ) : (
              tasks.length > 0 ? (
                tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.name}</td>
                    <td>{task.status}</td> {/* Assuming task.progress is available */}
                    <td>
                      <Link className="btn-more" to={`/taskProfile/${task.id}`}>
                        Daugiau
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">Nerasta užduočių</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
