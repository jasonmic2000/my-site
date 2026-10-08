import type { Metadata } from "next";
import Image from "next/image";
import { Connect } from "@/components/Connect";
import { JsonLd } from "@/components/JsonLd";
import { Posts } from "@/components/Posts";
import { Work } from "@/components/Work";
import { getAllPosts } from "@/lib/blog";
import { HOME_POST_COUNT } from "@/lib/consts";
import { getAllWorkEntries } from "@/lib/content";
import { homeJsonLd } from "@/lib/jsonld";
import { FEED_TYPES } from "@/lib/metadata";

export const metadata: Metadata = {
  alternates: { canonical: "/", types: FEED_TYPES },
};

const Home = async () => {
  const workEntries = await getAllWorkEntries();
  const mostRecentWorkEntry = workEntries[0];
  const recentPosts = getAllPosts().slice(0, HOME_POST_COUNT);

  return (
    <>
      {/* First child on purpose: main's space-y would otherwise add a gap after a trailing script. */}
      <JsonLd data={homeJsonLd()} />
      <section className="flex flex-col-reverse items-start md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="mt-2 font-extrabold text-[2rem] md:m-0">
            <span>Jason </span>
            <span className="text-accent">Michael</span>
          </h1>
          <p className="m-0 font-serif italic">
            {mostRecentWorkEntry &&
              `${mostRecentWorkEntry.role} at ${mostRecentWorkEntry.shortCompany ?? mostRecentWorkEntry.company}`}
          </p>
        </div>
        <div>
          <Image
            src="/luffy-wano-avatar.jpg"
            priority={true}
            alt="Portrait of Jason Michael"
            className="m-0 h-32 w-32 rounded-full shadow-xl transition duration-300 ease-in-out md:not-hover:grayscale"
            width={280}
            height={280}
          />
        </div>
      </section>
      <section className="mx-auto font-serif">
        <p className="mb-4">
          I’m a <em>software engineer</em>, <em>problem solver</em>,{" "}
          <em>tinkerer</em>, <em>gamer</em>, <em>lifelong student</em>, and
          full-time <em>geek</em>.
        </p>
        <p className="mb-4">
          My first brush with code was in the 7th grade, guiding a little
          triangle called the “Turtle” across the screen with BASIC and Logo. I
          didn’t know it then, but that triangle sparked an interest that’s
          still going strong. Since then, I’ve explored everything from HTML and
          Java in school to PHP and C++ in college - eventually finding my way
          to the web, where I’ve been building ever since.
        </p>
        <p className="mb-4">
          These days, I focus on thoughtful engineering - crafting intuitive,
          accessible UIs, improving performance, figuring out how to make things
          work a little better, and occasionally breaking things just to learn
          how they work. That instinct doesn’t stop at software either. I’ve
          always enjoyed taking things apart and tinkering, from self-hosted
          experiments and hardware projects to getting distracted by something
          completely unrelated and needing to understand how it works.
        </p>
        <p className="mb-4">
          Outside work, video games have been a constant in my life - not just
          as a hobby, but as something that’s shaped my creativity and how I
          think about systems. I’m a sucker for a good world, an interesting
          story, and the kind of lore that makes you want to keep digging,
          whether that’s in games, anime, movies, books, or at a tabletop. I’m
          especially fond of things that lean into the strange and unknown, and
          have a particular soft spot for cosmic horror and sprawling fictional
          universes. I tend to get invested in things pretty easily, and there’s
          always some new world, story, or idea pulling me in.
        </p>
        <p className="mb-4">That’s more or less what this website is for.</p>
        <p className="mb-4">
          It’s my little corner of the internet - somewhere to share what I’m
          working on, learning, or obsessed with. Some of it will be technical.
          Some of it probably won’t be. There might be a project here, a
          game-related rabbit hole there, or something I decided was worth
          writing down at 2 a.m.
        </p>
        <p>Sometimes code, sometimes ideas. Always me.</p>
      </section>
      {mostRecentWorkEntry && (
        <Work workEntries={[mostRecentWorkEntry]} showDetails={false} />
      )}
      <Posts posts={recentPosts} />
      <Connect />
    </>
  );
};

export default Home;
