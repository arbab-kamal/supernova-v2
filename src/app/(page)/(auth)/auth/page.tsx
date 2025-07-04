"use client"
import React, { useState, useEffect } from 'react';
import { MessageCircle, Eye, EyeOff, Sparkles, Zap, Shield, Users } from 'lucide-react';
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
  
  // Enhanced color theme with better contrast and gradients
  const colorTheme = {
    primary: '#5CAB7D',
    primaryLight: '#7DCCA0',
    primaryLighter: '#A8E6C3',
    primaryDark: '#3D8C5F',
    primaryDarker: '#2A6A45',
    accent: '#48C9B0',
    accentLight: '#76D7C4',
    white: '#FFFFFF',
    gray100: '#F8FAFC',
    gray200: '#E2E8F0',
    gray300: '#CBD5E1',
    gray400: '#94A3B8',
    gray500: '#64748B',
    gray600: '#475569',
    gray700: '#334155',
    gray800: '#1E293B',
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
      
      setShowLoadingScreen(true);
      
      toast.success('User login successful!', {
        description: `Welcome back, ${email}!`,
        duration: 3000,
      });
      
      console.log('User login successful:', response.data);
      
      setTimeout(() => {
        router.push('/project');
      }, 1500);
      
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Failed to login. Please check your credentials.');
      
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
      
      setShowLoadingScreen(true);
      
      toast.success('Admin login successful!', {
        description: `Welcome back, ${email}!`,
        duration: 3000,
      });
      
      console.log('Admin login successful:', response.data);
      
      setTimeout(() => {
        router.push('/admin');
      }, 1500);
      
    } catch (error) {
      console.error('Admin login error:', error);
      setError(error.response?.data?.message || 'Failed to login. Please check your credentials.');
      
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
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Enhanced Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Animated Background */}
        <div 
          className="absolute inset-0"
          style={{ 
            background: `linear-gradient(135deg, ${colorTheme.primary} 0%, ${colorTheme.primaryDark} 50%, ${colorTheme.accent} 100%)`,
          }}
        >
          {/* Animated floating elements */}
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-white/10 animate-pulse"></div>
          <div className="absolute bottom-40 right-16 w-24 h-24 rounded-full bg-white/5 animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-10 w-16 h-16 rounded-full bg-white/15 animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <MessageCircle className="w-10 h-10 text-white" />
              <Sparkles className="w-4 h-4 text-white absolute -top-1 -right-1" />
            </div>
            <span className="text-3xl font-bold text-white">SuperNova</span>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-white leading-tight">
                Welcome to the Future of AI
              </h1>
              <p className="text-xl text-white/90 max-w-md">
                Experience the power of SuperNova - your intelligent companion that's always ready to help, learn, and grow with you.
              </p>
            </div>
            
            {/* Enhanced Feature Cards */}
            <div className="space-y-6">
              <div className="group flex items-start space-x-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">Lightning Fast Responses</h3>
                  <p className="text-white/80 text-sm">
                    Get instant, accurate answers powered by advanced AI technology
                  </p>
                </div>
              </div>
              
              <div className="group flex items-start space-x-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">Secure & Private</h3>
                  <p className="text-white/80 text-sm">
                    Your conversations are protected with enterprise-grade security
                  </p>
                </div>
              </div>
              
              <div className="group flex items-start space-x-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">Collaborative AI</h3>
                  <p className="text-white/80 text-sm">
                    Work together with AI that understands context and learns from you
                  </p>
                </div>
              </div>
            </div>

          
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-white/60 text-sm">
            <span>© 2025 SuperNova. All rights reserved.</span>
            <div className="flex space-x-4">
              <span className="hover:text-white cursor-pointer">Privacy</span>
              <span className="hover:text-white cursor-pointer">Terms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center space-x-2">
              <MessageCircle className="w-8 h-8" style={{ color: colorTheme.primary }} />
              <span className="text-2xl font-bold text-gray-900">SuperNova</span>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Fixed TabsList - changed from grid-cols-3 to grid-cols-2 */}
            <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-gray-100 rounded-lg h-12">
              <TabsTrigger 
                value="userLogin"
                className="rounded-md py-2 px-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                style={{ 
                  backgroundColor: activeTab === 'userLogin' ? colorTheme.primary : 'transparent',
                  color: activeTab === 'userLogin' ? 'white' : colorTheme.gray600,
                  border: 'none',
                  outline: 'none'
                }}
              >
                User Login
              </TabsTrigger>
              <TabsTrigger 
                value="adminLogin"
                className="rounded-md py-2 px-4 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                style={{ 
                  backgroundColor: activeTab === 'adminLogin' ? colorTheme.primary : 'transparent',
                  color: activeTab === 'adminLogin' ? 'white' : colorTheme.gray600,
                  border: 'none',
                  outline: 'none'
                }}
              >
                Admin Login
              </TabsTrigger>
            </TabsList>

            <TabsContent value="userLogin" className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                <p className="text-gray-600">
                  Continue your AI journey with SuperNova
                </p>
              </div>
              
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleUserLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-gray-700 font-medium">Email Address</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 bg-gray-50 border-gray-200 focus:border-2 focus:bg-white transition-all"
                    style={{ 
                      focusBorderColor: colorTheme.primary,
                      outlineColor: colorTheme.primary 
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-gray-700 font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 bg-gray-50 border-gray-200 focus:border-2 focus:bg-white transition-all pr-12"
                      style={{ 
                        focusBorderColor: colorTheme.primary,
                        outlineColor: colorTheme.primary 
                      }}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-md transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <div className="text-right">
                    <a href="#" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 text-base font-medium rounded-lg transition-all hover:shadow-lg"
                  style={{ 
                    backgroundColor: colorTheme.primary,
                    opacity: isLoading ? 0.7 : 1,
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="adminLogin" className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">Admin Access</h2>
                <p className="text-gray-600">
                  Secure login for system administrators
                </p>
              </div>
              
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleAdminLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="admin-email" className="text-gray-700 font-medium">Admin Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="Enter admin email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 bg-gray-50 border-gray-200 focus:border-2 focus:bg-white transition-all"
                    style={{ 
                      focusBorderColor: colorTheme.primary,
                      outlineColor: colorTheme.primary 
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="admin-password" className="text-gray-700 font-medium">Admin Password</Label>
                  <div className="relative">
                    <Input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter admin password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 bg-gray-50 border-gray-200 focus:border-2 focus:bg-white transition-all pr-12"
                      style={{ 
                        focusBorderColor: colorTheme.primary,
                        outlineColor: colorTheme.primary 
                      }}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-md transition-colors"
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
                  className="w-full h-12 text-base font-medium rounded-lg transition-all hover:shadow-lg"
                  style={{ 
                    backgroundColor: colorTheme.primary,
                    opacity: isLoading ? 0.7 : 1,
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    "Admin Login"
                  )}
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