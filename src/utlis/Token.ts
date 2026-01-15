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
        // RefreshToken được server set qua httpOnly cookie
        // Frontend không thể đọc được nhưng browser sẽ tự gửi
        const token = Cookies.get('refreshToken') 
        return token 
    } 
    static getToken(name : string) 
    {
        return Cookies.get(name) 
    }
    static setToken(name : string , value : string) 
    {
        Cookies.set(name , value, {
            secure: true,
            sameSite: 'strict'
        }) 
    }
    static setAccessToken(value : string) 
    {
        Cookies.set('accessToken' , value, {
            secure: true,
            sameSite: 'strict'
        });
        
        // Dispatch custom event to notify components about auth change
        window.dispatchEvent(new Event('authChanged'));
    }
    static removeToken(name : string) 
    {
        Cookies.remove(name) 
    }
    static clearAllTokens() 
    {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        
        // Dispatch custom event to notify components about auth change
        window.dispatchEvent(new Event('authChanged'));
    }
}
export default Token 