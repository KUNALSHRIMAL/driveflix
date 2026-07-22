import {Route, Routes} from 'react-router-dom';
import Home from '@/pages/Home/Home';
import Login from '@/pages/Login/Login';
import Movies from '@/pages/Movies/Movies';
import Player from '@/pages/Player/Player';
import Search from '@/pages/Search/Search';
import Settings from '@/pages/Settings/Settings';
import MainLayout from '@/layouts/MainLayout';
import NotFound from '@/pages/NotFound/NotFound';
import Shows from '@/pages/Shows/Shows';
import MovieDetails from '@/pages/MovieDetails/MovieDetails';

const AppRouter=()=>{
    return(
            <Routes>
                <Route element={<MainLayout/>}>
                <Route index element={<Home/>} />
                <Route path='/movies' element={<Movies />} />
                <Route path='/movie/:id' element={<MovieDetails />} />
                <Route path='/player/:id' element={<Player/>} />
                <Route path='/search' element={<Search/>} />
                <Route path='/shows' element={<Shows/>} />
                <Route path='/settings' element={<Settings/>} />
                <Route path="*" element={<NotFound />} />\
                </Route>
                <Route path='/login' element={<Login/>} />
            </Routes>
    );
};

export default AppRouter;
