import Sidebar from "@/components/Sidebar";
import { UserSessionProvider } from "@/context/useSessionContext";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserSessionProvider>
      <main className="flex h-screen w-full font-inter">
        <Sidebar />
        <div className="flex size-full flex-col">{children}</div>
      </main>
    </UserSessionProvider>
  );
}
