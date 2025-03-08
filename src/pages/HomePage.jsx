import React, { useEffect } from 'react';
import Certification from './Certification'; // Import the Certification component

const HomePage = ({ setCurrentPage }) => {
  const handleShowProducts = () => {
    setCurrentPage('products'); // Show products page
  };

  // scroll reveal effect
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => {
      observer.observe(el);
    });
    
    return () => {
      animatedElements.forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Hero Section  */}
      <div className="bg-green-800 text-white text-center py-16 relative">
        {/* Background  */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="leaf-1 absolute top-10 left-20 text-3xl animate-float opacity-30">🍃</div>
          <div className="leaf-2 absolute top-32 right-40 text-3xl animate-float-slow opacity-30">🍃</div>
          <div className="leaf-3 absolute bottom-10 left-1/4 text-3xl animate-float-reverse opacity-30">🍃</div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fadeIn">Welcome to Green Marketplace</h1>
        <p className="text-lg mb-6 animate-slideUp">Discover eco-friendly and sustainable products that help you reduce your environmental footprint.</p>
        <button
          onClick={handleShowProducts}
          className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition transform hover:scale-105 duration-300 animate-pulse-subtle"
        >
          Browse Products
        </button>
      </div>

      {/* About Section */}
      <section className="py-16 px-4 text-center bg-white animate-on-scroll opacity-0 translate-y-10 transition duration-700">
        <h2 className="text-3xl font-bold text-green-800 mb-4">Why Choose Us?</h2>
        <p className="text-lg text-gray-700 mb-8 max-w-4xl mx-auto">
          At Green Marketplace, we curate only the finest eco-friendly and sustainable products that not only benefit you but also the planet. 
          From organic foods to eco-conscious fashion, we strive to offer a variety of products that help reduce your environmental footprint.
        </p>
        <button
          onClick={handleShowProducts}
          className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition transform hover:scale-105 duration-300"
        >
          Explore More
        </button>
      </section>

      {/* Features Section  */}
      <section className="py-16 px-4 bg-gray-100">
        <h2 className="text-3xl font-bold text-green-800 text-center mb-6 animate-on-scroll opacity-0 translate-y-10 transition duration-700">What We Offer</h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center animate-on-scroll opacity-0 translate-y-10 transition duration-700 delay-100 transform hover:scale-105 bg-white p-6 rounded-lg shadow-md">
            <div className="inline-block p-4 rounded-full bg-green-100 mb-4">
              <i className="fas fa-leaf text-4xl text-green-600"></i>
            </div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">Eco-Friendly Products</h3>
            <p className="text-gray-700">We carefully select products that minimize environmental impact while still offering quality and value.</p>
          </div>
          <div className="text-center animate-on-scroll opacity-0 translate-y-10 transition duration-700 delay-200 transform hover:scale-105 bg-white p-6 rounded-lg shadow-md">
            <div className="inline-block p-4 rounded-full bg-green-100 mb-4">
              <i className="fas fa-shipping-fast text-4xl text-green-600"></i>
            </div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">Fast Delivery</h3>
            <p className="text-gray-700">Enjoy quick and reliable shipping on all orders. We ensure that your green products arrive promptly.</p>
          </div>
          <div className="text-center animate-on-scroll opacity-0 translate-y-10 transition duration-700 delay-300 transform hover:scale-105 bg-white p-6 rounded-lg shadow-md">
            <div className="inline-block p-4 rounded-full bg-green-100 mb-4">
              <i className="fas fa-heart text-4xl text-green-600"></i>
            </div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">Sustainable Impact</h3>
            <p className="text-gray-700">Every purchase you make helps us support environmental initiatives and promote sustainability.</p>
          </div>
        </div>
      </section>

      {/* Certification Section */}
      <div className="animate-on-scroll opacity-0 translate-y-10 transition duration-700">
        <Certification />  {/* Use the Certification component */}
      </div>

      {/* Call to Action Section */}
      <section className="py-12 bg-gradient-to-r from-green-600 to-green-700 text-white text-center relative overflow-hidden">
        {/* Animated background pulse */}
        <div className="absolute inset-0 bg-green-500 animate-pulse-slow opacity-20"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4 animate-on-scroll opacity-0 translate-y-10 transition duration-700">Join the Green Movement Today!</h2>
          <p className="text-lg mb-6 animate-on-scroll opacity-0 translate-y-10 transition duration-700 delay-100">Start making conscious choices that help the planet. Browse our selection of sustainable products and make a difference.</p>
          <button
            onClick={handleShowProducts}
            className="bg-green-800 text-white px-6 py-3 rounded-full hover:bg-green-900 transition transform hover:scale-105 duration-300 hover:shadow-lg"
          >
            Browse Products
          </button>
        </div>
      </section>
    </div>
  );
};

// CustomAnimations component ((fix it for global style component))
const CustomAnimations = () => (
  <style jsx global>{`
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    @keyframes float-slow {
      0%, 100% { transform: translateY(0px) rotate(5deg); }
      50% { transform: translateY(-15px) rotate(-5deg); }
    }
    @keyframes float-reverse {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(20px); }
    }
    @keyframes pulse-slow {
      0%, 100% { opacity: 0.2; }
      50% { opacity: 0.3; }
    }
    @keyframes pulse-subtle {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    .animate-float-slow {
      animation: float-slow 8s ease-in-out infinite;
    }
    .animate-float-reverse {
      animation: float-reverse 7s ease-in-out infinite;
    }
    .animate-pulse-slow {
      animation: pulse-slow 4s ease-in-out infinite;
    }
    .animate-pulse-subtle {
      animation: pulse-subtle 2s ease-in-out infinite;
    }
    .animate-fadeIn {
      animation: fadeIn 1.5s ease-out;
    }
    .animate-slideUp {
      animation: slideUp 1s ease-out 0.5s both;
    }
  `}</style>
);

const HomePageWithAnimations = (props) => (
  <>
    <CustomAnimations />
    <HomePage {...props} />
  </>
);

export default HomePageWithAnimations;