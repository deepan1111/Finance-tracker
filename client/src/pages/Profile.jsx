

// import React, { useState, useEffect } from 'react';
// import Layout from '../components/layout/Layout';
// import { useAuth } from '../context/AuthContext';

// const Profile = () => {
//   const { user } = useAuth();
  
//   // Profile form state
//   const [profileData, setProfileData] = useState({
//     name: user?.name || '',
//     email: user?.email || '',
//     currency: user?.currency || 'USD',
//     phone: user?.phone || '',
//     timezone: user?.timezone || 'UTC',
//     language: user?.language || 'en'
//   });
  
//   // Password form state
//   const [passwordData, setPasswordData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
  
//   // UI state
//   const [isEditingProfile, setIsEditingProfile] = useState(false);
//   const [profileSaved, setProfileSaved] = useState(false);
//   const [passwordSaved, setPasswordSaved] = useState(false);
//   const [passwordError, setPasswordError] = useState('');
//   const [showPasswords, setShowPasswords] = useState({
//     current: false,
//     new: false,
//     confirm: false
//   });
//   const [passwordStrength, setPasswordStrength] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState('profile');

//   // Calculate password strength
//   useEffect(() => {
//     const password = passwordData.newPassword;
//     let strength = 0;
    
//     if (password.length >= 8) strength += 25;
//     if (password.length >= 12) strength += 25;
//     if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
//     if (/[0-9]/.test(password)) strength += 15;
//     if (/[^a-zA-Z0-9]/.test(password)) strength += 10;
    
//     setPasswordStrength(Math.min(strength, 100));
//   }, [passwordData.newPassword]);

//   const getPasswordStrengthColor = () => {
//     if (passwordStrength < 40) return 'bg-red-500';
//     if (passwordStrength < 70) return 'bg-yellow-500';
//     return 'bg-green-500';
//   };

//   const getPasswordStrengthText = () => {
//     if (passwordStrength < 40) return 'Weak';
//     if (passwordStrength < 70) return 'Medium';
//     return 'Strong';
//   };

//   // Handle profile input changes
//   const handleProfileChange = (e) => {
//     const { name, value } = e.target;
//     setProfileData(prev => ({ ...prev, [name]: value }));
//     setIsEditingProfile(true);
//   };

//   // Handle password input changes
//   const handlePasswordChange = (e) => {
//     const { name, value } = e.target;
//     setPasswordData(prev => ({ ...prev, [name]: value }));
//     setPasswordError('');
//   };

//   // Validate and save profile
//   const handleSaveProfile = async () => {
//     setIsLoading(true);
    
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 1000));
    
//     console.log('Saving profile:', profileData);
    
//     setProfileSaved(true);
//     setIsEditingProfile(false);
//     setIsLoading(false);
    
//     setTimeout(() => setProfileSaved(false), 3000);
//   };

//   // Cancel profile changes
//   const handleCancelProfile = () => {
//     setProfileData({
//       name: user?.name || '',
//       email: user?.email || '',
//       currency: user?.currency || 'USD',
//       phone: user?.phone || '',
//       timezone: user?.timezone || 'UTC',
//       language: user?.language || 'en'
//     });
//     setIsEditingProfile(false);
//   };

//   // Validate and update password
//   const handleUpdatePassword = () => {
//     // Validation
//     if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
//       setPasswordError('All password fields are required');
//       return;
//     }
    
//     if (passwordData.newPassword.length < 8) {
//       setPasswordError('New password must be at least 8 characters');
//       return;
//     }
    
//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       setPasswordError('New passwords do not match');
//       return;
//     }
    
//     // Add your API call here
//     console.log('Updating password');
    
//     setPasswordSaved(true);
//     setPasswordData({
//       currentPassword: '',
//       newPassword: '',
//       confirmPassword: ''
//     });
//     setPasswordError('');
    
//     setTimeout(() => setPasswordSaved(false), 3000);
//   };

//   // Toggle password visibility
//   const togglePasswordVisibility = (field) => {
//     setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
//   };

