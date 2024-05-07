import { useState, useEffect } from "react";
import axiosClient from "../../axios-client.js";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CreateTask() {
    const navigate = useNavigate();
    const { id } = useParams(); // Property ID

    const [users, setUsers] = useState([]);
    const [task, setTask] = useState({
        name: "",
        description: "",
        startDate: new Date(),
        endDate: new Date(),
        relevance: { value: "Labai svarbi", label: "Labai svarbi" },
        status: { value: "Vykdoma", label: "Vykdoma" },
        propertyId: id,
        userId: ""
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    useEffect(() => {
        axiosClient.get(`/turi?property_id_turi=${id}`)
            .then(response => {
                if (Array.isArray(response.data.data)) {
                    setUsers(response.data.data.map(user => ({
                        value: user.user_id,
                        label: user.user_name
                    })));
                } else {
                    console.error("Response data is not an array:", response.data);
                }
            })
            .catch(error => {
                console.error("Error fetching users:", error);
            });
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTask({ ...task, [name]: value });
    };

    const handleUserChange = (selectedOption) => {
        setTask({ ...task, userId: selectedOption.value });
    };

    const handleRelevanceChange = (selectedOption) => {
        setTask({ ...task, relevance: selectedOption });
    };

    const handleStatusChange = (selectedOption) => {
        setTask({ ...task, status: selectedOption });
    };

    const onSubmit = (ev) => {
        ev.preventDefault();
        setLoading(true);
    
        const payload = {
            name: task.name,
            description: task.description,
            start_date: task.startDate,
            end_date: task.endDate,
            relevance: task.relevance.value,
            status: task.status.value,
            property_id_task: task.propertyId,
            user_id_task: task.userId || null, 
        };
    
        axiosClient
            .post('/tasks', payload)
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
            <h1>Sukurti užduotį</h1>
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
                        <label>Pavadinimas:</label>
                        <input type="text" name="name" value={task.name} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Aprašymas:</label>
                        <input type="text" name="description" value={task.description} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label>Pradžios data:</label>
                        <DatePicker selected={task.startDate} onChange={(date) => setTask({ ...task, startDate: date })} />
                    </div>
                    <div>
                        <label>Pabaigos data:</label>
                        <DatePicker selected={task.endDate} onChange={(date) => setTask({ ...task, endDate: date })} />
                    </div>
                    <div>
                        <label>Svarbumas:</label>
                        <Select
                            value={task.relevance}
                            onChange={handleRelevanceChange}
                            options={[
                                { value: "Labai Svarbi", label: "labai svarbi" },
                                { value: "Svarbi", label: "Svarbi" },
                                { value: "Nesvarbi", label: "Nesvarbi" }
                            ]}
                        />
                    </div>
                    <div>
                        <label>Būsena:</label>
                        <Select
                            value={task.status}
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
                    <div>
                        <label>Naudotojas:</label>
                        <Select
                            options={users}
                            value={users.find(user => user.value === task.userId)}
                            onChange={handleUserChange}
                            placeholder="Pasirinkti naudotoja"
                        />
                    </div>
                    <button type="submit" className="btn-task" style={{marginTop: "5px"}}>Įrašyti</button>
                </form>
            </div>
        </>
    );
}
