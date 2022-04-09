import { useEffect, useState } from "react";

export default function Comments({ post_id, latest_comment }) {
    const [wroteComment, setWroteComment] = useState("");
    const [showComments, setShowComments] = useState(false);
    const [listOfComments, setListOfComments] = useState([]);

    useEffect(() => {
        if (showComments === true) {
            (async () => {
                const pending_response = await fetch(
                    `/comments?post_id=${post_id}`
                );
                const response = await pending_response.json();
                console.log(response);
                if (response.status === "success") {
                    setListOfComments([...response.message]);
                }
            })();
        }
    }, [showComments]);
    async function submitComment(e) {
        e.preventDefault();
        if (wroteComment === "") return;
        const pending_request = await fetch("/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                post_id,
                comment: wroteComment,
            }),
        });
        const response = await pending_request.json();
        if (response.status === "success") {
            setWroteComment("");
            setShowComments(false);
        }
        console.log(response);
    }
    return (
        <div className="flex flex-col border-t-[1px] border-[#ccc]">
            <div className="flex w-full flex-row-reverse">
                <span
                    className="px-8 underline-offset-2 underline font-bold cursor-pointer select-none"
                    onClick={() => setShowComments((prev) => !prev)}
                >
                    Comments
                </span>
            </div>
            {showComments === false ? (
                <div className="bg-slate-100 rounded-2xl w-1/3 min-w-fit flex flex-col px-[12px] py-1 h-9 ">
                    <span className="">{latest_comment}</span>
                </div>
            ) : null}

            <div className="flex w-full flex-col max-h-32 overflow-y-scroll">
                {showComments &&
                    listOfComments.reverse().map((comment) => {
                        return (
                            <div
                                className="mb-2 pl-4 relative"
                                key={comment.id + "-comment"}
                            >
                                <div className="bg-slate-100 rounded-2xl w-1/3 min-w-fit flex flex-col px-[12px] py-1 h-14">
                                    <div className="flex ">
                                        <span className="font-light">
                                            {comment.nickname}
                                        </span>
                                        <span className="opacity-0 hover:opacity-100 duration-300 absolute inset-0 left-20 z-10 flex justify-center items-center ">
                                            {comment.username}
                                        </span>
                                    </div>
                                    <div className="flex ">
                                        <span className="pl-1 break-words">
                                            {comment.message}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>

            {showComments && (
                <form
                    className="border-t-[1px] border-[#ccc] h-10 p-2"
                    onSubmit={submitComment}
                >
                    <input
                        autoFocus={1}
                        onChange={(e) => setWroteComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="px-3 rounded-xl w-full bg-slate-100 h-9"
                    ></input>
                </form>
            )}
        </div>
    );
}
