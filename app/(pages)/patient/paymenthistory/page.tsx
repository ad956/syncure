import PaymentDetails from "../components/PaymentDetails";
import getPaymentsHistory from "@lib/patient/get-payments-history";

export default async function PaymentHistory() {
  const response = await getPaymentsHistory();

  return (
    <section className="md:h-full md:w-full flex flex-col gap-5 items-center overflow-hidden">
      <PaymentDetails paymentHistory={response} />
    </section>
  );
}
