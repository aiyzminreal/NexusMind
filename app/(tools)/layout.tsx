import Navbar from "@/components/Navbar";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">{children}</main>
    </div>
  );
}
