import { Package, User as UserIcon, Truck, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function CustomerProfile() {
  // Mock customer orders representation
  const mockOrders = [
    {
      id: "DV-20231015-8492",
      date: "Oct 15, 2023",
      amount: 1059,
      status: "DELIVERED",
      items: [{ name: "DevVibe Core T-Shirt", size: "M", quantity: 1 }]
    },
    {
      id: "DV-20231102-1193",
      date: "Nov 02, 2023",
      amount: 2258,
      status: "PROCESSING",
      items: [{ name: "Drop Shoulder Aesthetic", size: "L", quantity: 2 }]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Customer Portal</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="col-span-1 space-y-4">
          <div className="bg-brand-paper border border-brand-card rounded-xl p-6 text-center">
            <div className="w-20 h-20 bg-brand-bg rounded-full border-2 border-brand-neon mx-auto mb-4 flex items-center justify-center text-brand-neon">
              <UserIcon size={32} />
            </div>
            <h2 className="text-lg font-bold text-white mb-1">Tushar</h2>
            <p className="text-sm text-brand-muted mb-4">hello@devvibe.com</p>
            <button className="text-brand-neon text-sm border border-brand-neon px-4 py-2 rounded font-medium hover:bg-brand-neon/10 transition-colors w-full">
              Edit Profile
            </button>
          </div>

          <div className="bg-brand-paper border border-brand-card rounded-xl overflow-hidden">
            <div className="p-4 border-b border-brand-card font-medium text-brand-text">Menu</div>
            <div className="flex flex-col">
              <div className="p-4 text-brand-neon bg-brand-bg/50 border-l-2 border-brand-neon flex items-center gap-3 font-medium">
                <Package size={18} /> Order History
              </div>
              <div className="p-4 text-brand-muted hover:text-white flex items-center gap-3 cursor-pointer transition-colors">
                <UserIcon size={18} /> Account Details
              </div>
            </div>
          </div>
        </div>

        {/* Orders Feed */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white mb-4 border-b border-brand-card pb-2">Recent Compiles (Orders)</h2>
          
          {mockOrders.map((order) => (
            <div key={order.id} className="bg-brand-paper border border-brand-card rounded-xl p-6 hover:border-brand-neon/50 transition-colors shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-card pb-4 mb-4 gap-4">
                <div>
                  <p className="text-brand-neon font-mono text-sm tracking-widest">{order.id}</p>
                  <p className="text-sm text-brand-muted mt-1">{order.date}</p>
                </div>
                <div className="flex items-center gap-2">
                   {order.status === "DELIVERED" ? (
                     <span className="bg-brand-neon/20 text-brand-neon px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-brand-neon/30">
                       <CheckCircle2 size={12} /> Delivered
                     </span>
                   ) : (
                     <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-yellow-500/30">
                       <Truck size={12} /> Processing
                     </span>
                   )}
                </div>
              </div>

              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3 text-white">
                      <span className="w-8 h-8 rounded bg-brand-bg flex items-center justify-center font-mono text-xs border border-brand-card">{item.quantity}x</span>
                      <span>{item.name}</span>
                      <span className="text-brand-muted font-mono bg-brand-bg px-1.5 rounded">{item.size}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-brand-card flex justify-between items-center cursor-default">
                 <p className="text-brand-text font-medium text-sm">Total Execution Time</p>
                 <p className="text-white font-bold tracking-tight">৳{order.amount}</p>
              </div>
            </div>
          ))}
          
          <div className="pt-4 flex justify-center">
             <Link href="/" className="text-brand-neon text-sm hover:underline hover:text-white transition-colors">
               Start New Compile (Shop)
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
