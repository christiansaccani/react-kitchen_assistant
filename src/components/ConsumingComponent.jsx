import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Button, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import '../style/App.css';

function ConsumingComponent({ open, onClose, pantryData, setPantryData }) {
  const [selectedItem, setSelectedItem] = useState('');
  const [quantityToUse, setQuantityToUse] = useState(0);

  const handleItemChange = (event) => {
    const itemName = event.target.value;
    setSelectedItem(itemName);
    
    const selectedPantryItem = pantryData.find(item => item.name === itemName);
    if (selectedPantryItem) {
      setQuantityToUse(0);
    }
  };

  const handleSubmit = useCallback(() => {
    if (quantityToUse > 0) {
      setPantryData((prevData) => {
        return prevData.map(item => {
          if (item.name === selectedItem && quantityToUse <= item.quantity) {
            return { ...item, quantity: item.quantity - quantityToUse };
          } else {
            alert ("Used quantity can't be over");
            return item;
          }
        });
      });
    } else {
      alert ("Used quantity can't be negative");
      return
    }
  },[pantryData, quantityToUse]);

  useEffect(() => {
    setSelectedItem('');
    setQuantityToUse(0);
  }, [pantryData])

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ padding: 20, backgroundColor: 'white', borderRadius: 8, maxWidth: 400, margin: 'auto', marginTop: '20%' }}>
        <h3>What did you use?</h3>
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="select-item">Select Item</InputLabel>
          <Select
            labelId="select-item"
            value={selectedItem}
            onChange={handleItemChange}
          >
            {pantryData.map(item => (
              <MenuItem key={item.name} value={item.name}>
                {item.name} (Quantity: {item.quantity})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Quantity to use"
          type="number"
          value={quantityToUse}
          onChange={(e) => setQuantityToUse(e.target.value)}
          inputProps={{ min: 1, max: Math.max(...pantryData.filter(item => item.name === selectedItem).map(item => item.quantity)) }}
          fullWidth
          margin="normal"
        />

        <Button onClick={handleSubmit} variant="contained" style={{ margin: '1rem .5rem 0 0' }}>
          Submit
        </Button>
        <Button onClick={onClose} style={{ marginTop: '1rem' }}>
          Close
        </Button>
      </div>
    </Modal>
  );
}

export default ConsumingComponent;
