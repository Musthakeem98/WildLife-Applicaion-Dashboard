"use client"
import React, { useEffect, useState } from 'react';
import Dropdown from '../components/Dropdown';
import Axios from 'axios';
// import FormModal from './openComplaints/components/FormModal';
import { useRouter } from 'next/navigation'
import FormModal from './components/FormModal';
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
    <div className="flex flex-col h-screen p-4">
      <div className="flex justify-between items-center mb-8">
        <div className="text-left">
          <p className="text-lg">Hey {user?.name}</p>
          <div className="flex items-center">
            <p className="text-md">Officer - {user?.id}</p>
            <div className="w-4"></div>
            <p className="text-md text-gray-500">{user?.divistion} Division</p>
          </div>
        </div>
        <div className="flex space-x-4">

          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={()=> handleSignOut()}>Sign Out</button>
        </div>
      </div>
      <div className="flex justify-end px-2 items-center">
        <div className="w-4"></div>
      </div>
      <div className="p-4"></div>
      <div className="flex space-x-4">
        <div className="bg-gray-200 p-4 rounded flex-1">
          <h2 className="text-lg font-semibold">Assigned Complaints</h2>
          {progressComplaints.map((item, index) => (
            <div key={index} className="bg-white p-4 mt-4 rounded flex justify-between items-center">
              <div className="flex flex-col">
                <p>{item.data && typeof item.data === 'string' && new Date(item.data).toLocaleDateString()}</p>
                <p className="f-5 font-semibold">{item.description}</p>
              </div>
              <button onClick={() => openModalFunction(item)} className="bg-blue-500 text-white px-2 py-1 rounded">
                Open
              </button>
            </div>
          ))}
        </div>

        {/* In Review Complaints */}
        <div className="bg-gray-200 p-4 rounded flex-1">
          <h2 className="text-lg font-semibold">Closed Complaints</h2>
          {reviewComplaints.map((item, index) => (
            <div key={index} className="bg-white p-4 mt-4 rounded flex justify-between items-center">
              <div className="flex flex-col">
                <p className="text-lg">{item.data && typeof item.data === 'string' && new Date(item.data).toLocaleDateString()}</p>
                <p className="text-lg font-semibold">{item.description}</p>
              </div>
              <button onClick={() => viewModelFunction(item)} className="bg-blue-500 text-white px-2 py-1 rounded">
                View
              </button>
            </div>
          ))}
        </div>
      </div>
    
    {isModalOpen && <FormModal isOpen={isModalOpen} onClose={closeModal} complaints = {formData} />}
    {/* {isViewOpen && <ViewFormModal isOpen={isViewOpen} onClose={closeViewModel} complaints = {formData} />} */}
    </div>
  );
};

export default BeatOfficer;
