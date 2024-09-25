
import beeLogo from './bee.png';

export default function SignupPage() {
    return (

        <div class="w-[1920px] h-[1239px] relative bg-[#bf6a02] border border-white">
    <div class="w-[1920px] h-[1239px] left-0 top-0 absolute border border-black">

    

    <div class="w-[350px] h-[95px] left-[1366px] top-[100px] absolute">
      <div class="w-[350px] h-[95px] left-0 top-0 absolute bg-[#a2845e] rounded-[100px]"></div>
      <div class="w-[198px] h-[95px] left-[152px] top-0 absolute bg-[#fff1c2] rounded-[100px]"></div>
      <div class="left-[60px] top-[31px] absolute text-[#222222] text-xl font-bold font-['Poppins'] lowercase">LOGIN</div>
      <div class="w-[109px] h-[37px] left-[196px] top-[24px] absolute text-[#111111] text-3xl font-bold font-['Poppins'] lowercase">SIGNUP</div> 
      </div>

    <div class="w-[771px] h-[1000px] left-[575px] top-[100px] absolute rounded-[100px] bg-white shadow-xl"></div>
    <div class="w-[519px] h-[59px] left-[790px] top-[268px] absolute text-black text-[40px] font-bold font-['Poppins']">Welcome to Storyhive! </div>

    <form>
      {/* email bubble and input */}
      <div class="w-[584px] h-[126px] left-[668px] top-[369px] relative">
        <label class="w-full h-full" for="email">
          <input class="rounded-[100px] border-2 border-[#aaaaaa] text-black text-2xl w-full h-full pl-10 placeholder:text-2xl placeholder:italic" type="text" id="email" placeholder="user@email.com" />
        </label>
      </div>

        {/* username bubble and input */}
      <div class="w-[584px] h-[126px] left-[669px] top-[400px] relative">
        <label class="w-full h-full" for="username">
          <input class="rounded-[100px] border-2 border-[#aaaaaa] text-black text-2xl w-full h-full pl-10 placeholder:text-2xl placeholder:italic" type="text" id="usernmame" placeholder="username" />
        </label>
      </div>

      {/* password bubble and input */}
      <div class="w-[584px] h-[126px] left-[669px] top-[435px] relative">
        <label class="w-full h-full" for="password">
          <input class="rounded-[100px] border-2 border-[#aaaaaa] text-black text-2xl w-full h-full pl-10 placeholder:text-2xl placeholder:italic" type="text" id="password" placeholder="Password" />
        </label>
      </div>
    </form>
    

    {/* Next button */}
    <div class="w-[237px] h-[102px] left-[870px] top-[455px] relative">
      <button type="submit" class="w-[186px] h-[80px] top-[12px] relative bg-[#e5a000] text-black text-3xl font-semibold font-['Arial'] rounded-[100px] hover:text-white">Next
      </button>
    </div>
    
    <img class="w-[126px] h-[138px] left-[898px] top-[130px] absolute" src={beeLogo} alt="site bee logo" />
    
       </div>
      </div>

            );
        }