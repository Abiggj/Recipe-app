import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Home.css";
import logo from './logo.png';

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const userID = useGetUserID();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:3001/recipes");
        setRecipes(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/savedRecipes/ids/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRecipes();
    fetchSavedRecipes();
  }, []);

  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put("http://localhost:3001/recipes", {
        recipeID,
        userID,
      });
      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {
      console.log(err);
    }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);

  const [flippedCards, setFlippedCards] = useState([]);

  const handleFlipCard = (recipeId) => {
    setFlippedCards((prevFlippedCards) => {
      if (prevFlippedCards.includes(recipeId)) {
        return prevFlippedCards.filter((id) => id !== recipeId);
      } else {
        return [...prevFlippedCards, recipeId];
      }
    });
  };

  return (
    <div className="home-container">
      <h1 className="text-center mb-5 animated fadeInDown">
        <img src={logo} id="logo"/>
      </h1>
      <div className="row">
        {recipes.map((recipe) => (
          <div key={recipe._id} className="col-md-6 col-lg-4 mb-4 animated fadeInUp">
            <div className="card flip-card h-100">
              <div
                className={`flip-card-inner h-100 ${
                  flippedCards.includes(recipe._id) ? "flipped" : ""
                }`}
              >
                <div className="flip-card-front h-100">
                  <img src={recipe.imageUrl} alt={recipe.name} className="card-img-top" />
                  <div className="card-body">
                    <h5 className="card-title">{recipe.name}</h5>
                    <p className="card-text">Cooking Time: {recipe.cookingTime} minutes</p>
                    <button
                      onClick={() => saveRecipe(recipe._id)}
                      disabled={isRecipeSaved(recipe._id)}
                      className={`btn btn-${isRecipeSaved(recipe._id) ? "success" : "primary"} mr-2`}
                    >
                      {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
                    </button>
                    <button
                      className="btn btn-info flip-card-btn"
                      type="button"
                      onClick={() => handleFlipCard(recipe._id)}
                    >
                      {flippedCards.includes(recipe._id) ? "Hide Instructions" : "Show Instructions"}
                    </button>
                  </div>
                </div>
                <div className="flip-card-back card h-100">
                  <div className="card-body">
                    <p className="card-text instructions-text">{recipe.instructions}</p>
                    <button
                      className="btn btn-secondary flip-card-btn"
                      type="button"
                      onClick={() => handleFlipCard(recipe._id)}
                    >
                      Flip Back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};