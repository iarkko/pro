import "./globals.css";
import Sidebar from "@/components/sidebar/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#070A12] text-white antialiased">
        <div className="flex min-h-screen">
          <Sidebar />

          <main className="flex-1 p-6 sm:p-8 lg:p-10 bg-gradient-to-b from-[#070A12] via-[#0b1020] to-[#121827]">
            <div className="mx-auto w-full max-w-[1600px]">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}