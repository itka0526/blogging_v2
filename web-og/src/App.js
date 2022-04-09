import { useEffect, useState, useRef } from "react";
import LoadedPost from "./components/LoadedPost";
import LoadingPost from "./components/LoadingPost";

function App() {
    const [loading, isLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [publicKey, setPublicKey] = useState("");

    useEffect(() => {
        // setTimeout(() => isLoading(false), 10000);
        (async () => {
            const pending_request = await fetch("/posts");
            const response = await pending_request.json();
            const rev = response.reverse()
            setPosts([...rev]);
            isLoading(false);
        })();
    }, []);

    return (
        <div className="h-auto w-full overflow-hidden ">
            <div className="bg-gray-100 h-full w-full flex justify-center items-center flex-col gap-y-8 py-4 ">
                {loading && (
                    <>
                        <LoadingPost />
                        <LoadingPost />
                        <LoadingPost />
                        <LoadingPost />
                    </>
                )}
                {!loading &&
                    posts.map((post) => {
                        return (
                            <LoadedPost
                                content={post}
                                comments={true}
                                key={`${post.post_id}-post`}
                            />
                        );
                    })}
            </div>
        </div>
    );
}

export default App;
