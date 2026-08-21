import React, { useState } from 'react';
import { CheckoutProduct, CheckoutOrder } from '../../types';
import { 
  Check, 
  CreditCard, 
  Lock, 
  ShieldCheck, 
  ArrowLeft, 
  ShoppingBag, 
  Sparkles, 
  Tag, 
  CheckCircle2 
} from 'lucide-react';

interface PublicHostedCheckoutProps {
  product: CheckoutProduct;
  onBackToApp?: () => void;
  onPaymentSuccess?: (order: CheckoutOrder) => void;
}

export const PublicHostedCheckout: React.FC<PublicHostedCheckoutProps> = ({
  product,
  onBackToApp,
  onPaymentSuccess
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [billingAddress, setBillingAddress] = useState('742 Evergreen Terrace, San Francisco, CA');
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const finalPrice = discountApplied ? Math.round(product.price * 0.8) : product.price;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'VIP20' || couponCode.trim().toUpperCase() === 'SAVE20') {
      setDiscountApplied(true);
    }
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);

      const newOrder: CheckoutOrder = {
        id: 'ord-' + Math.floor(1000 + Math.random() * 9000),
        productId: product.id,
        productTitle: product.title,
        customerName: customerName.trim() || 'Verified Customer',
        customerEmail: customerEmail.trim() || 'customer@atelier.io',
        amount: finalPrice,
        currency: product.currency,
        status: 'Paid',
        stripePaymentIntentId: 'pi_3P9x' + Date.now().toString().slice(-8),
        createdAt: 'Just now'
      };

      if (onPaymentSuccess) {
        onPaymentSuccess(newOrder);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between font-sans text-stone-900 selection:bg-stone-200">
      
      {/* Top Banner for Admin */}
      {onBackToApp && (
        <div className="bg-stone-900 text-stone-300 text-xs px-4 py-2 flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono">Live Hosted Checkout: sendline.co/pay/{product.slug}</span>
          </div>
          <button
            onClick={onBackToApp}
            className="flex items-center gap-1 text-white hover:text-stone-300 font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Workspace</span>
          </button>
        </div>
      )}

      {/* Main 2-Column Split Checkout */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl bg-white border border-stone-200/90 rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Left Column: Product Summary & Features */}
          <div className="md:col-span-5 bg-stone-50/70 p-6 sm:p-8 border-b md:border-b-0 md:border-r border-stone-200 space-y-6 text-left">
            <div className="space-y-4">
              <div className="aspect-16/10 rounded-xl overflow-hidden border border-stone-200/80 shadow-xs">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-stone-200/70 text-stone-700 uppercase">
                  {product.category}
                </span>
                <h1 className="text-xl font-extrabold text-stone-950 tracking-tight mt-1">
                  {product.title}
                </h1>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Pricing Display */}
              <div className="p-4 rounded-xl bg-white border border-stone-200/80 space-y-1">
                <div className="text-xs text-stone-400 uppercase font-semibold">Total Amount</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-stone-950 font-mono">
                    ${finalPrice}
                  </span>
                  <span className="text-xs text-stone-500 font-medium uppercase">
                    {product.currency} {product.pricingType === 'recurring_monthly' ? '/ month' : ''}
                  </span>
                </div>
                {discountApplied && (
                  <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1 pt-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>20% VIP discount code applied</span>
                  </div>
                )}
              </div>

              {/* Feature list */}
              <div className="space-y-2.5 pt-2">
                <div className="text-xs font-semibold text-stone-700 uppercase tracking-wider text-[11px]">
                  What&apos;s Included
                </div>
                {product.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-stone-600 leading-snug">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Stripe Payment Form */}
          <div className="md:col-span-7 p-6 sm:p-8 space-y-6 text-left">
            {isPaid ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-stone-950">Payment Successful!</h3>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                    A confirmation receipt and instant access link have been dispatched to <strong>{customerEmail || 'your email'}</strong>.
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPaid(false);
                      setCustomerName('');
                      setCustomerEmail('');
                    }}
                    className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold cursor-pointer"
                  >
                    Test Another Checkout
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePay} className="space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="text-sm font-bold text-stone-950">Express Stripe Checkout</h3>
                  <div className="flex items-center gap-1.5 text-xs text-stone-400">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-mono text-[11px]">256-bit Encrypted</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Elena Rostova"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900 bg-stone-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Email for Receipt & Access</label>
                    <input
                      type="email"
                      required
                      placeholder="elena@atelier.io"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900 bg-stone-50/50"
                    />
                  </div>

                  {/* Card Element Box */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Card Details (Stripe Elements)</label>
                    <div className="p-3 rounded-lg border border-stone-200 bg-stone-50/50 space-y-2">
                      <div className="relative">
                        <CreditCard className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="Card Number"
                          className="w-full pl-9 pr-3 py-1.5 rounded border border-stone-200 text-xs text-stone-900 font-mono bg-white focus:outline-none focus:border-stone-900"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          value={cardExp}
                          onChange={(e) => setCardExp(e.target.value)}
                          placeholder="MM / YY"
                          className="w-full px-3 py-1.5 rounded border border-stone-200 text-xs text-stone-900 font-mono bg-white focus:outline-none focus:border-stone-900"
                        />
                        <input
                          type="text"
                          required
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="CVC"
                          className="w-full px-3 py-1.5 rounded border border-stone-200 text-xs text-stone-900 font-mono bg-white focus:outline-none focus:border-stone-900"
                        />
                      </div>
                    </div>
                  </div>

                  {product.requireBillingAddress && (
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Billing Address</label>
                      <input
                        type="text"
                        required
                        value={billingAddress}
                        onChange={(e) => setBillingAddress(e.target.value)}
                        placeholder="Street, City, State, ZIP"
                        className="w-full px-3 py-2 rounded-lg border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900 bg-stone-50/50"
                      />
                    </div>
                  )}

                  {product.allowCouponCodes && (
                    <div className="pt-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Promo code (e.g. VIP20)"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 text-xs uppercase font-mono text-stone-900 bg-stone-50/50"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className={`w-full py-3 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      isProcessing ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isProcessing ? (
                      <span>Processing charge on Stripe...</span>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Pay ${finalPrice} USD</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[10px] text-center text-stone-400 pt-1">
                  Guaranteed safe checkout powered by Stripe Radar fraud protection.
                </p>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-stone-400 border-t border-stone-200/60 bg-white/50">
        <div className="flex items-center justify-center gap-1.5">
          <span>Powered by</span>
          <strong className="text-stone-700 font-bold tracking-tight">Sendline Commerce & Stripe</strong>
        </div>
      </footer>

    </div>
  );
};
