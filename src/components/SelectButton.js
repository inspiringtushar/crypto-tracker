import React from "react";

const SelectButton = ({ children, onClick, selected }) => {
  const style = {
    border: "1px solid gold",
    borderRadius: "5px",
    padding: "10px 10px",
    margin: "5px 0px",
    backgroundColor: selected ? "gold" : "",
    color: selected ? "black" : "",
    fontFamily: "Montserrat",
    cursor: "pointer",
    fontWeight: selected ? "700" : "500",
  };
  return (
    <span style={style} onClick={onClick}>
      {children}
    </span>
  );
};

export default SelectButton;
