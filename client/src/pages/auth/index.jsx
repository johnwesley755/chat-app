import React, { useState } from "react";
import backgroundImg from "../../assets/login2.png";
import victoryImg from "../../assets/victory.svg";
import { apiClient }  from "@/lib/api-client.js";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { toast } from "sonner";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { SIGNUP_ROUTE } from "@/utils/constants";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const validateSignup = () => {
    if(!email.length) {
      toast.error("Email is required");
      return false;
    }
    if(!password.length){
      toast.error("Password is required");
      return false;
    }
    if(password != confirmPassword){
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  }

  const handleLogin = async () => {
    // Implement login logic here
  };

  const handleSignup = async () => {
    // Implement signup logic here
    if(validateSignup()){
      alert("Done");
      const response = await apiClient.post(SIGNUP_ROUTE, {email, password});
      console.log({response});
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900">
      <div className="flex flex-col lg:flex-row bg-white shadow-2xl rounded-3xl overflow-hidden w-[90%] max-w-[1100px]">
        {/* Left Side */}
        <div className="flex flex-col items-center justify-center bg-gradient-to-b from-indigo-100 to-white p-10 lg:p-14 xl:p-20">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-800">
            Welcome
          </h1>
          <img src={victoryImg} alt="Victory" className="h-24 my-4" />
          <p className="text-gray-600 text-center text-lg">
            Fill in the details to get started with the best chat app
          </p>
        </div>

        {/* Right Side */}
        <div className="flex flex-col w-full lg:w-1/2 relative">
          {/* Background Image */}
          <div
            className="hidden lg:block absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImg})`,
            }}
          ></div>

          {/* Content Overlay */}
          <div className="relative z-10 flex flex-col w-full p-8 lg:p-14 bg-white bg-opacity-90 rounded-3xl lg:rounded-none">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="flex justify-between mb-6">
                <TabsTrigger
                  value="login"
                  className="w-1/2 text-center text-lg font-semibold py-2 border-b-2 transition-all duration-300 data-[state=active]:text-purple-500 data-[state=active]:border-purple-500"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="w-1/2 text-center text-lg font-semibold py-2 border-b-2 transition-all duration-300 data-[state=active]:text-purple-500 data-[state=active]:border-purple-500"
                >
                  Signup
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <div className="flex flex-col gap-4">
                  <Input
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-4 rounded-lg border-gray-300"
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-4 rounded-lg border-gray-300"
                  />
                  <Button
                    className="mt-4 bg-black text-white py-3 rounded-lg hover:bg-purple-600"
                    onClick={handleLogin}
                  >
                    Login
                  </Button>
                </div>
              </TabsContent>

              {/* Signup Tab */}
              <TabsContent value="signup">
                <div className="flex flex-col gap-4">
                  <Input
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-4 rounded-lg border-gray-300"
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-4 rounded-lg border-gray-300"
                  />
                  <Input
                    placeholder="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="p-4 rounded-lg border-gray-300"
                  />
                  <Button
                    className="mt-4 bg-black text-white py-3 rounded-lg hover:bg-purple-600"
                    onClick={handleSignup}
                  >
                    Signup
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
