
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-agro-green-dark text-white py-8 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">AgroConnect</h3>
            <p className="text-sm">
              Connecting farmers with communities in need of agricultural supplies.
              Building sustainable food systems together.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm hover:underline">Home</Link></li>
              <li><Link to="/about" className="text-sm hover:underline">About Us</Link></li>
              <li><Link to="/map" className="text-sm hover:underline">Map View</Link></li>
              <li><Link to="/register" className="text-sm hover:underline">Join Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: info@agroconnect.org</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Farm Road, Agritown</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-agro-green-light mt-8 pt-4">
          <p className="text-sm text-center">
            © {new Date().getFullYear()} AgroConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
