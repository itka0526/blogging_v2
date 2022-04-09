import { useEffect, useState, useCallback } from "react";
import Quill from "quill";
import LoadingPost from "../components/LoadingPost";
export default function EditingPost({ content, update, setPosts }) {
    const [quill, setQuill] = useState();
    const [sending, setSending] = useState(false);
    useEffect(() => {
        if (quill == null) return;
        quill.disable();
        quill.setContents(content.body);
    }, [quill, content]);

    useEffect(() => {
        if (quill == null) return;
        if (update === "false") return;
        quill.updateContents(update);
    }, [update]);

    const wrapperRef = useCallback((wrapper) => {
        if (wrapper == null) return;
        wrapper.innerHTML = "";
        const editor = document.createElement("div");
        wrapper.append(editor);
        const q = new Quill(editor, {
            readOnly: true,
            theme: "snow",
            modules: {
                toolbar: false,
            },
        });
        setQuill(q);
    }, []);
    async function updateTheBlog() {
        if (quill == null) return;
        setSending(true);
        const pending_response = await fetch("/posthandler", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                post_id: content.post_id,
                updated_body: quill.getContents(),
            }),
        });
        const response = await pending_response.json();
        if (response.status === "failed") {
            setTimeout(() => setSending(false), 15000);
        } else if (response.status === "success") {
            setPosts((prev) => {
                prev.find((post) => {
                    if (post.post_id === response.message.post_id)
                        post.body = response.message.body;
                });
                return prev;
            });
            //quill.setContents(response.message.body);
            setSending(false);
        }
    }
    async function deleteTheBlog() {
        if (quill == null) return;
        setSending(true);
        const pending_response = await fetch("/posthandler", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                post_id: content.post_id,
                deleted_body: quill.getContents(),
            }),
        });
        const response = await pending_response.json();
        if (response.status === "failed") {
            setTimeout(() => setSending(false), 15000);
        } else if (response.status === "success") {
            (async () => {
                const pending_request = await fetch("/posts");
                const response = await pending_request.json();
                setPosts([...response]);
                setSending(false);
            })();
        }
    }
    if (sending === true) {
        return <LoadingPost />;
    } else if (sending === false) {
        return (
            <div className="bg-white border-2 border-blue-500 p-4 rounded-xl shadow-xl w-11/12 h-fit flex flex-col justify-center ">
                <div className="w-full p-4 gap-y-4 flex flex-col ">
                    <div className=" gap-4 flex justify-between  ">
                        <div>
                            <span className="font-bold">{content.title}</span>
                        </div>
                        <div>
                            <span className="font-bold">{content.date}</span>
                        </div>
                    </div>
                    <div className="h-full">
                        <div className=" whitespace-pre-wrap">
                            <div>
                                <div ref={wrapperRef}></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-x-2">
                        <button
                            className="border-2 h-8 text-sm font-bold w-1/2 rounded border-orange-400 bg-transparent  shadow-xl hover:scale-105 duration-300 ease-in-out hover:bg-orange-400"
                            onClick={updateTheBlog}
                        >
                            Update
                        </button>
                        <button
                            className="border-2 h-8 text-sm font-bold w-1/2 rounded border-red-400 bg-transparent shadow-xl hover:scale-105 duration-300 ease-in-out hover:bg-red-500"
                            onClick={deleteTheBlog}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
