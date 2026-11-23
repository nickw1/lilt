import  { createContext } from 'react';
import type { Module } from '../types';
const ModulesContext = createContext<Partial<Module>>({code: "", topics: []});
export default ModulesContext;
