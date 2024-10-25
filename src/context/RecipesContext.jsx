import React, { createContext, useContext } from 'react';

const RecipesContext = createContext();

export const useRecipes = () => {
  const context = useContext(RecipesContext);
  if (!context) {
    throw new Error('useRecipes must be used within a RecipesProvider');
  }
  return context;
};

export const RecipesProvider = ({ children }) => {
  const [recipesData, setRecipesData] = React.useState([]);

  return (
    <RecipesContext.Provider value={{ recipesData, setRecipesData }}>
      {children}
    </RecipesContext.Provider>
  );
};