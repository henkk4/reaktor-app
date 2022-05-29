import React from 'react'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'



const Package = () => {
  // Hooks for package to be shown and array of its reverse dependencies
  const [pack, setPack] = useState('')
  const [reverseDs, setReverseDs] = useState([])

  const currentPack = useLocation().state.param
  const packs = JSON.parse(localStorage.getItem('packs'))

  useEffect(() => {
    let packageName
    // Setting state: pack
    if(typeof currentPack === 'string' || currentPack instanceof String) {
      const rightOne = packs.find(item => item.name === currentPack)
      setPack(rightOne)
      packageName = currentPack
    }
    else {
      setPack(currentPack)
      packageName = currentPack.name
    }
    // Finging reverse dependencies
    let temp = packs.filter(item => item.dependencies.find(packName => packName === packageName))
    temp = temp.map(item => item.name)
    setReverseDs(temp)
    
  }, [currentPack])

  const makeList = (packNames) => {
    return (
      <ol>
          {packNames.map((item,i) => {
            if(packs.find(pack => pack.name === item)) {
              return <li key={i}> <Link to={`/packages/${item}`} state={{ param: item }}>{item}</Link> </li>
            }
            else {
              return <li key={i}>{item}</li>
            }
          })}
      </ol>
    )
  }
  
	
	return (
    <div className='Package'>
      <h3>Selected Package</h3>
      <div id='feature'>
        <span id='label'>Name: </span> 
        {pack.name}
      </div>
      <div id='feature'>
        <span id='label'>Description: </span> 
        {pack.description}
      </div>
      <div id='feature'>
        <span id='label'>Category: </span> 
        {pack.category}
      </div>
      <div id='feature'>
        <span id='label'>Dependencies: </span> 
        <ol>
          {pack.dependencies && makeList(pack.dependencies)}
        </ol>
      </div>
      <div id='feature'>
        <span id='label'>Reverse dependencies: </span> 
        {reverseDs && makeList(reverseDs)}
      </div>
    </div>
    
	)
}

export default Package