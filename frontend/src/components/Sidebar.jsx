import React from "react";

const Sidebar = ({ handleClick }) => {
  const menu = ["Savings", "Transactions", "Investments", "Loans", "Insurance"];
  return (
    <div className="w-96 border h-full flex flex-col gap-10 text-center py-8 px-4">
      <h1>Finance App</h1>
      <div className="flex flex-col gap-5">
        {menu.map((item, index) => {
          return (
            <span
              key={index}
              onClick={() => handleClick(item)}
              className="p-2 text-lg border"
            >
              {item}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
