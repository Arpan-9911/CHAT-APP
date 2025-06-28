import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign Up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)

  const {login} = useContext(AuthContext)

  const submitHandle = async (e) => {
    e.preventDefault()
    if (currState === "Sign Up" && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return
    }
    login(currState === 'Sign Up' ? 'signup' : 'login', {email, password, fullName, bio})
  }
  
  return (
    <div className='min-h-screen bg-cover bg-center flex justify-center items-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      <img src={assets.logo_big} alt="logo" className='w-full max-w-[250px]' />
      <form onSubmit={submitHandle} className='border-2 bg-white/8 text-white border-gray-500 p-5 flex flex-col gap-6 rounded-lg shadow-lg'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState}
          {isDataSubmitted && (
            <img onClick={() => setIsDataSubmitted(false)} src={assets.arrow_icon} alt="arrow" className='w-5 cursor-pointer' />
          )}
        </h2>
        {currState === "Sign Up" && !isDataSubmitted && (
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className='p-2 border border-gray-500 rounded-md focus:outline-none'
            placeholder='Full Name'
            required
          />
        )}
        {!isDataSubmitted && (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Email Address'
              required
              className='p-2 border border-gray-500 rounded-md focus:outline-none'
            />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password' 
              required 
              className='p-2 border border-gray-500 rounded-md focus:outline-none'
            />
          </>
        )}
        {currState === "Sign Up" && isDataSubmitted && (
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className='p-2 border border-gray-500 rounded-md focus:outline-none'
            placeholder='Provide a short bio ...'
            required
            rows={4}
          >
          </textarea>
        )}

        <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
          {currState === "Sign Up" ? "Create Account" : "Login Now"}
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" />
          <p>Agree to terms and conditions & privacy policy.</p>
        </div>

        <div className='flex flex-col gap-2'>
          {currState === "Sign Up" && (
            <p className='text-sm text-gray-500'>Already have an account? <span className='text-violet-500 cursor-pointer' onClick={() => setCurrState("Login")}>Login Now</span></p>
          )}
          {currState === "Login" && (
            <p className='text-sm text-gray-500'>Don't have an account? <span className='text-violet-500 cursor-pointer' onClick={() => setCurrState("Sign Up")}>Sign Up</span></p>
          )}
        </div>

      </form>
    </div>
  )
}

export default LoginPage