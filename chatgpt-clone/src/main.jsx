import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {RouterProvider} from 'react-router-dom'
import Homepage from './routes/Homepage/Homepage.jsx'
import DashBoard from './routes/DashBoardPage/DashBoard.jsx'
import ChatPage from './routes/ChatPage/ChatPage.jsx'
import RootLayout from './layouts/RootLayout.jsx'
import {createBrowserRouter} from 'react-router-dom'
import DashBoardLayout from './layouts/dashboardLayout/DashBoardLayout.jsx'
import SignInPage from './routes/SignInPage/SignInPage.jsx'
import SignUpPage from './routes/SignUpPage/SignUpPage.jsx'

const router = createBrowserRouter([
  {
   element: <RootLayout></RootLayout>,
   children:[
    {
    path:"/",
    element:<Homepage></Homepage>
    },
    {
      path:"/sign-in/*",
      element:<SignInPage></SignInPage>
      },
      {
        path:"/sign-up/*",
        element:<SignUpPage></SignUpPage>
        },
    {
      element: <DashBoardLayout></DashBoardLayout>,
      children:[
        {
          path:"/dashboard",
          element:<DashBoard></DashBoard>
        },
        {
         path:"/dashboard/chat",
         element:<ChatPage></ChatPage>
        }
      ]
    }
   ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
