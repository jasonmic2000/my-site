import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

export const DEFAULT_METADATA = {
  title: "Jason Michael",
  description: "Jason Michael's Website",
  url: "https://dev.jasonjmichael.com",
  siteName: "Jason Michael",
  locale: "en_US",
  twitterHandle: "@jasonmic2000",
};

export const SITE = {
  NAME: "My Portfolio",
  EMAIL: "jasonmic2000@gmail.com",
//   NUM_POSTS_ON_HOMEPAGE: 3,
//   NUM_WORKS_ON_HOMEPAGE: 2,
//   NUM_PROJECTS_ON_HOMEPAGE: 3,
} as const;

export const HOME = {
  TITLE: "Home",
  DESCRIPTION: "Welcome to my minimal and lightweight portfolio.",
} as const;

export const BLOG = {
  TITLE: "Blog",
  DESCRIPTION: "Writings on things I care about.",
} as const;

export const WORK = {
  TITLE: "Work",
  DESCRIPTION: "Places I've worked and contributions made.",
} as const;

export const PROJECTS = {
  TITLE: "Projects",
  DESCRIPTION: "Some of the things I've built.",
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

