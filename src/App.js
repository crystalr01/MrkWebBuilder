import React, { useState, useEffect, useCallback } from 'react';
// Import Firebase Realtime Database specific functions
import { useParams } from 'react-router-dom'; // Import useParams for URL params
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database'; // Realtime Database imports
import { getAnalytics } from "firebase/analytics"; // As per user's provided config
import { Menu as MenuIcon, X as CloseIcon } from 'lucide-react'; // optional: use any icon

// Your web app's Firebase configuration from the user
const firebaseConfig = {
  apiKey: "AIzaSyD7EqMUFLJXvUVGUr-MlEJMrjSqxdDUnOU",
  authDomain: "scroller-4d10f.firebaseapp.com",
  databaseURL: "https://scroller-4d10f-default-rtdb.firebaseio.com", // Realtime Database URL
  projectId: "scroller-4d10f",
  storageBucket: "scroller-4d10f.appspot.com",
  messagingSenderId: "1053362115345",
  appId: "1:1053362115345:web:1e42a1c584dae0765a32b0",
  measurementId: "G-7Y65NLWMKL"
};

// Initialize Firebase (moved outside App component to prevent re-initialization)
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Initialize analytics as per user's config

// Icons (using inline SVG for simplicity and consistency)
const HomeIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
);
const AboutUsIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H2v-2a3 3 0 015.356-1.857M17 20v-9a2 2 0 00-2-2h-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v9m14 0a6 6 0 00-6-6v6m6-3h-6"></path></svg>
);
const ProductsIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
);
const SpecialtiesIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 7h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-2M9 12H7m8-2v2m-8 2h2m6 0h2"></path></svg>
);
const BestEmployeeIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);
const ContactIcon = () => (
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
);

// Helper function to safely get data and convert objects to arrays
// This is crucial for Realtime Database where objects are used to represent lists
const getSafeArray = (data, key) => {
  const item = data?.[key];
  if (Array.isArray(item)) {
    return item.filter(Boolean); // Filter out nulls
  }
  // If it's an object, convert its values to an array and filter out nulls
  // This handles cases where Realtime DB stores arrays as objects with numeric keys
  if (typeof item === 'object' && item !== null) {
    return Object.values(item).filter(Boolean);
  }
  return [];
};

