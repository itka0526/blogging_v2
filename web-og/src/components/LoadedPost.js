import { useEffect, useState, useCallback } from "react";
import Quill from "quill";
import Comments from "./Comments";
export default function LoadedPost({ content, comments = false }) {
    const [quill, setQuill] = useState();
    useEffect(() => {
        if (quill == null) return;
        quill.disable();
        quill.setContents(content.body);
    }, [quill]);
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

    return (
        <div className="bg-white border-2 border-white p-4 rounded-xl shadow-xl w-11/12 h-fit flex flex-col justify-center ">
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
                {comments === true ? (
                    <Comments
                        post_id={content.post_id}
                        latest_comment={content.latest_comment}
                    />
                ) : null}
            </div>
        </div>
    );
}
