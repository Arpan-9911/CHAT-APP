import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import assets from '../assets/assets'

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext)

  const [selectedImg, setSelectedImg] = useState(null)
  const navigate = useNavigate()
  const [name, setName] = useState(authUser.fullName)
  const [bio, setBio] = useState(authUser.bio)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!selectedImg){
      await updateProfile({fullName: name, bio})
      navigate('/')
      return
    }
    const reader = new FileReader()
    reader.readAsDataURL(selectedImg)
    reader.onloadend = async () => {
      await updateProfile({fullName: name, bio, profilePic: reader.result})
      navigate('/')
    }
  }

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg relative'>
        <img onClick={() => navigate('/')} src={assets.arrow_icon} alt="arrow" className="max-w-7 absolute right-5 top-5 cursor-pointer"/>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-lg'>Profile Details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input
              type="file"
              onChange={(e) => setSelectedImg(e.target.files[0])}
              id="avatar"
              accept='image/*'
              hidden
            />
            <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="avatar" className={`w-12 h-12 ${selectedImg && 'rounded-full'}`} />
            Upload Profile Image
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder='Your Name'
            className='p-2 border border-gray-500 rounded-md focus:outline-none'
          />
          <textarea
            placeholder='Your Bio'
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            rows={4}
            className='p-2 border border-gray-500 rounded-md focus:outline-none'
          >
          </textarea>
          <button type="submit" className='bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none text-lg p-2 rounded-full cursor-pointer'>Save</button>
        </form>
        <img className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImg && 'rounded-full'}`} src={authUser?.profilePic || assets.logo_icon} alt="logo" />
      </div>
    </div>
  )
}

export default ProfilePage