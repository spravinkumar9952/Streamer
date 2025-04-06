
export const baseUrl = "http://localhost:9999/"


export const getHeaders = () => {
  const token = localStorage.getItem('authToken');
  console.log("token", token)
  return {
    'Authorization': `Bearer ${token}`, 
    'Content-Type': 'application/json',
  }
}

// write a middleware to check if the token is expired in