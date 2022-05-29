import './App.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


function App() {
  // Hooks for poetry.lock file and array of packages
  const [poetryFile, setPoetryFile] = useState(
    JSON.parse(localStorage.getItem('poetry-file')) || ''
  )
  const [packages, setPackages] = useState(
    JSON.parse(localStorage.getItem('packs')) || []
  )

  useEffect(() => {
    // Parsing poetry.lock file to array
    const poetryArray = poetryFile.split('\n\n')
    const arr = poetryArray.map(str => {
      let [first, ...rest] = str.split('\n')
      rest = rest.join('\n').replaceAll('"', '')

      var properties = rest.split('\n');
      var obj = {};
      properties.forEach(function(property) {
        let [first2, ...rest2] = property.split(' = ');
        rest2 = rest2.join(' = ')
        obj[first2] = rest2;
      });
      return [first, obj]
    })
    // Going through the array and adding all the dependencies
    // to the package objects
    for(let i = 0; i < arr.length; i++) {
      arr[i][1].dependencies = []
      if(arr[i][0] === "[[package]]") {
        if(arr[i+1][0] === "[package.dependencies]"){
          // Adding dependencies to package objects from [package.dependencies]
          arr[i][1].dependencies = Object.keys(arr[i+1][1])
        }
        if(arr[i+1][0] === "[package.extras]" ||
          (arr[i+2][0] === "[package.extras]" && arr[i+1][0] === "[package.dependencies]")) {
          let index
          if(arr[i+1][0] === "[package.extras]") index = i + 1
          else index = i + 2
          // Parsing [package.extras] and adding them to package objects
          let extras = Object.values(arr[index][1])
          extras = extras.map(extra => extra.substring(1, extra.length-1).split(', '))
          extras = extras.map(array => array.map(line => {
            if(line.includes(' ')) {
              let extra = line.substring(0, line.indexOf(' '))
              arr[i][1].dependencies.push(extra)
              return extra
            }
            else {
              arr[i][1].dependencies.push(line)
              return line
            }
          }))
          // Removing duplicates from package.dependencies array
          arr[i][1].dependencies = [...new Set(arr[i][1].dependencies)]
        }
      }
    }
    // Separating packages of the other parts of the array
    const packs = arr.filter(item => item[0] === "[[package]]").map(item => item[1])
    localStorage.setItem('packs', JSON.stringify(packs))
    setPackages(packs)
  }, [poetryFile])

  // Reading poetry.lock file from user input
  const readFile = (event) =>  {
    var file = event.target.files[0]
    var reader = new FileReader()
    reader.onload = function(event) {
      localStorage.setItem('poetry-file', JSON.stringify(event.target.result))
      setPoetryFile(event.target.result)
    };
    reader.readAsText(file);
  }

  const removeFile = () => {
    setPoetryFile('')
    localStorage.clear()
  }

  return (
    <div className="App">
      <h2>Reaktor Fall 2022 Assignment</h2>
      <h4>poetry.lock parser</h4>
      <div>
        <input type="file" onChange={(e) => readFile(e)}></input>
        {poetryFile && <button onClick={removeFile}>Remove File</button>}
      </div>
      <div>
        <ol id="package-list">
          {packages.map((item,i) => 
            <li key={i}>
              <Link to={`/packages/${item.name}`} state={{ param: item }}>{item.name}</Link>
            </li>
          )}
        </ol>
      </div>
    </div>
  );
}

export default App;
