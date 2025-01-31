import React, { useState } from 'react';
import { client, urlFor } from '../../lib/client';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { CgShoppingCart } from 'react-icons/cg';
import { useStateContext } from '../../context/StateContext';
import Link from 'next/link';

const ProductDetails = ({ products, product }) => {
  const { image, name, details, price, tags, care } = product;
  const [index, setIndex] = useState(0);
  const { decQty, incQty, qty, onAdd } = useStateContext();
  const [selectedSize, setSelectedSize] = useState('M');  // Default size

  // Collecting product care details into a list
  const careList = [];
  { for (let i = 0; i < care.length; i++) {
      careList.push(care[i].children[0].text);
    }
  }

  return (
    <div className="products">
      <div className="product-detail-container">
        <div className="product-images">
          <div className="small-images-container">
            {image?.map((item, ind) => (
              <img
                key={ind}
                src={urlFor(item)}
                className="small-image"
                onMouseEnter={() => setIndex(ind)}
              />
            ))}
          </div>
          <div className="big-image-container">
            <img src={urlFor(image && image[index])} />
          </div>
        </div>
        <div className="product-details">
          <div className="name-and-category">
            <h3>{name}</h3>
            <span>{tags}</span>
          </div>
			<div className="size">
			  <p>SELECT SIZE</p>
			  <ul>
				<li
				  className={selectedSize === 'XS' ? 'selected' : ''}
				  onClick={() => setSelectedSize('XS')}
				>
				  XS
				</li>
				<li
				  className={selectedSize === 'S' ? 'selected' : ''}
				  onClick={() => setSelectedSize('S')}
				>
				  S
				</li>
				<li
				  className={selectedSize === 'M' ? 'selected' : ''}
				  onClick={() => setSelectedSize('M')}
				>
				  M
				</li>
				<li
				  className={selectedSize === 'L' ? 'selected' : ''}
				  onClick={() => setSelectedSize('L')}
				>
				  L
				</li>
				<li
				  className={selectedSize === 'XL' ? 'selected' : ''}
				  onClick={() => setSelectedSize('XL')}
				>
				  XL
				</li>
			  </ul>
			</div>
          <div className="quantity-desc">
            <h4>Quantity: </h4>
            <div>
              <span className="minus" onClick={decQty}><AiOutlineMinus /></span>
              <span className="num" onClick="">{qty}</span>
              <span className="plus" onClick={incQty}><AiOutlinePlus /></span>
            </div>
          </div>
          <div className="add-to-cart">



            <p className="price">${price}.00</p>
          </div>
            <div className="btn2">
              {/* Pass product information to the order page via URL parameters */}
				<Link
				  href={{
					pathname: '/order',
					query: {
					  productTitle: name,
					  productImage: encodeURIComponent(urlFor(image && image[0])),  // URL is passed here
					  productPrice: price,
					  productSize: selectedSize,
					  productQty: qty,
					}
				  }}
				>
				  <button className="place-order-button">BUY NOW -COD 🛒</button>
				</Link>

            </div>
        </div>
      </div>


      <div className="product-desc-container">
        <div className="desc-title">
          <div className="desc-background">Overview</div>
          <h2>Product Information</h2>
        </div>
        <div className="desc-details">
          <h4>PRODUCT DETAILS</h4>
          <p>{details[0].children[0].text}</p>
        </div>
        <div className="desc-care">
          <h4>PRODUCT CARE</h4>
          <ul>
            {careList.map((list, index) => (
              <li key={index}>{list}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

export const getStaticProps = async ({ params: { slug } }) => {
  const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
  const productsQuery = '*[_type == "product"]';
  const product = await client.fetch(query);
  const products = await client.fetch(productsQuery);

  return {
    props: { products, product }
  };
};

// Generates `/product/1` and `/product/2`
export const getStaticPaths = async () => {
  const query = `*[_type == "product"] {
    slug {
      current
    }
  }`;

  const products = await client.fetch(query);

  const paths = products.map((product) => ({
    params: {
      slug: product.slug.current
    }
  }));

  return {
    paths,
    fallback: 'blocking'
  };
};
