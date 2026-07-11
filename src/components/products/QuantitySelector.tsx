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
    <div className="flex items-center">
      <button
        onClick={() => onChange(-1)}
        className="text-foreground hover:text-accent transition-colors"
        aria-label="Restar cantidad"
      >
        <IoRemoveCircleOutline size={28} />
      </button>
      <span className="w-16 mx-3 py-2 bg-surface text-foreground font-semibold text-center rounded-notion shadow-sm flex items-center justify-center">
        {quantity}
      </span>
      <button
        onClick={() => onChange(+1)}
        className="text-foreground hover:text-accent transition-colors"
        aria-label="Sumar cantidad"
      >
        <IoAddCircleOutline size={28} />
      </button>
    </div>
  );
}

export default QuantitySelector;
