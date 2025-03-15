import jwt from 'jsonwebtoken'
import { randstr } from "./randstr";

const SECRET_KEY = import.meta.env.JWT_SECRET;
//console.log(SECRET_KEY);
const randId = randstr();

export function generateToken(){
    return jwt.sign({ id: randId }, SECRET_KEY, {
        expiresIn: '15m',
    }); 
} 