//   return (
//     <Layout>
//       <div className="max-w-6xl mx-auto space-y-6 pb-8">
//         {/* Header with gradient */}
//         <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white shadow-xl">
//           <div className="absolute inset-0 bg-black opacity-10"></div>
//           <div className="relative z-10">
//             <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
//             <p className="text-primary-100">Manage your account, security, and preferences</p>
//           </div>
//           <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
//           <div className="absolute -right-5 -bottom-5 w-32 h-32 bg-white opacity-10 rounded-full"></div>
//         </div>

//         {/* Success Messages */}
//         {profileSaved && (
//           <div className="bg-green-50 border-l-4 border-green-500 text-green-800 px-6 py-4 rounded-lg flex items-center shadow-md">
//             <div className="bg-green-500 rounded-full p-1 mr-3">
//               <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <div>
//               <p className="font-semibold">Success!</p>
//               <p className="text-sm">Profile updated successfully</p>
//             </div>
//           </div>
//         )}

//         {/* Tabs */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="flex border-b border-gray-200">
//             <button
//               onClick={() => setActiveTab('profile')}
//               className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
//                 activeTab === 'profile'
//                   ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
//                   : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//               }`}
//             >
//               <div className="flex items-center justify-center gap-2">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                 </svg>
//                 Profile Information
//               </div>
//             </button>
//             <button
//               onClick={() => setActiveTab('security')}
//               className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
//                 activeTab === 'security'
//                   ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
//                   : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//               }`}
//             >
//               <div className="flex items-center justify-center gap-2">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                 </svg>
//                 Security
//               </div>
//             </button>
//             <button
//               onClick={() => setActiveTab('preferences')}
//               className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
//                 activeTab === 'preferences'
//                   ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
//                   : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//               }`}
//             >
//               <div className="flex items-center justify-center gap-2">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                 </svg>
//                 Preferences
//               </div>
//             </button>
//           </div>

//           {/* Profile Tab Content */}
//           {activeTab === 'profile' && (
//             <div className="p-8">
//               {/* Profile Header */}
//               <div className="flex items-start justify-between mb-8">
//                 <div className="flex items-center gap-6">
//                   <div className="relative">
//                     <div className="h-24 w-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
//                       <span className="text-white font-bold text-3xl">
//                         {profileData.name?.charAt(0)?.toUpperCase() || 'U'}
//                       </span>
//                     </div>
//                     <button className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg border-2 border-gray-100 hover:bg-gray-50 transition-colors">
//                       <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
//                       </svg>
//                     </button>
//                   </div>
//                   <div>
//                     <h3 className="text-2xl font-bold text-gray-900">{profileData.name}</h3>
//                     <p className="text-gray-600 mt-1">{profileData.email}</p>
//                     <div className="flex items-center gap-2 mt-3">
//                       <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
//                         <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
//                         Active
//                       </span>
//                       <span className="text-sm text-gray-500">
//                         Member since {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Profile Form */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="group">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Full Name
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                       </svg>
//                     </div>
//                     <input
//                       type="text"
//                       name="name"
//                       className="input pl-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                       value={profileData.name}
//                       onChange={handleProfileChange}
//                       placeholder="Your full name"
//                     />
//                   </div>
//                 </div>

//                 <div className="group">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email Address
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                       </svg>
//                     </div>
//                     <input
//                       type="email"
//                       name="email"
//                       className="input pl-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                       value={profileData.email}
//                       onChange={handleProfileChange}
//                       placeholder="your.email@example.com"
//                     />
//                   </div>
//                 </div>

//                 <div className="group">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Phone Number
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                       </svg>
//                     </div>
//                     <input
//                       type="tel"
//                       name="phone"
//                       className="input pl-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                       value={profileData.phone}
//                       onChange={handleProfileChange}
//                       placeholder="+1 (555) 000-0000"
//                     />
//                   </div>
//                 </div>

