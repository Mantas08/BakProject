import { useState, useEffect } from "react";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../contexts/ContextProvider.jsx";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
//import "./calender.css"

export default function SplitFinances() {
    const navigate = useNavigate();
    const { id } = useParams(); // Property ID

    const [finance, setFinance] = useState({
        startDate: new Date(),
        endDate: "",
        sum: "",
        category: "",
        propertyId: id,
    });
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const [byPeriod, setFinances] = useState([]);
    const [users, setUsers] = useState([]);
    const { setNotification } = useStateContext();
    const [category, setCategory] = useState(null);
    const uniqueCategories = Array.from(new Set(byPeriod.map(financeItem => financeItem.category)));

    useEffect(() => {
        // Fetch users associated with the selected property ID
        fetchUsers();
    }, []);

    useEffect(() => {
        // Fetch categories when end date is selected
        if (finance.endDate) {
            fetchFinancesByPeriod();
        }
    }, [finance.endDate]);

    const fetchUsers = () => {
        setLoading(true);
        axiosClient
            .get(`/turi?property_id_turi=${id}`)
            .then((response) => {
                setUsers(
                    response.data.data.map((user) => ({
                        value: user.user_id,
                        label: user.user_name,
                    }))
                );
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
                setLoading(false);
            });
    };

    const fetchFinancesByPeriod = () => {
        setLoading(true);
        axiosClient
            .get(`/finances/by-date-range?start_date=${finance.startDate}&end_date=${finance.endDate}`)
            .then((response) => {
                setFinances(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching finances by period:", error);
                setLoading(false);
            });
    };

    const onSubmit = (ev) => {
        ev.preventDefault();
        setLoading(true);
        // Perform split finance logic here
        // Example: Split the sum among selected users for the chosen category
        // This is where you will send the split finance data to the server
        setLoading(false);
        setNotification("Išlaidos padalintos sėkmingai");
        navigate(`/finances/${id}`);
    };

    return (
        <>
            <h1>Dalinti išlaidas</h1>
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
                        <DatePicker selected={finance.startDate} onChange={(date) => setFinance({ ...finance, startDate: date })} />
                    </div>
                    <div>
                        <label>Pabaigos data: </label>
                        <DatePicker selected={finance.endDate} onChange={(date) => setFinance({ ...finance, endDate: date })} />
                    </div>
                    {finance.endDate && (
                        <div>
                            <label>Kategorija:</label>
                            <Select
                                value={category}
                                onChange={(selectedOptions) => setCategory(selectedOptions)}
                                options={uniqueCategories.map(category => ({ value: category, label: category }))}
                                isMulti
                            />
                        </div>
                    )}
                    {/*finance.category.lenght > 0*/(
                        <div>
                            <label>Vartotojai:</label>
                            <Select
                                value={finance.users}
                                onChange={(selectedOptions) => setFinance({ ...finance, users: selectedOptions })}
                                options={users}
                                isMulti
                            />
                        </div>
                    )}

                    <button className="btn-task" style={{marginTop: "10px"}}>Dalinti</button>
                </form>
            </div>
        </>
    );
}
