import React from "react";
import "../styling/footer.css";
import unicine from "../pictures/unicine.png";

export default function Footer() {
  return (
    <>
      <div className="title-2"></div>
      <div className="bg">
        <img src={unicine} alt="unicine" />
        <div class="container-footer">
          <p>
            &copy; 2024{" "}
            <a className="link" href="https://github.com/BeSomi22">
              BeSomi22
            </a>{" "}
            UniCine
          </p>
        </div>
      </div>
    </>
  );
}
