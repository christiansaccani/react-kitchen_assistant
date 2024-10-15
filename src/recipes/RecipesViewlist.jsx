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
} from "@mui/material";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "../style/App.css";
import PlayIcon from "@mui/icons-material/PlayCircleOutline";
import SearchIcon from "@mui/icons-material/Search";

function RecipesViewlist({ pantryData, setPantryData, recipesData }) {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [allowedViewlist, setAllowedViewlist] = useState([]);
  const [selectedRecipeName, setSelectedRecipeName] = useState(null);

  const handleCloseModal = () => {
    setOpenModal(false);
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
                const confirmUse = window.confirm(
                  `Are you sure to use the recipe "${name}"?`
                );

                if (confirmUse) {
                  setPantryData((prevPantryData) => {
                    return prevPantryData.map((item) => {
                      const usedIngredient = ingredients.find(
                        (ingredient) => ingredient.name === item.name
                      );
                      if (usedIngredient) {
                        return {
                          ...item,
                          quantity:
                            item.quantity - usedIngredient.amount > 0
                              ? item.quantity - usedIngredient.amount
                              : 0,
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

  /* questa costante si occupa di filtrare in questa lista solo le ricette di cui
  gli ingredienti sono disponibili in Pantry, si accede alla lista degli ingredienti 
  di ogni Recipe, di questi, OGNI elemento deve rispettare la condizione di essere
  minore o uguale alla disponibilità.*/
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
          {selectedIngredients.map((ingredient) => (
            <Typography key={ingredient.name}>
              {ingredient.name}: {ingredient.amount}
            </Typography>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default RecipesViewlist;
