import { useEffect, useState } from "react";
import DashboardMenu from "./DashboardMenu.js";
import Login from "./Login.js";

export default function AdminDashboard() {
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        (async () => {
            const pending_response = await fetch("/login", {
                method: "POST",
            });
            const response = await pending_response.json();
            setAuth(response.auth);
        })();
    }, []);
    return (
        <div className="bg-gray-100 h-screen w-screen">
            {auth === null ? (
                <div className="bg-gray-100 h-screen w-screen" />
            ) : auth === false ? (
                <Login setAuth={setAuth} />
            ) : auth === true ? (
                <DashboardMenu />
            ) : null}
        </div>
    );
}
