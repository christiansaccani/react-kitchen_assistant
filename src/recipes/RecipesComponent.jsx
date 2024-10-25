import React, { useState } from "react";
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
import RecipesModal from "./RecipesModal";
import DrawIcon from "@mui/icons-material/Draw";
import AddIcon from "@mui/icons-material/AddCircleOutline";
import RemoveIcon from "@mui/icons-material/RemoveCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import { useRecipes } from "../context/RecipesContext";

function RecipesComponent({ pantryData, setPantryData }) {
  const navigate = useNavigate();
  const { recipesData, setRecipesData } = useRecipes();

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openPortionDialog, setOpenPortionDialog] = useState(false);
  const [portionCount, setPortionCount] = useState(1);
  const [insufficientIngredients, setInsufficientIngredients] = useState(false);

  const recipesColDefs = [
    { headerName: "Item Name", field: "name", flex: 1 },
    {
      headerName: "",
      field: "actions",
      flex: 0.4,
      cellRenderer: (params) => {
        return (
          <div className="actionsContainer">
            <Button
              onClick={() => {
                setSelectedRecipe(params.data);
                setPortionCount(1);
                setInsufficientIngredients(false);
                setOpenPortionDialog(true);
              }}
              aria-hidden="false"
            >
              <SearchIcon />
            </Button>

            <Button
              onClick={() => {
                setSelectedRecipe(params.data);
                setOpenModal(true);
              }}
              style={{ color: "black" }}
            >
              <DrawIcon />
            </Button>

            <Button
              color="error"
              onClick={() => {
                const recipeToDelete = params.data;
                const confirmDelete = window.confirm(
                  `Are you sure to delete the recipe "${recipeToDelete.name}"?`
                );
                if (confirmDelete) {
                  setRecipesData((prevRecipes) =>
                    prevRecipes.filter(
                      (recipe) => recipe.id !== recipeToDelete.id
                    )
                  );
                }
              }}
            >
              <RemoveIcon />
            </Button>
          </div>
        );
      },
    },
  ];

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRecipe(null);
  };

  const handleClosePortionDialog = () => {
    setOpenPortionDialog(false);
    setInsufficientIngredients(false);
    setSelectedRecipe(null);
  };

  const handleUseRecipe = () => {
    if (!selectedRecipe) return;

    // Check for insufficient ingredients based on current portion count
    const insufficient = selectedRecipe.ingredients.some((ingredient) => {
      const pantryItem = pantryData.find(
        (item) => item.name === ingredient.name
      );
      return (
        !pantryItem || pantryItem.quantity < ingredient.amount * portionCount
      );
    });

    if (insufficient) {
      setInsufficientIngredients(true);
      return;
    }

    // If we have sufficient ingredients, update the pantry
    setPantryData((prevPantryData) => {
      return prevPantryData.map((item) => {
        const usedIngredient = selectedRecipe.ingredients.find(
          (ingredient) => ingredient.name === item.name
        );
        if (usedIngredient) {
          const totalUsedAmount = usedIngredient.amount * portionCount;
          return {
            ...item,
            quantity: Math.max(0, item.quantity - totalUsedAmount),
          };
        }
        return item;
      });
    });

    handleClosePortionDialog();
  };

  return (
    <div className="RecipesComponent">
      <h2>Recipes Manager</h2>

      <Button
        onClick={() => {
          setSelectedRecipe(null); // Ensure we're creating a new recipe
          setOpenModal(true);
        }}
        variant="contained"
        className="addButton"
      >
        <AddIcon style={{ marginRight: ".2rem" }} />
        Add
      </Button>

      <div
        className="ag-theme-quartz"
        style={{ height: 400, width: 500, fontWeight: "500" }}
      >
        <AgGridReact rowData={recipesData} columnDefs={recipesColDefs} />
      </div>

      <Button onClick={() => navigate(-1)} className="backButton">
        Back
      </Button>

      <RecipesModal
        open={openModal}
        onClose={handleCloseModal}
        selectedRecipe={selectedRecipe}
        pantryData={pantryData}
      />

      <Dialog
        open={openPortionDialog}
        onClose={handleClosePortionDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{selectedRecipe?.name}</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            How many portions do you want to prepare?
          </Typography>
          <TextField
            type="number"
            value={portionCount}
            onChange={(e) => {
              const value = Math.max(1, Number(e.target.value));
              setPortionCount(value);
              setInsufficientIngredients(false); // Reset error when portions change
            }}
            inputProps={{ min: 1 }}
            fullWidth
            margin="normal"
          />
          {selectedRecipe?.ingredients.map((ingredient) => (
            <Typography key={ingredient.name}>
              {ingredient.name}: {ingredient.amount * portionCount}
              {ingredient.amount * portionCount > ingredient.amount &&
                ` (${ingredient.amount} per portion)`}
            </Typography>
          ))}
          {insufficientIngredients && (
            <Typography color="error" style={{ marginTop: "1rem" }}>
              Not enough ingredients in pantry for the requested portions!
            </Typography>
          )}
        </DialogContent>
        <DialogActions
          style={{
            margin: "0 1rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button onClick={handleUseRecipe} variant="contained">
            Use Recipe
          </Button>
          <Button onClick={handleClosePortionDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default RecipesComponent;
