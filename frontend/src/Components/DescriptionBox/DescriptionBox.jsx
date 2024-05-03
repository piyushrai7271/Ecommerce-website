import React from "react";
import "./DescriptionBox.css";

export const DescriptionBox = () => {
  return (
    <div className="descriptionbox">
      <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews (122)</div>
      </div>
      <div className="descriptionbox-description">
        <p>
          An e-commerce website is an online platform that facilitate buying and
          selling of products or services over the internet serves as a virtual
          marketplace where businesses and individual showcase their products,
          intract with customers, and conduct transactions without the need for
          a physical presence. E-commerce websites have gained immense
          popularity due to their convenicenal accessibility, and the global
          reach they offer.
        </p>
        <p>E-commerce website typically display products or services along 
           detaied descriptions, image, price, and any availability variations
           (e.g., size, colors). Each product usually has its own dedicated page
           with relevant information.
           </p>
      </div>
    </div>
  );
};
