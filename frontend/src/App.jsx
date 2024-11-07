import { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import { Route, Routes } from 'react-router-dom'
import Adopt from './Pages/Adopt'
import PetCategory from './Pages/PetCategory'
import Pets from './Pages/Pets'
import LognSignup from './Pages/LoginSignup'
import UserRoutes from './components/Auth/UserRoutes'
import Profile from './components/Profile/Profile'
import Add from './components/Add/Add'
import PetDetail from './components/Add/PetDetail'

function App() {
  

  return (
    <div>
      <Navbar />
    

      <Routes>
        <Route path='/' element={<Adopt />}/>
        <Route path='/dog' element={<PetCategory category="dog"/>}/>
        <Route path='/cat' element={<PetCategory category="cat"/>}/>
        <Route path='/others' element={<PetCategory category="others"/>}/>
        <Route path='/pets' element={<Pets />}>
          <Route path=':petId' element={<Pets />}/>
        </Route>
        <Route path='/login' element={<LognSignup />}></Route>
        <Route element={<UserRoutes />}/>
        <Route path='/profile' element={<Profile />}/>
        <Route path='/add' element={<Add />}></Route>
        <Route path="/p/pets/:_id" element={<PetDetail />} />
      </Routes>

      <Footer />
    </div>
  )
}

export default App
