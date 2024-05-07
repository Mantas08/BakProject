import { useNavigate, useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import ReactSelect from 'react-select';

export default function PropertyProfile() {
    const navigate = useNavigate();
    const { id } = useParams(); // This is the property ID
    const [property, setProperty] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); // Selected user for invitation
    const [users, setUsers] = useState([]); // List of users to invite
    const { user, setNotification } = useStateContext();


    useEffect(() => {
        setLoading(true);
        // Fetch property details
        axiosClient.get(`/propertys/${id}`)
            .then(({ data }) => {
                setProperty(data.data);
                // Fetch users not associated with the current property in the turi table
                axiosClient.get(`/users-not-associated/${id}`)
                    .then(({ data }) => {
                        setUsers(data.data);
                    })
                    .catch((error) => {
                        console.error("Failed to fetch users not associated with the property", error);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            })
            .catch((error) => {
                console.error("Failed to fetch property details", error);
                setLoading(false);
            });
    }, [id]);


    const leaveProperty = async () => {
        setLoading(true);
        try {
            await axiosClient.delete(`/turi/${id}/${user.id}`);
            setNotification("Sėkimgai atsijungėte");
            navigate("/propertys");
        } catch (error) {
            console.error("Klaida bandant atsijungti.", error);
            setNotification("Klaida bandant atsijungti.");
        } finally {
            setLoading(false);
        }
    };

    const inviteUser = async () => {
        if (!selectedUser) {
            alert("prašome pasirinkti naudotoją pridėti prie būsto.");
            return;
        }

        try {
            await axiosClient.post('/turi', {
                property_id_turi: id,
                user_id_turi: selectedUser.value
            });


            await axiosClient.post('/notifications', {
                not_user_id: selectedUser.value,
                message: `Jūs buvote pridėtas prie būsto:"${property.title}"`,
                not_property_id: id
            });

            // Notify the user that the invitation was successful
            setNotification(`Pridėtas naudotojas ${selectedUser.label} prie ${property.title} būsto`);

        } catch (error) {
            console.error("Klaida bandant pridėti naudotoją.", error);
            // Notify the user about the error
            setNotification("Klaida bandant pridėti naudotoją.");
        }
    };

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Pavadinimas: {property.title}</h1>
                <Link className="btn-task" to={`/propertys/edit/${id}`}>Redaguoti</Link>
            </div>
            <div className="card animated fadeInDown">
                {loading ? (
                    <div className="text-center">Kraunama...</div>
                ) : (
                    <>
                        <img src={`${property.image_url}`} alt="Property Image" style={{ maxWidth: "20%", marginBottom: "20px" }} />
                        <div>
                            <p><strong>Tipas:</strong> {property.type}</p>
                            <p><strong>Adresas:</strong> {property.address}</p>
                            <p><strong>Plotas:</strong> {property.area}</p>
                        </div>
                        <div>
                            {/* Invite User Field */}
                            <label htmlFor="inviteUser">Pridėti naudotoją:</label>
                            <ReactSelect
                                id="inviteUser"
                                options={users.map(user => ({ value: user.id, label: user.name }))}
                                value={selectedUser}
                                onChange={setSelectedUser}
                            />
                            <button style={{ marginTop: "5px" }} className="btn-task" onClick={inviteUser}>Pridėti</button>
                        </div>

                    </>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
                    <div>
                        <Link
                            className="btn-reservation"
                            to={`/finances/${property.id}`}
                            style={{ marginLeft: "0px" }}
                        >
                            Išlaidos
                        </Link>
                        <Link
                            className="btn-reservation"
                            to={`/reservation/${property.id}`}
                            style={{ marginLeft: "5px" }}
                        >
                            Rezervacijos
                        </Link>
                        <Link
                            className="btn-reservation"
                            to={`/taskList/${property.id}`}
                            style={{ marginLeft: "5px" }}
                        >
                            Užduotys
                        </Link>
                    </div>
                    <button className="btn-finance" onClick={leaveProperty}>Ištrinti</button>
                </div>
            </div>
        </>
    );
}
