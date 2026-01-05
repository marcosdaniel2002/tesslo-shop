import { Size } from "@/seed/seed";
import { Span } from "next/dist/trace";

interface Props {
  selectedSize: Size;
  availableSizes: Size[];
}

function SizeSelector({ availableSizes, selectedSize }: Props) {
  return (
    <div className="my-5">
      <h3 className="font-bold mb-4">Tallas disponibles</h3>
      <div className="flex">
        {availableSizes.map((size) => (
          <button
            key={size}
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
