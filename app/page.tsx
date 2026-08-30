import Image from "next/image";
import { Connect } from "@/components/Connect";
import { Work } from "@/components/Work";
import { getAllWorkEntries } from "@/lib/utils";

const Home = async () => {
  const workEntries = await getAllWorkEntries();
  const mostRecentWorkEntry = workEntries[0];

  return (
    <>
      <section className="flex flex-col-reverse items-start md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="mt-2 md:m-0 text-[2rem] font-extrabold">
            <span>Jason </span>
            <span className="text-rose-400">Michael</span>
          </h2>
          <p className="m-0 italic font-serif">
            Associate Technology Manager at Maxxton
          </p>
        </div>
        <div>
          <Image
            src="/luffy-wano-avatar.jpg"
            priority={true}
            alt="avatar"
            className={`h-32 w-32 m-0 rounded-full shadow-xl md:not-hover:grayscale transition duration-300 ease-in-out`}
            width={280}
            height={280}
          />
        </div>
      </section>
      <section className="mx-auto font-serif">
        <p className="mb-4">
          I’m a <em>software engineer</em>, <em>manager</em>, <em>mentor</em>,{" "}
          <em>problem solver</em>, <em>lifelong student</em>, <em>gamer</em>,
          and full-time <em>geek</em>.
        </p>
        <p className="mb-4">
          My first brush with code was in the 7th grade, guiding a little
          triangle called the “Turtle” across the screen with BASIC and Logo. I
          didn’t know it then, but that triangle sparked a curiosity that’s
          still going strong. Since then, I’ve explored everything from HTML and
          Java in school to PHP and C++ in college — eventually finding my way
          back to the web, where I now build clean, accessible interfaces (and
          occasionally break things just to learn how they work).
        </p>
        <p className="mb-4">
          These days, I focus on thoughtful engineering — whether it’s crafting
          intuitive, accessible UIs, improving performance, or running
          self-hosted experiments on my home server. I’ve also found myself
          mentoring more lately — not necessarily in a formal way, but by
          helping teammates debug tricky problems, reviewing code, and
          supporting where I can.
        </p>
        <p className="mb-4">
          Outside work, video games have been a constant in my life — not just
          as a hobby, but as a space that’s shaped my curiosity, creativity, and
          the way I think about systems. I also spend time on board games,
          productivity experiments, and occasionally fall down rabbit holes
          about hardware, workflows, or terminal customization.
        </p>
        <p>
          This site is my digital playground — a space to share what I’m working
          on, learning, or obsessed with. Sometimes code, sometimes ideas.
          Always me.
        </p>
      </section>
      <Work workEntries={[mostRecentWorkEntry]} showDetails={false} />
      <Connect />
    </>
  );
};

export default Home;
