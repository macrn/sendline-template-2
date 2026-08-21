import React, { useState } from 'react';
import { CheckoutProduct } from '../../types';
import { 
  X, 
  Sparkles, 
  Check, 
  CreditCard, 
  DollarSign, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Lock, 
  ExternalLink,
  Code,
  Globe,
  Copy
} from 'lucide-react';

interface ProductBuilderModalProps {
  product?: CheckoutProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: CheckoutProduct) => void;
}

export const ProductBuilderModal: React.FC<ProductBuilderModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState(product?.title || 'New Digital Product');
  const [slug, setSlug] = useState(product?.slug || 'new-product-pay');
  const [description, setDescription] = useState(product?.description || 'Instant download & access upon payment completion.');
  const [price, setPrice] = useState<number>(product?.price || 49);
  const [currency, setCurrency] = useState<CheckoutProduct['currency']>(product?.currency || 'USD');
  const [pricingType, setPricingType] = useState<CheckoutProduct['pricingType']>(product?.pricingType || 'one_time');
  const [category, setCategory] = useState<CheckoutProduct['category']>(product?.category || 'Digital Product');
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || 'https://images.unsplash.com/photo-1542744094-3a31727221eb?w=600&auto=format&fit=crop&q=80');
  const [accentColor, setAccentColor] = useState(product?.accentColor || '#0f172a');
  const [buttonText, setButtonText] = useState(product?.buttonText || 'Complete Payment');
  const [allowCouponCodes, setAllowCouponCodes] = useState(product?.allowCouponCodes ?? true);
  const [requireBillingAddress, setRequireBillingAddress] = useState(product?.requireBillingAddress ?? true);
  const [requirePhone, setRequirePhone] = useState(product?.requirePhone ?? false);
  const [features, setFeatures] = useState<string[]>(product?.features || [
    'Instant digital delivery to customer email',
    'Full commercial usage license included',
    '30-day money-back guarantee'
  ]);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'embed'>('details');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFeatures([...features, newFeatureText.trim()]);
    setNewFeatureText('');
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-') || 'pay-' + Date.now();
    const updatedProduct: CheckoutProduct = {
      id: product?.id || 'prod-' + Date.now(),
      title: title.trim() || 'Untitled Product',
      slug: cleanSlug,
      description: description.trim(),
      price: Number(price) || 1,
      currency,
      pricingType,
      category,
      status: 'Active',
      imageUrl,
      accentColor,
      buttonText: buttonText.trim() || `Pay $${price}`,
      features,
      totalSalesCount: product?.totalSalesCount || 0,
      totalRevenue: product?.totalRevenue || 0,
      hostedPayLinkUrl: `https://sendline.co/pay/${cleanSlug}`,
      allowCouponCodes,
      requireBillingAddress,
      requirePhone,
      createdAt: product?.createdAt || 'Just now'
    };
    onSave(updatedProduct);
    onClose();
  };

  const copyEmbed = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const buyButtonEmbed = `<!-- Sendline Stripe Buy Button -->
<a href="https://sendline.co/pay/${slug}" target="_blank" style="display:inline-flex; align-items:center; justify-content:center; padding:12px 24px; background:${accentColor}; color:#ffffff; font-weight:bold; border-radius:12px; text-decoration:none;">
  ${buttonText} — $${price}
</a>`;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150 font-sans text-left">
      <div className="w-full max-w-4xl bg-white border border-stone-200 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-4 h-4 text-stone-700" />
            <div>
              <h3 className="text-base font-semibold text-stone-900">
                {product ? 'Edit Payment Link / Checkout Product' : 'Create Stripe Payment Link'}
              </h3>
              <p className="text-xs text-stone-500">
                Processed through your connected Stripe account with automatic invoice and customer sync.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 border-b border-stone-200 bg-white flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'details' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-500'
            }`}
          >
            Product & Pricing Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('embed')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'embed' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-500'
            }`}
          >
            Embed Button & Hosted Link
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FAF8F5]">
          {activeTab === 'details' ? (
            <div className="max-w-2xl mx-auto space-y-6">
              
              {/* Product Info */}
              <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-4 shadow-xs">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">Basic Information</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Product Title *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (!product) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-xs font-medium text-stone-900 focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Slug / Permalink</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-xs font-mono text-stone-900 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-xs font-medium text-stone-900 cursor-pointer"
                  >
                    <option value="Digital Product">Digital Product (Download / eBook / UI Kit)</option>
                    <option value="Service / Consultation">Service / 1-on-1 Consultation</option>
                    <option value="Membership">Membership / Mastermind Community</option>
                    <option value="Course">Online Video Course</option>
                    <option value="Physical Good">Physical Good / Merch</option>
                  </select>
                </div>
              </div>

              {/* Pricing & Stripe Config */}
              <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">Pricing & Billing Interval</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Stripe Direct Processing
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Price Amount *</label>
                    <div className="relative">
                      <DollarSign className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        min="1"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-xs font-bold text-stone-900 focus:outline-none focus:border-stone-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-xs font-medium text-stone-900 cursor-pointer"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CAD">CAD ($)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Billing Model</label>
                    <select
                      value={pricingType}
                      onChange={(e) => setPricingType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-xs font-medium text-stone-900 cursor-pointer"
                    >
                      <option value="one_time">One-time payment</option>
                      <option value="recurring_monthly">Monthly Subscription</option>
                      <option value="recurring_annual">Annual Subscription</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 space-y-2">
                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allowCouponCodes}
                      onChange={(e) => setAllowCouponCodes(e.target.checked)}
                      className="rounded text-stone-900"
                    />
                    <span>Allow customer discount / coupon codes at checkout</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={requireBillingAddress}
                      onChange={(e) => setRequireBillingAddress(e.target.checked)}
                      className="rounded text-stone-900"
                    />
                    <span>Require billing address (Recommended for Stripe Radar fraud defense)</span>
                  </label>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-3 shadow-xs">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">Features & Deliverables List</h4>
                
                <div className="space-y-2">
                  {features.map((feat, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-stone-50 border border-stone-100 text-xs text-stone-800">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(); } }}
                    placeholder="e.g. 14 HD video walkthroughs included..."
                    className="flex-1 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium cursor-pointer"
                  >
                    Add Feature
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-6">
              
              {/* Standalone Hosted Pay Link */}
              <div className="p-6 rounded-xl bg-white border border-stone-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-sm font-semibold text-stone-900">Hosted Payment Link</h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Live Stripe Checkout
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-50 border border-stone-200 font-mono text-xs text-stone-800">
                  <span className="flex-1 truncate">https://sendline.co/pay/{slug || 'checkout-link'}</span>
                  <button
                    type="button"
                    onClick={() => copyEmbed(`https://sendline.co/pay/${slug}`, 'paylink')}
                    className="px-3 py-1 rounded bg-white hover:bg-stone-100 text-stone-800 text-xs font-medium border border-stone-200 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {copiedKey === 'paylink' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'paylink' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Buy Button Embed */}
              <div className="p-6 rounded-xl bg-white border border-stone-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-stone-700" />
                    <h4 className="text-sm font-semibold text-stone-900">Embeddable Buy Button Code</h4>
                  </div>
                  <span className="text-xs text-stone-400 font-mono">&lt;button&gt;</span>
                </div>
                <div className="relative">
                  <pre className="p-4 rounded-lg bg-stone-900 text-stone-100 text-xs font-mono overflow-x-auto">
                    {buyButtonEmbed}
                  </pre>
                  <button
                    type="button"
                    onClick={() => copyEmbed(buyButtonEmbed, 'buybtn')}
                    className="absolute top-3 right-3 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-white text-xs font-medium border border-stone-700 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {copiedKey === 'buybtn' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'buybtn' ? 'Copied' : 'Copy Snippet'}</span>
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-stone-200 flex items-center justify-between bg-white shrink-0">
          <div className="text-xs text-stone-500 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>0% platform fee • Standard Stripe interchange applies</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium shadow-xs cursor-pointer"
            >
              Save Payment Link
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
