import { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./toolbar.css";
const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
];

export default function BlogEditor({ selectedPost, setUpdate, update }) {
    const [quill, setQuill] = useState();
    useEffect(() => {
        if (quill == null) return;
        if (update === "false") return;
        quill.updateContents(update);
    }, []);
    useEffect(() => {
        if (quill == null) return;
        quill.setContents(selectedPost.body);
    }, [selectedPost]);
    useEffect(() => {
        if (quill == null) return;
        const handler = (delta, _, __) => {
            setUpdate(delta);
        };
        quill.on("text-change", handler);
        return () => {
            quill.off("text-change", handler);
        };
    }, [quill, selectedPost]);

    const wrapperRef = useCallback((wrapper) => {
        if (wrapper == null) return;
        wrapper.innerHTML = "";
        const editor = document.createElement("div");
        wrapper.append(editor);
        const q = new Quill(editor, {
            theme: "snow",
            modules: { toolbar: TOOLBAR_OPTIONS },
            placeholder: "Start by typing here...",
        });
        q.enable();
        setQuill(q);
    }, []);
    return (
        <div
            className="w-inherit h-full blog-editor-container flex flex-col border-2 "
            ref={wrapperRef}
        ></div>
    );
}
