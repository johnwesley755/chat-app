import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Footer from "../components/layout/Footer";
import { MessageSquare, Users, Shield, ArrowRight } from "lucide-react";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="md:flex md:items-center md:justify-between">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                  Connect with friends and colleagues in real-time
                </h1>
                <p className="text-lg md:text-xl mb-8 text-primary-100 leading-relaxed">
                  Our chat application provides a seamless and secure way to
                  communicate with anyone, anywhere in the world.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link to="/register">
                    <Button
                      variant="primary"
                      size="lg"
                      className="bg-white text-primary-600 hover:bg-gray-100 shadow-lg transform hover:translate-y-[-2px] transition-all"
                    >
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-white border-white hover:bg-white hover:bg-opacity-10 transition-all"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="relative rounded-xl shadow-2xl overflow-hidden transform rotate-1 hover:rotate-0 transition-all duration-300">
                  <img
                    src="/images/chat-preview.png"
                    alt="Chat Application Preview"
                    className="w-full"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/600x400?text=Chat+Application";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                Features that make communication better
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Everything you need for efficient and enjoyable conversations
                with your team and friends
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-6">
                  <MessageSquare className="w-7 h-7 text-primary-600 dark:text-primary-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Real-time Messaging
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Instant message delivery with typing indicators and read
                  receipts. Stay connected with zero lag.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-primary-600 dark:text-primary-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Group Chats
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Create group conversations with multiple participants for team
                  collaboration and social interactions.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-6">
                  <Shield className="w-7 h-7 text-primary-600 dark:text-primary-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Secure Communication
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  End-to-end encryption ensures your conversations remain
                  private and secure at all times.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-12 md:p-12 text-center md:text-left md:flex md:items-center md:justify-between">
                <div className="md:max-w-2xl mb-8 md:mb-0">
                  <h2 className="text-3xl font-extrabold text-white mb-4">
                    Ready to start chatting?
                  </h2>
                  <p className="text-lg text-primary-100 mb-0">
                    Join thousands of users who are already enjoying our
                    platform. Sign up today and experience seamless
                    communication.
                  </p>
                </div>
                <div>
                  <Link to="/register">
                    <Button
                      variant="primary"
                      size="lg"
                      className="bg-white text-primary-600 hover:bg-gray-100 shadow-lg flex items-center space-x-2 px-6"
                    >
                      <span>Create Your Account</span>
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
