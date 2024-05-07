import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider.jsx";
import axiosClient from "../../axios-client.js";
import Chart from "chart.js/auto";

export default function Finance() {
    const [finance, setFinance] = useState([]);
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext();
    const { id } = useParams();
    const [categoryData, setCategoryData] = useState({});
    const [sumData, setSumData] = useState({});

    useEffect(() => {
        getFinances();
    }, []);

    useEffect(() => {
        createCharts();
    }, [categoryData, sumData]);

    const getFinances = () => {
        setLoading(true);
        axiosClient
            .get(`/finances/filtered-by-property/${id}`)
            .then(({ data }) => {
                setLoading(false);
                setFinance(data.data);
                prepareCategoryData(data.data);
                prepareSumData(data.data);
            })
            .catch((error) => {
                setLoading(false);
                console.error("Error fetching finances:", error);
            });
    };

    const prepareCategoryData = (finances) => {
        const categoryCount = finances.reduce((acc, finance) => {
            acc[finance.category] = (acc[finance.category] || 0) + 1;
            return acc;
        }, {});

        setCategoryData(categoryCount);
    };

    const prepareSumData = (finances) => {
        const sumCount = finances.reduce((acc, finance) => {
            acc[finance.category] = (acc[finance.category] || 0) + finance.sum;
            return acc;
        }, {});

        setSumData(sumCount);
    };

    const onDeleteClick = (finance) => {
        if (!window.confirm("Are you sure you want to delete this finance?")) {
            return;
        }
        axiosClient
            .delete(`/finances/${finance.id}`)
            .then(() => {
                setNotification("Finance was successfully deleted");
                getFinances();
            })
            .catch((error) => {
                console.error("Error deleting finance:", error);
            });
    };

    const createCharts = () => {
        createPieChart();
        createColumnChart();
    };

    const createPieChart = () => {
        if (Object.keys(categoryData).length === 0) {
            return; // Don't create chart if data is not available
        }

        const ctx = document.getElementById("pie-chart");

        // Check if there's an existing Chart instance associated with the canvas
        const existingChart = Chart.getChart(ctx);

        // If an existing Chart instance exists, destroy it
        if (existingChart) {
            existingChart.destroy();
        }

        // Create the pie chart
        const pieChart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: Object.keys(categoryData),
                datasets: [
                    {
                        label: "Categories",
                        data: Object.values(categoryData),
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.6)",
                            "rgba(54, 162, 235, 0.6)",
                            "rgba(255, 206, 86, 0.6)",
                            "rgba(75, 192, 192, 0.6)",
                            "rgba(153, 102, 255, 0.6)",
                            "rgba(255, 159, 64, 0.6)",
                        ],
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: "top",
                    },
                    title: {
                        display: true,
                        text: "Pie Chart",
                    },
                },
            },
        });

        return () => {
            pieChart.destroy();
        };
    };

    const createColumnChart = () => {
        if (Object.keys(sumData).length === 0) {
            return; // Don't create chart if data is not available
        }

        const ctx = document.getElementById("column-chart");

        // Check if there's an existing Chart instance associated with the canvas
        const existingChart = Chart.getChart(ctx);

        // If an existing Chart instance exists, destroy it
        if (existingChart) {
            existingChart.destroy();
        }

        // Create the column chart
        const columnChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: Object.keys(sumData),
                datasets: [
                    {
                        label: "Categories",
                        data: Object.values(sumData),
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.6)",
                            "rgba(54, 162, 235, 0.6)",
                            "rgba(255, 206, 86, 0.6)",
                            "rgba(75, 192, 192, 0.6)",
                            "rgba(153, 102, 255, 0.6)",
                            "rgba(255, 159, 64, 0.6)",
                        ],
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                    title: {
                        display: true,
                        text: "Column Chart",
                    },
                },
            },
        });

        return () => {
            columnChart.destroy();
        };
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                <h1>Finansai</h1>
                <div style={{ display: "flex", alignItems: "center" }}>
                <Link className="btn-reservation" to={`/finances/report/${id}`} style={{ marginRight: '10px' }}>
                    Generuoti ataskaitą
                </Link>
                <Link className="btn-reservation" to={`/finances/split/${id}`} style={{ marginRight: '10px' }}>
                    Dalinti išlaidas
                </Link>
                <Link className="btn-reservation" to={`/finances/new/${id}`}>
                    Pridėti išlaidas
                </Link>
                </div>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Suma</th>
                            <th>Kategorija</th>
                            <th>Apmokėjimo data</th>
                            <th>Veiksmai</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    Kraunama...
                                </td>
                            </tr>
                        ) : (
                            finance.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.sum}</td>
                                    <td>{u.category}</td>
                                    <td>{u.start_date}</td>
                                    <td>        
                                        &nbsp;
                                        <button
                                            className="btn-finance"
                                            onClick={(ev) => onDeleteClick(u)}
                                        >
                                            Ištrinti
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="charts-container" style={{ display: "flex" }}>
                <div className="chart-card" style={{ flex: 1 }}>
                    <canvas id="pie-chart"></canvas>
                </div>
                <div className="chart-card" style={{ flex: 1 }}>
                    <canvas id="column-chart"></canvas>
                </div>
            </div>
        </div>
    );
}
