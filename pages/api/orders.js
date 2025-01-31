// pages/api/orders.js
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Save order data to a local file
    const { customerName, address, phone, email } = req.body;

    const order = {
      customerName,
      address,
      phone,
      email,
      timestamp: new Date().toISOString(),
    };

    const filePath = path.join(process.cwd(), 'orders.json');

    try {
      // Read the existing orders from the file (if any)
      let orders = [];
      if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, 'utf-8');
        orders = JSON.parse(fileData);
      }

      // Add the new order
      orders.push(order);

      // Save the updated orders back to the file
      fs.writeFileSync(filePath, JSON.stringify(orders, null, 2), 'utf-8');

      res.status(200).json({ message: 'Order placed successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error saving order', error: error.message });
    }
  } else if (req.method === 'GET') {
    // Fetch order data from the local file
    const filePath = path.join(process.cwd(), 'orders.json');

    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf-8');
      const orders = JSON.parse(fileData);
      res.status(200).json(orders);
    } else {
      res.status(404).json({ message: 'No orders found' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
