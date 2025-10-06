import React from 'react'
import { assets } from '../assets/assets_frontend/assets'  // ✔ correct spelling and path

const About = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
      </div>

      <div className='my-10 flex flex-col items-center justify-center gap-12 text-center'>
  {/* <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" /> */}

  <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
    <p>
      Welcome to <span className='font-semibold text-gray-800'>Docuno</span> — your smart healthcare companion designed to simplify how you connect with doctors and manage your medical journey. We know how time-consuming it can be to book appointments, keep track of prescriptions, or access past health records. Docuno makes it all effortless and secure.
    </p>

    <p>
      At Docuno, innovation meets care. Our platform is built with cutting-edge technology to ensure reliability, speed, and privacy. Whether you’re scheduling a consultation, storing digital prescriptions, or following up with your doctor, Docuno ensures a smooth and intuitive experience at every step.
    </p>

    <b className='text-gray-800 text-base md:text-lg'>Our Vision</b>

    <p>
      Our vision is to empower individuals through accessible, technology-driven healthcare. We’re dedicated to creating a connected ecosystem where patients and healthcare professionals collaborate seamlessly — making quality healthcare just a few clicks away.
    </p>
  </div>
</div>


      <div className='text-xl my-4'>
        <p>
          WHY <span className='text-gray-600 font-semibold'>CHOOSE US</span>
        </p>
      </div>
      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer '>
          <b>Efficiency:</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>

        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer ' >
          <b>Convenience:</b>
          <p>Access to a network of trusted healthcare professionals in your area.</p>

        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer '>
          <b>Personalization:</b>
          <p>Tailored recommendations and reminders to help you stay on top of your health.</p>

        </div>

      </div>
    </div>
  )
}

export default About
