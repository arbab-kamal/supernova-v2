"use client"
import React, { useState, useEffect } from 'react';
import { MessageCircle, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LoadingScreen from '@/components/global/loading/loading';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('userLogin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const router = useRouter();
  
  // Handle mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // If not mounted yet, return null to avoid hydration errors
  if (!mounted) {
    return null;
  }
  
  // Updated color theme with pastel greens
  const colorTheme = {
    primary: '#5CAB7D',      // Main pastel green
    primaryLight: '#7DCCA0', // Lighter pastel green for hover states
    primaryLighter: '#A8E6C3', // Very light pastel green for backgrounds
    primaryDark: '#3D8C5F',  // Darker pastel green for accents
    primaryDarker: '#2A6A45', // Very dark pastel green for text/accents
    white: '#FFFFFF',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    error: '#EF4444'
  };

  const handleUserLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:8080/userLogin', {
        email,
        password
      });
      
      // Show loading screen after successful API response
      setShowLoadingScreen(true);
      
      // Show success toast
      toast.success('User login successful!', {
        description: `Welcome back, ${email}!`,
        duration: 3000,
      });
      
      // Handle successful login
      console.log('User login successful:', response.data);
      
      // Delay navigation to allow loading screen to show
      setTimeout(() => {
        // Redirect to user dashboard
        router.push('/project');
      }, 1500);
      
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Failed to login. Please check your credentials.');
      
      // Show error toast
      toast.error('Login failed', {
        description: error.response?.data?.message || 'Please check your credentials and try again.',
        duration: 5000,
      });
      
      setIsLoading(false);
    }
  };
  
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:8080/adminLogin', {
        email,
        password
      });
      
      // Show loading screen after successful API response
      setShowLoadingScreen(true);
      
      // Show success toast
      toast.success('Admin login successful!', {
        description: `Welcome back, ${email}!`,
        duration: 3000,
      });
      
      // Handle successful admin login
      console.log('Admin login successful:', response.data);
      
      // Delay navigation to allow loading screen to show
      setTimeout(() => {
        // Redirect to admin dashboard
        router.push('/admin');
      }, 1500);
      
    } catch (error) {
      console.error('Admin login error:', error);
      setError(error.response?.data?.message || 'Failed to login. Please check your credentials.');
      
      // Show error toast
      toast.error('Login failed', {
        description: error.response?.data?.message || 'Please check your credentials and try again.',
        duration: 5000,
      });
      
      setIsLoading(false);
    }
  };
  
  if (showLoadingScreen) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between" 
           style={{ background: `linear-gradient(to bottom right, ${colorTheme.primary}, ${colorTheme.primaryDark})` }}>
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-8 h-8 text-white" />
          <span className="text-2xl font-bold text-white">SuperNova</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white">
            Say Hello to SuperNova
          </h1>
          <p className="text-xl text-white/90">
            SuperNova is always ready to chat with you and answer your questions.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-white">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                💬
              </div>
              <div>
                <h3 className="font-semibold">Ask Anything</h3>
                <p className="text-white/80">
                  Just type your message in the chatbox
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-white">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                ⚡
              </div>
              <div>
                <h3 className="font-semibold">Lightning Fast</h3>
                <p className="text-white/80">
                  Get instant responses to your queries
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-white/80">
          © 2025 SuperNova. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Tabs */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center">
              <MessageCircle className="w-6 h-6" style={{ color: colorTheme.primary }} />
              <span className="text-xl font-bold ml-2 text-gray-900">SuperNova</span>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger 
                value="userLogin"
                className={activeTab === 'userLogin' ? 'text-white' : ''}
                style={{ 
                  backgroundColor: activeTab === 'userLogin' ? colorTheme.primary : '',
                }}
              >
                User Login
              </TabsTrigger>
              <TabsTrigger 
                value="adminLogin"
                className={activeTab === 'adminLogin' ? 'text-white' : ''}
                style={{ 
                  backgroundColor: activeTab === 'adminLogin' ? colorTheme.primary : '',
                }}
              >
                Admin Login
              </TabsTrigger>
            </TabsList>

            <TabsContent value="userLogin" className="rounded-lg p-6 bg-white shadow-lg">
              <div className="text-center pb-4">
                <h2 className="text-2xl font-semibold text-gray-900">User Login</h2>
                <p className="text-gray-500">
                  Log in to continue to SuperNova Bot
                </p>
              </div>
              
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleUserLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-50"
                    style={{ outlineColor: colorTheme.primary }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-gray-50"
                      style={{ outlineColor: colorTheme.primary }}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-right cursor-pointer hover:underline text-gray-600">
                    Forgot password?
                  </p>
                </div>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                  style={{ 
                    backgroundColor: colorTheme.primary,
                    opacity: isLoading ? 0.7 : 1,
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="adminLogin" className="rounded-lg p-6 bg-white shadow-lg">
              <div className="text-center pb-4">
                <h2 className="text-2xl font-semibold text-gray-900">Admin Login</h2>
                <p className="text-gray-500">
                  Log in to access admin controls
                </p>
              </div>
              
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-50"
                    style={{ outlineColor: colorTheme.primary }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-gray-50"
                      style={{ outlineColor: colorTheme.primary }}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                  style={{ 
                    backgroundColor: colorTheme.primary,
                    opacity: isLoading ? 0.7 : 1,
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isLoading ? "Logging in..." : "Admin Login"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;