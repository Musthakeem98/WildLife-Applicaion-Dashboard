"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation'
import '../../styles/login.css'

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
  const [isMsgShow, setMsgShow] = useState(false)
  const router = useRouter();

  const handleDepartmentChange = (department: React.SetStateAction<string>) => {
    setSelectedDepartment(department);
  };
 
  const handleLogin = async () => {
    setMsgShow(true)
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
    <div className="login-container">
      <div className="image-container">
        <img src="/Images/Login.png" alt="Login Image"/>
        <div className="image-text">WILDLIFE APP</div>
      </div>
      <div className="login-form">
        <div className="middle-container">
        <h1 className="heading" style={{color: '#fff'}}>Nice to see you!</h1>
        <p className="sub-heading">Choose your department and enter the credentials:</p>
          <div className="department-buttons">
            <button
              className={`department-button ${selectedDepartment === 'forest' ? 'selected' : ''}`}
              onClick={() => handleDepartmentChange('forest')}
            >
              Forest Reserve
            </button>
            <button
              className={`department-button ${selectedDepartment === 'wildlife' ? 'selected' : ''}`}
              onClick={() => handleDepartmentChange('wildlife')}
            >
              Wildlife Department
            </button>
          </div>
          <div className="input-fields">
              <input value={officerId} onChange={(e) => setOfficerId(e.target.value)} type="text" name="officeId" className="input-field" placeholder="Enter your officer ID" />
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="password" className="input-field" placeholder="Enter your Password"/>
            <button onClick={() => handleLogin()} type="button" className="login-button">
              Sign in
            </button>
            {isMsgShow && (
            <div>
            <p className={`login-message ${loginMessage.includes('successful') ? 'success' : 'error'}`}>
              {loginMessage}
            </p>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  }  
export default LoginPage;
