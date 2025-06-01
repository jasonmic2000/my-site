// import { getPinnedRepos } from "../lib/repos";
// import type { Repo } from "../lib/types";

import Image from "next/image";

// import PinnedRepos from "../components/PinnedRepos";
// import Footer from "../components/Footer";

const Home = () => {
  return (
    // <>
    //     <main className="flex flex-col min-h-screen items-center justify-center">
    //       <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
    //         <section className="prose mb-20 mt-16 flex w-full flex-col-reverse items-start justify-between gap-4 md:mt-0 md:flex-row md:gap-8 lg:mt-0 lg:flex-row lg:gap-14">
    //           <div className="leading-none">
    //             <h2 className="m-0 text-[2.5rem] font-extrabold text-zinc-900 dark:text-zinc-200">
    //               <span className="text-slate-900 dark:text-slate-50">
    //                 Jason{" "}
    //               </span>
    //               <span className="text-fuchsia-400">Michael</span>
    //             </h2>
    //             <p className="m-0 mb-4 text-slate-900 dark:text-slate-50">
    //               Software Engineer currently working at Maxxton
    //             </p>
    //             {/* <p className="m-0 text-sm text-zinc-700 dark:text-zinc-400">
    //               Learning about the web and experimenting with new
    //               technologies.
    //             </p> */}
    //           </div>
    //           <div className="min-w-fit">
    //             <Image
    //               src="https://i.pinimg.com/280x280_RS/a5/82/42/a58242e96fd87bca86b0d8dc92058a98.jpg"
    //               alt="avatar"
    //               className={`h-32 w-32 m-0 rounded-full shadow-xl not-hover:grayscale transition duration-300`}
    //               width={280}
    //               height={280}
    //             />
    //           </div>
    //         </section>
    //         {/* <PinnedRepos pinnedRepos={props.pinnedRepos} />
    //         <Footer /> */}
    //       </div>
    //     </main>
    // </>
    <>
      <main>
        <header className="flex flex-col-reverse items-start md:flex-row md:justify-between md:items-center md:px-4">
          <div>
            <h2 className="mt-2 md:m-0 text-[2rem] font-extrabold">
              <span>Jason </span>
              <span className="text-rose-400">Michael</span>
            </h2>
            <p className="m-0 italic font-serif">
              Associate Technology Engineer at Maxxton
            </p>
          </div>
          <div>
            <Image
              src="https://i.pinimg.com/280x280_RS/a5/82/42/a58242e96fd87bca86b0d8dc92058a98.jpg"
              alt="avatar"
              className={`h-32 w-32 m-0 rounded-full shadow-xl md:not-hover:grayscale transition duration-300`}
              width={280}
              height={280}
            />
          </div>
        </header>
        <section className="max-w-2xl mx-auto px-4 py-12 font-serif">
          <p className="mb-4">
            I’m a <em>software engineer</em>, <em>problem solver</em>,{" "}
            <em>mentor</em>, <em>manager</em>, <em>lifelong student</em>,{" "}
            <em>gamer</em>, and full-time <em>geek</em>.
          </p>
          <p className="mb-4">
            I love building things that are thoughtful — whether it’s clean,
            accessible UI, a snappy front end, or a self-hosted setup running on
            my home server. I’m curious by nature and thrive on figuring things
            out: debugging tricky issues, learning how systems work under the
            hood, or just customizing my desk setup for the tenth time.
          </p>
          <p className="mb-4">
            Outside of work, I’m deep into <em>board games</em>,{" "}
            <em>video games</em>, and exploring ways to work and live more
            intentionally. I also enjoy mentoring others, writing, and
            constantly tweaking my productivity workflows.
          </p>
          <p>
            This site is my digital playground — a space to share what I’m
            working on, learning, or experimenting with. Sometimes code,
            sometimes ideas. Always me.
          </p>
        </section>
      </main>
    </>
  );
};

export default Home;
