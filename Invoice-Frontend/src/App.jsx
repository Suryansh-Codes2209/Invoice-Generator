import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './App.css';

function App() {
  const [showInvoice, setShowInvoice] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    sellerName: '',
    sellerAddress: '',
    sellerCity: '',
    sellerState: '',
    sellerPincode: '',
    sellerPan: '',
    sellerGst: '',
    billingName: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingPincode: '',
    billingStateCode: '',
    shippingName: '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingPincode: '',
    shippingStateCode: '',
    orderNo: '',
    orderDate: '',
    invoiceNo: '',
    invoiceDate: '',
    reverseCharge: 'No',
    items: [
      {
        description: '',
        unitPrice: 0,
        qty: 0,
        discount: 0,
      },
    ],
    companyLogo: null,
    authorizedSignatory: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGenerateClick = () => {
    setShowForm(true);
  };


  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const items = [...formData.items];
    items[index][name] = value;
    setFormData({
      ...formData,
      items,
    });
  };

  const calculateNetAmount = (item) => {
    return item.unitPrice * item.qty - item.discount;
  };

  const calculateTax = (netAmount) => {
    const taxRate = 0.18; // 18%
    return netAmount * taxRate;
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', unitPrice: 0, qty: 0, discount: 0 }],
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      companyLogo: URL.createObjectURL(file),
    });
  };

  const handleSignatoryChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      authorizedSignatory: URL.createObjectURL(file),
    });
  };

  const handleGenerateInvoice = () => {
    setShowInvoice(true);
  };

  const downloadPdf = () => {
    const invoiceElement = document.getElementById('invoice');
    
    
    const imgElement = document.querySelector('img');
  
    if (invoiceElement && imgElement) {
      
      const img = new Image();
      img.src = imgElement.src;
  
      img.onload = () => {
        
        html2canvas(invoiceElement)
          .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('invoice.pdf');
          })
          .catch((error) => {
            console.error("Error generating PDF:", error);
          });
      };
  
      img.onerror = (error) => {
        console.error("Error loading image:", error);
      };
    } else {
      console.error('Invoice element or image element not found');
    }
  };
  

  if (showInvoice) {
    return (
      <div className="bg-black min-h-screen flex flex-col items-center pt-14">
        <div id="invoice" className="max-w-4xl mx-auto border border-gray-300 p-6 bg-white ">
        <div className="text-center mb-6">
        {formData.companyLogo ? (
              <img
                src={formData.companyLogo}
                alt="Company Logo"
                className="h-12 mx-auto"
              />
            ) : (
              <div className="h-12 mx-auto bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Company Logo</span>
              </div>
            )}
            
        <div>
        <h2 className="text-lg font-bold">Tax Invoice/Bill of Supply/Cash Memo</h2>
        <p>(Original for Recipient)</p>
        </div>
      </div>
          {/* Seller, Billing, Shipping, Order Details */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-bold">Sold By :</h3>
              <p>{formData.sellerName}</p>
              <p>{formData.sellerAddress}</p>
              <p>{formData.sellerCity}, {formData.sellerState}, {formData.sellerPincode}</p>
              <p>PAN No: {formData.sellerPan}</p>
              <p>GST Registration No: {formData.sellerGst}</p>
            </div>

            <div>
              <h3 className="font-bold">Billing Address :</h3>
              <p>{formData.billingName}</p>
              <p>{formData.billingAddress}</p>
              <p>{formData.billingCity}, {formData.billingState}, {formData.billingPincode}</p>
              <p>State/UT Code: {formData.billingStateCode}</p>
            </div>

            <div>
              <h3 className="font-bold">Shipping Address :</h3>
              <p>{formData.shippingName}</p>
              <p>{formData.shippingAddress}</p>
              <p>{formData.shippingCity}, {formData.shippingState}, {formData.shippingPincode}</p>
              <p>State/UT Code: {formData.shippingStateCode}</p>
            </div>

            <div>
              <h3 className="font-bold">Order Details :</h3>
              <p>Order Number: {formData.orderNo}</p>
              <p>Order Date: {formData.orderDate}</p>
            </div>
          </div>

          {/* Table for Items */}
          <table className="table-auto w-full border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Sl. No</th>
                <th className="border px-2 py-1">Description</th>
                <th className="border px-2 py-1">Unit Price</th>
                <th className="border px-2 py-1">Qty</th>
                <th className="border px-2 py-1">Net Amount</th>
                <th className="border px-2 py-1">Tax Amount</th>
                <th className="border px-2 py-1">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => {
                const netAmount = calculateNetAmount(item);
                const taxAmount = calculateTax(netAmount);
                const totalAmount = netAmount + taxAmount;
                return (
                  <tr key={index}>
                    <td className="border px-2 py-1 text-center">{index + 1}</td>
                    <td className="border px-2 py-1">{item.description}</td>
                    <td className="border px-2 py-1 text-right">₹{item.unitPrice}</td>
                    <td className="border px-2 py-1 text-right">{item.qty}</td>
                    <td className="border px-2 py-1 text-right">₹{netAmount.toFixed(2)}</td>
                    <td className="border px-2 py-1 text-right">₹{taxAmount.toFixed(2)}</td>
                    <td className="border px-2 py-1 text-right">₹{totalAmount.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <p className="text-right font-bold">
            TOTAL: ₹
            {formData.items.reduce((acc, item) => {
              const netAmount = calculateNetAmount(item);
              const taxAmount = calculateTax(netAmount);
              return acc + netAmount + taxAmount;
            }, 0).toFixed(2)}
          </p>

          <div className="flex justify-between mt-6">
        <div>
          <p>For {formData.sellerName}:</p>
          {formData.authorizedSignatory ? (
                <img
                  src={formData.authorizedSignatory}
                  alt="Authorized Signatory"
                  className="h-12"
                />
              ) : (
                <div className="h-12 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Authorized Signatory</span>
                </div>
              )}
          <p>Authorized Signatory</p>
        </div>
        <div>
          <p>Invoice Details:</p>
          <p>{formData.invoiceNo}</p>
          <p>{formData.invoiceDate}</p>
        </div>
        </div>
        </div>
        <button
          onClick={downloadPdf}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Download PDF
        </button>
      </div>
    );
  }

  return (
    <div className='bg-black min-h-screen flex flex-col items-center pt-14'>
      <div className='text-center'>
        <div className='text-5xl font-extrabold pt-5 font-sans mb-5 bg-gradient-to-t from-sky-400 to-gray-200 bg-clip-text text-transparent'>
          Invoice Generator
        </div>
        <img src="src/assets/invoice.gif" alt="gif" className='mx-auto ' />
        <p className='text-3xl font-extrabold pt-5 bg-gradient-to-t from-sky-400 to-gray-200 bg-clip-text text-transparent'>
          Generate the invoice for free
        </p>
        <div className='mt-9'>
          <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#87CEEB_0%,#00BFFF_50%,#87CEEB_100%)]" />
            <span
        className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl"
        onClick={handleGenerateClick}
      >
        Generate ✨
      </span>
          </button>
        </div>

        {/* Form for Invoice Details */}
        {showForm && (
          <div className='bg-black min-h-screen flex flex-col items-center pt-14'>
        <form className="w-full max-w-6xl mx-auto p-6 bg-white m-5 space-y-4 ">
          {/* Seller Details */}
          <h2 className="font-bold text-lg">Company Logo</h2>
          <input type="file" accept="image/*" onChange={handleLogoChange} className="block w-full px-4 py-2 mb-2 border" />

          <h2 className="font-bold text-lg">Order Details</h2>
          <input name="orderNo" placeholder="Order Number" onChange={handleInputChange} className="block w-full px-4 py-2 mb-2 border" />
          <input name="orderDate" placeholder="Order Date" type="date" onChange={handleInputChange} className="block w-full px-4 py-2 mb-2 border" />


          <h2 className="font-bold text-lg">Seller Details</h2>
          <input name="sellerName" placeholder="Seller Name" onChange={handleInputChange} className="block w-full px-4 py-2 mb-2 border" />
          <input name="sellerAddress" placeholder="Seller Address" onChange={handleInputChange} className="block w-full px-4 py-2 mb-2 border" />
          <input name="sellerCity" placeholder="Seller City" onChange={handleInputChange} className="block w-full px-4 py-2 mb-2 border" />
          <input name="sellerState" placeholder="Seller State" onChange={handleInputChange} className="block w-full px-4 py-2 mb-2 border" />
          <input name="sellerPincode" placeholder="Seller Pincode" onChange={handleInputChange} className="block w-full px-4 py-2 mb-2 border" />
          <input name="sellerPan" placeholder="Seller PAN" onChange={handleInputChange} className="block w-full px-4 py-2 mb-2 border" />
          <input name="sellerGst" placeholder="Seller GST" onChange={handleInputChange} className="block w-full px-4 py-2 mb-2 border" />
          {/* Add more fields as needed for Seller Details */}

          {/* Billing and Shipping Details */}
          <h2 className="font-bold text-lg">Billing Details</h2>
          <input name="billingName" placeholder="Billing Name" onChange={handleInputChange} className="block w-full px-4 py-2 mb-2 border" />
          <input name="billingAddress" placeholder="Billing Address" onChange={handleInputChange} className="block w-full px-4 py-2 mb-2 border" />
          <input name="billingCity" placeholder="Billing City" onChange={handleInputChange} className="block w-full px-4 py-2 mb-2 border" />
          <input name="billingState" placeholder="Billing State" onChange={handleInputChange} className="block w-full px-4 py-2 mb-2 border" />
          <input name="billingPincode" placeholder="Billing Pincode" onChange={handleInputChange} className="block w-full px-4 py-2 mb-2 border" />
          <input name="billingStateCode" placeholder="Billing State Code" onChange={handleInputChange} className="block w-full px-4 py-2 mb-2 border" />
          {/* Add more fields for Billing and Shipping */}

          <h2 className="font-bold text-lg">Shipping Details</h2>
          <input name="shippingName" placeholder="Shipping Name" onChange={handleInputChange} className="block w-full px-4 py-2 mb-2 border" />
          <input name="shippingAddress" placeholder="Shipping Address" onChange={handleInputChange} className="block w-full px-4 py-2 mb-2 border" />
          <input name="shippingCity" placeholder="Shipping City" onChange={handleInputChange} className="block w-full px-4 py-2 mb-2 border" />
          <input name="shippingState" placeholder="Shipping State" onChange={handleInputChange} className="block w-full px-4 py-2 mb-2 border" />
          <input name="shippingPincode" placeholder="Shipping Pincode" onChange={handleInputChange} className="block w-full px-4 py-2 mb-2 border" />
          <input name="shippingStateCode" placeholder="Shipping State Code" onChange={handleInputChange} className="block w-full px-4 py-2 mb-2 border" />
          
          <h2 className="font-bold text-lg">Invoice Details</h2>
          <input name="invoiceNo" placeholder="Invoice Number" onChange={handleInputChange} className="block w-full px-4 py-2 mb-2 border" />
          <input name="invoiceDate" placeholder="Invoice Date" type="date" onChange={handleInputChange} className="block w-full px-4 py-2 mb-2 border" />
          
          {/* Items Section */}
          <h2 className="font-bold text-lg">Items</h2>
          {formData.items.map((item, index) => (
            <div key={index} className="border p-4 mb-4">
              <input name="description" placeholder="Item Description" onChange={(e) => handleItemChange(index, e)} className="block w-full px-4 py-2 mb-2 border" />
              <input name="unitPrice" placeholder="Unit Price" type="number" onChange={(e) => handleItemChange(index, e)} className="block w-full px-4 py-2 mb-2 border" />
              <input name="qty" placeholder="Quantity" type="number" onChange={(e) => handleItemChange(index, e)} className="block w-full px-4 py-2 mb-2 border" />
              <input name="discount" placeholder="Discount" type="number" onChange={(e) => handleItemChange(index, e)} className="block w-full px-4 py-2 mb-2 border" />
            </div>
          ))}

          

          <button type="button" onClick={handleAddItem} className="bg-sky-500 text-white px-4 py-2 rounded">Add Item</button>
          <h2 className="font-bold text-lg">Authorized Signatory</h2>
          <input type="file" accept="image/*" onChange={handleSignatoryChange} className="block w-full px-4 py-2 mb-2 border" />
          <button type="button" onClick={handleGenerateInvoice} className="bg-green-500 text-white px-4 py-2 rounded">Generate Invoice</button>
        </form>
      </div>
        
      )}
      </div>
    </div>
  );
}

export default App;
