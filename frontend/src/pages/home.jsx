import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { FileUpload } from 'primereact/fileupload';
import { MetroSpinner } from 'react-spinners-kit';

const Home = () => {
    const { userData, login } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const location = userData.location;

    const getAllUser = async (location) => {
        console.log(location);
        try {
            setError(null);
            setLoading(true);
            const params = new URLSearchParams(location).toString();
            const res = await fetch(`http://localhost:3000/api/users?${params}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
            });

            const data = await res.json();
            if (res.ok) {
                setErrorMessage(data);
                setLoading(false);
            } else {
                setErrorMessage(data);
                setLoading(false);
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await getAllUser({ location: userData.location });
        };
        console.log(errorMessage);

        fetchData();
    }, []);

    const onUpload = () => {
        console.log('Files uploaded');
    };


    return (
        <div className="pt-10 flex flex-col items-center">
            <div className="w-full -mt-10 h-20 flex text-center items-center justify-center text-4xl font-bold bg-slate-400">Welcome back {userData.name}</div>
            <div className="bg-gray-200 p-4 m-4 justify-center rounded w-3/6">
                <h1 className="text-3xl text-center font-bold m-2">Your Previous Post</h1>
                {
                    userData.image ? (
                        <div className="flex justify-center">
                        <img
                            src={userData.image}
                            alt={userData.name}
                            className="w-52 h-52 object-cover rounded-full mb-4"
                        />
                        </div>
                    ) : <div className="text-sm text-center font-bold mb-4 text-red-600">You haven't upload anything yet</div>
                }
                <h1 className="text-center text-3xl font-bold mb-4">Post Your Image</h1>
                <FileUpload name="myPic" url="http://localhost:3000/upload" onUpload={onUpload}
                    mode="basic" accept="image/*" maxFileSize={1000000}
                    className="m-2 p-5 px-8 text-2xl border rounded-xl bg-blue-700 text-white text-center hover:bg-blue-300 cursor-pointer"
                />
            </div>
            <h1 className="text-4xl font-bold mt-4 mb-4">You can Find Your Region Users</h1>
            <h2 className="text-2xl mb-4">Your nearby location users</h2>
            {
                (loading == true) ? (
                    <div className="flex justify-center items-center mt-10">

                        <MetroSpinner size={70} color="#000" loading={true} />
                    </div>
                ) :
                    (<div className="grid grid-cols-3 gap-20">
                        {Array.isArray(errorMessage) && errorMessage
                            .filter(user => user.location === location && user.email !== userData.email)
                            .map((user, index) => (
                                <div key={index} className="border p-16 rounded shadow">
                                    <h3 className="text-xl text-center font-semibold">User Name: {user.name}</h3>
                                    <img src={user.image} alt={user.name} className="w-64 h-64 items-center object-cover rounded mb-4" />
                                    <p className="text-gray-900 text-xl text-center">{user.location}</p>
                                </div>
                            ))}
                    </div>)
            }
        </div>
    );
}

export default Home;
