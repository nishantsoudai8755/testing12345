// pages/api/submitOrder.js

import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { 
      customerName, 
      address, 
      phone, 
      email, 
	  landmark,
	  state,
      city,
	  postalCode,
      country,
      productTitle, 
      productImage, 
      productPrice, 
      productSize, 
      productQty, 
      totalAmount 
    } = req.body;

    const order = {
      customerName,
      address,
      phone,
      email,
	  landmark,
	  state,
      city,
	  postalCode,
      country,
      productTitle,
      productImage,
      productPrice,
      productSize,
      productQty,
      totalAmount,
      status: 'pending', // Default status for new orders
      timestamp: new Date().toISOString(),
    };

    // Define the file path to save the orders
    const filePath = path.join(process.cwd(), 'orders.json');

    try {
      // Check if the file exists and read the existing data
      let orders = [];
      if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, 'utf-8');
        orders = JSON.parse(fileData);
      }

      // Add the new order
      orders.push(order);

      // Save the updated orders back to the file
      fs.writeFileSync(filePath, JSON.stringify(orders, null, 2), 'utf-8');

      res.status(200).json({ message: 'Order placed successfully', order });
    } catch (error) {
      console.error("Error saving order:", error);
      res.status(500).json({ message: 'Error saving order', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
