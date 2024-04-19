import { initMercadoPago } from "@mercadopago/sdk-react";
import { Button } from "@mui/material";
import axios from "axios";

const cart = {
    id: 1,
    unit_price: 100,
    quantity: 1,
}; 
const profile = {
    id: 1,
    name: "Lalo",
    email: "test_user_435626719@testuser.com"
};

initMercadoPago(import.meta.env.VITE_PUBLICKEY,
    {locale: "es-AR"});

const urlBack = import.meta.env.VITE_URLBACK;

export const Item = () => {
    const createPreference = async () => {
        const newArray = {
                id: cart.id,
                unit_price: cart.unit_price,
                quantity: cart.quantity,
            };
            const body = {
                "items": newArray,
                "payer": profile
            }
        try {
            let response = await axios.post(`${urlBack}/shop/create-preference`, body);
            console.log(response.data);
            let {mp_url} = response.data;
            return mp_url;
        } catch (error) {
            console.log(error);
        }
    };
    // Crear las prefencia de compras con los datos obtenidos del front hacia el back
    const handleBuy = async () => {
        const mp_url = await createPreference();
        if (mp_url) {
            redirect(mp_url);
        }
    };

    return (
        <div>
            <h1>Comprar producto!</h1>
                <Button onClick={handleBuy}>
                    Comprar Producto!!
                </Button>
        </div>
    )
}