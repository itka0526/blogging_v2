import { useEffect, useState, useCallback } from "react";
import Quill from "quill";
import LoadingPost from "../components/LoadingPost";
export default function NewBlog({
    content,
    update,
    setPosts,
    setSelectedPost,
}) {
    const [quill, setQuill] = useState();
    const [time, setTime] = useState("");
    const [title, setTitle] = useState("");

    const [sending, setSending] = useState(false);
    useEffect(() => {
        if (quill == null) return;
        quill.disable();
        quill.setContents(content);
    }, [quill, content]);
    useEffect(() => {
        setTime(`${new Date().toLocaleDateString()}`);
    }, []);
    useEffect(() => {
        if (quill == null) return;
        if (update === "false") return;
        console.log(update);
        quill.updateContents(update);
    }, [update]);

    const wrapperRef = useCallback((wrapper) => {
        if (wrapper == null) return;
        wrapper.innerHTML = "";
        const editor = document.createElement("div");
        wrapper.append(editor);
        const q = new Quill(editor, {
            placeholder: "Once upon a time...",
            readOnly: true,
            theme: "snow",
            modules: {
                toolbar: false,
            },
        });
        setQuill(q);
    }, []);

    async function sendTheBlog() {
        if (title === "") {
            setTitle("Cannot be empty! ");
            return;
        }
        if (time === "") {
            setTime("Cannot be empty! ");
            return;
        }
        setSending(true);
        const pending_response = await fetch("/posthandler", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                date: time,
                body: quill.getContents(),
            }),
        });
        const response = await pending_response.json();
        if (response.status === "failed") {
            setTimeout(() => setSending(false), 15000);
        } else if (response.status === "success") {
            setPosts((prev) => [response.message, ...prev]);
            setTime(`${new Date().toLocaleDateString()}`);
            setTitle("");
            setSending(false);
            setSelectedPost({
                post_id: "blank",
            });
        }
    }
    if (sending === true) {
        return <LoadingPost />;
    } else if (sending === false) {
        return (
            <div className="bg-white border-2 border-blue-500 p-4 rounded-xl shadow-xl w-11/12 h-fit flex flex-col justify-center ">
                <div className="w-full p-4 gap-y-4 flex flex-col ">
                    <div className=" gap-4 flex justify-between border-black flex-wrap">
                        <div>
                            <span>Title: </span>
                            <input
                                placeholder="New title..."
                                className="font-bold border-2 px-3 border-blue-500 rounded w-full"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <span>Date: </span>
                            <input
                                className="font-bold px-3  border-2 border-blue-500 rounded w-full"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            ></input>
                        </div>
                    </div>
                    <div className="h-full">
                        <div className=" whitespace-pre-wrap">
                            <div>
                                <div ref={wrapperRef}></div>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <button
                            className="border-0 w-full rounded  bg-gradient-to-r from-lime-300 to-lime-500 shadow-xl hover:scale-105 duration-300 ease-in-out"
                            onClick={sendTheBlog}
                        >
                            Blog!
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
