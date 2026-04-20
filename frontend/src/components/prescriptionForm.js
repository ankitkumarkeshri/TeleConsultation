import React, { useState } from "react";
import API from "../api/axios";

const PrescriptionForm = ({ appointmentId }) => {
  const [notes, setNotes] = useState("");
  const [medicines, setMedicines] = useState("");

  const submit = async () => {
    await API.post("/prescription/create", {
      appointmentId,
      notes,
      medicines: medicines.split(","),
    });

    alert("Prescription saved");
  };

  return (
    <div>
      <h3>Prescription</h3>

      <textarea
        placeholder="Notes"
        onChange={(e) => setNotes(e.target.value)}
      />

      <input
        placeholder="Medicines (comma separated)"
        onChange={(e) => setMedicines(e.target.value)}
      />

      <button onClick={submit}>
        Save Prescription
      </button>
    </div>
  );
};

export default PrescriptionForm;