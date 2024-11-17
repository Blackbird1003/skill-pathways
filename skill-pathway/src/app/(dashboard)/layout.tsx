import { Sidebar } from "./_components/sidebar";
import { Navbar } from "./_components/navbar";

const DashbordLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen">
      <div className="sticky z-50 h-[80px] w-full md:pl-56">
        <Navbar />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="md:pl-56 h-full">{children}</main>
    </div>
  );
};

export default DashbordLayout;
