import React, { useState, useEffect, useCallback } from 'react';
// Import Firebase Realtime Database specific functions
import { useParams } from 'react-router-dom'; // Import useParams for URL params
import { initializeApp } from 'firebase/app';
import './App.css'; // Import your CSS styles
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue,push,set } from 'firebase/database'; // Realtime Database imports
import { getAnalytics } from "firebase/analytics"; // As per user's provided config
import { Menu as MenuIcon, X as CloseIcon } from 'lucide-react'; // optional: use any icon
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import AOS from 'aos'; // Animation on scroll library
import 'aos/dist/aos.css';

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
 
  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"  ><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
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
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration
      once: true,     // only animate once
    });
  })

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
            <h2 className="image-overlay-text">
           
            </h2>
          </div>
        </div>

        <div className="grid-2-cols gap-8 mt-12" data-aos="fade-up" data-aos-delay="100">
          <div className="card-item bg-gradient-blue-light" >
            <h3 className="card-title text-blue-700" data-aos="fade-up" data-aos-delay="100"><ProductsIcon /> Our Products</h3>
            <p className="card-text">Explore our cutting-edge products designed to meet your needs and exceed your expectations.</p>
          </div>
          <div className="card-item bg-gradient-green-light" data-aos="fade-up" data-aos-delay="200">
            <h3 className="card-title text-green-700" data-aos="fade-up" data-aos-delay="400"><SpecialtiesIcon /> Our Specialties</h3>
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

        {/* <div className="footer-text-bottom">
          <p>© {new Date().getFullYear()} {businessInfo?.businessName || 'Your Business Name'}. All rights reserved.</p>
        </div> */}
      </div>
    </div>
  );
};

// About Us Page Component
const AboutUsPage = ({ data }) => {
  const teamMembers = getSafeArray(data, 'AboutUs');
  const businessName = data?.businessInfo?.businessName || 'Our Business';
  const aboutBusiness = data?.businessInfo?.AboutBusiness || 'A leading company committed to innovation and excellence.';
  const [items, setItems] = useState([]);
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration
     once: false,     // only animate once
    });
  
  })
  
  return (
    <div className="page-container bg-gradient-blue-teal"  data-aos="fade-up" data-aos-delay="300">
      <div className="content-card">
        <h1 className="main-heading text-teal-800">
          About <span className="highlight-text-blue">{businessName}</span>
        </h1>
        {/* <p className="sub-heading text-gray-700">
          {aboutBusiness} We are passionate about delivering high-quality solutions and fostering strong relationships with our clients.
        </p> */}

        <h2 className="section-heading text-teal-700"></h2>
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
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration
      once: true,     // only animate once
    });
  })
  

  return (
    <div className="page-container bg-gradient-pink-red"  data-aos="fade-up" data-aos-delay="200">
      <div className="content-card">
        <h1 className="main-heading text-red-800">
          Our <span className="highlight-text-pink">Products</span>
        </h1>
        <p className="sub-heading text-gray-700">
          Explore our diverse range of products designed to enhance your experience and provide exceptional value.
        </p>

        <div className="grid-3-cols sm-grid-2-cols gap-8"  data-aos="fade-up" data-aos-delay="300">
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
     useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration
      once: true,     // only animate once
    });
  }, []);
  
  return (
    <div className="page-container bg-gradient-green-lime">
      <div className="content-card"  data-aos="fade-up" data-aos-delay="300"   data-aos-once="false" data-aos-mirror="true">
        <h1 className="main-heading text-lime-800" data-aos-delay="300">
          Our <span className="highlight-text-green">Specialties</span>
        </h1>
        <p className="sub-heading text-gray-700" data-aos="fade-up" data-aos-delay="300">
          We pride ourselves on our core competencies and the specialized services we offer to our clients.
        </p>

        <div className="grid-3-cols md-grid-2-cols gap-8" data-aos="fade-up" data-aos-delay="400">
          {specialties.length > 0 ? (
            specialties.map((specialty, index) => (
              <div key={index} className="specialty-item bg-gradient-teal-blue" data-aos="zoom-in" data-aos-delay="500">
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
  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration
      once: true,     // only animate once
    });
  }, []);
  return (
    <div className="page-container bg-gradient-yellow-orange">
      <div className="content-card">
        <h1 className="main-heading text-orange-800"  data-aos="fade-up" data-aos-delay="300">
          Our <span className="highlight-text-yellow">Meet Our Team</span>
        </h1>
        <p className="sub-heading text-gray-700" data-aos="fade-up" data-aos-delay="300">
          We recognize and celebrate the exceptional contributions of our best employees. Their dedication drives our success.
        </p>

        <div className="grid-3-cols sm-grid-2-cols "  data-aos="fade-up" data-aos-delay="300">
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
          )},
          
          
           
         
        </div>
        
        
      </div>
    </div>
  );
};  


