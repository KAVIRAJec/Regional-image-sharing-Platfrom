import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx"; 

const useSignup = () => {
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const registerUser = async (values) => {
    console.log(values);
    try {
      setError(null);
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(values)
      });

      const data = await res.json();
      if(res.status === 201) {
        setErrorMessage(data.message);
        login(data.token,data.user);
      } else if (res.status === 400) {
        setErrorMessage(data.message);
      }else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage(error);
     }finally {
      setLoading(false);
     }
  };
  
  return {loading, error, registerUser, errorMessage };
}

export default useSignup