"use client"
import React, { useEffect, useState } from 'react';
import Dropdown from '../components/Dropdown';
import Axios from 'axios';
// import FormModal from './openComplaints/components/FormModal';
import { useRouter } from 'next/navigation'
import FormModal from './components/FormModal';
import ViewModel from './components/onlyView/FormModal'
import '../../styles/betaofficer.css'
import ProfileFormModal from '../../components/editProfile/ViewFormModal';
// import ViewFormModal from './progressComplaints/ViewFormModal';

const isAuthenticated = () => {
  const userData = sessionStorage.getItem('userData');
  return userData !== null; 
};

const getUserData = () => {
  const userData = sessionStorage.getItem('userData');
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
};

const BeatOfficer: React.FC = () => {
  const [selectedOption1, setSelectedOption1] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false) 
  const [taskId, setTaskId] = useState('');
  const [formData, setFormData] = useState({
    task: '',
    division: '',
    description: '',
    location: '',
    landmark: '',
  });
  const [reviewComplaints, setReviewComplaints] = useState<Array<any>>([]);
  const [progressComplaints, setProgressComplaints] = useState<Array<any>>([]);
  const router = useRouter();
  const user = getUserData();
  const [isProfileEditEnable, setProfileEditEnable] = useState(false)
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    telNumber:'',
    address: '',
    password:'',
    nic: '',
    officerId: ''
  });


  useEffect(() => {
    const id = user?.id
    Axios.get(`http://localhost:3000/officerLogin/${id}`)
        .then((response) => setUserDetails(response.data.officerDetails))
        .catch((error) => console.error('Error fetching data:', error));
  })


  const editviewClose =() => {
    setProfileEditEnable(false)
  }

  const handleProfileEdit = () => {
    setProfileEditEnable(true)
    console.log("edit profile opened")
  }
  useEffect(() => {
    if (!isAuthenticated()) {
      // If not authenticated, redirect to the login page and show a message
      router.push('/login');
    } else {
      Axios.get(`http://localhost:3000/filterbeta/${user?.id}/close`)
        .then((response) => setReviewComplaints(response.data))
        .catch((error) => console.error('Error fetching data:', error));
      
      Axios.get(`http://localhost:3000/filterbeta/${user?.id}/progress`)
        .then((response) => setProgressComplaints(response.data))
        .catch((error) => console.error('Error fetching data:', error));  

    }
  }, [router]);


  const handleSelect1 = (value: string) => {
    setSelectedOption1(value);
  };

  const openModalFunction = (data: any) => {
    setFormData(data);
    setIsModalOpen(true);
    setTaskId(data.id)
  };
  const viewModelFunction = (data:any) =>{
    setIsViewOpen(true)
    setFormData(data);
    setTaskId(data.id)
  } 

  const closeModal = () => {
    setIsModalOpen(false);
    setIsViewOpen(false)
    
  };
  const closeViewModel =() => {
    setIsViewOpen(false)
  }



  const handleSubmit = () => {
    // Add your logic here for handling form submission
    // For example, you can make an API call to update the state
    // and then close the modal
    closeModal();
  };

  const handleSignOut = () => {
    // Clear the session storage or any authentication token
    sessionStorage.removeItem('userData');
    // Redirect to the login page or any other desired location
    router.push("/login");
  };

  return (
    <div className="dashboard-container">
      <div className="header-section">
        <div className="user-info">
          <p className="user-greeting">Hey {user?.name}</p>
          <div className="user-details">
            <p className="user-role">Officer - {user?.id}</p>
            <div className="spacer"></div>
            <p className="user-division">{user?.divistion} Division</p>
          </div>
        </div>
        <div className="action-buttons">
          <button className="profile-edit-button  " onClick={() =>handleProfileEdit()}>Profile Edit</button>
          <button className="signout-button" onClick={()=> handleSignOut()}>Sign Out</button>
        </div>
      </div>
      <div className="content-section">
        <div className="spacer"></div>
        <div className="complaints-section">
          <div className="assigned-complaints">
            <h2 className="section-heading">Assigned Complaints</h2>
            {progressComplaints.map((item, index) => (
              <div key={index} className="complaint-card">
                <div className="complaint-details">
                  <p>{item.data && typeof item.data === 'string' && new Date(item.data).toLocaleDateString()}</p>
                  <p className="complaint-description">{item.description}</p>
                </div>
                <button onClick={() => openModalFunction(item)} className="action-button open-button">
                  Open
                </button>
              </div>
            ))}
          </div>
          <div className="closed-complaints">
            <h2 className="section-heading">Closed Complaints</h2>
            {reviewComplaints.map((item, index) => (
              <div key={index} className="complaint-card">
                <div className="complaint-details">
                  <p>{item.data && typeof item.data === 'string' && new Date(item.data).toLocaleDateString()}</p>
                  <p className="complaint-description">{item.description}</p>
                </div>
                <button onClick={() => viewModelFunction(item)} className="action-button view-button">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isModalOpen && <FormModal isOpen={isModalOpen} onClose={closeModal} complaints = {formData} />}
      {isViewOpen && <ViewModel isOpen={isViewOpen} onClose={closeModal} complaints = {formData} />}
      {isProfileEditEnable && <ProfileFormModal isOpen={isProfileEditEnable} onClose={editviewClose} userData = {userDetails} />}
    </div>
  );
  
};

export default BeatOfficer;
