import { auth } from "@lib/auth";
import PaymentDetails from "../components/PaymentDetails";
import getPaymentsHistory from "@lib/patient/get-payments-history";

export default async function PaymentHistory() {
  const session = await auth();
  const response = await getPaymentsHistory(session?.user.id);

  return (
    <section className="md:h-full md:w-full flex flex-col gap-5 items-center overflow-hidden">
      <PaymentDetails paymentHistory={response} />
    </section>
  );
}