//                 <div className="group">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Preferred Currency
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                     </div>
//                     <select 
//                       name="currency"
//                       className="input pl-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
//                       value={profileData.currency}
//                       onChange={handleProfileChange}
//                     >
//                       <option value="USD">🇺🇸 USD - US Dollar</option>
//                       <option value="EUR">🇪🇺 EUR - Euro</option>
//                       <option value="GBP">🇬🇧 GBP - British Pound</option>
//                       <option value="INR">🇮🇳 INR - Indian Rupee</option>
//                       <option value="CAD">🇨🇦 CAD - Canadian Dollar</option>
//                       <option value="AUD">🇦🇺 AUD - Australian Dollar</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
//                 <button 
//                   className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                   onClick={handleCancelProfile}
//                   disabled={!isEditingProfile || isLoading}
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                   onClick={handleSaveProfile}
//                   disabled={!isEditingProfile || isLoading}
//                 >
//                   {isLoading ? (
//                     <>
//                       <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Saving...
//                     </>
//                   ) : (
//                     'Save Changes'
//                   )}
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Security Tab Content */}
//           {activeTab === 'security' && (
//             <div className="p-8">
//               <div className="max-w-2xl">
//                 <h3 className="text-xl font-semibold text-gray-900 mb-2">Change Password</h3>
//                 <p className="text-gray-600 mb-8">Update your password to keep your account secure</p>

//                 {passwordSaved && (
//                   <div className="bg-green-50 border-l-4 border-green-500 text-green-800 px-6 py-4 rounded-lg flex items-center mb-6 shadow-md">
//                     <div className="bg-green-500 rounded-full p-1 mr-3">
//                       <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                       </svg>
//                     </div>
//                     <div>
//                       <p className="font-semibold">Password Updated!</p>
//                       <p className="text-sm">Your password has been changed successfully</p>
//                     </div>
//                   </div>
//                 )}

//                 {passwordError && (
//                   <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-lg flex items-center mb-6 shadow-md">
//                     <div className="bg-red-500 rounded-full p-1 mr-3">
//                       <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                       </svg>
//                     </div>
//                     <div>
//                       <p className="font-semibold">Error</p>
//                       <p className="text-sm">{passwordError}</p>
//                     </div>
//                   </div>
//                 )}

//                 <div className="space-y-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Current Password
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                         </svg>
//                       </div>
//                       <input
//                         type={showPasswords.current ? "text" : "password"}
//                         name="currentPassword"
//                         className="input pl-10 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                         value={passwordData.currentPassword}
//                         onChange={handlePasswordChange}
//                         placeholder="Enter current password"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => togglePasswordVisibility('current')}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                       >
//                         {showPasswords.current ? (
//                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                           </svg>
//                         ) : (
//                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                           </svg>
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       New Password
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
//                         </svg>
//                       </div>
//                       <input
//                         type={showPasswords.new ? "text" : "password"}
//                         name="newPassword"
//                         className="input pl-10 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                         value={passwordData.newPassword}
//                         onChange={handlePasswordChange}
//                         placeholder="Enter new password (min. 8 characters)"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => togglePasswordVisibility('new')}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                       >
//                         {showPasswords.new ? (
//                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                           </svg>
//                         ) : (
//                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                           </svg>
//                         )}
//                       </button>
//                     </div>
                    
//                     {/* Password Strength Indicator */}
//                     {passwordData.newPassword && (
//                       <div className="mt-3">
//                         <div className="flex items-center justify-between mb-1">
//                           <span className="text-xs font-medium text-gray-600">Password Strength</span>
//                           <span className={`text-xs font-semibold ${
//                             passwordStrength < 40 ? 'text-red-600' : 
//                             passwordStrength < 70 ? 'text-yellow-600' : 
//                             'text-green-600'
//                           }`}>
//                             {getPasswordStrengthText()}
//                           </span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
//                           <div 
//                             className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
//                             style={{ width: `${passwordStrength}%` }}
//                           ></div>
//                         </div>
//                         <div className="mt-2 space-y-1">
//                           <p className={`text-xs ${passwordData.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
//                             ✓ At least 8 characters
//                           </p>
//                           <p className={`text-xs ${/[A-Z]/.test(passwordData.newPassword) && /[a-z]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
//                             ✓ Upper & lowercase letters
//                           </p>
//                           <p className={`text-xs ${/[0-9]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
//                             ✓ Contains numbers
//                           </p>
//                           <p className={`text-xs ${/[^a-zA-Z0-9]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
//                             ✓ Special characters
//                           </p>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Confirm New Password
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                         </svg>
//                       </div>
//                       <input
//                         type={showPasswords.confirm ? "text" : "password"}
//                         name="confirmPassword"
//                         className="input pl-10 pr-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//                         value={passwordData.confirmPassword}
//                         onChange={handlePasswordChange}
//                         placeholder="Confirm new password"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => togglePasswordVisibility('confirm')}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                       >
//                         {showPasswords.confirm ? (
//                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                           </svg>
//                         ) : (
//                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                           </svg>
//                         )}
//                       </button>
//                     </div>
//                     {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
//                       <p className="mt-2 text-sm text-red-600">Passwords do not match</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
//                   <button 
//                     className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                     onClick={handleUpdatePassword}
//                   >
//                     Update Password
//                   </button>
//                 </div>

