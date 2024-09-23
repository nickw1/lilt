import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, useLoaderData } from 'react-router-dom';
import App from './components/app.jsx';
import Admin from './components/admin.jsx';
import AdminAnswersMain from './components/adminanswersmain.jsx';

const router = createBrowserRouter([{
        path: "/",
        element: <App />
    }, {  
        path: "/admin",
        element: <Admin />,
    }, {  
        path: "/adminanswers",
        element: <AdminAnswersMain />,
    }
], // { basename: '/lilt' } // uncomment for non-default base urls 
);

const root = ReactDOM.createRoot(
    document.getElementById('root')
);

root.render(<RouterProvider router={router} />);
