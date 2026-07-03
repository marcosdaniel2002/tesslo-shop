import Image from "next/image";

interface Props {
  src?: string;
  width?: number;
  height?: number;
  alt?: string;
  className?: React.StyleHTMLAttributes<HTMLImageElement>["className"];
  fill?: boolean;
}

function ProductImage({ src, width, height, alt, className, fill }: Props) {
  const localSrc =
    src && src !== "undefined"
      ? src.startsWith("http")
        ? src
        : `/products/${src}`
      : "/imgs/placeholder.jpg";

  return (
    <Image
      src={localSrc}
      className={className}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      alt={alt ?? "Imagen del producto"}
    />
  );
}

export default ProductImage;
