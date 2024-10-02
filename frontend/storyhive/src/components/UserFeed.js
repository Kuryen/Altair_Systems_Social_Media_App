import CreatePostButton from "./CreatePostButton";
export default function UserFeed() {
    return (
        <div className="flex flex-col relative items-center justify-center w-screen h-[3000px] bg-[#bf6a02]">
            <CreatePostButton />
            <div class="w-[560px] flex justify-center absolute top-0 bottom-0 bg-[#e5ac3f]">
                <div>

                    <div class="pl-40 text-black text-[40px] font-normal font-['Arial']">Latest from</div>

                    {/* "Users" and "Hives" buttons */}
                    <div class="w-[560px] flex justify-evenly" >

                        <button class="w-[181px] h-[71px] bg-[#eec33d] rounded-[100px] shadow border-8 border-black">
                        <div class="text-black text-[40px] font-normal font-['Arial']">Users</div>
                        </button>

                        <button class="w-[181px] h-[71px] bg-[#eec33d] rounded-[100px] shadow border-8 border-black">
                        <div class="text-black text-[40px] font-normal font-['Arial']">Hives</div>
                        </button>
                    </div>

                    {/* "Feed" */}
                    <div class="pt-7">
                        <div class="self-center w-full h-auto bg-white border border-gray-300 shadow-lg flex items-center justify-center">
                        <p class="break-normal text-black">Post</p>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

{/* <div class="w-[560px] h-[1078px] bg-[#e5ac3f]"></div>
<div class="text-black text-[40px] font-normal font-['Inter']">Users</div>
<div class="text-black text-[40px] font-normal font-['Inter']">Hives</div>
<div class="text-black text-[40px] font-normal font-['Inter']">Latest from</div>
<div class="w-[181px] h-[71px] bg-[#eec33d] rounded-[100px] shadow border-8 border-black"></div>
<div class="w-[181px] h-[71px] bg-[#eec33d] rounded-[100px] shadow border-8 border-black"></div> */}