export function DummyNewBlog() {
    return (
        <div className="bg-white border-2 border-white p-4 rounded-xl shadow-xl w-11/12 h-fit flex flex-col justify-center ">
            <div className="w-full p-4 gap-y-4 flex flex-col ">
                <div className=" gap-4 flex justify-between  ">
                    <div>
                        <span className="font-bold underline underline-offset-4">
                            Title
                        </span>
                    </div>
                    <div>
                        <span className="font-bold underline underline-offset-4">
                            Date
                        </span>
                    </div>
                </div>
                <div className="h-full">
                    <div className=" whitespace-pre-wrap">
                        <div>
                            <div className="flex justify-center underline underline-offset-4">
                                Click here to write new blog
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
