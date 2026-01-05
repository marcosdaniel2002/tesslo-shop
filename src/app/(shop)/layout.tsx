import Footer from "@/components/ui/Footer";
import SideBar from "@/components/ui/SideBar";
import TopMenu from "@/components/ui/TopMenu";

interface Props {
  children: React.ReactNode;
}

function layout({ children }: Props) {
  return (
    <main className="min-h-screen">
      <TopMenu />
      <SideBar />
      <div className="px-0 sm:px-5">{children}</div>
      <Footer />
    </main>
  );
}

export default layout;
