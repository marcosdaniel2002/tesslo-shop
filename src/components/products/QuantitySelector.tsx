"use client";

import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface Props {
  quantity: number;
  onQuantityChange: (value: number) => void;
}

function QuantitySelector({ quantity, onQuantityChange }: Props) {
  const onChange = function (value: number) {
    if (quantity + value === 0) return;
    onQuantityChange(quantity + value);
  };

  return (
    <div className="flex">
      <button onClick={() => onChange(-1)}>
        <IoRemoveCircleOutline size={30} />
      </button>
      <span className="w-20 mx-3 px-5 bg-gray-100 text-center rounded-sm flex items-center justify-center">
        {quantity}
      </span>
      <button onClick={() => onChange(+1)}>
        <IoAddCircleOutline size={30} />
      </button>
    </div>
  );
}

export default QuantitySelector;
