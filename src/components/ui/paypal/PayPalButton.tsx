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

interface Props {
  orderId: string;
  amount: number;
}

function PayPalButton({ orderId, amount }: Props) {
  const [{ isPending }] = usePayPalScriptReducer();

  const roundedAmount = amount.toFixed(2);

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

  return <PayPalButtons createOrder={createOrder} onApprove={onApprove} />;
}

export default PayPalButton;
