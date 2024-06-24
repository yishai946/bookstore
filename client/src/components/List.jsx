import React from "react";

function List({ items, ItemComponent, funcs }) {
  return (
    <div>
      {items.map((item, index) => (
        <ItemComponent key={index} item={item} funcs={funcs} />
      ))}
    </div>
  );
}

export default List;
