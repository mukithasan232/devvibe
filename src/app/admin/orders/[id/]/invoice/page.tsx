import prisma from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) notFound();

  return (
    <div className="bg-white min-h-screen p-8 text-slate-900 font-sans print:p-0">
      <div className="max-w-4xl mx-auto border border-slate-200 p-12 bg-white shadow-xl print:shadow-none print:border-none">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <div className="relative w-48 h-12 mb-4">
              <Image 
                src="/images/logo/DevVibe.png" 
                alt="DevVibe" 
                fill 
                className="object-contain object-left filter invert brightness-0" 
              />
            </div>
            <p className="text-sm text-slate-500 max-w-xs">
              Compiled for Comfort. <br />
              Premium Tech Apparel & Accessories. <br />
              Dhaka, Bangladesh.
            </p>
          </div>
          <div className="text-right">
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">Invoice</h1>
            <p className="font-mono text-xs text-slate-500 uppercase">#{order.serializedId}</p>
            <p className="text-sm text-slate-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-12 border-t border-slate-100 pt-12">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Bill To</h4>
            <div className="space-y-1">
              <p className="font-bold text-lg">{order.customerName}</p>
              <p className="text-slate-500 text-sm">{order.customerPhone}</p>
              <p className="text-slate-500 text-sm whitespace-pre-wrap">{order.customerAddress}</p>
            </div>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl h-fit">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Payment Details</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Method:</span>
                <span className="font-bold uppercase">{order.paymentMethod}</span>
              </div>
              {order.trxId && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Transaction ID:</span>
                  <span className="font-mono text-xs">{order.trxId}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-green-600 italic">PAID</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-left mb-12">
          <thead>
            <tr className="border-b-2 border-slate-900">
              <th className="py-4 text-xs font-black uppercase tracking-widest">Item Description</th>
              <th className="py-4 text-xs font-black uppercase tracking-widest text-center">Qty</th>
              <th className="py-4 text-xs font-black uppercase tracking-widest text-right">Unit Price</th>
              <th className="py-4 text-xs font-black uppercase tracking-widest text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="py-6">
                  <p className="font-bold text-slate-900">{item.product?.name || "Premium Product"}</p>
                  <p className="text-xs text-slate-500 uppercase font-mono mt-1">Size: {item.size}</p>
                </td>
                <td className="py-6 text-center text-sm">{item.quantity}</td>
                <td className="py-6 text-right text-sm">৳{item.price / item.quantity}</td>
                <td className="py-6 text-right font-bold text-slate-900">৳{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-12">
          <div className="w-64 space-y-4">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Subtotal:</span>
              <span>৳{order.totalAmount}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500">
              <span>Delivery Fee:</span>
              <span>৳0.00</span>
            </div>
            <div className="flex justify-between text-xl font-black border-t-2 border-slate-900 pt-4">
              <span>Total:</span>
              <span>৳{order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 pt-12 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Thank you for your business</p>
            <p className="text-[10px] text-slate-400 italic">This is a system generated invoice. For any queries, contact support@devvibe.com</p>
        </div>

      </div>
      
      {/* Print Controls (Visible only on screen) */}
      <div className="fixed bottom-8 right-8 print:hidden flex gap-4">
          <button 
            onClick={() => window.print()}
            className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
          >
              Download PDF / Print
          </button>
      </div>
    </div>
  );
}
