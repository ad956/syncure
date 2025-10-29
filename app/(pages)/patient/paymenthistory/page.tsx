"use client";

import PaymentDetails from "../components/PaymentDetails";
import { usePaymentHistory } from "@hooks/usePaymentHistory";
import SpinnerLoader from "@components/SpinnerLoader";

export default function PaymentHistory() {
  const { paymentHistory, isLoading } = usePaymentHistory();

  if (isLoading) {
    return <SpinnerLoader />;
  }

  return (
    <section className="md:h-full md:w-full flex flex-col gap-5 items-center overflow-hidden">
      <PaymentDetails paymentHistory={paymentHistory} />
    </section>
  );
}
