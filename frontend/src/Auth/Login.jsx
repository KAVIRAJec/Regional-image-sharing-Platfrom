import React from 'react'
import { useState, useEffect } from 'react'
import {
    Card,
    CardHeader,
    CardContent,
    CardDescription,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Toaster, toast } from "sonner"
import { Label } from "@/components/ui/label"
import { ClassicSpinner } from 'react-spinners-kit'
import { Link } from 'react-router-dom';
import useLogin from '../hooks/useLogin';
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from "jwt-decode";

const initialValues = { email: "", password: "" };

const Login = () => {

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate(formValues);
        setFormErrors(errors);
        setIsSubmit(true);
    };

  useEffect(() => {
    console.log(formErrors);
    if(Object.keys(formErrors).length === 0 && isSubmit){
      handleLogin(formValues);
    }
  },[formErrors]);

  const validate = (values) => {
    const errors = {};
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!values.email){
      errors.email = "Email is required";
    }else if(!regex.test(values.email)){
      errors.email = "Email is invalid";
    }
    if(!values.password){
      errors.password = "Password is required";
    } else if (values.password.length < 4) {
      errors.password = "Password must be more than 4 characters";
    } else if (values.password.length > 10) {
      errors.password = "Password cannot exceed more than 10 characters";
    }
    return errors;
  };

  const { error,loading, loginUser, errorMessage } = useLogin();
  const handleLogin = async (values) => {
    loginUser(values);
  }

  return (
    <div className='flex justify-center items-center h-screen bg-gray-300'>
    <Card className='w-full max-w-md'>
            <CardHeader className="bg-white shadow-md rounded-md p-6">
            <CardTitle className="text-xxl font-bold mb-2">Sign in</CardTitle>
            <CardDescription className="text-gray-700 font-medium text-base">
                Unlock your World!
            </CardDescription>
            </CardHeader>

            <CardContent className="mt-4">
            <form onSubmit={handleSubmit}>
                  <div className='mb-4'>
                    <Label className="block text-gray-700 font-bold mb-2 text-base px-2">Email</Label>
                      <Input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formValues.email}
                        onChange={handleChange} 
                      />
                      <p className='text-red-500 text-xs italic'>{formErrors.email}</p>
                  </div>
                  <div className='mb-4'>
                    <Label className="block text-gray-700 font-bold mb-2 text-base px-2">Password</Label>
                      <Input
                        type="password"
                        name="password"
                        placeholder="Enter your Password"
                        value={formValues.password}
                        onChange={handleChange} 
                      />
                      <p className='text-red-500 text-xs italic'>{formErrors.password}</p>
                  </div>
                            
                <Button
                type={`${loading ? '' : 'primary'}`}
                className="w-full mt-4"
                onClick={() => {
                                if (errorMessage && errorMessage.includes("User signed in Successfully")) {
                                    toast.success(errorMessage);
                                } else if (errorMessage) {
                                    toast.error(errorMessage);
                                }
                            }}
                >
                  <Toaster richColors position="top-center" expand={false}/>
              

                  {loading ? <ClassicSpinner /> : 'Sign in'}
                </Button>

              <div className='flex justify-center mt-5'>
              <GoogleLogin 
                size='large'
                shape='rectangular'
                theme='outline'
                text='continue_with'
                className="w-full"
                onSuccess={credentialResponse => {
                  const credentialResponseDecoded = jwtDecode(
                    credentialResponse.credential
                  )
                console.log(credentialResponseDecoded);
                handleLogin({email: credentialResponseDecoded.email, password: "default"});
              }}
                onError={() => {
                console.log('Login Failed');
              }}
              />
              </div>
            </form>

            <div className='text-center mt-5 mb-3'>
              <Link to="/">
                <Button className="w-full">
                  Create an Account
                </Button>
              </Link>
              </div>
            </CardContent>
    </Card>
    </div>
  )
}

export default Login
