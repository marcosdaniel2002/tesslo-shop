import { Size } from "@/seed/seed";

interface Props {
  selectedSize?: Size;
  availableSizes: Size[];
  onSizeChange: (size: Size) => void;
}

function SizeSelector({ availableSizes, selectedSize, onSizeChange }: Props) {
  return (
    <div className="my-5">
      <h3 className="font-bold mb-4">Tallas disponibles</h3>
      <div className="flex">
        {availableSizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeChange(size)}
            className={`mr-4 hover:underline text-lg rounded bg-gray-200 p-2.5 ${
              selectedSize == size && "underline !bg-blue-600 text-white"
            }`}
          >
            {size.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SizeSelector;
