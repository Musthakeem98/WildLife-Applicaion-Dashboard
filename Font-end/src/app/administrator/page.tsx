"use client"
import React, { useEffect, useState } from 'react';
import Dropdown from '../components/Dropdown';
import Axios from 'axios';
import FormModal from './openComplaints/components/FormModal';
import { useRouter } from 'next/navigation'
import ViewFormModal from './progressComplaints/ViewFormModal';
import '../../styles/adminofficer.css'
import ProfileFormModal from '../../components/editProfile/ViewFormModal';
import ManageOfficers from '../../components/ManageOfficers/ManageOfficers';

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


const dropdownOptions = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
];



const AdministratorPage: React.FC = () => {
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
  const [openComplaints, setOpenComplaints] = useState<Array<any>>([]);
  const [reviewComplaints, setReviewComplaints] = useState<Array<any>>([]);
  const [progressComplaints, setProgressComplaints] = useState<Array<any>>([]);
  const router = useRouter();
  const user = getUserData();
  const [isProfileEditEnable, setProfileEditEnable] = useState(false)
  const [isMnageOfficerEnable, setMnageOfficerEnable] = useState(false)
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

  const manageOfficerClose =() => {
    setMnageOfficerEnable(false)
  }

  const handleProfileEdit = () => {
    setProfileEditEnable(true)
    console.log("edit profile opened")
  }

  const ManageOfficersOpen = () => {
    setMnageOfficerEnable(true)
    console.log("mange officer opened")
  }

  useEffect(() => {
    if (!isAuthenticated()) {
      // If not authenticated, redirect to the login page and show a message
      router.push('/login');
    } else {
      console.log("working")
      Axios.get("http://localhost:3000/complaints/getstate/open")
        .then((response) => setOpenComplaints(response.data))
        .catch((error) => console.error('Error fetching data:', error));

      Axios.get("http://localhost:3000/complaints/getstate/review")
        .then((response) => setReviewComplaints(response.data))
        .catch((error) => console.error('Error fetching data:', error));
      
      Axios.get("http://localhost:3000/complaints/getstate/progress")
        .then((response) => setProgressComplaints(response.data))
        .catch((error) => console.error('Error fetching data:', error));  

    }
  }, [router]);


  const handleSelect1 = (value: string) => {
    setSelectedOption1(value);
  };

  const openModalFunction = (data: any) => {
    setFormData(data); // Set form data based on the selected data
    setIsModalOpen(true);
    setTaskId(data.id)
    console.log("responce : ", openComplaints )
  };
  const viewModelFunction = (data:any) =>{
    setIsViewOpen(true)
    setFormData(data);
    setTaskId(data.id)
  } 

  const closeModal = () => {
    setIsModalOpen(false);
    
  };
  const closeViewModel =() => {
    setIsViewOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
  
    const day = date.getDate();
    const suffix = getDaySuffix(day);
  
    return formattedDate.replace(/\b(\d{1,2})\b/, `$1${suffix}`);
  };
  
  const getDaySuffix = (day:any) => {
    if (day >= 11 && day <= 13) {
      return 'th';
    }
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return (
    <div className="dashboard-container">
      <div className="header-section">
        <div className="user-info">
          <p className="user-greeting">Hey {user?.name}</p>
          <div className="user-details">
            <p className="user-role">Administrator - {user?.id}</p>
            <div className="spacer"></div>
            <p className="user-division">{user?.divistion} Division</p>
          </div>
        </div>
        <div className="action-buttons">
          <button className="profile-edit-button" onClick={() =>handleProfileEdit()}>Profile Edit</button>
          <button className="manage-officers-button" onClick={() =>ManageOfficersOpen()}>Manage Officers</button>
          <button className="signout-button" onClick={()=> handleSignOut()}>Sign Out</button>
        </div>
      </div>
      {/* <div className="filter-section">
        <p className="filter-label">Filter by:</p>
        <Dropdown options={dropdownOptions} onSelect={handleSelect1} />
      </div> */}
      <div className="complaints-section">
        <div className="complaints-column">
          <h2 className="section-heading">Opened Complaints</h2>
          {openComplaints.map((item, index) => (
            <div key={index} className="complaint-card">
              <div className="complaint-details">
              <p className='date'>
                {item.createdAt && formatDate(item.createdAt)}
              </p>
                <p className="complaint-description">{item.description}</p>
              </div>
              <button onClick={() => openModalFunction(item)} className="action-button open-button">
                Open
              </button>
            </div>
          ))}
        </div>
        <div className="complaints-column">
          <h2 className="section-heading">In Progress Complaints</h2>
          {progressComplaints.map((item, index) => (
            <div key={index} className="complaint-card-assgine">
              <div className="complaint-details">
              <div className='coloum-container'>
                <div className="assign-text">ASSIGNED</div>
                  <p className='date'>
                    {item.createdAt && formatDate(item.createdAt)}
                  </p>
                </div>
                <p className="complaint-description">{item.description}</p>
                <p className='assigened-text'>Assigned To: {item.assignedTo}</p>
              </div>
              <button onClick={() => viewModelFunction(item)} className="action-button view-button">
                View
              </button>
            </div>
          ))}
        </div>
        <div className="complaints-column">
          <h2 className="section-heading">In Review Complaints</h2>
          {reviewComplaints.map((item, index) => (
            <div key={index} className="complaint-card">
              <div className="complaint-details">
              <p className='date'>
                {item.createdAt && formatDate(item.createdAt)}
              </p>
                <p className="complaint-description">{item.description}</p>
              </div>
              <button onClick={() => viewModelFunction(item)} className="action-button view-button">
                View
              </button>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && <FormModal isOpen={isModalOpen} onClose={closeModal} complaints = {formData} />}
      {isViewOpen && <ViewFormModal isOpen={isViewOpen} onClose={closeViewModel} complaints = {formData} />}
      {isProfileEditEnable && <ProfileFormModal isOpen={isProfileEditEnable} onClose={editviewClose} userData = {userDetails} />}
      {isMnageOfficerEnable && <ManageOfficers isOpen={isMnageOfficerEnable} onClose={manageOfficerClose} />}
    </div>
  );
  
};

export default AdministratorPage;
