import React, { useState, useCallback, useEffect } from "react";
import {
  Modal,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import "../style/App.css";

function AddingComponent({ open, onClose, pantryData, setPantryData }) {
  const [selectedItem, setSelectedItem] = useState("");
  const [quantityToAdd, setQuantityToAdd] = useState(0);

  const handleItemChange = (event) => {
    const itemName = event.target.value;
    setSelectedItem(itemName);

    const selectedPantryItem = pantryData.find(
      (item) => item.name === itemName
    );
    if (selectedPantryItem) {
      setQuantityToAdd(0);
    }
  };

  const handleSubmit = useCallback(() => {
    if (!selectedItem) {
      alert("You may select an Item.");
      return;
    }

    if (quantityToAdd < 0) {
      alert("Adding Quantity can't be negative.");
      return;
    }

    setPantryData((prevData) =>
      prevData.map((item) =>
        item.name === selectedItem
          ? { ...item, quantity: Number(item.quantity) + Number(quantityToAdd) }
          : item
      )
    );
  }, [pantryData, quantityToAdd]);

  useEffect(() => {
    setSelectedItem("");
    setQuantityToAdd(0);
  }, [pantryData]);

  return (
    <Modal open={open} onClose={onClose}>
      <div
        style={{
          padding: 20,
          backgroundColor: "white",
          borderRadius: 8,
          maxWidth: 400,
          margin: "auto",
          marginTop: "20%",
        }}
      >
        <h3>What did you use?</h3>

        <FormControl fullWidth margin="normal">
          <InputLabel id="select-item">Select Item</InputLabel>
          <Select
            labelId="select-item"
            value={selectedItem}
            onChange={handleItemChange}
          >
            {pantryData.map((item) => (
              <MenuItem key={item.name} value={item.name}>
                {item.name} (Quantity: {item.quantity})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Quantity to add"
          type="number"
          value={quantityToAdd}
          onChange={(e) => setQuantityToAdd(e.target.value)}
          fullWidth
          margin="normal"
        />

        <Button
          onClick={handleSubmit}
          variant="contained"
          style={{ margin: "1rem .5rem 0 0" }}
        >
          Submit
        </Button>
        <Button onClick={onClose} style={{ marginTop: "1rem" }}>
          Close
        </Button>
      </div>
    </Modal>
  );
}

export default AddingComponent;
