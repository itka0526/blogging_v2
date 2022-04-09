import { useState } from "react";
import { ReactComponent as FacebookIcon } from "../images/facebook-svgrepo-com.svg";
import { ReactComponent as GithubIcon } from "../images/github-svgrepo-com.svg";
import { ReactComponent as GmailIcon } from "../images/gmail-svgrepo-com.svg";
import { ReactComponent as EyeIcon } from "../images/eye-svgrepo-com.svg";

export default function Login({ setAuth }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [seePassword, setSeePassword] = useState(false);
    const [error, setError] = useState("");

    async function attemptLogin(e) {
        e.preventDefault();
        const pending_response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });
        const response = await pending_response.json();
        if (response.auth === false) {
            setError(response.message);
            setPassword("");
        } else if (response.auth === true) {
            setAuth(response.auth);
        }
    }
    return (
        <div className="flex justify-center items-center w-screen h-screen">
            <form
                onSubmit={attemptLogin}
                className="border-2 border-white shadow-2xl rounded-xl bg-white h-fit flex flex-col w-[420px] min-w-1/3 p-8 gap-y-5 select-none"
            >
                <div className="flex flex-col p-4 h-20 ">
                    <div className="flex justify-center ">
                        <h1 className="text-3xl font-bold mb-2">Нэвтрэх</h1>
                    </div>
                    <div className=" border-t-2 border-black"></div>
                    <div className="flex justify-center">
                        <h1 className=" text-red-500">{error}</h1>
                    </div>
                </div>
                <div className="flex flex-col gap-y-3 pl-8">
                    <div className="w-full h-12  flex">
                        <input
                            autoFocus={1}
                            value={username}
                            className="bottom-2 h-12 w-full px-3 border-2 border-slate-100 rounded"
                            placeholder="Нэвтрэх нэр"
                            onChange={(e) => setUsername(e.target.value)}
                        ></input>
                        <div className=" w-10"></div>
                    </div>
                    <div className="w-full h-12 flex">
                        <input
                            value={password}
                            className="bottom-2 h-12 w-full px-3 border-2 border-slate-100 rounded"
                            placeholder="Нууц үг"
                            onChange={(e) => setPassword(e.target.value)}
                            type={seePassword === false ? "password" : "text"}
                        ></input>
                        <div className=" w-10 flex justify-center items-center">
                            <div
                                className="w-7 h-6 "
                                onClick={() => setSeePassword((prev) => !prev)}
                            >
                                <EyeIcon />
                            </div>
                        </div>
                    </div>
                </div>
                <div className=" flex box-border justify-center h-12 px-3">
                    <button
                        className="border-0 w-full rounded-xl  bg-gradient-to-r from-lime-300 to-lime-500 shadow-xl hover:scale-105 duration-300 ease-in-out"
                        onClick={attemptLogin}
                    >
                        НЭВТРЭХ
                    </button>
                </div>
            </form>
            <div className="fixed bottom-0">
                <div className="flex justify-center mb-4">
                    <a
                        className="px-2 scale-110 hover:scale-125 duration-300 ease-in-out"
                        href="https://www.facebook.com/itgeltultra/"
                        target="_blank"
                    >
                        <FacebookIcon />
                    </a>
                    <a
                        className="px-2 scale-110 hover:scale-125 duration-300 ease-in-out"
                        href="https://github.com/itka0526"
                        target="_blank"
                    >
                        <GithubIcon />
                    </a>
                    <a
                        className="px-2 scale-110 hover:scale-125 duration-300 ease-in-out"
                        href="https://contacts.google.com/person/c8692183175649231489?hl=en"
                        target="_blank"
                    >
                        <GmailIcon />
                    </a>
                </div>
            </div>
        </div>
    );
}
