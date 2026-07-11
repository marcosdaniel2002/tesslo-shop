import Title from "@/components/ui/Title";
import AddressForm from "./ui/AddressForm";
import { getCountries } from "@/actions/country/get-countries";
import { auth } from "@/auth";
import { getUserAddress } from "@/actions/address/get-user-address";

export default async function page() {
  const countries = await getCountries();

  const session = await auth();

  if (!session?.user) {
    return (
      <h3 className="text-foreground">
        No estas autenticado, inicia sesion para continuar con el proceso de
      </h3>
    );
  }

  const userAddress = (await getUserAddress(session.user.id)) ?? undefined;

  console.log({ userAddress });

  return (
    <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">
      <div className="w-full  xl:w-[1000px] flex flex-col justify-center text-left">
        <Title title="Dirección" subtitle="Dirección de entrega" />

        <AddressForm countries={countries} userStoredAddress={userAddress} />
      </div>
    </div>
  );
}
