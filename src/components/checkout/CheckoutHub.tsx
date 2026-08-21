import React, { useState } from 'react';
import { CheckoutProduct, CheckoutOrder } from '../../types';
import { 
  Plus, 
  Search, 
  CreditCard, 
  DollarSign, 
  ExternalLink, 
  Copy, 
  Check, 
  Edit3, 
  Trash2, 
  ShoppingBag, 
  Sparkles, 
  Users, 
  ArrowUpRight, 
  CheckCircle2,
  Lock,
  Receipt,
  TrendingUp
} from 'lucide-react';
import { ProductBuilderModal } from './ProductBuilderModal';

interface CheckoutHubProps {
  products: CheckoutProduct[];
  orders: CheckoutOrder[];
  onSaveProduct: (product: CheckoutProduct) => void;
  onDeleteProduct: (productId: string) => void;
  onOpenPublicPay: (product: CheckoutProduct) => void;
  onOpenCommerceSettings?: () => void;
}

export const CheckoutHub: React.FC<CheckoutHubProps> = ({
  products,
  orders,
  onSaveProduct,
  onDeleteProduct,
  onOpenPublicPay,
  onOpenCommerceSettings
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<CheckoutProduct | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Metrics
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.amount, 0) + products.reduce((sum, p) => sum + p.totalRevenue, 0);
  const totalSalesCount = orders.length + products.reduce((sum, p) => sum + p.totalSalesCount, 0);
  const averageOrderValue = totalSalesCount > 0 ? (totalRevenue / totalSalesCount).toFixed(0) : '0';

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyLink = (slug: string) => {
    const url = `https://sendline.co/pay/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-left font-sans">
      
      {/* 1. Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-200 text-left">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">
              Checkout & Payment Links
            </h1>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Stripe Direct Connected
            </span>
          </div>
          <p className="text-sm text-stone-500 mt-1">
            Sell digital downloads, memberships, and consultation sessions with 1-click Stripe payment links and buy buttons.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto flex-wrap">
          {onOpenCommerceSettings && (
            <button
              onClick={onOpenCommerceSettings}
              className="px-3.5 py-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <CreditCard className="w-3.5 h-3.5 text-stone-500" />
              <span>Stripe Account</span>
            </button>
          )}

          <button
            id="checkout-header-create-btn"
            onClick={() => {
              setSelectedProduct(null);
              setIsBuilderOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-stone-300" />
            <span>Create Payment Link</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 KPI Metric Cards - Consistent Design */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 text-left">
        
        {/* KPI 1: Total Gross Volume */}
        <div className="p-3.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 transition-all group flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Total Gross Volume</span>
            <span className="p-1 rounded-md bg-stone-50 text-stone-600">
              <DollarSign className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-center justify-center flex-1 py-1">
            <div className="text-2xl font-semibold text-stone-900 font-sans tracking-tight">
              ${totalRevenue.toLocaleString()}
            </div>
          </div>
          <div className="flex items-center justify-center gap-1 text-emerald-700 text-xs font-normal pt-1 border-t border-stone-100">
            <ArrowUpRight className="w-3 h-3 text-emerald-600" />
            <span>+24.8% sales growth</span>
          </div>
        </div>

        {/* KPI 2: Total Orders Processed */}
        <div className="p-3.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 transition-all group flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Transactions</span>
            <span className="p-1 rounded-md bg-stone-50 text-stone-600">
              <ShoppingBag className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-center justify-center flex-1 py-1">
            <div className="text-2xl font-semibold text-stone-900 font-sans tracking-tight">
              {totalSalesCount.toLocaleString()}
            </div>
          </div>
          <div className="flex items-center justify-center gap-1 text-stone-400 text-xs font-normal pt-1 border-t border-stone-100">
            <span>Direct Stripe Settlement</span>
          </div>
        </div>

        {/* KPI 3: Average Order Value */}
        <div className="p-3.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 transition-all group flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Avg. Order Value</span>
            <span className="p-1 rounded-md bg-stone-50 text-stone-600">
              <TrendingUp className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-center justify-center flex-1 py-1">
            <div className="text-2xl font-semibold text-stone-900 font-sans tracking-tight">
              ${averageOrderValue}
            </div>
          </div>
          <div className="flex items-center justify-center gap-1 text-emerald-700 text-xs font-normal pt-1 border-t border-stone-100">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>High ticket ratio</span>
          </div>
        </div>

        {/* KPI 4: Active Payment Links */}
        <div className="p-3.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 transition-all group flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Active Pay Links</span>
            <span className="p-1 rounded-md bg-stone-50 text-stone-600">
              <Lock className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-center justify-center flex-1 py-1">
            <div className="text-2xl font-semibold text-stone-900 font-sans tracking-tight">
              {products.length}
            </div>
          </div>
          <div className="flex items-center justify-center gap-1 text-emerald-700 text-xs font-normal pt-1 border-t border-stone-100">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span>0% Platform Fee</span>
          </div>
        </div>

      </div>

      {/* 3. Main Container */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-5">
        
        {/* Nav Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-stone-100/80 border border-stone-200/80 overflow-x-auto">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Products & Links ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Orders & Payouts ({orders.length})</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products or paylinks..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* TAB 1: PRODUCTS LIST */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="p-4 sm:p-5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 transition-all flex flex-col justify-between space-y-4 shadow-2xs group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 uppercase">
                        {prod.category}
                      </span>
                      <h3 className="text-sm font-semibold text-stone-900 line-clamp-1">{prod.title}</h3>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-bold text-stone-900 font-mono">${prod.price}</span>
                      <span className="text-[10px] text-stone-400 block font-medium uppercase">
                        {prod.pricingType === 'one_time' ? 'One-time' : 'Per Month'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>

                  {/* Revenue / sales pill row */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-center">
                    <div className="p-1.5 rounded-lg bg-stone-50">
                      <span className="text-[10px] text-stone-400 block">Total Sales</span>
                      <strong className="text-xs font-mono font-bold text-stone-800">{prod.totalSalesCount} units</strong>
                    </div>
                    <div className="p-1.5 rounded-lg bg-stone-50">
                      <span className="text-[10px] text-stone-400 block">Gross Volume</span>
                      <strong className="text-xs font-mono font-bold text-emerald-700">${prod.totalRevenue.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopyLink(prod.slug)}
                      className="px-2.5 py-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                      title="Copy hosted pay link"
                    >
                      {copiedSlug === prod.slug ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-stone-500" />
                      )}
                      <span>{copiedSlug === prod.slug ? 'Copied' : 'Link'}</span>
                    </button>

                    <button
                      onClick={() => onOpenPublicPay(prod)}
                      className="px-2.5 py-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                      title="Open live pay checkout"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
                      <span>Live</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setSelectedProduct(prod);
                        setIsBuilderOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                      title="Edit product details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeleteProduct(prod.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: ORDERS LIST */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Product Purchased</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Stripe Intent</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-sans">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-stone-950">{ord.customerName}</div>
                        <div className="text-stone-500 text-[11px] font-mono">{ord.customerEmail}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-stone-800">
                        {ord.productTitle}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-stone-950">
                        ${ord.amount} USD
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-stone-500">
                        {ord.stripePaymentIntentId}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-stone-400 font-mono text-[11px]">
                        {ord.createdAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Product Builder Modal */}
      {isBuilderOpen && (
        <ProductBuilderModal
          product={selectedProduct}
          isOpen={isBuilderOpen}
          onClose={() => setIsBuilderOpen(false)}
          onSave={onSaveProduct}
        />
      )}

    </div>
  );
};
