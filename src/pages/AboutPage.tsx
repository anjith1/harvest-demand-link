
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const AboutPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('user');
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        isLoggedIn={isLoggedIn} 
        userType={isLoggedIn ? JSON.parse(localStorage.getItem('user') || '{}').userType : null}
        onLogout={handleLogout}
      />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-agro-cream py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About AgroConnect</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Bridging the gap between agricultural supply and community demand through innovative location-based technology.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <img 
                  src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Community garden" 
                  className="rounded-lg shadow-xl max-w-full h-auto"
                />
              </div>
              <div className="md:w-1/2 md:pl-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-lg text-gray-600 mb-6">
                  At AgroConnect, we believe in creating sustainable food systems by connecting those who need agricultural supplies with the farmers and suppliers who can provide them.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  Our platform uses location-based technology to identify areas with clustered needs, enabling more efficient distribution and reducing waste in the agricultural supply chain.
                </p>
                <p className="text-lg text-gray-600">
                  By facilitating these connections, we aim to strengthen local food networks, support small-scale farmers, and ensure communities have access to the agricultural supplies they need.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-agro-cream">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How AgroConnect Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-agro-green-dark rounded-full flex items-center justify-center mb-4 text-white font-bold text-xl">1</div>
                <h3 className="text-xl font-semibold mb-2">Mark Your Location</h3>
                <p className="text-gray-600">
                  Users pinpoint their location on our interactive map and list the agricultural supplies they need, specifying quantities and types.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-agro-green-dark rounded-full flex items-center justify-center mb-4 text-white font-bold text-xl">2</div>
                <h3 className="text-xl font-semibold mb-2">Cluster Analysis</h3>
                <p className="text-gray-600">
                  Our system identifies areas where multiple users within a 10km radius need similar items, creating priority clusters for efficient distribution.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-agro-green-dark rounded-full flex items-center justify-center mb-4 text-white font-bold text-xl">3</div>
                <h3 className="text-xl font-semibold mb-2">Farmer Connection</h3>
                <p className="text-gray-600">
                  Local farmers and suppliers view these clusters and can bid to fulfill requests, creating an efficient marketplace for agricultural needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Team</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixlib=rb-4.0.3&q=80&w=300" 
                    alt="Team member" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">Alex Johnson</h3>
                <p className="text-agro-green-dark">Founder & CEO</p>
              </div>
              
              <div className="text-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixlib=rb-4.0.3&q=80&w=300" 
                    alt="Team member" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">Maria Rodriguez</h3>
                <p className="text-agro-green-dark">Agricultural Expert</p>
              </div>
              
              <div className="text-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixlib=rb-4.0.3&q=80&w=300" 
                    alt="Team member" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">David Chen</h3>
                <p className="text-agro-green-dark">Technology Lead</p>
              </div>
              
              <div className="text-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixlib=rb-4.0.3&q=80&w=300" 
                    alt="Team member" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">Sarah Patel</h3>
                <p className="text-agro-green-dark">Community Manager</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-agro-green-dark text-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Whether you're a community in need of agricultural supplies or a farmer looking to connect with nearby demands, AgroConnect is your platform.
            </p>
            <Button 
              className="bg-white text-agro-green-dark hover:bg-agro-cream py-2 px-8 text-lg"
              onClick={() => navigate("/register")}
            >
              Get Started Today
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
