
import { useContext, useState } from "react";
import { assets } from "../assets/assets_frontend/assets";
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from "../context/AppContext";
const Navbar = () => {
    const navigate = useNavigate();

    const [showMenu, setShowmenu] = useState(false)
   const {token,setToken,userData } = useContext(AppContext)

   const logout =()=>{
    setToken(false)
    localStorage.removeItem('token')
   }

    return (
        <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
            <img 
  onClick={() => navigate('/')} 
  className="w-160 h-20 scale-300 object-contain cursor-pointer" 
  src={assets.logo} 
  alt="Logo" 
/>

            <ul className="hidden md:flex items-start gap-5 font-medium">
                <NavLink to='/'>
                    <li className="py-1">HOME</li>
                    <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto  hidden" />
                </NavLink >
                <NavLink to='/doctors'>
                    <li className="py-1">ALL DOCTORS</li>
                    <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                </NavLink>

                <NavLink to='/about'>
                    <li className="py-1">ABOUT</li>
                    <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                </NavLink>
                <NavLink to='/contact'>
                    <li className="py-1">CONTACT</li>
                    <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
                </NavLink>
{/*                  <NavLink to='/admin-login'>
        <li className="py-1 border px-3 rounded-md hover:bg-primary hover:text-white transition">
            Admin Panel
        </li>
    </NavLink> */}
            </ul>
            <div className="flex items-center gap-4">
                {
                    token && userData ?
                        <div className="flex items-center gap-2 cursor-pointer group relative">
                            <img className="w-8 rounded-full" src={userData.image} alt="" />
                            <img className="w-2.5" src={assets.dropdown_icon} />
                            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
                                <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                                    <p onClick={() => navigate('my-profile')} className="hover:text-black cursor-pointer">My Profile</p>
                                    <p onClick={() => navigate('my-appointments')} className="hover:text-black cursor-pointer">My Appointments</p>
                                    <p onClick={logout} className="hover:text-black cursor-pointer">Logout</p>

                                </div>
                            </div>
                        </div>
                        : <button onClick={() => navigate('/login')} className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block">Create Account</button>

                }
                <img onClick={() => setShowmenu(true)} className="w-6 md:hidden" src={assets.menu_icon} alt="" />
                {/* mobile menu----------- */}
                <div className={`fixed top-0 right-0 z-20 w-full h-screen bg-white transition-transform duration-300 transform ${showMenu ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
                    <div className="flex items-center justify-between px-5 py-6">
                        <img className="w-36" src={assets.logo} alt="Logo" />
                        <img
                            className="w-7 cursor-pointer"
                            onClick={() => setShowmenu(false)}
                            src={assets.cross_icon}
                            alt="Close"
                        />
                    </div>
                    <ul className="flex flex-col gap-6 px-6 mt-10 text-lg font-medium">
                        <NavLink to="/" onClick={() => setShowmenu(false)}> <p className="px-4 py-2 rounded inline-block">Home</p> </NavLink>
                        <NavLink to="/doctors" onClick={() => setShowmenu(false)}> <p className="px-4 py-2 rounded inline-block">All Doctors</p> </NavLink>
                        <NavLink to="/about" onClick={() => setShowmenu(false)}> <p className="px-4 py-2 rounded inline-block">About</p> </NavLink>
                        <NavLink to="/contact" onClick={() => setShowmenu(false)}> <p className="px-4 py-2 rounded inline-block">Contact</p> </NavLink>
                    </ul>
                </div>

            </div>
        </div>
    );
};

export default Navbar
