import React, { useState, useRef } from 'react';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineShopping } from 'react-icons/ai';
import { HiOutlineTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useStateContext } from '../context/StateContext';
import { urlFor } from '../lib/client';
import getStripe from '../lib/getStripe';

const Cart = () => {
  const cartRef = useRef();
  const { cartItems, totalPrice, totalQty, onRemove, toggleCartItemQuantity } = useStateContext();

  // State to manage the visibility of the Buy Now modal
  const [isBuyNowModalOpen, setIsBuyNowModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    customerName: '',
    address: '',
    phone: '',
    email: '',
    landmark: '',
    state: '',
    city: '',
    postalCode: '',
    country: ''
  });

  const handleCheckout = async () => {
    const stripe = await getStripe();

    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartItems),
    });

    if (response.statusCode === 500) return;

    const data = await response.json();

    toast.loading('Redirecting...');

    stripe.redirectToCheckout({ sessionId: data.id });
  };

  const handleBuyNow = () => {
    setIsBuyNowModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsBuyNowModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails({
      ...orderDetails,
      [name]: value,
    });
  };

  const handleCODOrder = async () => {
    const response = await fetch('/api/submitOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...orderDetails,
        productTitle: cartItems[0]?.name, // Assuming you're passing the first product's info
        productImage: cartItems[0]?.image[0],
        productPrice: cartItems[0]?.price,
        productQty: cartItems[0]?.quantity,
        totalAmount: totalPrice,
      }),
    });

    if (response.ok) {
      toast.success('Order placed successfully');
      setIsBuyNowModalOpen(false);
    } else {
      toast.error('Error placing the order');
    }
  };

  return (
    <div className="cart-wrapper" ref={cartRef}>
      <h2>Shopping Cart</h2>
      <div className="cart-container">
        <div className="cart-items">
          {cartItems.length < 1 && (
            <div className="empty-cart">
              <AiOutlineShopping size={150} />
              <h1>Your shopping bag is empty</h1>
            </div>
          )}

          {cartItems.length >= 1 && cartItems.map((item) => (
            <div key={item._id} className="item-card">
              <div className="item-image">
                <img src={urlFor(item?.image[0])} alt="img" />
              </div>
              <div className="item-details">
                <div className="name-and-remove">
                  <h3>{item.name}</h3>
                  <button type="button" onClick={() => onRemove(item)} className="remove-item">
                    <HiOutlineTrash size={28} />
                  </button>
                </div>
                <p className="item-tag">Dress</p>
                <p className="delivery-est">Delivery Estimation</p>
                <p className="delivery-days">5 Working Days</p>
                <div className="price-and-qty">
                  <span className="price">${item.price * item.quantity}</span>
                  <div>
                    <span className="minus" onClick={() => toggleCartItemQuantity(item._id, 'dec')}>
                      <AiOutlineMinus />
                    </span>
                    <span className="num">{item.quantity}</span>
                    <span className="plus" onClick={() => toggleCartItemQuantity(item._id, 'inc')}>
                      <AiOutlinePlus />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cartItems.length >= 1 && (
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="qty">
              <p>Quantity</p>
              <span>{totalQty} Product</span>
            </div>
            <div className="subtotal">
              <p>Sub Total</p>
              <span>${totalPrice}</span>
            </div>
            <div>
              <button className="btn" type="button" onClick={handleBuyNow}>
                Buy Now - COD
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Buy Now Modal */}
      {isBuyNowModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Order Details</h2>
            <p>Total Price: ${totalPrice}</p>
            <input
              type="text"
              name="customerName"
              placeholder="Customer Name"
              value={orderDetails.customerName}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={orderDetails.address}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={orderDetails.phone}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={orderDetails.email}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="landmark"
              placeholder="Landmark"
              value={orderDetails.landmark}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={orderDetails.state}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={orderDetails.city}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={orderDetails.postalCode}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={orderDetails.country}
              onChange={handleInputChange}
            />
            <div className="buttons">
              <button className="btn" onClick={handleCODOrder}>
                Place Order - COD
              </button>
              <button className="btn3" onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
