import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Zap, Check, Calendar, 
  ArrowRight, Download, AlertTriangle, RefreshCw, FileText
} from '../components/icons';
import apiClient from '../api/client';
import NavigationBar from '../components/NavigationBar';

const BillingPage = () => {
  const [usage, setUsage] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      const [usageRes, invoicesRes] = await Promise.all([
        apiClient.get('/users/me/usage'),
        apiClient.get('/users/me/invoices')
      ]);
      setUsage(usageRes.data);
      setInvoices(invoicesRes.data);
    } catch (err) {
      setError('Failed to load billing data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getUsageData = () => {
    if (!usage) return { qUsed: 0, qLimit: 100, dUsed: 0, dLimit: 10, sUsed: 0, sLimit: 100, plan: 'free' };
    return {
      qUsed: usage.queries_used ?? usage.queriesUsed ?? 0,
      qLimit: usage.queries_limit ?? usage.queriesLimit ?? 100,
      dUsed: usage.documents_used ?? usage.documentsUsed ?? 0,
      dLimit: usage.documents_limit ?? usage.documentsLimit ?? 10,
      sUsed: usage.storage_used_mb ?? usage.storageUsed ?? 0,
      sLimit: usage.storage_limit_mb ?? usage.storageLimit ?? 100,
      plan: usage.plan || 'free'
    };
  };

  const usagePercent = (used, limit) => {
    if (limit >= 999999 || limit === Infinity) return 0;
    return Math.min((used / (limit || 1)) * 100, 100);
  };

  const plans = [
    {
      id: 'free', name: 'Free', price: '$0', period: '/month',
      description: 'Get started with Cv-Insight RAG intelligence',
      features: ['100 queries / month', '10 document uploads', '100 MB vector storage', 'Standard AI models', 'Community support'],
      cta: 'Current Plan', disabled: true
    },
    {
      id: 'pro', name: 'Pro Specialist', price: '$19', period: '/month',
      description: 'Designed for active researchers & practitioners',
      features: ['2,000 queries / month', '100 document uploads', '5 GB vector storage', 'Priority deep-indexing', 'Custom model selection'],
      cta: 'Upgrade to Pro', disabled: false, highlighted: true
    },
    {
      id: 'team', name: 'Enterprise Team', price: '$49', period: '/user/month',
      description: 'Collaborative AI knowledge base for teams',
      features: ['Unlimited queries', 'Unlimited document storage', '50 GB shared storage', 'SSO & SAML Security', 'Dedicated vector cluster', '24/7 Priority Support'],
      cta: 'Contact Sales', disabled: false
    }
  ];

  const u = getUsageData();

  if (loading) {
    return (
      <div className="app-layout">
        <NavigationBar />
        <main className="main-content page-container">
          <div className="page-header-title">
            <h2 className="page-title">Usage & Subscription</h2>
            <p className="page-subtitle">Track resource quotas, select plans, and manage invoicing.</p>
          </div>
          <div className="billing-grid-container">
            <div className="glass-panel usage-card skeleton" style={{ height: 140 }} />
            <div className="glass-panel usage-card skeleton" style={{ height: 140 }} />
            <div className="glass-panel usage-card skeleton" style={{ height: 140 }} />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-layout">
        <NavigationBar />
        <main className="main-content page-container">
          <div className="glass-panel error-card-box">
            <AlertTriangle className="icon-lg text-danger" />
            <h3>Billing Data Unavailable</h3>
            <p>{error}</p>
            <button className="btn primary-btn mt-4" onClick={fetchBillingData}>
              <RefreshCw className="icon-sm" />
              <span>Retry Loading</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <NavigationBar />

      <main className="main-content page-container">
        {/* Page Header */}
        <div className="page-header-title">
          <h1 className="page-title">Usage & Subscription</h1>
          <p className="page-subtitle">
            Monitor real-time consumption limits, upgrade tier plans, and download past invoices.
          </p>
        </div>

        {/* Usage Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Queries Consumed', used: u.qUsed, limit: u.qLimit, unit: '', color: '#0052ff' },
            { label: 'Documents Indexed', used: u.dUsed, limit: u.dLimit, unit: '', color: '#05b169' },
            { label: 'Vector Storage', used: u.sUsed, limit: u.sLimit, unit: ' MB', color: '#f4b000' }
          ].map((m) => {
            const pct = usagePercent(m.used, m.limit);
            return (
              <div key={m.label} className="bg-white dark:bg-[#16181c] border border-[#dee1e6] dark:border-[#212327] rounded-[24px] p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#5b616e] dark:text-[#a8acb3]">{m.label}</span>
                  <span className="text-xs font-mono text-[#7c828a]">{Math.round(pct)}%</span>
                </div>
                <div className="text-2xl font-normal tracking-tight text-[#0a0b0d] dark:text-white">
                  <strong>{m.used}</strong>
                  <span className="text-base text-[#5b616e] dark:text-[#a8acb3]">
                    {m.unit} / {m.limit >= 999999 ? '∞' : `${m.limit}${m.unit}`}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[#eef0f3] dark:bg-[#212327] overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: m.color }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Subscription Tier Cards */}
        <div className="mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-normal tracking-tight text-[#0a0b0d] dark:text-white">Select Membership Plan</h2>
            <p className="text-sm text-[#5b616e] dark:text-[#a8acb3] mt-1">Scale vector indexing and model inference as your workflow expands.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {plans.map(p => {
              const isCurrent = u.plan === p.id;
              const isFeatured = p.highlighted;
              return (
                <div
                  key={p.id}
                  className={`rounded-[24px] p-8 flex flex-col justify-between gap-6 border transition-all duration-200
                    ${isFeatured
                      ? 'bg-[#0a0b0d] border-[#212327] text-white shadow-xl'
                      : 'bg-white dark:bg-[#16181c] border-[#dee1e6] dark:border-[#212327]'
                    }`}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className={`font-mono text-xs uppercase tracking-widest ${isFeatured ? 'text-[#a8acb3]' : 'text-[#5b616e] dark:text-[#a8acb3]'}`}>{p.name}</span>
                      {isFeatured && <span className="px-3 py-1 bg-[#0052ff] rounded-full text-xs font-mono text-white">Popular</span>}
                      {isCurrent && <span className="px-3 py-1 bg-[#05b169]/20 rounded-full text-xs font-mono text-[#05b169] border border-[#05b169]/30">Active</span>}
                    </div>

                    <div className="flex items-end gap-1">
                      <span className={`text-4xl font-normal tracking-tight ${isFeatured ? 'text-white' : 'text-[#0a0b0d] dark:text-white'}`}>{p.price}</span>
                      <span className={`text-sm mb-1.5 ${isFeatured ? 'text-[#7c828a]' : 'text-[#5b616e] dark:text-[#a8acb3]'}`}>{p.period}</span>
                    </div>

                    <p className={`text-sm leading-relaxed ${isFeatured ? 'text-[#a8acb3]' : 'text-[#5b616e] dark:text-[#a8acb3]'}`}>{p.description}</p>

                    <ul className="flex flex-col gap-2.5">
                      {p.features.map((f, i) => (
                        <li key={i} className={`flex items-center gap-2.5 text-sm ${isFeatured ? 'text-[#a8acb3]' : 'text-[#5b616e] dark:text-[#a8acb3]'}`}>
                          <Check className="w-4 h-4 flex-shrink-0 text-[#05b169]" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    className={`w-full h-11 rounded-full font-semibold text-sm transition-all duration-150 cursor-pointer disabled:cursor-default
                      ${isCurrent ? 'bg-[#eef0f3] dark:bg-[#212327] text-[#7c828a] cursor-default' :
                        isFeatured ? 'bg-[#0052ff] hover:bg-[#003ecc] text-white' :
                        'bg-[#0a0b0d] dark:bg-white hover:opacity-90 text-white dark:text-[#0a0b0d]'
                      }`}
                    disabled={isCurrent}
                    onClick={() => alert(`Upgrading to ${p.name} tier plan...`)}
                  >
                    {isCurrent ? 'Current Plan' : p.cta}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Invoice Statements Table */}
        {invoices.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-normal tracking-tight text-[#0a0b0d] dark:text-white mb-4">Invoice Statements</h2>
            <div className="bg-white dark:bg-[#16181c] border border-[#dee1e6] dark:border-[#212327] rounded-[24px] overflow-hidden">
              <div className="grid grid-cols-5 px-6 py-3 border-b border-[#dee1e6] dark:border-[#212327] text-xs font-mono uppercase tracking-wider text-[#5b616e] dark:text-[#a8acb3]">
                <span>Date</span>
                <span>Description</span>
                <span>Amount</span>
                <span>Status</span>
                <span className="text-right">Receipt</span>
              </div>
              {invoices.map(inv => (
                <div key={inv.id} className="grid grid-cols-5 px-6 py-4 border-b border-[#eef0f3] dark:border-[#212327] last:border-0 items-center text-sm text-[#0a0b0d] dark:text-white">
                  <span className="font-mono text-xs text-[#5b616e] dark:text-[#a8acb3]">{new Date(inv.date).toLocaleDateString()}</span>
                  <span>{inv.description}</span>
                  <span className="font-mono">{inv.amount}</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-mono inline-block w-fit ${
                    inv.status === 'paid' ? 'bg-[#05b169]/10 text-[#05b169] border border-[#05b169]/20' : 'bg-[#f4b000]/10 text-[#f4b000] border border-[#f4b000]/20'
                  }`}>{inv.status}</span>
                  <div className="text-right">
                    <button type="button" className="p-2 rounded-full hover:bg-[#f7f7f7] dark:hover:bg-[#212327] text-[#5b616e] dark:text-[#a8acb3] transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const UsageMetricCard = ({ icon, label, used, limit, percent, unit = '' }) => (
  <div className="glass-panel usage-metric-card">
    <div className="usage-metric-header">
      {icon}
      <span className="usage-metric-label">{label}</span>
    </div>
    <div className="usage-progress-track">
      <div 
        className="usage-progress-bar" 
        style={{ width: `${percent}%` }}
      />
    </div>
    <div className="usage-metric-footer">
      <span className="usage-value-text">
        <strong>{used}</strong>{unit} of {limit >= 999999 || limit === Infinity ? 'Unlimited' : `${limit}${unit}`}
      </span>
      <span className="usage-percent-text">{Math.round(percent)}%</span>
    </div>
  </div>
);

export default BillingPage;

