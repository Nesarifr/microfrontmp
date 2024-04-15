import {Route, Routes} from 'react-router-dom';
import { Home } from '../components/pages/home/Home';
import { Checkout } from '../components/pages/checkout/Checkout';

export const AppRouter = () => {
    return (
        <>
            <Routes>
                <Route path="/*" element={<Checkout />} />
                <Route path="/checkout" element={<Checkout />} />

            </Routes>
        </>
    )
}