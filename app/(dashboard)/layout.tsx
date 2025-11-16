import Sidebar from "@/components/layout/sidebar"
import Header from "@/components/layout/header"
import "../globals.css"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

