import prisma from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  size: string;
  product: {
    name: string;
  } | null;
}

export default async function PublicInvoicePage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findFirst({
    where: { 
      OR: [
        { id: params.id },
        { serializedId: params.id }
      ]
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true
            }
          },
        },
      },
    },
  });

  if (!order) notFound();

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8 text-slate-900 font-sans">
      <div className="max-w-4xl mx-auto border border-slate-200 p-6 sm:p-12 bg-white shadow-2xl rounded-[32px] print:shadow-none print:border-none print:p-0">
        
        <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-12">
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
          <div className="text-left sm:text-right">
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">Invoice</h1>
            <p className="font-mono text-xs text-slate-500 uppercase">#{order.serializedId}</p>
            <p className="text-sm text-slate-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 mb-12 border-t border-slate-100 pt-12">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Customer Details</h4>
            <div className="space-y-1">
              <p className="font-bold text-lg">{order.customerName}</p>
              <p className="text-slate-500 text-sm">{order.customerPhone}</p>
              <p className="text-slate-500 text-sm whitespace-pre-wrap">{order.customerAddress}</p>
            </div>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl h-fit">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Order Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Method:</span>
                <span className="font-bold uppercase">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-slate-200 pt-2 mt-2">
                <span className="text-slate-500">Total Status:</span>
                <span className="font-black text-slate-900 italic">PAID / ৳{order.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left mb-12">
            <thead>
                <tr className="border-b-2 border-slate-900">
                <th className="py-4 text-xs font-black uppercase tracking-widest">Item Description</th>
                <th className="py-4 text-xs font-black uppercase tracking-widest text-center">Qty</th>
                <th className="py-4 text-xs font-black uppercase tracking-widest text-right">Price</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {(order.items as unknown as OrderItem[]).map((itm) => (
                <tr key={itm.id}>
                    <td className="py-6">
                    <p className="font-bold text-slate-900">{itm.product?.name || "Premium DevVibe Apparel"}</p>
                    <p className="text-xs text-slate-500 uppercase font-mono mt-1">Size: {itm.size}</p>
                    </td>
                    <td className="py-6 text-center text-sm">{itm.quantity}</td>
                    <td className="py-6 text-right font-bold text-slate-900">৳{itm.price}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>

        <div className="border-t border-slate-100 pt-12 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Thank you for choosing DevVibe</p>
            <p className="text-[10px] text-slate-400 italic">This is an official transaction record. For support, contact us at devvibebd@gmail.com</p>
        </div>

      </div>
      
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 print:hidden z-50">
          <button 
            onClick={() => window.print()}
            className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
          >
              <Download size={20} /> Download Invoice
          </button>
      </div>
    </div>
  );
}
