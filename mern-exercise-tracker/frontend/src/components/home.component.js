import React from 'react';
import { useEffect } from 'react';
import http from '../services/http-common';

const Home = () => {
    const [message, setMessage] = React.useState("");

    useEffect(() => {
        let mounted = true;
        const loadData = () => {
            http.get("/home")
                .then(res => {
                    if(mounted)
                        setMessage(res.data);
                })
                .catch(err => {
                    setMessage(
                    (err.response && err.response.data && err.response.data.message)
                        || err.message || err.toString()
                )});
        }
        loadData();
        return () => {
            mounted = false;
        }
    }, [message]);

    return (
        <div className="jumbotron">
            {message && (
                <h3>{message}</h3>
            )}
            {!message && (
                <h3>Loading page...</h3>
            )}
        </div>
    )
}

export default Home;