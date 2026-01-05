"use client";

import { useState } from "react";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface Props {
  quantity: number;
}

function QuantitySelector({ quantity }: Props) {
  const [count, setCount] = useState(quantity);

  const onQuantityChange = function (value: number) {
    if (count + value === 0) return;
    setCount(count + value);
  };
  return (
    <div className="flex">
      <button onClick={() => onQuantityChange(-1)}>
        <IoRemoveCircleOutline size={30} />
      </button>
      <span className="w-20 mx-3 px-5 bg-gray-100 text-center rounded-sm flex items-center justify-center">
        {count}
      </span>
      <button onClick={() => onQuantityChange(+1)}>
        <IoAddCircleOutline size={30} />
      </button>
    </div>
  );
}

export default QuantitySelector;
