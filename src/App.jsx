import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import { Button, Dialog } from '@mui/material';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css"; 
import './style/App.css';
import PantryLeft from './components/PantryLeft'
import ConsumingComponent from './components/ConsumingComponent';
import AddingComponent from './components/AddingComponent';
import RecipesComponent from './recipes/RecipesComponent';
import FavoriteIcon from '@mui/icons-material/Favorite';

function App() {
  const [shoppingListData, setShoppingListData] = useState([]);
  const [pantryData, setPantryData] = useState([]);
  const [recipesData, setRecipesData] = useState([]);

  const [openConsumingComponent, setOpenConsumingComponent] = useState(false);
  const handleOpenConsumingComponent = () => {
    setOpenConsumingComponent(true);
  };
  const handleCloseConsumingComponent = () => {
    setOpenConsumingComponent(false);
  };

  const [openAddingComponent, setOpenAddingComponent] = useState(false);
  const handleOpenAddingComponent = () => {
    setOpenAddingComponent(true);
  };
  const handleCloseAddingComponent = () => {
    setOpenAddingComponent(false);
  };

  const shoppingListColDefs = [
    { headerName: "Item Name", field: "name", flex: 1 },
    { headerName: "To Buy (g)", field: "toBuy", flex: 1 },
    { headerName: "Quantity (g)", field: "quantity", flex: 1 },
  ];

  const getRowStyle = params => {
    if (params.data.quantity < params.data.minimum) {
      if (params.data.quantity == 0) {
        return { backgroundColor: 'black', color: 'white'};
      }
      return { backgroundColor: 'rgba(255, 0, 0, .25)'};
    }
    return null;
  };

  useEffect(() => {
    const filteredPantry = pantryData
      .filter(item => item.quantity < item.minimum * 2)
      .map(item => {
        const toBuy = item.minimum * 2 - item.quantity;
        return { ...item, toBuy: toBuy > 0 ? toBuy : 0 };
      });
  
    setShoppingListData(filteredPantry);
  }, [pantryData]);
  

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <div>
              <h1>kitchen_assistant</h1>

              <Button variant='contained' component={Link} to="/pantry" style={{marginBottom: ".5rem", marginRight: '.5rem'}}> Pantry </Button>
              <Button variant='contained' onClick={handleOpenAddingComponent} style={{marginBottom: ".5rem", marginRight: '.5rem'}}> Adding </Button>
              <Button variant='contained' onClick={handleOpenConsumingComponent} style={{marginBottom: ".5rem", marginRight: '.5rem'}}> Consuming </Button>

              <div
                className="ag-theme-quartz"
                style={{ height: 400, width: 500, fontWeight:'500' }}
              >
                <AgGridReact
                    rowData={shoppingListData}
                    columnDefs={shoppingListColDefs}
                    getRowStyle={getRowStyle}
                />
              </div>

              <Button variant='contained' component={Link} to="/recipes" style={{marginTop: ".5rem", marginRight: '.5rem'}}><FavoriteIcon style={{marginRight: '.5rem'}}/> Recipes </Button>
            </div>
          } />
          <Route path="/pantry" element={<PantryLeft pantryData={pantryData} setPantryData={setPantryData} />} />
          <Route path="/recipes" element={<RecipesComponent pantryData={pantryData} setPantryData={setPantryData} recipesData={recipesData} setRecipesData={setRecipesData} />} />
        </Routes>

        {/* modal to open AddingComponent */}
        <Dialog
          open={openAddingComponent}
          onClose={handleCloseAddingComponent}
          fullWidth
          maxWidth="md"
        >
          <AddingComponent
            open={openAddingComponent}
            onClose={handleCloseAddingComponent}
            pantryData={pantryData} 
            setPantryData={setPantryData}
          />
        </Dialog>

        {/* modal to open ConsumingComponent */}
        <Dialog
          open={openConsumingComponent}
          onClose={handleCloseConsumingComponent}
          fullWidth
          maxWidth="md"
        >
          <ConsumingComponent
            open={openConsumingComponent}
            onClose={handleCloseConsumingComponent}
            pantryData={pantryData} 
            setPantryData={setPantryData}
          />
        </Dialog>

      </div>
    </Router>
  );
}

export default App;