const ContactUsPage = ({ data }) => {
  const { mobileNumber } = useParams(); // ✅ Extract mobileNumber from route
  const cleanMobile = String(mobileNumber || '').trim();

  const contactInfo = data?.contacts?.contactInfo;
  const businessName = data?.businessInfo?.businessName || 'Our Business';

  console.log('ContactUsPage received mobileNumber:', cleanMobile);
  console.log('Is valid 10-digit number?', /^\d{10}$/.test(cleanMobile));

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    inquiry: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    console.log('Form Data:', formData);
    console.log('mobileNumber:', cleanMobile);

    // ✅ Validate mobile number
    if (!/^\d{10}$/.test(cleanMobile)) {
      alert('Error: Invalid or missing mobile number. Cannot submit inquiry.');
      return;
    }

    const { name, contact, inquiry } = formData;
    if (!name.trim() || !contact.trim() || !inquiry.trim()) {
      alert('Error: All fields must be filled out.');
      return;
    }

    try {
      const db = getDatabase();
      const inquiriesRef = ref(db, `MarketingPro/WebBuilder/${cleanMobile}/Inquiries`);
      const newInquiryRef = push(inquiriesRef);
      await set(newInquiryRef, {
        ...formData,
        timestamp: Date.now(),
      });

      alert('Inquiry submitted successfully!');
      setFormData({ name: '', contact: '', inquiry: '' });
    } catch (error) {
      console.error('Realtime Database Error:', {
        code: error.code,
        message: error.message,
        stack: error.stack,
        formData,
        mobileNumber: cleanMobile,
      });
      alert(`Failed to submit inquiry: ${error.message} (Code: ${error.code})`);
    }
  };

  return (
    <div className="page-container bg-gradient-indigo-purple" data-aos="fade-up" data-aos-delay="300">
      <div className="content-card">
        <h1 className="main-heading text-purple-800">
          Contact <span className="highlight-text-indigo">Us</span>
        </h1>
        <p className="sub-heading text-gray-700">
          We'd love to hear from you! Reach out to us through any of the following channels.
        </p>

        <form className="inquiry-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="contact">Phone :</label>
            <input
              type="text"
              id="contact"
              name="contact"
              maxLength={10}
              value={formData.contact}
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                setFormData({ ...formData, contact: onlyNumbers });
              }}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="inquiry">Inquiry:</label>
            <textarea
              id="inquiry"
              name="inquiry"
              rows="4"
              value={formData.inquiry}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit">Submit</button>
        </form>

        {/* CONTACT INFO CARDS — unchanged */}
        {/* You can keep your existing JSX for address, phone, timings, email, whatsapp, and social media here */}
        {/* No need to modify further unless layout/UI needs a fix */}
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
          
            <h2 className="error-heading">Error!</h2>
            <p className="error-message">{error}</p>
            {isValidMobileNumber && (
              <p className="error-hint">
                Please ensure your data is correctly structured in Realtime Database under: <br />
                <span className="code-path">{REALTIME_DB_PATH}</span>
              </p>
            )}
       
        </div>
      );
    }

    if (!websiteData) {
      return (
        <div className="no-data-container">
        
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
  return <ContactUsPage data={websiteData} mobileNumber={trimmedMobileNumber} />;

      default:
        return <HomePage data={websiteData} />;
    }
  }, [currentPage, loading, error, websiteData, REALTIME_DB_PATH, trimmedMobileNumber, isValidMobileNumber]);
 useEffect(() => {
              AOS.init({
                duration: 1000, // animation duration
                once: true,     // only animate once   
              });
            }, []);
  return (
    <div className="app-container">
      {/* Custom CSS styles (unchanged) */}
      <style>
        {` `}
      </style>

      {/* Navigation Bar */}
      
        <div className="navbar-container">
          <div className="navbar-brand">
            {websiteData?.businessInfo?.businessName || 'Your Business'}
          </div>

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          <div className={`navbar-links ${menuOpen ? 'open' : ''}`} data-aos="fade-up" data-aos-delay="100">
           
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
    

      {/* Page Content */}
      <main className="app-container-main">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-container">
          <p>© {new Date().getFullYear()} {websiteData?.businessInfo?.businessName || 'Your Business Name'}. All rights reserved.</p>
          <p style={{ marginTop: '0.5rem' }}>Designed and Developed with ❤️</p>
        </div>
      </footer>
    </div>
  );
}

export default App;