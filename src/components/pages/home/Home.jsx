import { Button } from "@mui/material"
import { Link } from "react-router-dom"

export const Home = () => {



    return (
        <>
            <Button>
                <Link to="/authmp">Autorizar a Troca</Link>
            </Button>
            <Button>
                <Link to="/item">Comprar Producto</Link>
            </Button>
        </>
    )
}