import { Size } from "@/seed/seed";

interface Props {
  selectedSize?: Size;
  availableSizes: Size[];
  onSizeChange: (size: Size) => void;
}

function SizeSelector({ availableSizes, selectedSize, onSizeChange }: Props) {
  return (
    <div className="my-5">
      <h3 className="font-bold text-foreground mb-3">Tallas disponibles</h3>
      <div className="flex gap-2">
        {availableSizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeChange(size)}
            className={`text-sm font-semibold rounded-notion px-3 py-2 shadow-sm hover:shadow-md active:scale-[0.98] transition-all ${
              selectedSize == size
                ? "bg-accent text-black"
                : "bg-surface text-foreground"
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
