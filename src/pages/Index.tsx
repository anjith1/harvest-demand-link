import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RoleSelection from "@/components/RoleSelection";
import { MapPin, Users, ShoppingBag } from "lucide-react";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<"user" | "farmer" | "admin" | null>(null);
  const [showRoleSelection, setShowRoleSelection] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for user in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsLoggedIn(parsedUser.isLoggedIn || false);
        setUserType(parsedUser.userType || null);
        setShowRoleSelection(false);
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
    
    // Check if user has selected a role but not completed registration
    const selectedRole = localStorage.getItem('selectedRole');
    if (selectedRole && !storedUser) {
      setShowRoleSelection(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('selectedRole');
    setIsLoggedIn(false);
    setUserType(null);
    setShowRoleSelection(true);
  };

  const handleBackToSelection = () => {
    localStorage.removeItem('selectedRole');
    setShowRoleSelection(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} userType={userType} onLogout={handleLogout} />
      
      <main className="flex-grow">
        {showRoleSelection ? (
          <RoleSelection />
        ) : (
          // Hero Section
          <section className="bg-gradient-to-b from-agro-cream to-white py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-10 md:mb-0">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                    Connecting <span className="text-agro-green-dark">Farmers</span> with <span className="text-agro-green-dark">Communities</span>
                  </h1>
                  <p className="text-lg md:text-xl text-gray-700 mb-8">
                    AgroConnect bridges the gap between agricultural suppliers and areas in need.
                    Map your necessities and connect with local farmers for sustainable food solutions.
                  </p>
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <Button 
                      className="bg-agro-green-dark hover:bg-agro-green-light text-white py-2 px-6 text-lg"
                      onClick={() => navigate("/register")}
                    >
                      Get Started
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-agro-green-dark text-agro-green-dark hover:bg-agro-green-dark hover:text-white py-2 px-6 text-lg"
                      onClick={() => navigate("/about")}
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
                <div className="md:w-1/2 flex justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                    alt="Farmers working in field" 
                    className="rounded-lg shadow-xl max-w-full h-auto"
                    style={{ maxHeight: '400px' }}
                  />
                </div>
              </div>
            </div>
          </section>

          // How It Works
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How AgroConnect Works</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Our platform simplifies connecting agricultural needs with suppliers through a simple, effective process.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="overflow-hidden transform transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className="h-2 bg-agro-green-dark"></div>
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-agro-green-light rounded-full flex items-center justify-center mb-4 mx-auto">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-center mb-2">Mark Your Location</h3>
                    <p className="text-gray-600 text-center">
                      Easily pinpoint your location on our interactive map and list the agricultural supplies you need.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden transform transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className="h-2 bg-agro-green-dark"></div>
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-agro-green-light rounded-full flex items-center justify-center mb-4 mx-auto">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-center mb-2">Connect with Neighbors</h3>
                    <p className="text-gray-600 text-center">
                      When similar needs exist nearby, we group requests to create efficient distribution opportunities.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden transform transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className="h-2 bg-agro-green-dark"></div>
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-agro-green-light rounded-full flex items-center justify-center mb-4 mx-auto">
                      <ShoppingBag className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-center mb-2">Receive Supplies</h3>
                    <p className="text-gray-600 text-center">
                      Local farmers and suppliers view clustered requests and fulfill them efficiently, ensuring communities get what they need.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          // Call to Action
          <section className="bg-agro-green-dark text-white py-16">
            <div className="container mx-auto px-4 md:px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Connect?</h2>
              <p className="text-xl mb-8 max-w-3xl mx-auto">
                Whether you need supplies or can provide them, join our community today to strengthen local food networks.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  className="bg-white text-agro-green-dark hover:bg-agro-cream py-2 px-8 text-lg"
                  onClick={() => navigate("/register")}
                >
                  Sign Up Now
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10 py-2 px-8 text-lg"
                  onClick={() => navigate("/map")}
                >
                  Explore Map
                </Button>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