//                 {/* Two-Factor Authentication */}
//                 <div className="mt-8 pt-8 border-t border-gray-200">
//                   <h4 className="text-lg font-semibold text-gray-900 mb-2">Two-Factor Authentication</h4>
//                   <p className="text-gray-600 mb-4">Add an extra layer of security to your account</p>
//                   <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-between">
//                     <div className="flex items-center gap-4">
//                       <div className="bg-primary-100 rounded-full p-3">
//                         <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                         </svg>
//                       </div>
//                       <div>
//                         <p className="font-medium text-gray-900">2FA is not enabled</p>
//                         <p className="text-sm text-gray-600">Protect your account with an authenticator app</p>
//                       </div>
//                     </div>
//                     <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
//                       Enable 2FA
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Preferences Tab Content */}
//           {activeTab === 'preferences' && (
//             <div className="p-8">
//               <div className="max-w-2xl">
//                 <h3 className="text-xl font-semibold text-gray-900 mb-2">App Preferences</h3>
//                 <p className="text-gray-600 mb-8">Customize your experience</p>

//                 <div className="space-y-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Language
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
//                         </svg>
//                       </div>
//                       <select 
//                         name="language"
//                         className="input pl-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
//                         value={profileData.language}
//                         onChange={handleProfileChange}
//                       >
//                         <option value="en">English</option>
//                         <option value="es">Español</option>
//                         <option value="fr">Français</option>
//                         <option value="de">Deutsch</option>
//                         <option value="zh">中文</option>
//                         <option value="ja">日本語</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Timezone
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                         </svg>
//                       </div>
//                       <select 
//                         name="timezone"
//                         className="input pl-10 focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
//                         value={profileData.timezone}
//                         onChange={handleProfileChange}
//                       >
//                         <option value="UTC">UTC (Coordinated Universal Time)</option>
//                         <option value="America/New_York">Eastern Time (ET)</option>
//                         <option value="America/Chicago">Central Time (CT)</option>
//                         <option value="America/Denver">Mountain Time (MT)</option>
//                         <option value="America/Los_Angeles">Pacific Time (PT)</option>
//                         <option value="Europe/London">London (GMT)</option>
//                         <option value="Europe/Paris">Paris (CET)</option>
//                         <option value="Asia/Tokyo">Tokyo (JST)</option>
//                         <option value="Asia/Kolkata">India (IST)</option>
//                       </select>
//                     </div>
//                   </div>

//                   {/* Notification Preferences */}
//                   <div className="pt-6 border-t border-gray-200">
//                     <h4 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h4>
//                     <div className="space-y-4">
//                       <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                         <div className="flex items-center gap-3">
//                           <div className="bg-blue-100 rounded-lg p-2">
//                             <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                             </svg>
//                           </div>
//                           <div>
//                             <p className="font-medium text-gray-900">Email Notifications</p>
//                             <p className="text-sm text-gray-600">Receive updates via email</p>
//                           </div>
//                         </div>
//                         <label className="relative inline-flex items-center cursor-pointer">
//                           <input type="checkbox" className="sr-only peer" defaultChecked />
//                           <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
//                         </label>
//                       </div>

