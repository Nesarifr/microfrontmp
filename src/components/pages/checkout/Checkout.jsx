import {initMercadoPago, Wallet} from "@mercadopago/sdk-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {Button} from "@mui/material";
import  axios  from "axios";

//simulacion del carrito de compras, en localstorage quizas
const cart = [{
    id: 1,
    unit_price: 100,
    quantity: 1,
}]; 

const urlBack = import.meta.env.VITE_URLBACK;

export const Checkout = () => {
    useEffect(()=>{
        initMercadoPago(import.meta.env.VITE_PUBLICKEY,
            {locale: "es-AR"});
    }, [])
    //configuracion de mercado pago
    
    // preferencia del pedido, datos sobre la compra, el producto, metodo de pago etc
    const [preferenceId, setPreferenceId] = useState(null);
    // datos del usuario
    const [userData, setUserData] = useState({
    });

    // obtenecion de la respuesta de mercado pago, si fue aprobado el pago o no
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const paramValue = queryParams.get("status"); // approved --- reject
    
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
            let response = await axios.post(
                `${urlBack}/shop/create-preference/2/buy`,newArray);
            const { id } = response.data;
            return id;
        } catch (error) {
            console.log(error);
        }
    };

    const handleBuy = async () => {
        const id = await createPreference();
        if (id) {
            console.log(id);
            setPreferenceId(id);
        }
    };

    return (
        <div>
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