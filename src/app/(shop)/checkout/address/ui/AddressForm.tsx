"use client";

import { deleteUserAddress } from "@/actions/address/delete-user-address";
import { setUserAddress } from "@/actions/address/set-user-address";
import { Country } from "@/generated/prisma/client";
import { Address } from "@/interfaces/address.interface";
import { useAddressStore } from "@/store/address";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface FormInputs {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  rememberAddress: boolean;
}

interface Props {
  countries: Country[];
  userStoredAddress?: Partial<Address>;
}

function AddressForm({ countries, userStoredAddress }: Props) {
  const router = useRouter();
  const setAddress = useAddressStore((state) => state.setAddress);
  const address = useAddressStore((state) => state.address);
  const {
    handleSubmit,
    register,
    formState: { isValid },
    reset,
  } = useForm<FormInputs>({
    defaultValues: {
      // TODO
      ...userStoredAddress,
      rememberAddress: true,
    },
  });

  const { data: session } = useSession({ required: true });

  const onSubmit = async (data: FormInputs) => {
    const { rememberAddress: _rememberAddress, ...addressData } = data;
    setAddress(addressData);

    if (data.rememberAddress) {
      // SERVER ACTION
      await setUserAddress(addressData, session?.user.id || "");
    } else {
      // SERVER ACTION
      await deleteUserAddress(session?.user.id || "");
    }

    router.push("/checkout");
  };

  useEffect(() => {
    if (address.firstName) {
      reset(address);
    }
  }, [address, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2"
    >
      <div className="flex flex-col mb-2">
        <span className="text-sm text-muted mb-1">Nombres</span>
        <input type="text" className="input" {...register("firstName", { required: true })} />
      </div>

      <div className="flex flex-col mb-2">
        <span className="text-sm text-muted mb-1">Apellidos</span>
        <input type="text" className="input" {...register("lastName", { required: true })} />
      </div>

      <div className="flex flex-col mb-2">
        <span className="text-sm text-muted mb-1">Dirección</span>
        <input type="text" className="input" {...register("address", { required: true })} />
      </div>

      <div className="flex flex-col mb-2">
        <span className="text-sm text-muted mb-1">Dirección 2 (opcional)</span>
        <input type="text" className="input" {...register("address2")} />
      </div>

      <div className="flex flex-col mb-2">
        <span className="text-sm text-muted mb-1">Código postal</span>
        <input type="text" className="input" {...register("postalCode", { required: true })} />
      </div>

      <div className="flex flex-col mb-2">
        <span className="text-sm text-muted mb-1">Ciudad</span>
        <input type="text" className="input" {...register("city", { required: true })} />
      </div>

      <div className="flex flex-col mb-2">
        <span className="text-sm text-muted mb-1">País</span>
        <select className="input" {...register("country", { required: true })}>
          <option value="">[ Seleccione ]</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col mb-2">
        <span className="text-sm text-muted mb-1">Teléfono</span>
        <input type="text" className="input" {...register("phone", { required: true })} />
      </div>

      <div className="flex flex-col mb-2 sm:mt-1">
        <label
          htmlFor="checkbox"
          className="inline-flex items-center gap-2 mb-10 cursor-pointer text-foreground"
        >
          <input
            type="checkbox"
            id="checkbox"
            className="w-4 h-4 rounded accent-accent cursor-pointer"
            {...register("rememberAddress")}
          />
          <span>Recordar direccion?</span>
        </label>

        <button
          type="submit"
          className={`${isValid ? "btn-primary" : "btn-disabled"} flex w-full sm:w-1/2 justify-center`}
        >
          Siguiente
        </button>
      </div>
    </form>
  );
}

export default AddressForm;
