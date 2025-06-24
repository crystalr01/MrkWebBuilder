import React from 'react';
// import { ProductsIconSvg } from './Icons';

const ProductsPage = ({ data, getSafeArray }) => {
    const products = getSafeArray(data, 'Products');
    // const businessName = data?.businessInfo?.businessName || 'Our Business';

    return (
        <div className="page-container bg-gradient-blue-teal">
            <div className="content-card">
                <h1 className="main-heading text-teal-800">
                    Our <span className="highlight-text-pink">Products</span>
                </h1>
                <p className="sub-heading text-gray-700">
                    Explore our range of high-quality products designed to meet your needs.
                </p>

                <div className="grid-3-cols sm-grid-2-cols gap-6">
                    {products.length > 0 ? (
                        products.map((product, index) => (
                            <div key={index} className="product-card bg-gradient-pink-red">
                                <img
                                    src={product.imageUrl || 'https://placehold.co/400x300/EFEFEF/333333?text=Product+Image'}
                                    alt={product.productName}
                                    className="product-img"
                                    onError={(e) => { e.target.src = 'https://placehold.co/400x300/EFEFEF/333333?text=Image+Not+Found'; }}
                                />
                                <div className="product-details">
                                    <h3 className="product-name">{product.productName}</h3>
                                    {product.price && <p className="product-price">Price: {product.price}</p>}
                                    {product.description && <p className="product-description">{product.description}</p>}
                                    {product.url && (
                                        <a
                                            href={product.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="product-button"
                                        >
                                            Know More
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-data-message">No products available at the moment.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;