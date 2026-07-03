"use client";

import { createUpdateProduct } from "@/actions/products/create-update-product";
import { deleteProductImage } from "@/actions/products/delete-product-image";
import ProductImage from "@/app/(shop)/product/product-image/ProductImage";
import { Gender } from "@/generated/prisma/enums";
import { Category } from "@/interfaces/category.interface";
import { Product } from "@/interfaces/product.interfaces";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface Props {
  product: Product | null;
  categories: Category[];
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

interface FormInputs {
  title: string;
  slug: string;
  description: string;
  price: number;
  inStock: number;
  sizes: string[];
  tags: string; // camisa, t-shirt, ropa, hombre insertar como set
  gender: Gender;
  categoryId: string;

  // TODO: Images
  images?: FileList;
}

export const ProductForm = ({ product, categories }: Props) => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    watch,
  } = useForm<FormInputs>({
    defaultValues: {
      ...product,
      sizes: product?.sizes || [],
      tags: product?.tags?.join(", ") || "",
      images: undefined,
    },
  });

  watch("sizes"); // Para que se renderice cuando cambie

  async function onSubmit(data: FormInputs) {
    const formData = new FormData();

    const { images, ...productToSave } = data;
    if (product?.id) {
      formData.append("id", product?.id ?? "");
    }

    formData.append("title", productToSave.title);
    formData.append("slug", productToSave.slug);
    formData.append("description", productToSave.description);
    formData.append("price", productToSave.price.toString());
    formData.append("inStock", productToSave.inStock.toString());
    formData.append("sizes", productToSave.sizes.toString());
    formData.append("tags", productToSave.tags);
    formData.append("gender", productToSave.gender);
    formData.append("categoryId", productToSave.categoryId);

    if (images) {
      for (const image of Array.from(images)) {
        formData.append("images", image);
      }
    }

    const {
      resp,
      message,
      product: updatedProduct,
    } = await createUpdateProduct(formData);
    if (!resp) {
      alert("Producto no se pudo actualizar: " + message);
    }
    router.replace(`/admin/product/${updatedProduct?.slug}`);
  }

  function onSizeChange(size: string) {
    const sizes = getValues("sizes") || [];
    if (sizes.includes(size)) {
      setValue(
        "sizes",
        sizes.filter((s) => s !== size),
      );
    } else {
      setValue("sizes", [...sizes, size]);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3"
    >
      {/* Textos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Título</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register("title", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Slug</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register("slug", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Descripción</span>
          <textarea
            rows={5}
            className="p-2 border rounded-md bg-gray-200"
            {...register("description", { required: true })}
          ></textarea>
        </div>

        <div className="flex flex-col mb-2">
          <span>Price</span>
          <input
            type="number"
            className="p-2 border rounded-md bg-gray-200"
            {...register("price", { required: true, valueAsNumber: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Tags</span>
          <input
            type="text"
            className="p-2 border rounded-md bg-gray-200"
            {...register("tags", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <span>Gender</span>
          <select
            className="p-2 border rounded-md bg-gray-200"
            {...register("gender", { required: true })}
          >
            <option value="">[Seleccione]</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        <div className="flex flex-col mb-2">
          <span>Categoria</span>
          <select
            className="p-2 border rounded-md bg-gray-200"
            {...register("categoryId", { required: true })}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button className="btn-primary w-full">Guardar</button>
      </div>

      {/* Selector de tallas y fotos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Stock</span>
          <input
            type="number"
            className="p-2 border rounded-md bg-gray-200"
            {...register("inStock", { required: true, valueAsNumber: true })}
          />
        </div>
        {/* As checkboxes */}
        <div className="flex flex-col">
          <span>Tallas</span>
          <div className="flex flex-wrap">
            {sizes.map((size) => (
              <div
                key={size}
                className={`cursor-pointer flex items-center justify-center w-10 h-10 mr-2 border rounded-md ${getValues("sizes")?.includes(size) ? "bg-blue-500 text-white" : ""}`}
                onClick={() => onSizeChange(size)}
              >
                <span className="select-none">{size}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col mb-2 mt-3">
            <span>Fotos</span>
            <input
              type="file"
              {...register("images")}
              multiple
              className="p-2 border rounded-md bg-gray-200"
              accept="image/png, image/jpeg, image/avif"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {product?.ProductImage.map((image) => (
              <div key={image.id} className="relative">
                <ProductImage
                  src={`${image.url}`}
                  width={300}
                  height={300}
                  alt="Producto"
                  className="object-cover border rounded-md"
                />
                <button
                  onClick={() => deleteProductImage(image.id)}
                  type="button"
                  className="btn-danger w-full mt-2"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};
