import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex justify-center flex-col gap-6 items-center text-white min-h-[60vh] px-5 md:px-0 text-center">
        <div className="font-bold flex flex-col md:flex-row gap-4 md:text-7xl justify-center items-center text-4xl mt-16">
          <span>Get Me A Momo</span>
          <span>
            <img
              className="invertImg w-16 md:w-24"
              src="/momo.gif"
              alt="momo"
            />
          </span>
        </div>
        <p className="text-lg md:text-2xl text-slate-300 max-w-2xl px-4">
          A crowdfunding platform for creators to fund their dreams. Fans can
          buy you a momo to support your work!
        </p>
        <div className="flex gap-4 mt-4">
          <Link href={"/login"}>
            <button
              type="button"
              className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-bold rounded-xl text-lg px-8 py-4 text-center transition-all transform hover:scale-105"
            >
              Start Here
            </button>
          </Link>

          <Link href="/about">
            <button
              type="button"
              className="text-white glass hover:bg-white/10 focus:ring-4 focus:outline-none focus:ring-slate-300 font-bold rounded-xl text-lg px-8 py-4 text-center transition-all"
            >
              Read More
            </button>
          </Link>
        </div>
      </div>

      <div className="h-[1px] bg-gradient-to-r from-transparent via-slate-500 to-transparent opacity-20 my-10"></div>

      <div className="text-white container mx-auto py-20 px-6">
        <h2 className="text-4xl font-bold text-center mb-16">
          Why "Get Me A Momo"?
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="item space-y-4 flex flex-col items-center glass p-8 rounded-3xl transition-transform hover:-translate-y-2">
            <div className="bg-indigo-500/20 p-4 rounded-full">
              <img
                className="invertImg w-16 h-16"
                src="/man.gif"
                alt="fans help"
              />
            </div>
            <p className="font-bold text-2xl">Fans want to help</p>
            <p className="text-slate-400 text-center">
              Your community is ready to back your vision.
            </p>
          </div>
          <div className="item space-y-4 flex flex-col items-center glass p-8 rounded-3xl transition-transform hover:-translate-y-2">
            <div className="bg-purple-500/20 p-4 rounded-full">
              <img
                className="invertImg w-16 h-16"
                src="/coin.gif"
                alt="contribute"
              />
            </div>
            <p className="font-bold text-2xl">Easy Support</p>
            <p className="text-slate-400 text-center">
              Receive micro-donations directly from your supporters.
            </p>
          </div>
          <div className="item space-y-4 flex flex-col items-center glass p-8 rounded-3xl transition-transform hover:-translate-y-2">
            <div className="bg-pink-500/20 p-4 rounded-full">
              <img
                className="invertImg w-16 h-16"
                src="/group.gif"
                alt="collaborate"
              />
            </div>
            <p className="font-bold text-2xl">Build Community</p>
            <p className="text-slate-400 text-center">
              Create a lasting bond with your most loyal fans.
            </p>
          </div>
        </div>
      </div>
      <div className="h-[1px] bg-gradient-to-r from-transparent via-slate-500 to-transparent opacity-20 my-10"></div>

      <div className="text-white container mx-auto pb-32 pt-14 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-center mb-14">
          Learn more about us
        </h2>
        {/* Responsive youtube embed  */}
        <div className="w-[90%] h-[40vh] md:w-[50%] md:h-[40vh] lg:w-[50%] lg:h-[40vh] xl:w-[50%] xl:h-[40vh]">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/ojuUnfqnUI0?si=wMUv4DG3ia6Wt4zn"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </>
  );
}
