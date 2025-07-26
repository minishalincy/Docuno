import React, { useEffect, useState } from 'react'
import { useContext } from "react"
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets_frontend/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { toast } from 'react-toastify'
import axios from 'axios'

const Appointments = () => {
  const { docId } = useParams()
  const { doctors, currencySymbol, userData, backendUrl, token, getDoctorsData } = useContext(AppContext)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const navigate = useNavigate()

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  useEffect(() => {
    if (!doctors || doctors.length === 0) return
    const doc = doctors.find(doc => doc._id === docId)
    setDocInfo(doc)
  }, [doctors, docId])

  useEffect(() => {
  if (!docInfo) return;

  const getAvailableSlots = async () => {
    const today = new Date();
    const allSlots = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0); // 9:00 PM

      if (i === 0) {
        // Today
        if (currentDate.getHours() >= 21) continue; // Skip if it's already 9 PM or later
        currentDate.setHours(Math.max(currentDate.getHours() + 1, 10));
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        // Future days
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      const timeSlots = [];

      while (currentDate < endTime) {
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        const slotDate = `${day}_${month}_${year}`;
        const slotTime = currentDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });

        const isSlotAvailable =
          !docInfo.slots_booked?.[slotDate]?.includes(slotTime);

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: slotTime
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      allSlots.push(timeSlots);
    }

    setDocSlots(allSlots);
    console.log("Available Slots:", allSlots);
  };

  getAvailableSlots();
}, [docInfo]);

  // --------------------------------------------
  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }

    if (!userData || !userData._id) {
      toast.error("User data not found");
      return;
    }

    try {
      const date = docSlots[slotIndex][0].datetime;
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const slotDate = `${day}_${month}_${year}`;

      const payload = {
        docId,
        userId: userData._id,
        userData, // full user object from context
        slotDate,
        slotTime,
      };

      const { data } = await axios.post(`${backendUrl}/api/user/book-appointment`, payload, {
        headers: { token },
      });

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };


  if (!docInfo) return <div>Loading doctor information...</div>

  return (
    <>
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img
            className='bg-primary w-full sm:max-w-72 rounded-lg'
            src={docInfo.image}
            alt={docInfo.name || "Doctor"}
          />
        </div>

        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          <p className='flex items-center gap-2 font-semibold text-xl'>
            {docInfo.name}
            <img src={assets.verified_icon} alt="Verified" className='w-4 h-4' />
          </p>

          <div className='flex items-center gap-2 text-sm mt-2'>
            <p className='text-gray-700'>
              {docInfo.degree} - {docInfo.speciality}
            </p>
            <button className='bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs border'>
              {docInfo.experience}
            </button>
          </div>

          <div className='mt-4'>
            <p className='flex items-center gap-2 font-medium text-gray-800'>
              About
              <img src={assets.info_icon} alt="Info" className='w-4 h-4' />
            </p>
            <p className='text-gray-600 mt-1 text-sm max-w-[700px]'>{docInfo.about}</p>
          </div>

          <div>
            <p className='text-gray-500 font-medium mt-4'>
              Appointment fee: <span className='text-gray-700'>{currencySymbol} {docInfo.fees}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ----booking slots now BELOW the doctor row */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking Slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {
            docSlots.length > 0 && docSlots.map((item, index) => (
              <div
                key={index}
                onClick={() => setSlotIndex(index)}
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer px-4 ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'
                  }`}
              >
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))
          }
        </div>
        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlots.length && docSlots[slotIndex].map((item, index) => (
            <p onClick={() => setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`} key={index}>
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>

        <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>Book an appointment</button>
      </div>

      {/* listing the other doctors */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />


    </>
  )
}

export default Appointments
