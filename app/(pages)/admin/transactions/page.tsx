import { getSession } from "@lib/auth/get-session";
import Transactions from "../components/Transactions";
import getTransactions from "@lib/admin/get-transactions";

export default async function TransactionsPage() {
  const session = await getSession();
  const transactions = await getTransactions(session?.user?.id);

  return <Transactions transactions={transactions} />;
}
