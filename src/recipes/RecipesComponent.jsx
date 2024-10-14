import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@mui/material";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "../style/App.css";
import RecipesModal from "./RecipesModal";
import SearchIcon from "@mui/icons-material/Search";
import RemoveIcon from "@mui/icons-material/RemoveCircleOutline";
import PlayIcon from '@mui/icons-material/PlayCircleOutline';

function RecipesComponent({
  pantryData,
  setPantryData,
  recipesData,
  setRecipesData,
}) {
  const navigate = useNavigate();

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const recipesColDefs = [
    { headerName: "Item Name", field: "name", flex: 1 },
    {
      headerName: "",
      field: "actions",
      flex: 0.4,
      cellRenderer: (params) => {
        const { id, name, ingredients } = params.data;

        return (
          <div className="actionsContainer">
            <Button
                onClick={() => {
                    const recipeToUse = params.data;
                    const confirmUse = window.confirm(
                        `Are you sure to use the recipe "${recipeToUse.name}"?`
                    );

                    if (confirmUse) {
                        setPantryData(prevPantryData => {
                            return prevPantryData.map(item => {
                            const usedIngredient = recipeToUse.ingredients.find(ingredient => ingredient.name === item.name);
                                if (usedIngredient) {
                                    return {
                                    ...item,
                                    quantity: item.quantity - usedIngredient.quantity > 0 ? item.quantity - usedIngredient.quantity : 0,
                                    };
                                }
                            return item;
                            });
                        });
                    }
                }}
                color="success"
            >
                <PlayIcon />
            </Button>

            <Button
              onClick={() => {
                setSelectedRecipe(params.data);
                setOpenModal(true);
              }}
              style={{ color: "black" }}
            >
              <SearchIcon />
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


  return (
    <div className="RecipesComponent">
      <h2>Recipes Manager</h2>

      <Button
        onClick={() => setOpenModal(true)}
        variant="contained"
        className="addButton"
      >
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

      {/* Recipes Modal */}
      <RecipesModal
        open={openModal}
        onClose={handleCloseModal}
        selectedRecipe={selectedRecipe}
        pantryData={pantryData}
        recipesData={recipesData}
        setRecipesData={setRecipesData}
      />
    </div>
  );
}

export default RecipesComponent;
