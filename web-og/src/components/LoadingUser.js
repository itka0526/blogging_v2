export default function LoadingUser() {
    return (
        <div className="bg-white border-2 border-white p-4 rounded-xl shadow-xl w-3/4 h-48 flex animate-pulse">
            <div className="flex items-center justify-center box-border w-fit ">
                <div className=" w-24 h-24 rounded-full bg-slate-200"></div>
            </div>
            <div className=" w-full p-4 gap-y-3 flex flex-col ">
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
