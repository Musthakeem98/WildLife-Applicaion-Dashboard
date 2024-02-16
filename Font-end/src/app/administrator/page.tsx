"use client"
import React, { useEffect, useState } from 'react';
import Dropdown from '../components/Dropdown';
import Axios from 'axios';
import FormModal from './openComplaints/components/FormModal';
import { useRouter } from 'next/navigation'
import ViewFormModal from './progressComplaints/ViewFormModal';

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


  useEffect(() => {
    if (!isAuthenticated()) {
      // If not authenticated, redirect to the login page and show a message
      router.push('/login');
    } else {
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
  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex justify-between items-center mb-8">
        <div className="text-left">
          <p className="text-lg">Hey {user?.name}</p>
          <div className="flex items-center">
            <p className="text-md">Administrator - {user?.id}</p>
            <div className="w-4"></div>
            <p className="text-md text-gray-500">{user?.divistion} Division</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Profile Edit</button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded">Manage Officers</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={()=> handleSignOut()}>Sign Out</button>
        </div>
      </div>
      <div className="flex justify-end px-2 items-center">
        <p className="text-md mr-2">Filter by:</p>
        <Dropdown options={dropdownOptions} onSelect={handleSelect1} />
        <div className="w-4"></div>
      </div>
      <div className="p-4"></div>
      <div className="flex space-x-4">
        <div className="bg-gray-200 p-4 rounded flex-1">
          <h2 className="text-lg font-semibold">Opened Complaints</h2>
          {openComplaints.map((item, index) => (
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

        {/* In Progress Complaints */}
        <div className="bg-gray-200 p-4 rounded flex-1">
          <h2 className="text-lg font-semibold">In Progress Complaints</h2>
          {progressComplaints.map((item, index) => (
            <div key={index} className="bg-white p-4 mt-4 rounded flex justify-between items-center">
              <div className="flex flex-col">
                <button className="bg-green-500 text-white px-2 py-1 rounded mb-2 opacity-75">Assign</button>
                <p className="text-lg">{item.data && typeof item.data === 'string' && new Date(item.data).toLocaleDateString()}</p>
                <p className="text-lg font-semibold">{item.description}</p>
                <p className="">Assigned To: {item.assignedTo}</p>
              </div>
              <button onClick={() => viewModelFunction(item)} className="bg-blue-500 text-white px-2 py-1 rounded">
                View
              </button>
            </div>
          ))}
        </div>

        {/* In Review Complaints */}
        <div className="bg-gray-200 p-4 rounded flex-1">
          <h2 className="text-lg font-semibold">In Review Complaints</h2>
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
      {isViewOpen && <ViewFormModal isOpen={isViewOpen} onClose={closeViewModel} complaints = {formData} />}
    </div>
  );
};

export default AdministratorPage;
