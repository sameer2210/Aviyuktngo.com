import { ChevronDownIcon } from '@heroicons/react/solid';
import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SkeletonImage from '../Components/SkeletonImage';
import { useAuth } from '../context/useAuth';
import axios from '../instant/axios';

const faqs = [
  {
    question: 'How is my donation used?',
    answer: 'Your donation directly supports the cause you select, ensuring maximum impact.',
  },
  {
    question: 'Is my donation tax-deductible?',
    answer: 'Yes, all donations are eligible for tax deductions under Section 80G.',
  },
  {
    question: 'Can I donate anonymously?',
    answer: 'Absolutely! You can choose to keep your identity confidential.',
  },
];

const Highlights = () => {
  const highlightsBackgroundSrc =
    'https://res.cloudinary.com/dc2geexnf/image/upload/v1775721910/WhatsApp_Image3_2026-04-09_at_11.12.19_AM_wmhsdo.jpg';
  const highlightsBackgroundFallbackSrc =
    'https://res.cloudinary.com/dc2geexnf/image/upload/v1775721852/WhatsApp_Image_2026-04-09_at_11.12.18_AM_eorwl1.jpg';

  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const receiptRef = useRef(null);
  const [formType, setFormType] = useState('donor');
  const [form, setForm] = useState({
    amount: '',
    name: '',
    email: '',
    adhar: '',
    address: '',
    occupation: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    gender: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [paymentMessage, setPaymentMessage] = useState({ type: '', text: '' });
  const [paymentClip, setPaymentClip] = useState(null);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [isDownloadingReceipt, setIsDownloadingReceipt] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!form.name.trim()) {
      errors.name = 'Required';
      isValid = false;
    }
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = 'Valid email required';
      isValid = false;
    }
    if (!form.adhar || form.adhar.length !== 12) {
      errors.adhar = '12 digits required';
      isValid = false;
    }

    if (formType === 'donor') {
      if (!form.amount || Number(form.amount) <= 0) {
        errors.amount = 'Must be > 0';
        isValid = false;
      }
      if (!form.address.trim()) {
        errors.address = 'Required';
        isValid = false;
      }
    }

    if (formType === 'member') {
      if (!form.occupation.trim()) {
        errors.occupation = 'Required';
        isValid = false;
      }
      if (!form.street.trim()) {
        errors.street = 'Required';
        isValid = false;
      }
      if (!form.city.trim()) {
        errors.city = 'Required';
        isValid = false;
      }
      if (!form.state.trim()) {
        errors.state = 'Required';
        isValid = false;
      }
      if (!form.pincode || form.pincode.length !== 6) {
        errors.pincode = '6 digits';
        isValid = false;
      }
      if (!form.gender.trim()) {
        errors.gender = 'Required';
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const loadRazorpayScript = () =>
    new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => reject(false);
      document.body.appendChild(script);
    });

  const handleSubmit = async e => {
    e.preventDefault();
    setPaymentMessage({ type: '', text: '' });

    if (!validateForm()) return;

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setPaymentMessage({ type: 'error', text: 'Razorpay SDK failed to load.' });
      return;
    }

    try {
      const payload = {
        ...form,
        amount: formType === 'member' ? 1200 : form.amount,
        formType,
      };

      const res = await axios.post('/razorpay/paymentcreate', payload);
      const { id, amount, currency } = res.data.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID?.trim(),
        amount: amount.toString(),
        currency,
        name: 'Aviyukt NGO',
        description: formType === 'member' ? 'Membership Payment' : 'Donation Payment',
        image: '/logo.png',
        order_id: id,
        handler: async function (response) {
          try {
            await axios.post('/razorpay/paymentverify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            setPaymentClip({
              ...payload,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              message: '✅ Payment successful!',
            });

            setPaymentMessage({ type: 'success', text: '✅ Payment verified successfully!' });
          } catch {
            setPaymentMessage({ type: 'error', text: '❌ Payment verification failed.' });
          }
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: '0000000000',
        },
        notes: {
          address: form.address || `${form.street}, ${form.city}, ${form.state}, ${form.pincode}`,
          occupation: form.occupation || '',
          gender: form.gender || '',
        },
        theme: {
          color: '#1a1a1a',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setPaymentMessage({ type: 'error', text: '❌ Payment creation failed.' });
    }
  };

  const toggleForm = type => {
    setFormType(type);
    setFormErrors({});
    setPaymentClip(null);
    setPaymentMessage({ type: '', text: '' });
    setForm({
      amount: type === 'member' ? '1200' : '',
      name: '',
      email: '',
      adhar: '',
      address: '',
      occupation: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      gender: '',
    });
  };

  const handleDownloadReceipt = async () => {
    if (!receiptRef.current || !paymentClip) return;
    setIsDownloadingReceipt(true);

    try {
      const [{ default: html2canvas }, jsPdfModule] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);
      const jsPDF = jsPdfModule.jsPDF || jsPdfModule.default;

      if (!jsPDF) {
        throw new Error('jsPDF failed to load');
      }

      const receiptElement = receiptRef.current;
      const canvas = await html2canvas(receiptElement, {
        scale: Math.max(window.devicePixelRatio || 1, 2),
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: clonedDocument => {
          const clonedEl = clonedDocument.getElementById('aviyukt-receipt');
          if (clonedEl) {
            const btn = clonedEl.querySelector('#receipt-download-btn');
            if (btn) btn.style.display = 'none';
          }
        },
      });

      const imageData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const scale = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
      const renderWidth = canvas.width * scale;
      const renderHeight = canvas.height * scale;
      const x = (pageWidth - renderWidth) / 2;
      const y = (pageHeight - renderHeight) / 2;

      pdf.addImage(imageData, 'PNG', x, y, renderWidth, renderHeight, undefined, 'FAST');
      pdf.save(`aviyukt-receipt-${paymentClip.orderId || Date.now()}.pdf`);
    } catch (error) {
      console.error('Receipt download error:', error);
      setPaymentMessage({ type: 'error', text: '❌ Failed to generate receipt PDF.' });
    } finally {
      setIsDownloadingReceipt(false);
    }
  };

  const receiptRows = paymentClip
    ? [
        { label: 'Full Name', value: paymentClip.name },
        { label: 'Email Address', value: paymentClip.email },
        { label: 'Aadhar Number', value: paymentClip.adhar },
        ...(formType === 'donor'
          ? [{ label: 'Address', value: paymentClip.address }]
          : [
              { label: 'Occupation', value: paymentClip.occupation },
              { label: 'Gender', value: paymentClip.gender },
              {
                label: 'Address',
                value: `${paymentClip.street}, ${paymentClip.city}, ${paymentClip.state} - ${paymentClip.pincode}`,
              },
            ]),
        { label: 'Payment ID', value: paymentClip.paymentId },
        { label: 'Order ID', value: paymentClip.orderId },
      ]
    : [];

  return (
    <div className="font-sans min-h-screen flex flex-col relative w-full bg-[#10141c]">
      {/* Immersive Background Image */}
      <SkeletonImage
        src={highlightsBackgroundSrc}
        fallbackSrc={highlightsBackgroundFallbackSrc}
        maxRetries={2}
        alt="Highlights page background"
        loading="eager"
        fetchPriority="high"
        wrapperClassName="fixed inset-0 h-full w-full z-0"
        className="h-full w-full object-cover brightness-[0.72] saturate-[1.08]"
        skeletonClassName="from-[#1d2533] via-[#273247] to-[#1a2130]"
        errorClassName="bg-[#1b2230] text-[#dbe4f7]"
      />
      <div aria-hidden className="fixed inset-0 z-0 bg-black/35" />

      {/* Main Container */}
      <div className="relative z-10 w-full min-h-screen flex flex-col pt-28 pb-16 px-4 items-center justify-start">

        {/* Toggle Form Type */}
        <div className="flex gap-4 mb-10 w-full max-w-sm">
          <button
            className={`flex-1 py-3 border border-white/20 uppercase tracking-widest text-xs font-bold transition-all duration-300 backdrop-blur-md rounded-none ${
              formType === 'donor' ? 'bg-[#f4efe4] text-black' : 'bg-transparent text-white/80 hover:bg-white/10'
            }`}
            onClick={() => toggleForm('donor')}
          >
            Donation
          </button>
          <button
            className={`flex-1 py-3 border border-white/20 uppercase tracking-widest text-xs font-bold transition-all duration-300 backdrop-blur-md rounded-none ${
              formType === 'member' ? 'bg-[#f4efe4] text-black' : 'bg-transparent text-white/80 hover:bg-white/10'
            }`}
            onClick={() => toggleForm('member')}
          >
            Membership
          </button>
        </div>

        {/* Vintage Scalloped Card */}
        <div className="relative w-full max-w-2xl bg-[#f4efe4] rounded-sm shadow-2xl p-8 md:p-14 text-[#2b2b29] mt-6">
          
          {/* Custom SVG Scalloped Top Edge */}
          <div className="absolute left-0 right-0 -top-[14px] h-[15px] overflow-hidden">
            <div 
              className="w-full h-[15px]" 
              style={{
                backgroundImage: 'radial-gradient(15px 15px at 15px 15px, transparent 15px, #f4efe4 15px)',
                backgroundSize: '30px 15px',
                backgroundPosition: '-15px 0px'
              }}
            />
          </div>

          <h2 className="text-3xl md:text-5xl font-serif font-black uppercase text-center tracking-tight mb-10">
            {formType === 'donor' ? 'Make a Donation' : 'Become a Member'}
          </h2>

          {!isAuthenticated ? (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-xl font-serif text-center mb-8 text-[#2b2b29]">
                Please log in to {formType === 'donor' ? 'make a donation' : 'become a member'}.
              </p>
              <button
                onClick={() => navigate('/auth', { state: { from: location } })}
                className="w-full sm:w-auto bg-[#2b2b29] text-[#f4efe4] px-10 py-4 uppercase tracking-widest text-sm font-bold shadow hover:bg-black transition-colors"
              >
                Log In to Continue
              </button>
            </div>
          ) : !paymentClip ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
                {/* Name */}
                <div className="relative flex flex-col">
                  <label className="font-serif font-bold text-sm mb-1 uppercase tracking-wide">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full bg-transparent border-0 border-b-2 border-gray-300/60 outline-none px-0 py-2 focus:ring-0 focus:border-[#2b2b29] transition-colors placeholder:text-gray-400 font-sans text-sm"
                  />
                  {formErrors.name && <p className="absolute -bottom-5 text-red-600 text-xs">{formErrors.name}</p>}
                </div>

                {/* Email */}
                <div className="relative flex flex-col">
                  <label className="font-serif font-bold text-sm mb-1 uppercase tracking-wide">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="adresse@email.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-transparent border-0 border-b-2 border-gray-300/60 outline-none px-0 py-2 focus:ring-0 focus:border-[#2b2b29] transition-colors placeholder:text-gray-400 font-sans text-sm"
                  />
                  {formErrors.email && <p className="absolute -bottom-5 text-red-600 text-xs">{formErrors.email}</p>}
                </div>

                {/* Aadhar */}
                <div className="relative flex flex-col">
                  <label className="font-serif font-bold text-sm mb-1 uppercase tracking-wide">Aadhar Number</label>
                  <input
                    type="text"
                    name="adhar"
                    placeholder="12 digit aadhar"
                    maxLength={12}
                    value={form.adhar}
                    onChange={handleChange}
                    className="w-full bg-transparent border-0 border-b-2 border-gray-300/60 outline-none px-0 py-2 focus:ring-0 focus:border-[#2b2b29] transition-colors placeholder:text-gray-400 font-sans text-sm"
                  />
                  {formErrors.adhar && <p className="absolute -bottom-5 text-red-600 text-xs">{formErrors.adhar}</p>}
                </div>

                {formType === 'donor' && (
                  <div className="relative flex flex-col">
                    <label className="font-serif font-bold text-sm mb-1 uppercase tracking-wide">Donation Amount</label>
                    <input
                      type="number"
                      name="amount"
                      placeholder="Amount in INR"
                      value={form.amount}
                      onChange={handleChange}
                      className="w-full bg-transparent border-0 border-b-2 border-gray-300/60 outline-none px-0 py-2 focus:ring-0 focus:border-[#2b2b29] transition-colors placeholder:text-gray-400 font-sans text-sm"
                    />
                    {formErrors.amount && <p className="absolute -bottom-5 text-red-600 text-xs">{formErrors.amount}</p>}
                  </div>
                )}

                {formType === 'member' && (
                  <>
                    <div className="relative flex flex-col">
                      <label className="font-serif font-bold text-sm mb-1 uppercase tracking-wide">Gender</label>
                      <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className="w-full bg-transparent border-0 border-b-2 border-gray-300/60 outline-none px-0 py-2 focus:ring-0 focus:border-[#2b2b29] transition-colors text-gray-700 font-sans text-sm"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {formErrors.gender && <p className="absolute -bottom-5 text-red-600 text-xs">{formErrors.gender}</p>}
                    </div>
                    <div className="relative flex flex-col mt-4 sm:mt-0">
                      <label className="font-serif font-bold text-sm mb-1 uppercase tracking-wide">Occupation</label>
                      <input
                        type="text"
                        name="occupation"
                        placeholder="Your profession"
                        value={form.occupation}
                        onChange={handleChange}
                        className="w-full bg-transparent border-0 border-b-2 border-gray-300/60 outline-none px-0 py-2 focus:ring-0 focus:border-[#2b2b29] transition-colors placeholder:text-gray-400 font-sans text-sm"
                      />
                      {formErrors.occupation && <p className="absolute -bottom-5 text-red-600 text-xs">{formErrors.occupation}</p>}
                    </div>
                  </>
                )}
              </div>

              {/* Full Width Address Field(s) */}
              {formType === 'donor' && (
                <div className="relative flex flex-col mt-4">
                  <label className="font-serif font-bold text-sm mb-1 uppercase tracking-wide">Full Address</label>
                  <textarea
                    name="address"
                    placeholder="Complete address details"
                    value={form.address}
                    onChange={handleChange}
                    rows="2"
                    className="w-full bg-transparent border-0 border-b-2 border-gray-300/60 outline-none px-0 py-2 focus:ring-0 focus:border-[#2b2b29] transition-colors placeholder:text-gray-400 font-sans text-sm resize-none"
                  />
                  {formErrors.address && <p className="absolute -bottom-5 text-red-600 text-xs">{formErrors.address}</p>}
                </div>
              )}

              {formType === 'member' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 mt-4">
                  <div className="relative flex flex-col">
                    <label className="font-serif font-bold text-sm mb-1 uppercase tracking-wide">Street</label>
                    <input
                      type="text"
                      name="street"
                      placeholder="Street name"
                      value={form.street}
                      onChange={handleChange}
                      className="w-full bg-transparent border-0 border-b-2 border-gray-300/60 outline-none px-0 py-2 focus:ring-0 focus:border-[#2b2b29] transition-colors placeholder:text-gray-400 font-sans text-sm"
                    />
                    {formErrors.street && <p className="absolute -bottom-5 text-red-600 text-xs">{formErrors.street}</p>}
                  </div>
                  <div className="relative flex flex-col">
                    <label className="font-serif font-bold text-sm mb-1 uppercase tracking-wide">City</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full bg-transparent border-0 border-b-2 border-gray-300/60 outline-none px-0 py-2 focus:ring-0 focus:border-[#2b2b29] transition-colors placeholder:text-gray-400 font-sans text-sm"
                    />
                    {formErrors.city && <p className="absolute -bottom-5 text-red-600 text-xs">{formErrors.city}</p>}
                  </div>
                  <div className="relative flex flex-col">
                    <label className="font-serif font-bold text-sm mb-1 uppercase tracking-wide">State</label>
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={form.state}
                      onChange={handleChange}
                      className="w-full bg-transparent border-0 border-b-2 border-gray-300/60 outline-none px-0 py-2 focus:ring-0 focus:border-[#2b2b29] transition-colors placeholder:text-gray-400 font-sans text-sm"
                    />
                    {formErrors.state && <p className="absolute -bottom-5 text-red-600 text-xs">{formErrors.state}</p>}
                  </div>
                  <div className="relative flex flex-col">
                    <label className="font-serif font-bold text-sm mb-1 uppercase tracking-wide">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      placeholder="6 digit pincode"
                      maxLength={6}
                      value={form.pincode}
                      onChange={handleChange}
                      className="w-full bg-transparent border-0 border-b-2 border-gray-300/60 outline-none px-0 py-2 focus:ring-0 focus:border-[#2b2b29] transition-colors placeholder:text-gray-400 font-sans text-sm"
                    />
                    {formErrors.pincode && <p className="absolute -bottom-5 text-red-600 text-xs">{formErrors.pincode}</p>}
                  </div>
                </div>
              )}

              <div className="pt-8">
                <button
                  type="submit"
                  className="w-full border-2 border-[#2b2b29] bg-transparent text-[#2b2b29] hover:bg-[#2b2b29] hover:text-[#f4efe4] font-bold uppercase tracking-widest py-4 transition-all duration-300 text-sm"
                >
                  Confirm & Pay Now
                </button>
              </div>

              {paymentMessage.text && (
                <p
                  className={`mt-6 p-4 rounded text-sm text-center font-bold font-sans ${
                    paymentMessage.type === 'success'
                      ? 'bg-green-100 text-green-900'
                      : 'bg-red-100 text-red-900'
                  }`}
                >
                  {paymentMessage.text}
                </p>
              )}
            </form>
          ) : (
            <div className="flex flex-col items-center">
              {/* Receipt Output Component */}
              <div
                id="aviyukt-receipt"
                ref={receiptRef}
                style={{ backgroundColor: '#ffffff', color: '#1a1a2e' }}
                className="w-full border border-gray-200 mt-4 rounded-md shadow-lg"
              >
                <div style={{ height: '6px', backgroundColor: '#2b2b29', borderRadius: '6px 6px 0 0' }} />
                <div style={{ padding: '24px 32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{ textAlign: 'left' }}>
                      <p style={{ fontSize: '18px', fontWeight: '700', color: '#2b2b29', margin: 0, fontFamily: 'Georgia, serif' }}>
                        AVIYUKT NGO
                      </p>
                      <p style={{ fontSize: '11px', color: '#94a3b8', margin: '3px 0 0', fontFamily: 'sans-serif' }}>
                        Empowering Lives, Spreading Hope
                      </p>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#2b2b29', borderRadius: '4px', padding: '8px 16px', marginBottom: '20px', textAlign: 'center' }}>
                    <p style={{ color: '#ffffff', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', margin: 0 }}>
                      {formType === 'donor' ? 'DONATION RECEIPT' : 'MEMBERSHIP CERTIFICATE'}
                    </p>
                  </div>

                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
                    {receiptRows.map((row, i) => (
                      <div key={i} style={{ display: 'flex', borderBottom: i < receiptRows.length - 1 ? '1px solid #f1f5f9' : 'none', backgroundColor: '#ffffff' }}>
                        <div style={{ width: '40%', padding: '9px 14px', fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>{row.label}</div>
                        <div style={{ width: '60%', padding: '9px 14px', fontSize: '12px', color: '#1e293b', wordBreak: 'break-all' }}>{row.value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ backgroundColor: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: '#555', fontWeight: 'bold' }}>Amount</p>
                    <p style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#2b2b29' }}>₹{paymentClip.amount}</p>
                  </div>

                  <p style={{ textAlign: 'center', fontSize: '10px', color: '#94a3b8', margin: 0, lineHeight: '1.6' }}>
                    This receipt is valid for tax deduction under Section 80G.<br />Thank you for your generous support.
                  </p>
                </div>
              </div>

              <button
                id="receipt-download-btn"
                onClick={handleDownloadReceipt}
                disabled={isDownloadingReceipt}
                className={`mt-10 bg-[#2b2b29] text-[#f4efe4] px-8 py-3 uppercase tracking-widest text-sm font-bold shadow transition ${
                  isDownloadingReceipt ? 'opacity-70 cursor-not-allowed' : 'hover:bg-black'
                }`}
              >
                {isDownloadingReceipt ? 'Preparing PDF...' : 'Download Receipt'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FAQ Section underneath full screen layout */}
      <div className="relative z-10 w-full py-20 px-4 sm:px-10 md:px-20 bg-white">
        <h2 className="text-3xl font-serif text-center text-[#2b2b29] mb-12 uppercase tracking-wide">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-2">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 py-6">
              <button
                className="w-full flex justify-between items-center text-left text-lg font-serif font-bold text-[#2b2b29] focus:outline-none"
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              >
                {faq.question}
                <ChevronDownIcon
                  className={`h-6 w-6 transform transition-transform duration-300 ${
                    openFAQ === index ? 'rotate-180 text-gray-500' : 'rotate-0 text-black'
                  }`}
                />
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openFAQ === index ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-gray-600 font-sans text-md leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Highlights;
