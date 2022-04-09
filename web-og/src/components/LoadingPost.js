export default function LoadingPost() {
    return (
        <div className="bg-white border-2 border-white p-4 rounded-xl shadow-xl w-11/12 h-48 flex flex-col justify-center">
            <div className=" w-full p-4 gap-y-4 flex flex-col animate-pulse ">
                <div className=" gap-4 flex justify-between ">
                    <div className="bg-slate-200 w-1/2 h-4 rounded-xl"></div>
                    <div className="bg-slate-200 w-2/3 h-4 rounded-xl"></div>
                </div>
                <div className=" gap-4 flex justify-between ">
                    <div className="bg-slate-200 w-2/3 h-4 rounded-xl"></div>
                    <div className="bg-slate-200 w-1/2 h-4 rounded-xl"></div>
                </div>
                <div className="bg-slate-200 w-full h-4 rounded-xl"></div>

                <div className="bg-slate-200 w-3/4 self-end h-4 rounded-xl"></div>
            </div>
        </div>
    );
}
