import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, InputLabel, Select, MenuItem, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function RecipesModal({ open, onClose, selectedRecipe, pantryData, recipesData, setRecipesData }) {
    
    const idCounter = useRef(0);
    const [selectedName, setSelectedName] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [selectedIngredients, setSelectedIngredients] = useState([]);

    const handleAddIngredient = useCallback(() => {
        if (selectedItem && selectedAmount) {
            const ingredient = pantryData.find(item => item.name === selectedItem);

            setSelectedIngredients((prevIngredients) => [
                ...prevIngredients, 
                { name: ingredient.name, amount: selectedAmount }
            ]);

            setSelectedItem('');
            setSelectedAmount('');
        }
    }, [pantryData, selectedItem, selectedAmount]);

    const handleKeyDown = useCallback((event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleAddIngredient();
        }
    }, [handleAddIngredient]);

    const handleRemoveIngredient = useCallback((index) => {
        setSelectedIngredients((prevIngredients) =>
            prevIngredients.filter((_, i) => i !== index)
        );
    //  '_' rappresenta ogni elemento del precedente array, ignorando il valore considerando solo l'indice 
    }, [selectedIngredients]);

    const handleSaveRecipe = useCallback(() => {
        const newRecipe = {
            id: idCounter.current,
            name: selectedName,
            ingredients: selectedIngredients,
        };

        if (!selectedRecipe) {
            setRecipesData((prevRecipes) => [
                ...prevRecipes,
                newRecipe,
            ]);
            idCounter.current++;
        } else {
            setRecipesData((prevRecipes) =>
                prevRecipes.map(recipe =>
                    recipe.id === selectedRecipe.id ? newRecipe : recipe
                )
            );
        }

        onClose();
    }, [selectedName, selectedIngredients, selectedRecipe, onClose]);



    useEffect(() => {
        if (selectedRecipe) {
            setSelectedName(selectedRecipe.name);
            setSelectedItem('');
            setSelectedAmount('');
            setSelectedIngredients(selectedRecipe.ingredients);
        } else {
            setSelectedName('');
            setSelectedItem('');
            setSelectedAmount('');
            setSelectedIngredients([]);
        }
    }, [selectedRecipe, recipesData]);


    
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Recipe Details</DialogTitle>
            <DialogContent onKeyDown={handleKeyDown}>
                <InputLabel shrink>Recipe Name</InputLabel>
                <TextField
                    value={selectedName}
                    onChange={(e) => setSelectedName(e.target.value)}
                    fullWidth
                    variant="outlined"
                    style={{ marginBottom: '1rem' }}
                />

                <InputLabel shrink>Ingredients</InputLabel>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <Select
                        value={selectedItem}
                        onChange={(e) => setSelectedItem(e.target.value)}
                        fullWidth
                        variant="outlined"
                        style={{ flex: 1 }}
                    >
                        {pantryData.map((item) => (
                            <MenuItem key={item.id} value={item.name}>
                                {item.name} ({item.quantity})
                            </MenuItem>
                        ))}
                    </Select>

                    <TextField
                        value={selectedAmount}
                        onChange={(e) => setSelectedAmount(e.target.value)}
                        label="Quantity"
                        type="number"
                        variant="outlined"
                        style={{ width: '120px' }}
                    />
                </div>

                <Button 
                    onClick={handleAddIngredient} 
                    variant="contained" 
                    color="primary"
                    disabled={!selectedItem || !selectedAmount || selectedAmount <= 0}
                    style={{ marginBottom: '1rem' }}
                >
                    Add Ingredient
                </Button>

                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                    {selectedIngredients.map((ingredient, index) => (
                        <li key={index}>
                            <Chip 
                                label={
                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                        {`${ingredient.name} (${ingredient.amount})`}
                                        <CloseIcon style={{ marginLeft: '0.3rem', color: 'grey', fontSize: '16px' }} />
                                    </span>
                                } 
                                variant="outlined" 
                                onClick={() => handleRemoveIngredient(index)}
                            />
                        </li>
                    ))}
                </ul>

            </DialogContent>
            <DialogActions style={{display: 'flex', justifyContent: 'space-between', margin: '0 1rem 1rem'}}>
                <Button onClick={handleSaveRecipe} variant='contained'>Save Recipe</Button>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default RecipesModal;
