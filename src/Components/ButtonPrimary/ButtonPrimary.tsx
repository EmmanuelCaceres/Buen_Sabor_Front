import './ButtonPrimary.css';

interface Props{
    label:string;
    customMethod:()=>void;
}

export const ButtonPrimary = ({label,customMethod}:Props)=>{
    return(
        <button className='buttonStyle' onClick={customMethod}>
            {label}
        </button>
    )
}