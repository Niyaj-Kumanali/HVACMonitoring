import React, { useState } from 'react'

const AllCoolants: React.FC = () => {

  const [allcoolants, setAllcoolants] = useState([])

  const fetchAllCoolants = async() => {
    const response = await fetch('http://localhost:2000/sensor/getavaliablesensors')

    
  }
  return (
    <div>AllCoolants</div>
  )
}

export default AllCoolants