import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/savedRecipes.css";

export const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [showInstructions, setShowInstructions] = useState({});
  const userID = useGetUserID();

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/savedRecipes/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSavedRecipes();
  }, [userID]);

  const toggleInstructions = (recipeId) => {
    setShowInstructions((prevState) => ({
      ...prevState,
      [recipeId]: !prevState[recipeId],
    }));
  };

  return (
    <div className="saved-recipes-container">
      <h1 className="text-center mb-5 animated fadeInDown">Saved Recipes</h1>
      <div className="row justify-content-center">
        {savedRecipes.map((recipe) => (
          <div
            key={recipe._id}
            className="col-md-6 col-lg-4 mb-4 animated fadeInUp"
          >
            <div className="card recipe-card">
              <img
                src={recipe.imageUrl}
                alt={recipe.name}
                className="card-img-top"
              />
              <div className="card-body">
                <h5 className="card-title">{recipe.name}</h5>
                <p className="card-text">{recipe.description}</p>
                <p className="card-text">
                  Cooking Time: {recipe.cookingTime} minutes
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => toggleInstructions(recipe._id)}
                >
                  {showInstructions[recipe._id]
                    ? "Hide Instructions"
                    : "Show Instructions"}
                </button>
                {showInstructions[recipe._id] && (
                  <div className="instructions-container animated fadeIn">
                    <p className="card-text">{recipe.instructions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};