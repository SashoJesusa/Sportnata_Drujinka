import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import AddProduct from './pages/AddProduct'
import MyListings from './pages/MyListings'
import ProductDetails from './pages/ProductDetails'
import LoginPage from './pages/Login-Page'
import Community from './pages/Community'
import Coalitions from './pages/Coalitions'

function ScrollToTopOnRouteChange() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, hash])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTopOnRouteChange />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/community" element={<Community />} />
        <Route path="/coalitions" element={<Coalitions />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </BrowserRouter>
  )
}