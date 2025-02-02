import { Link } from "react-router-dom";

interface Props{
    label:string
    url:string;
}

export const ButtonEdit = ({label,url}:Props)=>{
    return(
        <Link to={url} className='btn btn-warning me-2'>
            {label}
        </Link>
    )
}