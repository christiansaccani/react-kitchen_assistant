import React, { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import { Button, TextField, InputLabel } from "@mui/material";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "../style/App.css";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

function PantryLeft({ pantryData, setPantryData }) {
  const idCounter = useRef(0);
  const navigate = useNavigate();

  const PantryColDefs = [
    { headerName: "Item Name", field: "name", flex: 0.6 },
    { field: "quantity", flex: 0.3 },
    { field: "minimum", flex: 0.3 },
    {
      headerName: "",
      field: "actions",
      flex: 0.4,
      cellRenderer: (params) => {
        const { id, name, quantity, minimum } = params.data;

        return (
          <div className="actionsContainer">
            <Button
              onClick={() => {
                setSelectedName(name);
                setSelectedQuantity(quantity);
                setSelectedMinimum(minimum);
                setSelectedObject(params.data);
              }}
              style={{ color: "black" }}
            >
              <SettingsIcon />
            </Button>
            <Button color="error" onClick={() => handleDeleteObject(id)}>
              <DeleteOutlineIcon />
            </Button>
          </div>
        );
      },
    },
  ];

  const [selectedName, setSelectedName] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(null);
  const [selectedMinimum, setSelectedMinimum] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);

  const handleChangePantryDatas = useCallback(() => {
    // Error handling //
    if (!selectedName || !selectedQuantity || !selectedMinimum) {
      alert("All fields must be filled.");
      return;
    }

    if (selectedQuantity < 0 || selectedMinimum < 0) {
      alert("Quantities can't be negative.");
      return;
    }

    if (selectedObject) {
      if (selectedObject.name.toLowerCase() !== selectedName.toLowerCase()) {
        if (
          pantryData.some(
            (item) => item.name.toLowerCase() === selectedName.toLowerCase()
          )
        ) {
          alert("That name is already used.");
          return;
        }
      }
    } else {
      if (
        pantryData.some(
          (item) => item.name.toLowerCase() === selectedName.toLowerCase()
        )
      ) {
        alert("That name is already used.");
        return;
      }
    }
    // -------------- //

    const newObject = {
      id: selectedObject ? selectedObject.id : idCounter.current,
      name: selectedName,
      quantity: Number(selectedQuantity),
      minimum: Number(selectedMinimum),
    };

    if (selectedObject) {
      // edit
      setPantryData((prevPantryData) =>
        prevPantryData.map((item) =>
          item.id === selectedObject.id ? newObject : item
        )
      );
    } else {
      // add
      setPantryData((prevPantryData) => [...prevPantryData, newObject]);
      idCounter.current += 1;
    }
  }, [
    selectedName,
    selectedQuantity,
    selectedMinimum,
    selectedObject,
    pantryData,
  ]);

  const handleDeleteObject = useCallback(
    (id) => {
      setPantryData((prevPantry) =>
        prevPantry.filter((pantry) => pantry.id !== id)
      );
    },
    [pantryData]
  );

  useEffect(() => {
    setSelectedName("");
    setSelectedQuantity("");
    setSelectedMinimum("");
    setSelectedObject(null);
  }, [pantryData]);

  return (
    <div className="PantryLeft">
      <h2>Pantry Manager</h2>

      <form
        className="pantry-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleChangePantryDatas();
        }}
        style={{ width: 550 }}
      >
        <InputLabel shrink>Item Name</InputLabel>
        <TextField
          value={selectedName}
          onChange={(e) => setSelectedName(e.target.value)}
          fullWidth
          variant="outlined"
          style={{ marginBottom: "1rem" }}
        />

        <InputLabel shrink>Quantity</InputLabel>
        <TextField
          type="number"
          value={selectedQuantity}
          onChange={(e) => setSelectedQuantity(e.target.value)}
          fullWidth
          variant="outlined"
          style={{ marginBottom: "1rem" }}
        />

        <InputLabel shrink>Minimum</InputLabel>
        <TextField
          type="number"
          value={selectedMinimum}
          onChange={(e) => setSelectedMinimum(e.target.value)}
          fullWidth
          variant="outlined"
          style={{ marginBottom: "1rem" }}
        />

        <Button type="submit" variant="contained" className="addButton">
          {selectedObject ? "Edit" : "Add"}
        </Button>
      </form>

      {/* Table */}
      <div className="ag-theme-quartz" style={{ height: 350, width: "100%" }}>
        <AgGridReact rowData={pantryData} columnDefs={PantryColDefs} />
      </div>

      <Button onClick={() => navigate(-1)} className="backButton">
        Back
      </Button>
    </div>
  );
}

export default PantryLeft;
