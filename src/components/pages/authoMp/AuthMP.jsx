import {initMercadoPago, Wallet} from "@mercadopago/sdk-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {Button} from "@mui/material";
import  axios  from "axios";

//simulacion del carrito de compras, en localstorage quizas
const profile = {
    id: 1,
    name: "Lalo",
    email: "test_user_435626719@testuser.com"
};

initMercadoPago(import.meta.env.VITE_PUBLICKEY,
    {locale: "es-AR"});

const urlBack = import.meta.env.VITE_URLBACK;

export const AuthMP = () => {

    const [tokenUrl, setTokenUrl] = useState(null);
    // obtenecion del codigo de autorizacion de mercado pago
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const paramCode = queryParams.get("code"); //code cuando se pide authorizacion al  vendedor para MP
    const paramState= queryParams.get("state"); //randomID cuando se pide authorizacion al  vendedor para MP

    useEffect(() => {

        if(paramCode && paramState){
            createTokenAccess();
        } 
        
    }, [paramCode, paramState])
    
    const createTokenAccess = async () => {
        try {
            await axios.get(
                `${urlBack}/mp/oauth?code=${paramCode}&state=${paramState}`);
            navigate("/home");
        } catch (error) {
            console.log(error);
        }
    };

    const handlerToken = async () => {
        try {
            let response = await axios.post(
                `${urlBack}/profile/${profile.id}/auth-mp`);
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
            
            <p>Enviando una peticion POST a {urlBack}/profile/1/auth-mp</p>
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
        </div>
    )
}