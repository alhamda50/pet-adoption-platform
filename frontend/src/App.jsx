import { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import { Route, Routes } from 'react-router-dom';
import Adopt from './Pages/Adopt';
import PetCategory from './Pages/PetCategory';
import Pets from './Pages/Pets';
import LognSignup from './Pages/LoginSignup';
import UserRoutes from './components/Auth/UserRoutes';  // Import UserRoutes
import Profile from './components/Profile/Profile';
import Add from './components/Add/Add';
import PetDetail from './components/Add/PetDetail';
import ManageAdoptions from './components/ManageAdoptions/ManageAdoptions';
import { PetProvider } from './Context/PetContext';
import PetDesc from './components/PetDesc/PetDesc';
import EditPet from './components/EditPet/EditPet';
import AdminDashboard from './components/Admin/AdminDashboard';
import ManagePet from './components/Admin/ManagePet';
import ManageUser from './components/Admin/ManageUser';
import EditPetAdmin from './components/Admin/EditPetAdmin';
import EditUserAdmin from './components/Admin/EditUserAdmin';

function App() {
  return (
    <PetProvider>
      <div>
        <Navbar />
        <Routes>
          {/* Public Routes (No login required) */}
          <Route path="/" element={<Adopt />} />
          <Route path="/dog" element={<PetCategory category="dog" />} />
          <Route path="/cat" element={<PetCategory category="cat" />} />
          <Route path="/others" element={<PetCategory category="others" />} />
          <Route path="/pets" element={<Pets />} />
          
          <Route path="/pet/:id" element={<PetDesc />} />
          <Route path="/pets/:petId" element={<PetDetail />} />

          <Route path="/login" element={<LognSignup />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/manage-pets" element={<ManagePet />} />
        <Route path="/manage-users" element={<ManageUser />} />
        <Route path="manage-pets/edit-pet/:id" element={<EditPetAdmin />} />
        <Route exact path="/manage-user/edit-user/:id" element={<EditUserAdmin />} />

          {/* Protected Routes (Login required) */}
          <Route element={<UserRoutes />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/add" element={<Add />} />
          </Route>

          <Route path="/p/pet/:_id" element={<PetDetail />} />
          <Route path='/manage' element={<ManageAdoptions />} />
          <Route path='/edit-pet/:id' element={<EditPet />} />
        </Routes>
        <Footer />
      </div>
    </PetProvider>
  );
}

export default App;
