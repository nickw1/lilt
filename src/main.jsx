import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, useLoaderData } from 'react-router-dom';
import App from './components/app.jsx';
import Admin from './components/admin.jsx';

const router = createBrowserRouter([{
        path: "/",
        element: <App />
    }, {  
        path: "/admin",
        element: <Admin />,
    }
]);

const root = ReactDOM.createRoot(
    document.getElementById('root')
);

root.render(<RouterProvider router={router} />);