// Home Page Component
const HomePage = ({ data }) => {
  const businessInfo = data?.businessInfo;
  const images = getSafeArray(data, 'images');
  const mainImageUrl = images.length > 0 ? images[0].imageUrl : 'https://placehold.co/1200x400/CCCCCC/333333?text=Main+Image';

  return (
    <div className="page-container bg-gradient-purple-indigo">
      <div className="content-card">
        {/* Welcome Section */}
        <h1 className="main-heading text-indigo-800">
          Welcome to <span className="highlight-text-purple">{businessInfo?.businessName || 'Our Business'}</span>
        </h1>
        <p className="sub-heading text-gray-700">
          {businessInfo?.AboutBusiness || 'Discover our services and see what makes us unique.'}
        </p>

        <div className="image-hero-container">
          <img
            src={mainImageUrl}
            alt="Business Main"
            className="image-cover hover-scale"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/1200x400/CCCCCC/333333?text=Image+Not+Found'; }}
          />
          <div className="image-overlay">

          </div>
        </div>

        <div className="grid-2-cols gap-8 mt-12">
          <div className="card-item bg-gradient-blue-light">
            <h3 className="card-title text-blue-700"><ProductsIcon /> Our Products</h3>
            <p className="card-text">Explore our cutting-edge products designed to meet your needs and exceed your expectations.</p>
          </div>
          <div className="card-item bg-gradient-green-light">
            <h3 className="card-title text-green-700"><SpecialtiesIcon /> Our Specialties</h3>
            <p className="card-text">We specialize in delivering top-notch services with unparalleled expertise.</p>
          </div>
        </div>

        {/* About Us Section */}
        <div className="mt-12">
          <AboutUsPage data={data} />
        </div>

        {/* Products Section */}
        <div className="mt-12">
          <ProductsPage data={data} />
        </div>

        {/* Specialties Section */}
        <div className="mt-12">
          <SpecialtiesPage data={data} />
        </div>

        {/* Best Employee Section */}
        <div className="mt-12">
          <BestEmployeePage data={data} />
        </div>

        {/* Contact Us Section */}
        <div className="mt-12">
          <ContactUsPage data={data} />
        </div>

        <div className="footer-text-bottom">
          <p>© {new Date().getFullYear()} {businessInfo?.businessName || 'Your Business Name'}. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

// About Us Page Component
const AboutUsPage = ({ data }) => {
  const teamMembers = getSafeArray(data, 'AboutUs');
  const businessName = data?.businessInfo?.businessName || 'Our Business';
  const aboutBusiness = data?.businessInfo?.AboutBusiness || 'A leading company committed to innovation and excellence.';

  return (
    <div className="page-container bg-gradient-blue-teal">
      <div className="content-card">
        <h1 className="main-heading text-teal-800">
          About <span className="highlight-text-blue">{businessName}</span>
        </h1>
        {/* <p className="sub-heading text-gray-700">
          {aboutBusiness} We are passionate about delivering high-quality solutions and fostering strong relationships with our clients.
        </p> */}

        {/* <h2 className="section-heading text-teal-700">Meet Our Team</h2> */}
        <div className="grid-3-cols sm-grid-2-cols gap-8">
          {teamMembers.length > 0 ? (
            teamMembers.map((member) => (
              <div key={member.id} className="team-member-card bg-gradient-indigo-purple">
                {/* <img
                  src={member.imageUrl || 'https://placehold.co/150x150/EEEEEE/555555?text=No+Image'}
                  alt={member.name}
                  className="team-member-img"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150x150/EEEEEE/555555?text=No+Image'; }}
                /> */}
                <h3 className="team-member-name text-indigo-800">{member.name}</h3>
                <p className="team-member-position text-purple-600">{member.position}</p>
                {member.date && <p className="team-member-date">Joined: {member.date}</p>}
              </div>
            ))
          ) : (
            <p className="no-data-message">No team members to display yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Products Page Component
const ProductsPage = ({ data }) => {
  const products = getSafeArray(data, 'Products');

  return (
    <div className="page-container bg-gradient-pink-red">
      <div className="content-card">
        <h1 className="main-heading text-red-800">
          Our <span className="highlight-text-pink">Products</span>
        </h1>
        {/* <p className="sub-heading text-gray-700">
          Explore our diverse range of products designed to enhance your experience and provide exceptional value.
        </p> */}

        <div className="grid-3-cols sm-grid-2-cols gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="product-card bg-gradient-gray-light">
                <img
                  src={product.imageUrl || 'https://placehold.co/400x300/CCCCCC/333333?text=Product+Image'}
                  alt={product.name}
                  className="product-img hover-scale-img"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/CCCCCC/333333?text=Product+Image'; }}
                />
                <div className="product-details">
                  <h3 className="product-name text-gray-800">{product.name}</h3>
                  <p className="product-price text-pink-600">₹{parseFloat(product.price).toFixed(2) || 'N/A'}</p>
                  <p className="product-description text-gray-700">
                    {product.description || 'A high-quality product offering excellent features and reliability.'}
                  </p>
                  <button className="product-button bg-pink-500 hover-bg-pink-600">
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-data-message">No products to display yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Specialties Page Component
const SpecialtiesPage = ({ data }) => {
  const specialties = getSafeArray(data, 'Specialties');

  return (
    <div className="page-container bg-gradient-green-lime">
      <div className="content-card">
        <h1 className="main-heading text-lime-800">
          Our <span className="highlight-text-green">Specialties</span>
        </h1>
        {/* <p className="sub-heading text-gray-700">
          We pride ourselves on our core competencies and the specialized services we offer to our clients.
        </p> */}

        <div className="grid-3-cols md-grid-2-cols gap-8">
          {specialties.length > 0 ? (
            specialties.map((specialty, index) => (
              <div key={index} className="specialty-item bg-gradient-teal-blue">
                <div className="specialty-icon-container">
                  &#10003; {/* Checkmark icon */}
                </div>
                <p className="specialty-text text-gray-800">{specialty}</p>
              </div>
            ))
          ) : (
            <p className="no-data-message">No specialties to display yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Best Employee Page Component
const BestEmployeePage = ({ data }) => {
  const bestEmployees = getSafeArray(data, 'BestEmployee');

  return (
    <div className="page-container bg-gradient-yellow-orange">
      <div className="content-card">
        <h1 className="main-heading text-orange-800">
          Our <span className="highlight-text-yellow">Team</span>
        </h1>
        <p className="sub-heading text-gray-700">
          We recognize and celebrate the exceptional contributions of our best employees. Their dedication drives our success.
        </p>

        <div className="grid-3-cols sm-grid-2-cols gap-8">
          {bestEmployees.length > 0 ? (
            bestEmployees.map((employee, index) => (
              <div key={index} className="employee-card bg-gradient-purple-pink">
                <img
                  src={employee.imageUrl || 'https://placehold.co/180x180/FDD835/616161?text=Employee+Award'}
                  alt={employee.employeeName}
                  className="employee-img"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/180x180/FDD835/616161?text=Employee+Award'; }}
                />
                <h3 className="employee-name text-orange-800">{employee.employeeName}</h3>
                <p className="employee-award text-pink-600">{employee.awardName}</p>
                {employee.date && <p className="employee-date">Awarded on: {employee.date}</p>}
              </div>
            ))
          ) : (
            <p className="no-data-message">No best employee awards to display yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Contact Us Page Component
const ContactUsPage = ({ data }) => {
  const contactInfo = data?.contacts?.contactInfo;
  const businessName = data?.businessInfo?.businessName || 'Our Business';

  return (
    <div className="page-container bg-gradient-indigo-purple">
      <div className="content-card">
        <h1 className="main-heading text-purple-800">
          Contact <span className="highlight-text-indigo">Us</span>
        </h1>
        <p className="sub-heading text-gray-700">
          We'd love to hear from you! Reach out to us through any of the following channels.
        </p>

        <div className="contact-info-card bg-gradient-blue-indigo">
          {contactInfo?.address && (
            <div className="contact-item">
              <svg className="contact-icon color-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"></path></svg>
              <p className="contact-text">{contactInfo.address}</p>
            </div>
          )}
          {contactInfo?.phone && (
            <div className="contact-item">
              <svg className="contact-icon color-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              <p className="contact-text">{contactInfo.phone}</p>
            </div>
          )}
          {contactInfo?.email && (
            <div className="contact-item">
              <svg className="contact-icon color-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <p className="contact-text"><a href={`mailto:${contactInfo.email}`} className="text-link-indigo">{contactInfo.email}</a></p>
            </div>
          )}
          {contactInfo?.whatsapp && (
            <div className="contact-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                width="24"
                height="24"
                fill="currentColor"
                className="contact-icon color-green"
              >
                <path d="M16 .396C7.163.396 0 7.56 0 16.396c0 2.891.766 5.73 2.214 8.23L.36 31.638l7.186-1.88c2.376 1.294 5.067 1.975 7.954 1.975 8.837 0 16-7.163 16-16 0-4.268-1.665-8.279-4.687-11.302C24.28 2.06 20.268.396 16 .396zm0 29.208c-2.574 0-5.074-.688-7.28-1.988l-.521-.305-4.271 1.117 1.136-4.151-.338-.538C3.454 22.032 2.708 19.248 2.708 16.396c0-7.312 5.98-13.292 13.292-13.292 3.554 0 6.897 1.385 9.407 3.895 2.51 2.511 3.895 5.854 3.895 9.407 0 7.312-5.98 13.292-13.292 13.292zm7.535-9.937c-.412-.206-2.436-1.206-2.816-1.342-.38-.138-.657-.206-.935.207s-1.072 1.342-1.313 1.616c-.242.275-.482.31-.894.103-.412-.206-1.743-.643-3.32-2.047-1.227-1.095-2.052-2.45-2.294-2.862-.242-.413-.026-.635.181-.84.186-.184.412-.48.618-.72.206-.24.275-.413.412-.688.138-.275.07-.516-.034-.72-.104-.206-.935-2.253-1.282-3.084-.337-.812-.679-.702-.935-.716l-.797-.012c-.275 0-.72.103-1.097.516-.38.413-1.446 1.41-1.446 3.438s1.48 3.984 1.684 4.263c.206.275 2.914 4.445 7.057 6.23.988.426 1.758.682 2.36.872.993.315 1.897.27 2.614.164.797-.117 2.436-1.006 2.78-1.978.343-.972.343-1.805.24-1.978-.103-.172-.377-.275-.789-.48z" />
              </svg>

              <p className="contact-text"><a href={`https://wa.me/${contactInfo.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-link-green">Chat on WhatsApp</a></p>
            </div>
          )}
          {contactInfo?.timings && (
            <div className="contact-item">
              <svg className="contact-icon color-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <p className="contact-text">Hours: {contactInfo.timings}</p>
            </div>
          )}
          {(contactInfo?.facebook || contactInfo?.instagram || contactInfo?.youtube) && (
            <div className="social-links-container">
              {contactInfo.facebook && (
                <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer" className="social-icon-link color-facebook">
                  <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.776-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </a>
              )}
              {contactInfo.instagram && (
                <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className="social-icon-link color-instagram">
                  <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.792.01 3.24.029 2.863.186 4.464 1.42 5.256 2.21.79.791 2.024 2.393 2.21 5.257.019.447.029.81.029 3.24s-.01 2.793-.029 3.24c-.186 2.863-1.42 4.464-2.21 5.256-.791.79-2.393 2.024-5.257 2.21-.447.019-.81.029-3.24.029s-2.793-.01-3.24-.029c-2.863-.186-4.464-1.42-5.256-2.21-.79-.791-2.024-2.393-2.21-5.257-.019-.447-.029-.81-.029-3.24s.01-2.793.029-3.24c.186-2.863 1.42-4.464 2.21-5.256.791-.79 2.393-2.024 5.257-2.21.447-.019.81-.029 3.24-.029zm0 2.163c-2.899 0-3.21.011-3.657.031-2.613.17-4.14 1.34-4.845 2.046-.705.705-1.876 2.232-2.046 4.845-.02.447-.031.758-.031 3.657s.011 3.21.031 3.657c.17 2.613 1.34 4.14 2.046 4.845.705.705 2.232 1.876 4.845 2.046.447.02 3.21.031 3.657.031s3.21-.011 3.657-.031c2.613-.17 4.14-1.34 4.845-2.046.705-.705 1.876-2.232 2.046-4.845.02-.447.031-.758.031-3.657s-.011-3.21-.031-3.657c-.17-2.613-1.34-4.14-2.046-4.845-.705-.705-1.876-2.232-4.845-2.046-.447-.02-3.21-.031-3.657-.031zM12.315 9.176c1.554 0 2.81 1.256 2.81 2.81s-1.256 2.81-2.81 2.81-2.81-1.256-2.81-2.81 1.256-2.81 2.81-2.81zm0 2.163c-.381 0-.693.312-.693.693s.312.693.693.693.693-.312.693-.693-.312-.693-.693-.693zM16.5 7.404c-.655 0-1.185.53-1.185 1.185s.53 1.185 1.185 1.185 1.185-.53 1.185-1.185-.53-1.185-1.185-1.185z" clipRule="evenodd" /></svg>
                </a>
              )}
              {contactInfo.youtube && (
                <a href={contactInfo.youtube} target="_blank" rel="noopener noreferrer" className="social-icon-link color-youtube">
                  <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19.812 5.44C19.423 3.523 17.994 2.073 16.074 1.684 14.854 1.342 12 1.342 12 1.342s-2.854 0-4.074.342C5.994 2.073 4.564 3.523 4.176 5.44 3.834 6.66 3.834 9.342 3.834 9.342s0 2.682.342 3.9C4.564 15.462 5.994 16.912 7.914 17.302 9.134 17.644 12 17.644 12 17.644s2.854 0 4.074-.342c1.92-.39 3.349-1.84 3.738-3.758.342-1.218.342-3.9.342-3.9s0-2.682-.342-3.9zm-8.47 8.35v-6.98l6.103 3.49-6.103 3.49z" clipRule="evenodd" /></svg>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [websiteData, setWebsiteData] = useState(null);
  const [loading, setLoading] = useState(true); // Keep loading true initially
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const { mobileNumber } = useParams();
  console.log('Extracted mobileNumber:', mobileNumber, typeof mobileNumber);
  const trimmedMobileNumber = mobileNumber ? mobileNumber.trim() : '';
  console.log('Regex test:', trimmedMobileNumber ? /^\d{10}$/.test(trimmedMobileNumber) : 'No mobileNumber');

  const isValidMobileNumber = trimmedMobileNumber && /^\d{10}$/.test(trimmedMobileNumber);
  const REALTIME_DB_PATH = isValidMobileNumber ? `MarketingPro/WebBuilder/${trimmedMobileNumber}` : null;

  // Authentication setup
  useEffect(() => {
    try {
      const database = getDatabase(app);
      const authentication = getAuth(app);
      setDb(database);
      setAuth(authentication);

      const unsubscribeAuth = onAuthStateChanged(authentication, async (user) => {
        if (user) {
          console.log('Authenticated user:', user.uid);
          setUserId(user.uid);
        } else {
          try {
            const userCredential = await signInAnonymously(authentication);
            console.log('Anonymous sign-in successful:', userCredential.user.uid);
          } catch (e) {
            console.error('Anonymous sign-in error:', e.code, e.message);
            setError(`Authentication failed: ${e.message}. Data access may be unaffected due to permissive rules.`);
            setLoading(false);
          }
        }
      });

      return () => unsubscribeAuth();
    } catch (e) {
      console.error('Firebase initialization error:', e);
      setError('Failed to initialize Firebase. Please check your configuration.');
      setLoading(false);
    }
  }, []);

  // Data fetching with improved loading state
  useEffect(() => {
    if (!mobileNumber) {
      setError('Missing mobile number in the URL. Ensure URL is like /9370329233.');
      setLoading(false);
      return;
    }
    if (!isValidMobileNumber) {
      setError(`Invalid mobile number: "${mobileNumber}". Must be exactly 10 digits.`);
      setLoading(false);
      return;
    }

    if (db && REALTIME_DB_PATH) {
      const dataRef = ref(db, REALTIME_DB_PATH);
      console.log(`Fetching data from: ${REALTIME_DB_PATH}`);

      const unsubscribeData = onValue(
        dataRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const fetchedData = snapshot.val();
            console.log('Fetched data:', fetchedData);
            setWebsiteData(fetchedData);
            setError(null);
          } else {
            console.log('No data at path:', REALTIME_DB_PATH);
            setWebsiteData(null);
            setError(`No website data found for mobile number: ${trimmedMobileNumber}.`);
          }
          setLoading(false); // Set loading to false after first snapshot
        },
        (e) => {
          console.error('Database error:', e.code, e.message);
          setError(`Failed to load data: ${e.message}.`);
          setLoading(false);
        }
      );

      return () => unsubscribeData();
    }
  }, [db, REALTIME_DB_PATH, isValidMobileNumber, trimmedMobileNumber, mobileNumber]);

  const renderPage = useCallback(() => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-content">
            <div className="spinner"></div>
            <p className="loading-text">Loading website data...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <div className="error-content">
            <h2 className="error-heading">Error!</h2>
            <p className="error-message">{error}</p>
            {isValidMobileNumber && (
              <p className="error-hint">
                Please ensure your data is correctly structured in Realtime Database under: <br />
                <span className="code-path">{REALTIME_DB_PATH}</span>
              </p>
            )}
          </div>
        </div>
      );
    }

    if (!websiteData) {
      return (
        <div className="no-data-container">
          <div className="no-data-content">
            <h2 className="no-data-heading">No Data Found</h2>
            <p className="no-data-message-text">
              No website data available for mobile number:{' '}
              <span className="highlight-text-yellow-dark">{trimmedMobileNumber}</span>.
            </p>
            <p className="no-data-hint">
              Please ensure you have uploaded your business information to Realtime Database at: <br />
              <span className="code-path">{REALTIME_DB_PATH}</span>
            </p>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case 'home':
        return <HomePage data={websiteData} />;
      case 'aboutUs':
        return <AboutUsPage data={websiteData} />;
      case 'products':
        return <ProductsPage data={websiteData} />;
      case 'specialties':
        return <SpecialtiesPage data={websiteData} />;
      case 'bestEmployee':
        return <BestEmployeePage data={websiteData} />;
      case 'contactUs':
        return <ContactUsPage data={websiteData} />;
      default:
        return <HomePage data={websiteData} />;
    }
  }, [currentPage, loading, error, websiteData, REALTIME_DB_PATH, trimmedMobileNumber, isValidMobileNumber]);

  return (
    <div className="app-container">
      {/* Custom CSS styles (unchanged) */}
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        body {
            margin: 0;
            font-family: 'Inter', sans-serif;
            background-color: #f3f4f6;
            min-height: 100vh;
        }

        .text-shadow-lg {
            text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.4);
        }

        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #555;
        }

        .page-container {
            min-height: 100vh;
            font-family: 'Inter', sans-serif;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        @media (min-width: 768px) {
            .page-container {
                padding: 2.5rem;
            }
        }

        .content-card {
            background-color: #ffffff;
            border-radius: 0.75rem;
            margin-top: 1.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            padding: 0.2rem;
            transform: scale(1);
            transition: all 0.3s ease-in-out;
        }
        .content-card:hover {
            transform: scale(1.01);
        }

        .main-heading {
            font-size: 2.25rem;
            font-weight: 800;
            text-align: center;
            margin-bottom: 1.5rem;
            line-height: 1.25;
            color: #374151;
        }
        @media (min-width: 768px) {
            .main-heading {
                font-size: 3rem;
            }
        }

        .sub-heading {
            font-size: 1.125rem;
            text-align: center;
            color: #4b5563;
            margin-bottom: 2rem;
            max-width: 42rem;
            margin-left: auto;
            margin-right: auto;
        }
        @media (min-width: 768px) {
      
    .content-card {
    height: auto; /* Ensures it grows with content */
}

            .sub-heading {
                font-size: 1.25rem;
            }
        }

        .section-heading {
            font-size: 1.875rem;
            font-weight: 700;
            color: #115e59;
            margin-bottom: 2rem;
            text-align: center;
        }

        .no-data-message {
            text-align: center;
            color: #4b5563;
            font-size: 1.125rem;
            width: 100%;
            padding: 1rem;
        }

        .image-hero-container {
            width: 100%;
            height: 16rem;
            background-color: #e5e7eb;
            border-radius: 0.5rem;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            margin-bottom: 2rem;
            position: relative;
        }
        @media (min-width: 768px) {
            .image-hero-container {
                height: 24rem;
            }
        }

        .image-cover {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease-in-out;
        }
        .image-cover.hover-scale:hover {
            transform: scale(1.05);
        }

        .image-overlay {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background-color: rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .image-overlay-text {
            color: #ffffff;
            font-size: 1.875rem;
            font-weight: 700;
            text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.4);
            padding: 1rem;
            background-color: rgba(0, 0, 0, 0.4);
            border-radius: 0.5rem;
        }
        @media (min-width: 768px) {
            .image-overlay-text {
                font-size: 2.25rem;
            }
        }

        .grid-2-cols {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;
        }
        @media (min-width: 768px) {
            .grid-2-cols {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }
        }

        .grid-3-cols {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;
        }
        @media (min-width: 640px) {
          .grid-3-cols.sm-grid-2-cols {
              grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (min-width: 1024px) {
            .grid-3-cols {
                grid-template-columns: repeat(3, minmax(0, 1fr));
            }
        }
        @media (min-width: 768px) {
          .grid-3-cols.md-grid-2-cols {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        .card-item {
            padding: 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            transition: all 0.3s ease-in-out;
        }
        .card-item:hover {
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .card-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
        }

        .card-text {
            color: #4b5563;
        }

        .team-member-card {
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            padding: 1.5rem;
            text-align: center;
            transform: scale(1);
            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .team-member-card:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .team-member-img {
            width: 8rem;
            height: 8rem;
            border-radius: 9999px;
            object-fit: cover;
            margin-bottom: 1rem;
            border: 4px solid #a78bfa;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .team-member-name {
            font-size: 1.25rem;
            font-weight: 600;
            color: #312e81;
            margin-bottom: 0.25rem;
        }

        .team-member-position {
            font-size: 1rem;
            color: #9333ea;
            margin-bottom: 0.5rem;
        }

        .team-member-date {
            font-size: 0.875rem;
            color: #6b7280;
        }

        .product-card {
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            overflow: hidden;
            transform: scale(1);
            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        }
        .product-card:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .product-img {
            width: 100%;
            height: 12rem;
            object-fit: cover;
            transition: transform 0.3s ease-in-out;
        }
        .product-img.hover-scale-img:hover {
            transform: scale(1.1);
        }

        .product-details {
            padding: 1.5rem;
        }

        .product-name {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 0.5rem;
        }

        .product-price {
            font-size: 1.25rem;
            font-weight: 600;
            color: #ec4899;
            margin-bottom: 1rem;
        }

        .product-description {
            color: #4b5563;
            font-size: 0.875rem;
        }

        .product-button {
            margin-top: 1rem;
            width: 100%;
            background-color: #ec4899;
            color: #ffffff;
            font-weight: 700;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            transition: background-color 0.3s ease-in-out;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: none;
            cursor: pointer;
        }
        .product-button:hover {
            background-color: #db2777;
        }

        .specialty-item {
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            padding: 1.5rem;
            transform: scale(1);
            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
            display: flex;
            align-items: flex-start;
            gap: 1rem;
        }
        .specialty-item:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .specialty-icon-container {
            flex-shrink: 0;
            color: #10b981;
            font-size: 1.875rem;
            font-weight: 700;
        }

        .specialty-text {
            font-size: 1.125rem;
            color: #1f2937;
            flex-grow: 1;
        }

        .employee-card {
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            padding: 1.5rem;
            text-align: center;
            transform: scale(1);
            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .employee-card:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .employee-img {
            width: 11rem;
            height: 11rem;
            border-radius: 9999px;
            object-fit: cover;
            margin-bottom: 1rem;
            border: 4px solid #fcd34d;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .employee-name {
            font-size: 1.5rem;
            font-weight: 700;
            color: #9a3412;
            margin-bottom: 0.25rem;
        }

        .employee-award {
            font-size: 1.125rem;
            color: #ec4899;
            margin-bottom: 0.5rem;
        }

        .employee-date {
            font-size: 0.875rem;
            color: #6b7280;
        }

        .contact-info-card {
            max-width: 32rem;
            margin-left: auto;
            margin-right: auto;
            border-radius: 0.75rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            padding: 2rem;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .contact-item {
            display: flex;
            align-items: center;
            color: #1f2937;
        }

        .contact-icon {
            width: 1.5rem;
            height: 1.5rem;
            margin-right: 0.75rem;
        }

        .contact-text {
            font-size: 1.125rem;
        }

        .social-links-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1.5rem;
            padding-top: 1rem;
        }

        .social-icon-link {
            transition: color 0.3s ease-in-out;
        }

        .social-icon {
            width: 2rem;
            height: 2rem;
        }

        .navbar {
            background-color: #ffffff;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            padding: 1rem;
            position: sticky;
            top: 0;
            z-index: 50;
            border-bottom-left-radius: 0.75rem;
            border-bottom-right-radius: 0.75rem;
        }

        .navbar-container {
            max-width: 1280px;
            margin-left: auto;
            margin-right: auto;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
        }

        .navbar-brand {
            font-size: 1.5rem;
            font-weight: 700;
            color: #4338ca;
        }

        .navbar-links {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            justify-content: center;
            margin-top: 0.5rem;
        }
        @media (min-width: 640px) {
          .navbar-links {
            gap: 1rem;
            margin-top: 0;
          }
        }
        @media (max-width: 639px) {
            .navbar-links button {
                width: 100%;
                margin-bottom: 0.5rem;
            }
        }

        .nav-button {
            display: flex;
            align-items: center;
            padding: 0.5rem 0.75rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            font-weight: 500;
            transition: all 0.3s ease-in-out;
            border: none;
            cursor: pointer;
            background-color: transparent;
            color: #374151;
            text-decoration: none;
        }

        .nav-button:hover {
            background-color: #f3f4f6;
        }

        .nav-button.active {
            background-color: #4f46e5;
            color: #ffffff;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .icon {
            width: 1.25rem;
            height: 1.25rem;
            margin-right: 0.5rem;
        }

        .app-footer {
            background-color: #1f2937;
            color: #ffffff;
            padding: 1.5rem;
            margin-top: 2rem;
            border-top-left-radius: 0.75rem;
            border-top-right-radius: 0.75rem;
            box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
            text-align: center;
            font-size: 0.875rem;
        }

        .footer-text-bottom {
            text-align: center;
            color: #6b7280;
            font-size: 0.875rem;
            margin-top: 3rem;
        }

        .loading-container, .error-container, .no-data-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }

        .loading-container { background-color: #f9fafb; }
        .error-container { background-color: #fef2f2; }
        .no-data-container { background-color: #fffbeb; }

        .loading-content, .error-content, .no-data-content {
            text-align: center;
            padding: 2rem;
            background-color: #ffffff;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .error-content { border: 2px solid #ef4444; }
        .no-data-content { border: 2px solid #facc15; }

        .spinner {
            animation: spin 1s linear infinite;
            border: 2px solid transparent;
            border-bottom-color: #4f46e5;
            border-radius: 50%;
            height: 3rem;
            width: 3rem;
            margin-left: auto;
            margin-right: auto;
            margin-bottom: 1rem;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .loading-text {
            font-size: 1.125rem;
            color: #4b5563;
        }

        .error-heading, .no-data-heading {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
        }

        .error-heading { color: #b91c1c; }
        .no-data-heading { color: #b45309; }

        .error-message, .no-data-message-text {
            font-size: 1.125rem;
            color: #4b5563;
        }

        .error-hint, .no-data-hint {
            font-size: 0.875rem;
            color: #6b7280;
            margin-top: 0.5rem;
        }

        .code-path {
            font-family: monospace;
            background-color: #f3f4f6;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.875rem;
        }

        .text-indigo-800 { color: #312e81; }
        .text-purple-600 { color: #9333ea; }
        .text-blue-700 { color: #1d4ed8; }
        .text-green-700 { color: #047857; }
        .text-teal-800 { color: #115e59; }
        .text-blue-600 { color: #2563eb; }
        .text-red-800 { color: #991b1b; }
        .text-pink-600 { color: #ec4899; }
        .text-lime-800 { color: #4d7c0f; }
        .text-green-600 { color: #16a34a; }
        .text-orange-800 { color: #9a3412; }
        .text-yellow-600 { color: #d97706; }
        .highlight-text-purple { color: #9333ea; }
        .highlight-text-blue { color: #2563eb; }
        .highlight-text-pink { color: #ec4899; }
        .highlight-text-green { color: #16a34a; }
        .highlight-text-yellow-dark { color: #b45309; }
        .highlight-text-indigo { color: #4f46e5; }

        .bg-gradient-purple-indigo { background: linear-gradient(to bottom right, #f5f3ff, #eef2ff); }
        .bg-gradient-blue-light { background: linear-gradient(to right, #eff6ff, #e0e7ff); }
        .bg-gradient-green-light { background: linear-gradient(to right, #f0fdf4, #dcfce7); }
        .bg-gradient-blue-teal { background: linear-gradient(to bottom right, #eff6ff, #ccfbf1); }
        .bg-gradient-indigo-purple { background: linear-gradient(to bottom right, #eef2ff, #f5f3ff); }
        .bg-gradient-pink-red { background: linear-gradient(to bottom right, #fdf2f8, #fee2e2); }
        .bg-gradient-gray-light { background: linear-gradient(to bottom right, #f9fafb, #f3f4f6); }
        .bg-gradient-green-lime { background: linear-gradient(to bottom right, #f7fee7, #ecfccb); }
        .bg-gradient-teal-blue { background: linear-gradient(to bottom right, #f0fdfa, #eff6ff); }
        .bg-gradient-yellow-orange { background: linear-gradient(to bottom right, #fefce8, #fff7ed); }
        .bg-gradient-purple-pink { background: linear-gradient(to right, #f5f3ff, #fdf2f8); }
        .bg-gradient-blue { background: linear-gradient(to bottom right, #e0f7ff, #4f4ff); }
        .bg-gradient-blue-indigo { background: linear-gradient(to bottom right, #e0e7ff, #ee2ff); }

        .text-link-indigo { color: #4f46e5; text-decoration: underline; }
        .text-link-indigo:hover { color: #4338ca; }
        .text-link-green { color: #16a34a; text-decoration: underline; }
        .text-link-green:hover { color: #15803d; }
        .color-indigo { color: #4f46e5 }
        .color-green { color: #16a34a; }
        .color-blue {color: blue;}
        .color-facebook { color: #1877f2; }
        .color-facebook:hover { color: #0a66d8; }
        .color-instagram { color: #e1306c; }
        .color-instagram:hover { color: #c25c; }
        .color-youtube { color: #ff0000; }
        .color-youtube:hover { color: #cc0000; }

        .navbar {
          background-color: #fff;
          border-bottom: 1px solid #ccc;
          padding: 0.5rem 1rem;
        }

        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
        }

        .navbar-brand {
          font-weight: bold;
          font-size: 1.2rem;
        }

        .navbar-links {
          display: flex;
          flex-direction: row;
          gap: 1rem;
        }

        .nav-button {
          background: none;
          border: none;
          font-size: 1rem;
          padding: 0.5rem;
          cursor: pointer;
        }

        .nav-button.active {
          font-weight: bold;
          border-bottom: 2px solid #333;
        }

        .hamburger {
          display: none;
          background: none;
          border: none;
          font-size: 1.5rem;
        }

        @media (max-width: 639px) {
          .hamburger {
            display: block;
          }

          .navbar-links {
            flex-direction: column;
            width: 100%;
            display: none;
          }

          .navbar-links.open {
            display: flex;
            margin-top: 1rem;
          }

          .navbar-links button {
            width: 100%;
            text-align: left;
          }
        }
        `}
      </style>

      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            {websiteData?.businessInfo?.businessName || 'Your Business'}
          </div>

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
            {[
              { key: 'home', icon: <HomeIcon />, label: 'Home' },
              { key: 'aboutUs', icon: <AboutUsIcon />, label: 'About Us' },
              { key: 'products', icon: <ProductsIcon />, label: 'Products' },
              { key: 'specialties', icon: <SpecialtiesIcon />, label: 'Specialties' },
              { key: 'bestEmployee', icon: <BestEmployeeIcon />, label: 'Best Employee' },
              { key: 'contactUs', icon: <ContactIcon />, label: 'Contact Us' }
            ].map(({ key, icon, label }) => (
              <button
                key={key}
                onClick={() => {
                  setCurrentPage(key);
                  setMenuOpen(false);
                }}
                className={`nav-button ${currentPage === key ? 'active' : ''}`}
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="app-container-main">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="navbar-container">
          <p>© {new Date().getFullYear()} {websiteData?.businessInfo?.businessName || 'Your Business Name'}. All rights reserved.</p>
          <p style={{ marginTop: '0.5rem' }}>Designed and Developed with ❤️</p>
        </div>
      </footer>
    </div>
  );
}

export default App;