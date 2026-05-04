import "./globals.css";
import Sidebar from "@/components/sidebar/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#070A12] text-white">

        <div className="flex min-h-screen">

          <Sidebar />

          {/* MAIN AREA */}
          <main className="flex-1 p-10 bg-gradient-to-b from-[#070A12] to-[#0B1020]">
            {children}
          </main>

        </div>

      </body>
    </html>
  );
}