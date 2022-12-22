import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../components/Login/Login'
import CreateRestaurants from '../components/Restaurants/CreateRestaurants'
import Restaurants from '../components/Restaurants/Restaurants'
import UpdateRestaurants from '../components/Restaurants/UpdateRestaurants'
import Home from '../pages/Home'


const MyRouter = () => {
  return (
    <div>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/restaurants" element={<Restaurants/>}/>
            <Route path='/restaurants/create' element={<CreateRestaurants />}/>
            <Route path='/restaurants/update' element={<UpdateRestaurants />}/>
            <Route path='/login' element={<Login />}/> 
        </Routes>
    </div>
  )
}

export default MyRouter