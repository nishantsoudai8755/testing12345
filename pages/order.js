import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';


const OrderPage = () => {
  const router = useRouter();
  const { productTitle, productImage, productPrice, productSize, productQty } = router.query;

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India'); // Default to India
  const [message, setMessage] = useState('');

  // Calculate total order amount
  const shippingCost = 0;  // Free shipping
  const totalAmount = parseFloat(productPrice) * parseInt(productQty) + shippingCost;

  useEffect(() => {
    // Optional: Handle edge cases if the image URL is not passed
    if (!productImage) {
      setMessage('MUJE PTA HAI 🙌');
    }
  }, [productImage]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      customerName: name,
      address,
      landmark,
      phone,
      email,
      city,
      state,
      postalCode,
      country,
      productTitle,
      productImage,
      productPrice,
      productSize,
      productQty,
      totalAmount,
    };

    try {
      const response = await fetch('/api/submitOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Order submitted successfully!');

        // Redirect to the success page after successful order submission
        router.push('/successPay');  // Redirecting to the successPay page
      } else {
        setMessage('Failed to submit order: ' + data.message);
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div className="order-page">
      <h2>Enter Your Information</h2>

      {/* Product Information */}
		<div className="product-info">
		  <h3>{productTitle}</h3>
		  <div className="product-details-box">
			<div className="product-image">
			  <img src={decodeURIComponent(productImage)} alt={productTitle} style={{ width: '150px', height: 'auto' }} />
			</div>
			<div className="product-details-item">
			  <p>Price: <span>${productPrice}</span></p>
			</div>
			<div className="product-details-item">
			  <p>Size: <span>{productSize}</span></p>
			</div>
			<div className="product-details-item">
			  <p>Quantity: <span>{productQty}</span></p>
			</div>
			<div className="product-details-item">
			  <p>Shipping: <span>Free</span></p>
			</div>
			<div className="product-details-item">
			  <p>Total: <span>${totalAmount}</span></p>
			</div>
		  </div>
		</div>



      {/* Order Form */}
      <form onSubmit={handleSubmit}>
        <label>
          Full Name:
          <input
            type="text"
            value={name}
			placeholder="eg Vanshika sharma"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

		<label>
		  Phone Number:
		  <input
			type="tel"
			value={phone}
			placeholder="Phone/whatsapp"
			onChange={(e) => setPhone(e.target.value)}
			pattern="^[5-9][0-9]{9}$"
			title="Enter a valid 10-digit phone number"
			required
		  />
		</label>


        <label>
          Full Address:
          <textarea
            value={address}
			placeholder="Full Address"
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>

        <label>
          Landmark or Nearby:
          <input
            type="text"
            value={landmark}
			placeholder="eg school,colage,hospital name"
            onChange={(e) => setLandmark(e.target.value)}
            required
          />
        </label>

        <label>
          State:
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          >
            {/* List of Indian States */}
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Arunachal Pradesh">Arunachal Pradesh</option>
            <option value="Assam">Assam</option>
            <option value="Bihar">Bihar</option>
            <option value="Chhattisgarh">Chhattisgarh</option>
            <option value="Goa">Goa</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Haryana">Haryana</option>
            <option value="Himachal Pradesh">Himachal Pradesh</option>
            <option value="Jharkhand">Jharkhand</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Manipur">Manipur</option>
            <option value="Meghalaya">Meghalaya</option>
            <option value="Mizoram">Mizoram</option>
            <option value="Nagaland">Nagaland</option>
            <option value="Odisha">Odisha</option>
            <option value="Punjab">Punjab</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Sikkim">Sikkim</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Telangana">Telangana</option>
            <option value="Tripura">Tripura</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Uttarakhand">Uttarakhand</option>
            <option value="West Bengal">West Bengal</option>
          </select>
        </label>

        <label>
          City:
          <input
            type="text"
            value={city}
			placeholder="eg Jaipur"
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </label>

		<label>
		  Postal Code:
		  <input
			type="text"
			placeholder="eg 110001"
			value={postalCode}
			onChange={(e) => setPostalCode(e.target.value)}
			pattern="^\d{6}$"  // Ensures 6 digits only
			title="Enter a valid 6-digit Indian postal code"
			required
		  />
		</label>


        <label>
          Country:
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            disabled
          />
        </label>

        <label>
          Email:(Optional)
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            
          />
        </label>

        <button type="submit">Place Order-COD</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default OrderPage;
