import {Route, Routes} from 'react-router-dom';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Movie from '../pages/MovieDetails/Movie';
import Player from '../pages/Player/Player';
import Search from '../pages/Search/Search';
import Settings from '../pages/Settings/Settings';
import MainLayout from '../layouts/MainLayout';
import NotFound from '@/pages/NotFound/NotFound';

const AppRouter=()=>{
    return(
            <Routes>
                <Route element={<MainLayout/>}>
                <Route path='/' element={<Home/>} />
                <Route path='/movie/:id' element={<Movie/>} />
                <Route path='/player/:id' element={<Player/>} />
                <Route path='/search' element={<Search/>} />
                <Route path='/settings' element={<Settings/>} />
                <Route path="*" element={<NotFound />} />
                </Route>
                <Route path='/login' element={<Login/>} />
            </Routes>
    );
};

export default AppRouter;