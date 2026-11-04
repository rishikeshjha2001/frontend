import React from 'react';

interface CheckoutSummaryProps {
  basePrice: number;
  platformFee: number;
  tax: number;
  discount: number;
  totalPayable: number;
}

export const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  basePrice,
  platformFee,
  tax,
  discount,
  totalPayable,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount / 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6 border border-gray-100">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Booking Summary</h3>
      
      <div className="space-y-3 mb-6 text-gray-600">
        <div className="flex justify-between">
          <span>Base Price</span>
          <span>{formatCurrency(basePrice)}</span>
        </div>
        <div className="flex justify-between">
          <span>Platform Fee</span>
          <span>{formatCurrency(platformFee)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (GST)</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 pt-4 mb-4">
        <div className="flex justify-between items-center text-lg font-bold text-gray-900">
          <span>Total Payable</span>
          <span>{formatCurrency(totalPayable)}</span>
        </div>
      </div>
      
      <div className="text-xs text-center text-gray-400 mt-4 pt-4 border-t border-gray-100">
        Powered securely by Razorpay
      </div>
    </div>
  );
};
