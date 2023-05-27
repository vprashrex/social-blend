import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

export default function CategoryiseInf() {
  const { influencersCategory } = useAppContext();
  return (
    <div className="featured-con container my-5">
      <h3 className="fw-bold">Categories</h3>
      <div className="influencers-con gap-3 d-flex">
        {influencersCategory.map((category) => {
          return (
            category.url && (
              <Link
                to={"/influencers/any/" + category.name}
                className="category-influencer"
                key={category.id}
              >
                <div className="overlay"></div>
                <img src={category.url} alt="Category" height="200px" />
                <h3>{category.name}</h3>
              </Link>
            )
          );
        })}
      </div>
    </div>
  );
}
