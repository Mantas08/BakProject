import React, { useState } from "react";
import axiosClient from "../../axios-client.js";
import { useParams } from "react-router-dom";


const GenerateReport = () => {
  const [period, setPeriod] = useState({ start_date: "", end_date: "" });
  const { id } = useParams();

  const handleFromDateChange = (e) => {
    setPeriod({ ...period, start_date: e.target.value });
  };

  const handleToDateChange = (e) => {
    setPeriod({ ...period, end_date: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchFinanceData();
  };

  const fetchFinanceData = () => {
    axiosClient
      .post("/generate-pdf", { period, property_id: id }, { responseType: "blob" })
      .then((response) => {
        // Assuming the response contains the PDF data
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
  
        // Open the PDF in a new tab
        window.open(url, "_blank");
      })
      .catch((error) => {
        console.error("Error generating PDF report:", error);
      });
  };
  

  return (
    <div>
      <h2>Generuoti ataskaitą</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="start_date">Nuo:</label>
          <input
            type="date"
            id="start_date"
            value={period.start_date}
            onChange={handleFromDateChange}
          />
        </div>
        <div>
          <label htmlFor="end_date">Iki:</label>
          <input
            type="date"
            id="end_date"
            value={period.end_date}
            onChange={handleToDateChange}
          />
        </div>
        <button className="btn-task" type="submit">Generuoti</button>
      </form>
    </div>
  );
};

export default GenerateReport;