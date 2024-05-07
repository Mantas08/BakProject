import { useState } from "react";
import axiosClient from "../../axios-client.js";
import { useStateContext } from "../../contexts/ContextProvider.jsx";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
//import "./calender.css"

export default function AddFinances() {

    const navigate = useNavigate();
    const { id } = useParams(); // Property ID

    const [finance, setFinance] = useState({
        startDate: new Date(),
        endDate: new Date(),
        sum: "",
        category: "",
        propertyId: id,
    });
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext();

    const onSubmit = (ev) => {
        ev.preventDefault();
        setLoading(true);

        const payload = {
            start_date: finance.startDate,
            end_date: finance.endDate,
            sum: parseFloat(finance.sum), // Add the sum field
            category: finance.category.value, // Access the value of the selected category
            property_id_finance: finance.propertyId,
        };

        axiosClient
            .post('/finances', payload)
            .then(() => {
                setNotification('Išlaidų įrašas sėkmingai sukurtas');
                setLoading(false);
                navigate(`/finances/${id}`);
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
            <h1>Pridėti išlaidas</h1>
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
                        <label>Data:   </label>
                        <DatePicker selected={finance.startDate} onChange={(date) => setFinance({ ...finance, startDate: date })} />
                    </div>
                    <div>
                        <input
                            type="number"
                            step="0.01"
                            onChange={(ev) => setFinance({ ...finance, sum: ev.target.value })}
                            placeholder="Suma"
                        />
                        <label>Kategorija:</label>
                        <Select
                            value={finance.category} // Selected option object
                            onChange={(selectedOption) => setFinance({ ...finance, category: selectedOption })} // Extract value from selected option
                            options={[
                                { value: "Mokesčiai", label: "Mokesčiai" },
                                { value: "Maistas", label: "Maistas" },
                                { value: "Medžiagos", label: "Medžiagos" },
                                { value: "Kita", label: "Kita" },
                            ]}
                        />
                        &nbsp;
                    </div>
                    <button className="btn-finance">Įrašyti</button>
                </form>
            </div>
        </>
    );
}