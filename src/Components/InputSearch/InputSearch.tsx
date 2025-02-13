import { useState } from 'react'
import './InputSearch.css'

interface Params {
    label: string
    customMethod: (value:string)=>void
}

export const InputSearch = ({label,customMethod}:Params)=>{

    const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') { 
      customMethod(inputValue);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };



    return(
        <div className="inputContainer">
            <input  type="text" 
                    placeholder={label} 
                    value={inputValue} 
                    onChange={handleChange} 
                    onKeyDown={handleKeyDown}
            />
        </div>
    )
}