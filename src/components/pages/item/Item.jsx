import { initMercadoPago } from "@mercadopago/sdk-react";
import { Button } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { redirect, useLocation, useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status");

    useEffect(() => {

        if(status == "approved"){
            console.log("Compra exitosa!");
            alert("Compra exitosa!");
        }
        }, [status])

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
            return response.data;
        } catch (error) {
            console.log(error);
        }
    };
    // Crear las prefencia de compras con los datos obtenidos del front hacia el back
    const handleBuy = async () => {
        const mp_url = await createPreference();
        if (mp_url) {
            window.location.href= mp_url;
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