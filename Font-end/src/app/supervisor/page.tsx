"use client"
import React, { useEffect, useState } from 'react';
import Dropdown from '../components/Dropdown';
import Axios from 'axios';
import FormModal from './openComplaints/components/FormModal';
import { useRouter } from 'next/navigation'
import ViewFormModal from './progressComplaints/ViewFormModal';
import '../../styles/supervisor.css'
import ProfileFormModal from '../../components/editProfile/ViewFormModal';

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
interface AssignedOfficers {
  [key: string]: string; // Define index signature for string keys and string values
}
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
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    telNumber:'',
    address: '',
    password:'',
    nic: '',
    officerId: ''
  });
  const [assignedOfficers, setAssignedOfficers] = useState<AssignedOfficers>({});


  useEffect(() => {
    if (!isAuthenticated()) {
      // If not authenticated, redirect to the login page and show a message
      router.push('/login');
    } else {
      Axios.get("http://localhost:3000/complaints/getstate/open")
        .then((response) => setOpenComplaints(response.data))
        .catch((error) => console.error('Error fetching data:', error));

      Axios.get("http://localhost:3000/complaints/getstate/close")
        .then((response) => setReviewComplaints(response.data))
        .catch((error) => console.error('Error fetching data:', error));
      
      Axios.get("http://localhost:3000/complaints/getstate/progress")
        .then((response) => setProgressComplaints(response.data))
        .catch((error) => console.error('Error fetching data:', error));  

    }
  }, [router]);

  useEffect(() => {
    const fetchAssignedOfficers = async () => {
      const assignedOfficersData = {};
      for (const complaint of progressComplaints) {
        const complaintId = complaint.complaintId;
        try {
          const response = await Axios.get(`http://localhost:3000/task/getassignedofficer/${complaintId}`);
          assignedOfficersData[complaintId] = response.data.officerName;
        } catch (error) {
          console.error('Error fetching data:', error);
          assignedOfficersData[complaintId] = 'Error'; // or any default value
        }
      }
      setAssignedOfficers(assignedOfficersData);
    };

    if (progressComplaints.length > 0) {
      fetchAssignedOfficers();
    }
  }, [progressComplaints]);

  const getAssignedOfficerName = (complaintId: string) => {
    return assignedOfficers[complaintId] || ''; // Return officer name or empty string if not found
  };

  useEffect(() => {
    const id = user?.id
    Axios.get(`http://localhost:3000/officerLogin/${id}`)
        .then((response) => setUserDetails(response.data.officerDetails))
        .catch((error) => console.error('Error fetching data:', error));
  })
  const handleSelect1 = (value: string) => {
    setSelectedOption1(value);
  };

  const openModalFunction = (data: any) => {
    setFormData(data); // Set form data based on the selected data
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
    
  };
  const closeViewModel =() => {
    setIsViewOpen(false)
  }

  const editviewClose =() => {
    setProfileEditEnable(false)
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
  const handleProfileEdit = () => {
    setProfileEditEnable(true)
    console.log("edit profile opened")
  }

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
            <p className="user-role">Supervisor - {user?.id}</p>
            <div className="spacer"></div>
            <p className="user-division">{user?.divistion} Division</p>
          </div>
        </div>
        <div className="action-buttons">
          <button className="profile-edit-button" onClick={() => handleProfileEdit()}>Profile Edit</button>
          <button className="signout-button" onClick={()=> handleSignOut()}>Sign Out</button>
        </div>
      </div>
      <div className="filter-section">
        <div className="spacer"></div>
      </div>
      <div className="complaints-section">
        <div className="complaints-column">
          <h2 className="section-heading">Opened Complaints</h2>
          {openComplaints.map((item, index) => (
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
             <div className='assignedcontainer'>
                  <p className='assigened-text'>Assigned To: </p>
                  <p className='assigened-officer'>{getAssignedOfficerName(item.complaintId)}</p>
                </div>
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
      {isModalOpen && <FormModal isOpen={isModalOpen} onClose={closeModal} complaints = {formData} />}
      {isViewOpen && <ViewFormModal isOpen={isViewOpen} onClose={closeViewModel} complaints = {formData} />}
      {isProfileEditEnable && <ProfileFormModal isOpen={isProfileEditEnable} onClose={editviewClose} userData = {userDetails} />}
    </div>
  );  
};

export default AdministratorPage;
