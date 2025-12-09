// src/hooks/useAuth.js

export function useAuth() {
  const getToken = () => localStorage.getItem('token');
  
  const getUser = () => {
    const user = localStorage.getItem('user');

    return user ? JSON.parse(user) : null;
  };


  const isAdmin = () => {
    const user = getUser();
 
    return user && user.tipo === 'admin'; 
  };

  return { getToken, getUser, isAdmin };
}