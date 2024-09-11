const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Define the endpoint to generate the invoice
app.post("/generate-invoice", (req, res) => {
  const invoiceData = req.body;

  // Use the invoice data to generate an invoice HTML or PDF
  // For example, fill in the HTML template with data and send it back
  const invoiceHtml = generateInvoiceHtml(invoiceData);

  // Respond with the invoice HTML (or convert to PDF and respond with the file)
  res.send(invoiceHtml);
});

const generateInvoiceHtml = (data) => {
  // Replace placeholders in your HTML template with data from `data`
  return `<html><body><h1>Invoice for ${data.clientName}</h1><p>Total: ${data.total}</p></body></html>`;
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
