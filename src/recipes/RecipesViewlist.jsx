import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
} from "@mui/material";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "../style/App.css";
import SearchIcon from "@mui/icons-material/Search";
import { useRecipes } from '../context/RecipesContext';

function RecipesViewlist({ pantryData, setPantryData }) {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [allowedViewlist, setAllowedViewlist] = useState([]);
  const [selectedRecipeName, setSelectedRecipeName] = useState(null);
  const [portionCount, setPortionCount] = useState(1);
  const [insufficientIngredients, setInsufficientIngredients] = useState(false);

  const { recipesData } = useRecipes();

  const handleCloseModal = () => {
    setOpenModal(false);
    setInsufficientIngredients(false);
  };

  const viewlistColDefs = [
    { headerName: "Recipe Name", field: "name", flex: 1 },
    {
      headerName: "Actions",
      field: "actions",
      flex: 0.4,
      cellRenderer: (params) => {
        const { name, ingredients } = params.data;

        return (
          <div className="actionsContainer">
            <Button
              onClick={() => {
                setSelectedIngredients(ingredients);
                setSelectedRecipeName(name);
                setOpenModal(true);
              }}
              color="primary"
            >
              <SearchIcon />
            </Button>
          </div>
        );
      },
    },
  ];

  const handleViewlist = useCallback(() => {
    const filteredViewlist = recipesData.filter((recipe) => {
      return recipe.ingredients.every((ingredient) => {
        const pantryItem = pantryData.find(
          (item) => item.name === ingredient.name
        );
        return pantryItem && pantryItem.quantity >= ingredient.amount;
      });
    });

    setAllowedViewlist(filteredViewlist);
  }, [pantryData, recipesData]);

  useEffect(() => {
    handleViewlist();
  }, [pantryData, recipesData]);

  const handleUseRecipe = () => {
    // Verifica se ci sono ingredienti insufficienti
    const insufficient = selectedIngredients.some((ingredient) => {
      const pantryItem = pantryData.find(item => item.name === ingredient.name);
      return pantryItem && pantryItem.quantity < ingredient.amount * portionCount;
    });

    if (insufficient) {
      setInsufficientIngredients(true); // Imposta lo stato per errore
      return; // Non procedere se ci sono ingredienti insufficienti
    }

    // Logica per aggiornare gli ingredienti in base al numero di porzioni
    setPantryData((prevPantryData) => {
      return prevPantryData.map((item) => {
        const usedIngredient = selectedIngredients.find(
          (ingredient) => ingredient.name === item.name
        );
        if (usedIngredient) {
          const totalUsedAmount = usedIngredient.amount * portionCount; // Calcola la quantità totale in base alle porzioni
          return {
            ...item,
            quantity:
              item.quantity - totalUsedAmount > 0
                ? item.quantity - totalUsedAmount
                : 0,
          };
        }
        return item;
      });
    });
    handleCloseModal(); // Chiudi il dialogo dopo l'uso della ricetta
  };

  return (
    <div className="RecipesViewlist">
      <h2>Recipes Viewlist</h2>

      <div
        className="ag-theme-quartz"
        style={{ height: 400, width: 500, fontWeight: "500" }}
      >
        <AgGridReact rowData={allowedViewlist} columnDefs={viewlistColDefs} />
      </div>

      <Button onClick={() => navigate(-1)} className="backButton">
        Back
      </Button>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{selectedRecipeName}</DialogTitle>
        <DialogContent>
          <Typography>
            How many portions do you want to prepare?
          </Typography>
          <TextField
            type="number"
            value={portionCount}
            onChange={(e) => setPortionCount(Number(e.target.value))}
            inputProps={{ min: 1 }} // Imposta un valore minimo di 1
            fullWidth
            margin="normal"
          />
          {selectedIngredients.map((ingredient) => (
            <Typography key={ingredient.name}>
              {ingredient.name}: {ingredient.amount * portionCount} 
              {ingredient.amount * portionCount > ingredient.amount && ` (${ingredient.amount} per portion)`}
            </Typography>
          ))}
          {insufficientIngredients && (
            <Typography color="error">
              Not enough ingredients in pantry for the requested portions!
            </Typography>
          )}
        </DialogContent>
        <DialogActions style={{margin:'0 1rem', display:'flex', justifyContent:'space-between'}}>
          <Button onClick={handleUseRecipe} variant="contained">
            Use Recipe
          </Button>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default RecipesViewlist;
