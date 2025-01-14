
import { cookie, setCookie } from '@lazarv/react-server';

export default class Cookies {
    constructor() {
		console.log("Cookies");
        this.cookieObject = cookie(); 
    }

    get(name)  {
        return { value: this.cookieObject[name] };
    }

    set(name, value, options) {
        setCookie(name, value, options);
    }
   
    toString() {
        return `Cookies object : ${JSON.stringify(this.cookieObject)}`;
    }
}
