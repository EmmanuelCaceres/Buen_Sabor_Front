import { useState } from "react";

export default function useError(){
    const [error, setError] = useState<string | null>()

    return{error,setError}
}