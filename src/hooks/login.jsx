//import { useState, useEffect } from 'react';
import UserDao from '../../server/dao/user.mjs';
import db from '../../server/db/db.mjs';

import { useHttpContext } from '@lazarv/react-server';

export default function useLoggedIn() {
    const userDao = new UserDao(db);
    const {
        platform: { request: req } 
    } = useHttpContext();
    if(req.session?.uid){
        return {
            usercode: req.session.admin ? 1 : userDao.findUserById(req.session.uid)?.usercode,
            admin: req.session.admin
        };    
    }
    return { usercode: null, admin: false };
}
