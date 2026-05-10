import Sidebar from "@/components/SideBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen overflow-y-auto">
        {children}
      </div>
    </div>
  );
}