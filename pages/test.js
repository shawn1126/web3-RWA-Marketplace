import React from 'react'

const Test = () => {
    const callApi=()=>{
        fetch("api/test").then(res=>console.log(res)).catch((e)=>console.log(e))
    }
  return (
    <div onClick={callApi}>click here</div>
  )
}

export default Test






