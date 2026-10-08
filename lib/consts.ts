import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

/** How many of the newest posts the home page shows. */
export const HOME_POST_COUNT = 2;

export const HOVER_TRANSITION_CLASS =
  "transition duration-300 ease-in-out hover:text-black dark:hover:text-white";

export const DEFAULT_METADATA = {
  title: "Jason Michael",
  description:
    "Personal site of Jason Michael: work experience, and writing on software and the web.",
  url: "https://dev.jasonjmichael.com",
  siteName: "Jason Michael",
  locale: "en_US",
  twitterHandle: "@jasonmic2000",
};

export const SITE = {
  EMAIL: "jasonmic2000@gmail.com",
} as const;

export const SOCIALS = [
  {
    ICON: FaXTwitter,
    NAME: "twitter-x",
    HREF: "https://twitter.com/jasonmic2000",
  },
  {
    ICON: FaGithub,
    NAME: "github",
    HREF: "https://github.com/jasonmic2000",
  },
  {
    ICON: FaLinkedinIn,
    NAME: "linkedin",
    HREF: "https://www.linkedin.com/in/jasonmic2000",
  },
] as const;
