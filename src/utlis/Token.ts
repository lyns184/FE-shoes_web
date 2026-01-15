import Cookies from 'js-cookie';

class Token 
{
    static getAccessToken() 
    {
        const token = Cookies.get('accessToken') 
        return token 
    } 
    static getRefreshToken() 
    {
        const token = Cookies.get('refreshToken') 
        return token 
    } 
    static getToken(name : string) 
    {
        return Cookies.get(name) 
    }
    static setToken(name : string , value : string) 
    {
        Cookies.set(name , value) 
    }
}
export default Token 