//                       <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                         <div className="flex items-center gap-3">
//                           <div className="bg-purple-100 rounded-lg p-2">
//                             <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
//                             </svg>
//                           </div>
//                           <div>
//                             <p className="font-medium text-gray-900">Push Notifications</p>
//                             <p className="text-sm text-gray-600">Receive push notifications</p>
//                           </div>
//                         </div>
//                         <label className="relative inline-flex items-center cursor-pointer">
//                           <input type="checkbox" className="sr-only peer" defaultChecked />
//                           <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
//                         </label>
//                       </div>

//                       <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                         <div className="flex items-center gap-3">
//                           <div className="bg-green-100 rounded-lg p-2">
//                             <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                             </svg>
//                           </div>
//                           <div>
//                             <p className="font-medium text-gray-900">Weekly Reports</p>
//                             <p className="text-sm text-gray-600">Get weekly expense summaries</p>
//                           </div>
//                         </div>
//                         <label className="relative inline-flex items-center cursor-pointer">
//                           <input type="checkbox" className="sr-only peer" />
//                           <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
//                         </label>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
//                   <button className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
//                     Save Preferences
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Profile;

import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currency: user?.currency || 'USD',
    phone: user?.phone || '',
    timezone: user?.timezone || 'UTC',
    language: user?.language || 'en'
  });
  
  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // UI state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Calculate password strength
  useEffect(() => {
    const password = passwordData.newPassword;
    let strength = 0;
    
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10;
    
    setPasswordStrength(Math.min(strength, 100));
  }, [passwordData.newPassword]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-red-500';
    if (passwordStrength < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 70) return 'Medium';
    return 'Strong';
  };

  // Handle profile input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    setIsEditingProfile(true);
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setPasswordError('');
  };

  // Validate and save profile
  const handleSaveProfile = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Saving profile:', profileData);
    
    setProfileSaved(true);
    setIsEditingProfile(false);
    setIsLoading(false);
    
    setTimeout(() => setProfileSaved(false), 3000);
  };

  // Cancel profile changes
  const handleCancelProfile = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      currency: user?.currency || 'USD',
      phone: user?.phone || '',
      timezone: user?.timezone || 'UTC',
      language: user?.language || 'en'
    });
    setIsEditingProfile(false);
  };

  // Validate and update password
  const handleUpdatePassword = () => {
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All password fields are required');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    // Add your API call here
    console.log('Updating password');
    
    setPasswordSaved(true);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError('');
    
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6 pb-8">
        {/* Header with gradient - Enhanced for mobile */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-black rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Profile Settings</h1>
            <p className="text-slate-300 text-sm sm:text-base">Manage your account, security, and preferences</p>
          </div>
          <div className="absolute -right-10 -top-10 w-32 h-32 sm:w-40 sm:h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -right-5 -bottom-5 w-24 h-24 sm:w-32 sm:h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
        </div>

        {/* Success Messages */}
        {profileSaved && (
          <div className="bg-gradient-to-r from-emerald-900/50 to-emerald-800/50 border border-emerald-500/50 text-emerald-100 px-4 sm:px-6 py-4 rounded-xl flex items-center shadow-lg backdrop-blur-sm">
            <div className="bg-emerald-500 rounded-full p-1 mr-3 flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-sm sm:text-base">Success!</p>
              <p className="text-xs sm:text-sm text-emerald-200">Profile updated successfully</p>
            </div>
          </div>
        )}

        {/* Tabs - Mobile optimized */}
        <div className="bg-slate-900 rounded-xl sm:rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
          <div className="flex border-b border-slate-700/50 overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 min-w-fit px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'profile'
                  ? 'text-blue-400 border-b-2 border-blue-500 bg-slate-800/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline">Profile Information</span>
                <span className="sm:hidden">Profile</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex-1 min-w-fit px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'security'
                  ? 'text-blue-400 border-b-2 border-blue-500 bg-slate-800/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Security
              </div>
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`flex-1 min-w-fit px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'preferences'
                  ? 'text-blue-400 border-b-2 border-blue-500 bg-slate-800/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="hidden sm:inline">Preferences</span>
                <span className="sm:hidden">Prefs</span>
              </div>
            </button>
          </div>

          {/* Profile Tab Content */}
          {activeTab === 'profile' && (
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Profile Header - Mobile optimized */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
                  <div className="relative flex-shrink-0">
                    <div className="h-20 w-20 sm:h-24 sm:w-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl ring-2 ring-slate-700">
                      <span className="text-white font-bold text-2xl sm:text-3xl">
                        {profileData.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <button className="absolute -bottom-2 -right-2 bg-slate-800 rounded-full p-2 shadow-xl border border-slate-600 hover:bg-slate-700 transition-colors">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-100 truncate">{profileData.name}</h3>
                    <p className="text-slate-400 mt-1 text-sm sm:text-base truncate">{profileData.email}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium bg-emerald-900/30 text-emerald-400 border border-emerald-500/30">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        Active
                      </span>
                      <span className="text-xs sm:text-sm text-slate-500">
                        Member since {new Date(user?.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Form - Mobile grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="group">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="name"
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Preferred Currency
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <select 
                      name="currency"
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all text-sm sm:text-base"
                      value={profileData.currency}
                      onChange={handleProfileChange}
                    >
                      <option value="USD">🇺🇸 USD - US Dollar</option>
                      <option value="EUR">🇪🇺 EUR - Euro</option>
                      <option value="GBP">🇬🇧 GBP - British Pound</option>
                      <option value="INR">🇮🇳 INR - Indian Rupee</option>
                      <option value="CAD">🇨🇦 CAD - Canadian Dollar</option>
                      <option value="AUD">🇦🇺 AUD - Australian Dollar</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 sm:mt-8 pt-6 border-t border-slate-700/50">
                <button 
                  className="w-full sm:w-auto px-6 py-2.5 border border-slate-600 rounded-lg text-slate-300 font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleCancelProfile}
                  disabled={!isEditingProfile || isLoading}
                >
                  Cancel
                </button>
                <button 
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30"
                  onClick={handleSaveProfile}
                  disabled={!isEditingProfile || isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Security Tab Content */}
          {activeTab === 'security' && (
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="max-w-2xl">
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-2">Change Password</h3>
                <p className="text-slate-400 mb-6 sm:mb-8 text-sm sm:text-base">Update your password to keep your account secure</p>

                {passwordSaved && (
                  <div className="bg-gradient-to-r from-emerald-900/50 to-emerald-800/50 border border-emerald-500/50 text-emerald-100 px-4 sm:px-6 py-4 rounded-xl flex items-center mb-6 shadow-lg backdrop-blur-sm">
                    <div className="bg-emerald-500 rounded-full p-1 mr-3 flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-sm sm:text-base">Password Updated!</p>
                      <p className="text-xs sm:text-sm text-emerald-200">Your password has been changed successfully</p>
                    </div>
                  </div>
                )}

                {passwordError && (
                  <div className="bg-gradient-to-r from-red-900/50 to-red-800/50 border border-red-500/50 text-red-100 px-4 sm:px-6 py-4 rounded-xl flex items-center mb-6 shadow-lg backdrop-blur-sm">
                    <div className="bg-red-500 rounded-full p-1 mr-3 flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-sm sm:text-base">Error</p>
                      <p className="text-xs sm:text-sm text-red-200">{passwordError}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        name="currentPassword"
                        className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPasswords.current ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      </div>
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        name="newPassword"
                        className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password (min. 8 characters)"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPasswords.new ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        )}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {passwordData.newPassword && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-slate-400">Password Strength</span>
                          <span className={`text-xs font-semibold ${
                            passwordStrength < 40 ? 'text-red-400' : 
                            passwordStrength < 70 ? 'text-yellow-400' : 
                            'text-emerald-400'
                          }`}>
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                            style={{ width: `${passwordStrength}%` }}
                          ></div>
                        </div>
                        <div className="mt-2 space-y-1">
                          <p className={`text-xs ${passwordData.newPassword.length >= 8 ? 'text-emerald-400' : 'text-slate-500'}`}>
                            ✓ At least 8 characters
                          </p>
                          <p className={`text-xs ${/[A-Z]/.test(passwordData.newPassword) && /[a-z]/.test(passwordData.newPassword) ? 'text-emerald-400' : 'text-slate-500'}`}>
                            ✓ Upper & lowercase letters
                          </p>
                          <p className={`text-xs ${/[0-9]/.test(passwordData.newPassword) ? 'text-emerald-400' : 'text-slate-500'}`}>
                            ✓ Contains numbers
                          </p>
                          <p className={`text-xs ${/[^a-zA-Z0-9]/.test(passwordData.newPassword) ? 'text-emerald-400' : 'text-slate-500'}`}>
                            ✓ Special characters
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        name="confirmPassword"
                        className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPasswords.confirm ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                      <p className="mt-2 text-sm text-red-400">Passwords do not match</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end mt-6 sm:mt-8 pt-6 border-t border-slate-700/50">
                  <button 
                    className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/30"
                    onClick={handleUpdatePassword}
                  >
                    Update Password
                  </button>
                </div>

                {/* Two-Factor Authentication */}
                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-700/50">
                  <h4 className="text-lg font-semibold text-slate-100 mb-2">Two-Factor Authentication</h4>
                  <p className="text-slate-400 mb-4 text-sm sm:text-base">Add an extra layer of security to your account</p>
                  <div className="bg-slate-800/50 rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-700/50">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="bg-blue-900/30 rounded-full p-3 border border-blue-500/30 flex-shrink-0">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-slate-100 text-sm sm:text-base">2FA is not enabled</p>
                        <p className="text-xs sm:text-sm text-slate-400">Protect your account with an authenticator app</p>
                      </div>
                    </div>
                    <button className="w-full sm:w-auto px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 font-medium hover:bg-slate-600 transition-colors text-sm sm:text-base">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab Content */}
          {activeTab === 'preferences' && (
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="max-w-2xl">
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-100 mb-2">App Preferences</h3>
                <p className="text-slate-400 mb-6 sm:mb-8 text-sm sm:text-base">Customize your experience</p>

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Language
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                      </div>
                      <select 
                        name="language"
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all text-sm sm:text-base"
                        value={profileData.language}
                        onChange={handleProfileChange}
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="zh">中文</option>
                        <option value="ja">日本語</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Timezone
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <select 
                        name="timezone"
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all text-sm sm:text-base"
                        value={profileData.timezone}
                        onChange={handleProfileChange}
                      >
                        <option value="UTC">UTC (Coordinated Universal Time)</option>
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="Europe/London">London (GMT)</option>
                        <option value="Europe/Paris">Paris (CET)</option>
                        <option value="Asia/Tokyo">Tokyo (JST)</option>
                        <option value="Asia/Kolkata">India (IST)</option>
                      </select>
                    </div>
                  </div>

                  {/* Notification Preferences */}
                  <div className="pt-6 border-t border-slate-700/50">
                    <h4 className="text-lg font-semibold text-slate-100 mb-4">Notifications</h4>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="bg-blue-900/30 rounded-lg p-2 border border-blue-500/30 flex-shrink-0">
                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-100 text-sm sm:text-base">Email Notifications</p>
                            <p className="text-xs sm:text-sm text-slate-400 truncate">Receive updates via email</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer ml-3">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-900/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="bg-purple-900/30 rounded-lg p-2 border border-purple-500/30 flex-shrink-0">
                            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-100 text-sm sm:text-base">Push Notifications</p>
                            <p className="text-xs sm:text-sm text-slate-400 truncate">Receive push notifications</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer ml-3">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-900/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="bg-emerald-900/30 rounded-lg p-2 border border-emerald-500/30 flex-shrink-0">
                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-100 text-sm sm:text-base">Weekly Reports</p>
                            <p className="text-xs sm:text-sm text-slate-400 truncate">Get weekly expense summaries</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer ml-3">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-900/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6 sm:mt-8 pt-6 border-t border-slate-700/50">
                  <button className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-900/30">
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;