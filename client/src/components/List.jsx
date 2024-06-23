import React from "react";

function List({ items, ItemComponent }) {
  return (
    <div>
      {items.map((item, index) => (
        <ItemComponent key={index} item={item} />
      ))}
    </div>
  );
}

export default List;
