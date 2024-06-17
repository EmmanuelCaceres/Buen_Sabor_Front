import { useState,useEffect } from "react";

export default function CheckOutMP({montoTotal=0}){

    const [idPreference, setIdPreference] = useState<string>('');

    const getPreferenceMP = async () => {
        if(montoTotal > 0){
            const response:PreferenceMP = await createPreferenceMP({id: 0, nombre:'Pedido Buen Sabor', montoTotal: montoTotal});
            console.log("Preference id: " + response.idPreference);
            if(response)
                setIdPreference(response.idPreference);
        }else{
            alert("Agregue al menos un plato al carrito");
        }
      
    }

    useEffect(() => {
                      // TEST-eff051e2-6610-48a8-952f-4423523253c4
        initMercadoPago('TEST-eff051e2-6610-48a8-952f-4423523253c4',{ locale: 'es-AR' });
      }, []);
    

    return(
        <div>
            <button onClick={getPreferenceMP} className='btMercadoPago'>Pagar</button>
            <div className={idPreference ? 'divVisible':'divInvisible'}>
                <Wallet initialization={{ preferenceId: idPreference, redirectMode:"blank" }} customization={{ texts:{ valueProp: 'smart_option'}}} />
            </div>

        </div>
    )
}