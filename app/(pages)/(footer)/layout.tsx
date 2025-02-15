import { Footer, NavBar } from "@components/LandingPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syncure Support Links",
  description:
    "The page contains support links for Syncure which is a modern healthcare platform designed to streamline patient management and monitoring across multiple hospitals.",
};

export default function FooterLinksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="h-[80vh]">
      <NavBar />
      <main className="h-full">{children}</main>
      <Footer />
    </section>
  );
}
