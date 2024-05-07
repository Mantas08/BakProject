import { Navigate, createBrowserRouter } from "react-router-dom";
import Login from "./view/Login";
import Signup from "./view/Signup";
import Users from "./view/users";
import NotFound from "./view/Notfound";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Dashboard from "./view/Dashboard";
import UserForm from "./view/UserForm";
import Propertys from "./view/Propertys";
import PropertyNewForm from "./view/PropertyNewForm";
import PropertyUpdateForm from "./view/PropertyUpdateForm";
import Reservations from "./view/Reservation/Reservations";
import UserReservations from "./view/Reservation/UserReservations";
import CreateReservation from "./view/Reservation/Createreservation";
import ForgotPassword from "./view/ForgotPassword";
import ResetPassword from "./view/ResetPassword";
import TaskList from "./view/Task/TaskList";
import CreateTask from "./view/Task/CreateTask";
import PropertyProfile from "./view/PropertyProfile";
import Finance from "./view/Finance/finance";
import AddFinances from "./view/Finance/AddFinances";
import GenerateReport from "./view/Finance/GenerateReport";
import TaskProfile from "./view/Task/TaskProfile";
import TaskEdit from "./view/Task/TaskEdit";
import SplitFinances from "./view/Finance/SpiltFinances";

const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: '/',
                element: <Navigate to="/propertys" />
            },
            {
                path: '/dashboard',
                element: <Dashboard />
            },
            {
                path: '/users',
                element: <Users/>
            },
            {
                path: '/users/new',
                element: <UserForm key="userCreate" />
            },
            {
                path: '/users/:id',
                element: <UserForm key="userUpdate" />
            },
            {
                path: '/propertys',
                element: <Propertys/>
            },
            {
                path: '/propertys/new',
                element: <PropertyNewForm key="propertyCreate" />
            },
            {
                path: '/propertys/edit/:id',
                element: <PropertyUpdateForm key="propertyUpdate" />
            },
            {
                path: '/propertys/:id',
                element: <PropertyProfile />
            },
            {
                path: 'userReservations/',
                element: <UserReservations />
            },
            {
                path: 'reservation/:id',
                element: <Reservations key="reservationPlace" />
            },
            {
                path: 'reservation/new/:id',
                element: <CreateReservation key="reservationCreate" />
            },
            {
                path: 'taskList/:id',
                element: <TaskList />
            },
            {
                path: 'task/new/:id',
                element: <CreateTask key="TaskCreate" />
            },
            {
                path: '/tasks/edit/:id',
                element: <TaskEdit/>
            },
            {
                path: 'taskProfile/:id',
                element: <TaskProfile />
            },
            {
                path: '/finances/:id',
                element: <Finance/>
            },
            {
                path: '/finances/new/:id',
                element: <AddFinances/>
            },
            {
                path: '/finances/report/:id',
                element: <GenerateReport/>
            },
            {
                path: '/finances/split/:id',
                element: <SplitFinances/>
            },
            
        ]
    },
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/signup',
                element: <Signup />
            },
            {
                path: '/ForgotPassword',
                element: <ForgotPassword />
            },
            {
                path: '/ResetPasssword',
                element: <ResetPassword />
            },
        ]
    },
    {
        path: '*',
        element: <NotFound />
    },

])

export default router;