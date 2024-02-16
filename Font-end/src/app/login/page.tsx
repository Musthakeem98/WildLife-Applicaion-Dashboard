"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation'

interface LoginResponse {
  type: any;
  success: boolean;
  name: String;
  divistion: String;
}

const LoginPage = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('forest');
  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState(''); 
  const router = useRouter();

  const handleDepartmentChange = (department: React.SetStateAction<string>) => {
    setSelectedDepartment(department);
  };
 
  const handleLogin = async () => {
    try {
      // Send the plain-text password to the server for hashing
      const response = await axios.post<LoginResponse>('http://localhost:3000/officerLogin/authenticate', {
        officerId,
        password
      });
      
      if (response.data.success) {
        sessionStorage.setItem('userData', JSON.stringify(response.data));
        if (response.data.type === "admin"){
          setLoginMessage('🎉 Login successful! Redirecting to admin page...');
          router.push("/administrator");
        }
        if (response.data.type === "beta"){
          setLoginMessage('👮‍♂️ Login successful! Redirecting to beta officer page...');
          router.push("/beatOfficer");
        }
        if (response.data.type === "supervisor"){
          setLoginMessage('👨‍💼 Login successful! Redirecting to supervisor page...');
          router.push("/supervisor");
        }
      } else {
        setLoginMessage('❌ Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoginMessage('⚠️ Login failed. Please check your credentials.');
    }
  };




  return (
    <div className="flex justify-between items-center h-screen p-4">
      <div className="w-1/2">
        <Image src="/your-image.jpg" alt="Your Image" width={300} height={300} />
      </div>
      <div className="w-1/2 p-8 border border-gray-300 rounded">
        <h1 className="text-4xl font-bold mb-4">Nice to see you!</h1>
        <p className="mb-4">Choose your department and enter the credentials:</p>
        <div className="flex mb-4">
          <button
            className={`flex-1 p-2 border ${selectedDepartment === 'forest' ? 'bg-green-500 text-white' : ''}`}
            onClick={() => handleDepartmentChange('forest')}
          >
            Forest Reserve
          </button>
          <button
            className={`flex-1 p-2 border ${selectedDepartment === 'wildlife' ? 'bg-green-500 text-white' : ''}`}
            onClick={() => handleDepartmentChange('wildlife')}
          >
            Wildlife Department
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col">
            Office ID:
            <input value={officerId} onChange={(e) => setOfficerId(e.target.value)} type="text" name="officeId" className="border p-2" />
          </label>
          <label className="flex flex-col">
            Password:
            <input value={password} onChange={(e)=> setPassword(e.target.value)} type="password" name="password" className="border p-2" />
          </label>
          <button onClick={() => handleLogin()} type="button" className="bg-blue-500 text-white p-2 rounded">
            Login
          </button>
          <p className={`text-center text-lg mt-4 p-2 ${loginMessage.includes('successful') ? 'bg-green-100 text-green-800 rounded' : 'bg-red-100 text-red-800 rounded'}`}>
            {loginMessage}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
