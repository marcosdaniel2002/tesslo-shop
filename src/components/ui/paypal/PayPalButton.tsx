"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
  CreateOrderData,
  CreateOrderActions,
  OnApproveData,
  OnApproveActions,
} from "@paypal/paypal-js";
import { setTransactionId } from "@/actions/payments/set-transaction-id";
import { paypalCheckPayment } from "@/actions/payments/paypal-payment";
import { IoInformationOutline, IoCopyOutline } from "react-icons/io5";
import { useState } from "react";

const SANDBOX_EMAIL = "sb-lgf2q51636632@personal.example.com";
const SANDBOX_PASSWORD = "gM'b!8Y.";

interface Props {
  orderId: string;
  amount: number;
}

function PayPalButton({ orderId, amount }: Props) {
  const [{ isPending }] = usePayPalScriptReducer();
  const [copied, setCopied] = useState<"email" | "password" | null>(null);

  const roundedAmount = amount.toFixed(2);

  const handleCopy = async (value: string, field: "email" | "password") => {
    await navigator.clipboard.writeText(value);
    setCopied(field);
    setTimeout(() => setCopied(null), 1500);
  };

  if (isPending) {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-300 h-11 w-full rounded"></div>
        <div className="bg-gray-300 h-11 w-full rounded mt-3 mb-12"></div>
      </div>
    );
  }

  async function createOrder(
    data: CreateOrderData,
    actions: CreateOrderActions,
  ): Promise<string> {
    const transactionId = await actions.order.create({
      intent: "CAPTURE",
      purchase_units: [
        {
          invoice_id: orderId,
          amount: {
            currency_code: "USD",
            value: roundedAmount.toString(),
          },
        },
      ],
    });

    // GUARDAR EL ID EN LA ORDEN DE LA BASE DE DATOS
    const resp = await setTransactionId(orderId, transactionId);
    if (!resp.resp) throw Error(resp.message);
    //

    return transactionId;
  }

  async function onApprove(
    data: OnApproveData,
    actions: OnApproveActions,
  ): Promise<void> {
    const details = await actions.order?.capture();
    if (!details) return;

    await paypalCheckPayment(details.id!);
  }

  return (
    <>
      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-notion shadow-sm flex items-start gap-3">
        <IoInformationOutline className="h-5 w-5 text-yellow-700 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-yellow-800">
          <p className="font-medium mb-2">
            Cuenta de pruebas de PayPal (sandbox). Úsala en la ventana emergente:
          </p>
          <button
            type="button"
            onClick={() => handleCopy(SANDBOX_EMAIL, "email")}
            className="flex items-center gap-2 font-mono text-xs bg-yellow-100 hover:bg-yellow-200 rounded px-2 py-1 mb-1.5 w-full text-left"
          >
            <IoCopyOutline className="flex-shrink-0" />
            <span className="font-sans font-semibold">Correo:</span> {SANDBOX_EMAIL}
            {copied === "email" && <span className="ml-auto italic">¡Copiado!</span>}
          </button>
          <button
            type="button"
            onClick={() => handleCopy(SANDBOX_PASSWORD, "password")}
            className="flex items-center gap-2 font-mono text-xs bg-yellow-100 hover:bg-yellow-200 rounded px-2 py-1 w-full text-left"
          >
            <IoCopyOutline className="flex-shrink-0" />
            <span className="font-sans font-semibold">Contraseña:</span> {SANDBOX_PASSWORD}
            {copied === "password" && <span className="ml-auto italic">¡Copiado!</span>}
          </button>
        </div>
      </div>
      <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
    </>
  );
}

export default PayPalButton;
