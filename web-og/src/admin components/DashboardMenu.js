import { useState, useEffect, use } from "react";
import LoadedPost from "../components/LoadedPost";
import EditingPost from "./EditingPost";
import NewBlog from "./NewBlog";
import BlogEditor from "./BlogEditor";
import { DummyNewBlog } from "./DummyNewBlog";

export default function DashboardMenu() {
    const [posts, setPosts] = useState([]);
    const [loading, isLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState({ post_id: null });
    useEffect(() => {
        (async () => {
            const pending_request = await fetch("/posts");
            const response = await pending_request.json();
            setPosts([...response]);
        })();
    }, []);
    const [update, setUpdate] = useState("false");
    const [writeNewBlog, setWriteNewBlog] = useState(false);
    return (
        <div className="flex flex-col w-screen h-screen">
            <div className="h-10">
                <SearchBar posts={posts} setPosts={setPosts} />
            </div>
            <div className="bg-inherit flex w-screen h-[calc(100%-40px)] overflow-hidden">
                <div className="w-[49%] border-2 flex flex-col overflow-y-scroll gap-y-8 pt-2">
                    {writeNewBlog === true ? (
                        <div className="flex justify-center">
                            <NewBlog
                                setSelectedPost={setSelectedPost}
                                content={selectedPost}
                                update={update}
                                setPosts={setPosts}
                            />
                        </div>
                    ) : (
                        <div
                            className="flex justify-center"
                            onClick={() => {
                                setUpdate("false");
                                setSelectedPost({
                                    post_id: "blank",
                                });
                                setWriteNewBlog(true);
                            }}
                        >
                            <DummyNewBlog />
                        </div>
                    )}

                    {posts.map((post) => {
                        return (
                            <div
                                key={`${post.post_id}-div`}
                                className="flex justify-center"
                                onClick={() => {
                                    setUpdate("false");
                                    setSelectedPost(post);
                                    setWriteNewBlog(false);
                                }}
                            >
                                {selectedPost.post_id === post.post_id ? (
                                    <EditingPost
                                        setSelectedPost={setSelectedPost}
                                        setPosts={setPosts}
                                        update={update}
                                        content={selectedPost}
                                    />
                                ) : (
                                    <LoadedPost content={post} />
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="w-[2%]"></div>
                <div className="w-[49%] h-inherit ">
                    <BlogEditor
                        selectedPost={selectedPost}
                        update={update}
                        setUpdate={setUpdate}
                    />
                </div>
            </div>
        </div>
    );
}

function SearchBar({ posts, setPosts }) {
    const [searchValue, setSearchValue] = useSearchDebounce();

    // .sort(function (x, y) {
    //         // true values first
    //         return x === y ? 0 : x ? -1 : 1;
    //     });
    useEffect(() => {
        const pattern = new RegExp(searchValue, "ig");
        const sortingVal = (value) => {
            if (pattern.test(value)) {
                return 1;
            }
            return 2;
        };
        const m = posts.sort(
            (x, y) => sortingVal(x.title) - sortingVal(y.title)
        );
        setPosts([...m]);
    }, [searchValue]);
    return (
        <div className="w-full h-full border-b-2 border-[#ccc] flex shadow-2xl">
            <div className="flex justify-center items-center w-1/2">
                <input
                    placeholder="Search with title..."
                    className="border-2 rounded px-3 w-2/3"
                    onChange={(e) => {
                        if (
                            /[\'\\^£$%&*()}{@#~?><>,|=_+¬-]/g.test(
                                e.target.value
                            ) === true
                        )
                            return;
                        setSearchValue(e.target.value);
                    }}
                ></input>
            </div>
            <div className="flex justify-center items-center  w-1/2">
                <a href="http://itgelt-is-blogging.herokuapp.com/">
                    <span className="underline">DELETED</span>
                </a>
            </div>
        </div>
    );
}

export function useSearchDebounce(delay = 350) {
    const [search, setSearch] = useState(null);
    const [searchQuery, setSearchQuery] = useState(null);

    useEffect(() => {
        const delayFn = setTimeout(() => setSearch(searchQuery), delay);
        return () => clearTimeout(delayFn);
    }, [searchQuery, delay]);

    return [search, setSearchQuery];
}
