import {initMercadoPago, Wallet} from "@mercadopago/sdk-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {Button} from "@mui/material";
import  axios  from "axios";

//simulacion del carrito de compras, en localstorage quizas
const cart = [{
    id: 1,
    unit_price: 100,
    quantity: 1,
}]; 

let newTicket = {
    "meta": "meta 2",
    "event":{
        "id":1
    }
}

const urlBack = import.meta.env.VITE_URLBACK;

export const Checkout = () => {
    // preferencia del pedido, datos sobre la compra, el producto, metodo de pago etc
    const [preferenceId, setPreferenceId] = useState(null);
    // datos del usuario
    const [profileData, setProfileData] = useState({id:1});
    const [tokenUrl, setTokenUrl] = useState(null);
    // obtenecion del codigo de autorizacion de mercado pago
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const paramCode = queryParams.get("code"); 
    const paramState= queryParams.get("state");
    
    //configuracion de mercado pago
    useEffect(()=>{
        initMercadoPago(import.meta.env.VITE_PUBLICKEY,
            {locale: "es-AR"});
    }, [])

    useEffect(() => {
        if(paramCode && paramState){
            console.log(paramCode);
            console.log(paramState);
            createTokenAccess();
        } else {
            console.log("No hay codigo de autorizacion");
        }
    }, [paramCode, paramState])
    
    const createTokenAccess = async () => {
        try {
            await axios.get(
                `${urlBack}/mp/oauth?code=${paramCode}&state=${paramState}`);
        } catch (error) {
            console.log(error);
        }
    };
    // Crear las prefencia de compras con los datos obtenidos del front hacia el back
    const createPreference = async () => {
        const newArray = cart.map((product) => {
            return {
                id: product.id,
                unit_price: product.unit_price,
                quantity: product.quantity,
            };
        });
        try {
            console.log(newArray);
            let response = await axios.post(`${urlBack}/shop/create-preference/2/buy`, newArray);
            console.log(response.data);
            const { id } = response.data;
            return id;
        } catch (error) {
            console.log(error);
        }
    };

    const handleBuy = async () => {
        const id = await createPreference();
        console.log(id);
        if (id) {
            console.log(id);
            setPreferenceId(id);
        }
    };

    const handlerToken = async () => {
        try {
            //se hace un body de la creacion de un Ticket, esto se puede cambiar segun convenga
            let body = newTicket;
            let response = await axios.post(
                `${urlBack}/profile/1/ticket`, body);
            console.log(response.data);
            setTokenUrl(response.data.mp_url);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <h1> Primer paso </h1>
            <p> Ya sea al crear al perfil o al vender una entrada, (hay que definir esto) el usuario de una cuenta de MercadoPago 
                Le tiene que dar acceso a Troca para poder comercializar en su nombre </p>
            <hr />
            <p> Para crear un token necesito el ID del profile vendedor </p>
            <p>En este caso, se simula la creacion de una entrada pàra el profile con id : 1</p>
            <pre>
                {JSON.stringify(newTicket, null, 2)}
            </pre>
            <p>Enviando una peticion POST a {urlBack}/profile/1/ticket</p>
            <Button onClick={handlerToken}>
                crear Tocken del vendedor
            </Button>
            <hr />
            <p> Se obtiene como respuesta el siguiente link: </p>
            <pre>
                {tokenUrl ? tokenUrl : "No se ha creado el token aun"}
            </pre>
                {tokenUrl && (
                    <Link to={tokenUrl}>Link de acceso a la cuenta de MercadoPago</Link>
                )}


            <h1>checkout</h1>
            <Button onClick={handleBuy}>
                        Seleccione metodo de pago
            </Button>
                {preferenceId && (
                    <Wallet
                        initialization={{ preferenceId }}
                    />
                )}
        </div>
    )
}