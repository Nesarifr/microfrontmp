import {Route, Routes} from 'react-router-dom';
import { Home } from '../components/pages/home/Home';
import { Item } from '../components/pages/item/Item';
import { AuthMP } from '../components/pages/authoMp/AuthMP';

export const AppRouter = () => {
    return (
        <>
            <Routes>
                <Route path="/*" element={<Home />} />
                <Route path="/item" element={<Item />} />
                <Route path="/authmp" element={<AuthMP />} />


            </Routes>
        </>
    )
}