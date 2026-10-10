"use client";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { SOCIALS } from "@/lib/consts";
import { formatDate } from "@/lib/dates";
import { getEmail } from "@/lib/email";
import type { SearchIndex } from "@/lib/search-index";

type Kind = "Page" | "Post" | "Action" | "Link";

interface Item {
  id: string;
  kind: Kind;
  label: string;
  /** Short secondary text shown on the right. */
  hint?: string;
  /** Extra words that should match, lowercase. */
  keywords: string;
  run: () => void;
}

const GROUPS: { kind: Kind; label: string }[] = [
  { kind: "Page", label: "Pages" },
  { kind: "Post", label: "Posts" },
  { kind: "Action", label: "Actions" },
  { kind: "Link", label: "Links" },
];

const PAGES = [
  { label: "Home", href: "/", keywords: "start about bio" },
  {
    label: "Work",
    href: "/work",
    keywords: "experience jobs career resume cv",
  },
  { label: "Blog", href: "/blog", keywords: "posts writing articles" },
];

const SOCIAL_LABELS: Record<string, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  "twitter-x": "X (Twitter)",
};

/** Posts shown before the visitor types anything. */
const EMPTY_QUERY_POST_LIMIT = 5;
/** Most posts shown once the visitor types; the rest are summarised (keep typing to narrow). */
const SEARCH_POST_LIMIT = 8;

/** Every token must appear; earlier and label matches rank higher. -1 = no match. */
function score(item: Item, tokens: string[]): number {
  const label = item.label.toLowerCase();
  const haystack = `${label} ${item.keywords}`;
  let total = 0;
  for (const token of tokens) {
    if (!haystack.includes(token)) return -1;
    if (label.startsWith(token)) total += 3;
    else if (label.includes(` ${token}`)) total += 2;
    else if (label.includes(token)) total += 1.5;
    else total += 0.5;
  }
  return total;
}

interface Props {
  open: boolean;
  onClose: () => void;
  /** Where focus goes on close if the previously focused element is gone. */
  returnFocusTo: RefObject<HTMLElement | null>;
}

// Default export because React.lazy needs it (the menu loads this on demand).
const CommandMenuDialog = ({ open, onClose, returnFocusTo }: Props) => {
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousFocus = useRef<Element | null>(null);
  const baseId = useId();
  const listId = `${baseId}-list`;
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [index, setIndex] = useState<SearchIndex | null>(null);
  const [notice, setNotice] = useState("");

  // Post list: static JSON, fetched once when the menu is first opened.
  useEffect(() => {
    let cancelled = false;
    fetch("/search-index.json")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: SearchIndex | null) => {
        if (!cancelled && data) setIndex(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Open and close the native dialog from the `open` prop.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      previousFocus.current = document.activeElement;
      setQuery("");
      setActive(0);
      setNotice("");
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleClose = useCallback(() => {
    onClose();
    const previous = previousFocus.current;
    if (previous instanceof HTMLElement && previous.isConnected)
      previous.focus();
    else returnFocusTo.current?.focus();
  }, [onClose, returnFocusTo]);

  const items = useMemo<Item[]>(() => {
    const go = (href: string) => () => {
      onClose();
      router.push(href);
    };
    const external = (href: string) => () => {
      onClose();
      window.open(href, "_blank", "noopener,noreferrer");
    };
    const copyEmail = async () => {
      try {
        await navigator.clipboard.writeText(getEmail());
        setNotice("Email address copied to clipboard");
      } catch {
        // Only shown after the visitor asked to copy it, never on first render.
        setNotice(`Could not copy automatically: ${getEmail()}`);
      }
      window.setTimeout(() => setNotice(""), 3000);
    };

    return [
      ...PAGES.map<Item>((page) => ({
        id: `page-${page.href}`,
        kind: "Page",
        label: page.label,
        keywords: page.keywords,
        run: go(page.href),
      })),
      ...(index?.posts ?? []).map<Item>((post) => ({
        id: `post-${post.slug}`,
        kind: "Post",
        label: post.title,
        hint: formatDate(post.date),
        keywords: `${post.description} ${post.tags.join(" ")}`.toLowerCase(),
        run: go(`/blog/${post.slug}`),
      })),
      {
        id: "action-theme",
        kind: "Action",
        label: "Toggle theme",
        hint: resolvedTheme === "dark" ? "Switch to light" : "Switch to dark",
        keywords: "dark light mode appearance",
        run: () => {
          setTheme(resolvedTheme === "dark" ? "light" : "dark");
          onClose();
        },
      },
      {
        id: "action-email",
        kind: "Action",
        label: "Copy email address",
        hint: "Copies to clipboard",
        keywords: "contact mail clipboard",
        run: copyEmail,
      },
      {
        id: "action-rss",
        kind: "Action",
        label: "Open RSS feed",
        hint: "/feed.xml",
        keywords: "subscribe atom json feed",
        run: external("/feed.xml"),
      },
      ...SOCIALS.map<Item>((social) => ({
        id: `link-${social.NAME}`,
        kind: "Link",
        label: SOCIAL_LABELS[social.NAME] ?? social.NAME,
        hint: "Opens in a new tab",
        keywords: "social profile",
        run: external(social.HREF),
      })),
    ];
  }, [index, onClose, resolvedTheme, router, setTheme]);

  const { results, hiddenPosts } = useMemo(() => {
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    let hidden = 0;
    const list = GROUPS.flatMap(({ kind }) => {
      const ofKind = items.filter((item) => item.kind === kind);
      if (tokens.length === 0) {
        // No query: a short, fixed overview.
        if (kind !== "Post") return ofKind;
        hidden = Math.max(0, ofKind.length - EMPTY_QUERY_POST_LIMIT);
        return ofKind.slice(0, EMPTY_QUERY_POST_LIMIT);
      }
      const ranked = ofKind
        .map((item) => ({ item, rank: score(item, tokens) }))
        .filter(({ rank }) => rank >= 0)
        .sort((a, b) => b.rank - a.rank)
        .map(({ item }) => item);
      if (kind !== "Post") return ranked;
      hidden = Math.max(0, ranked.length - SEARCH_POST_LIMIT);
      return ranked.slice(0, SEARCH_POST_LIMIT);
    });
    return { results: list, hiddenPosts: hidden };
  }, [items, query]);

  const position = useMemo(
    () => new Map(results.map((item, i) => [item.id, i])),
    [results],
  );
  const activeIndex = Math.min(active, Math.max(results.length - 1, 0));
  const optionId = (i: number) => `${baseId}-option-${i}`;

  // Keep the highlighted option visible while arrowing through a long list.
  // biome-ignore lint/correctness/useExhaustiveDependencies: `results` is a deliberate trigger (the list changes under the same index).
  useEffect(() => {
    document
      .getElementById(`${baseId}-option-${activeIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, baseId, results]);

  const status =
    notice ||
    (query.trim()
      ? results.length === 0
        ? "No results"
        : `${results.length} result${results.length === 1 ? "" : "s"}${hiddenPosts ? `, ${hiddenPosts} more posts not shown` : ""}`
      : "");

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive(() =>
        results.length ? (activeIndex + 1) % results.length : 0,
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(() =>
        results.length
          ? (activeIndex - 1 + results.length) % results.length
          : 0,
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      results[activeIndex]?.run();
    }
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: clicking the backdrop is a pointer-only convenience; keyboard users close with Esc (native dialog cancel).
    <dialog
      ref={dialogRef}
      data-cmdk=""
      aria-label="Command menu"
      onClose={handleClose}
      // Clicks on the backdrop land on the dialog element itself.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="cmdk m-0 mx-auto mt-[14vh] mb-auto w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-lg border border-zinc-300 bg-background p-0 text-foreground shadow-xl backdrop:bg-black/40 dark:border-zinc-700"
    >
      <input
        type="text"
        role="combobox"
        aria-expanded="true"
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          results.length ? optionId(activeIndex) : undefined
        }
        aria-label="Search pages, posts and actions"
        placeholder="Search pages, posts and actions..."
        autoComplete="off"
        spellCheck={false}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setActive(0);
        }}
        onKeyDown={onKeyDown}
        className="w-full border-zinc-300 border-b bg-transparent px-4 py-3 text-base transition placeholder:text-zinc-600 focus:border-accent focus:bg-zinc-200/60 focus-visible:outline-hidden dark:border-zinc-700 dark:focus:border-accent dark:focus:bg-zinc-800/60 dark:placeholder:text-zinc-400"
      />

      <div
        id={listId}
        role="listbox"
        aria-label="Results"
        className="max-h-[50vh] overflow-y-auto p-2"
      >
        {results.length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
            No results for “{query.trim()}”.
          </p>
        )}
        {GROUPS.map(({ kind, label }) => {
          const group = results.filter((item) => item.kind === kind);
          if (group.length === 0) return null;
          const headingId = `${baseId}-group-${kind}`;
          return (
            // biome-ignore lint/a11y/useSemanticElements: the ARIA listbox pattern groups options with role="group"; a fieldset would be wrong here.
            <div key={kind} role="group" aria-labelledby={headingId}>
              <div
                id={headingId}
                className="px-3 pt-2 pb-1 font-medium text-xs text-zinc-600 uppercase tracking-wide dark:text-zinc-400"
              >
                {label}
              </div>
              {group.map((item) => {
                const i = position.get(item.id) ?? 0;
                return (
                  // biome-ignore lint/a11y/useKeyWithClickEvents: options are operated from the search field (combobox pattern), which handles the arrow keys and Enter.
                  <div
                    key={item.id}
                    id={optionId(i)}
                    role="option"
                    tabIndex={-1}
                    onMouseDown={(event) => event.preventDefault()}
                    aria-selected={i === activeIndex}
                    onMouseMove={() => setActive(i)}
                    onClick={() => item.run()}
                    className="flex cursor-pointer items-center justify-between gap-4 rounded-md px-3 py-2 text-sm aria-selected:bg-zinc-200 aria-selected:shadow-[inset_2px_0_0_var(--accent)] dark:aria-selected:bg-zinc-800"
                  >
                    <span className="truncate font-medium">{item.label}</span>
                    {item.hint && (
                      <span className="shrink-0 truncate text-xs text-zinc-600 dark:text-zinc-400">
                        {item.hint}
                      </span>
                    )}
                  </div>
                );
              })}
              {kind === "Post" && hiddenPosts > 0 && (
                <div
                  aria-hidden="true"
                  className="px-3 py-1 text-xs text-zinc-600 dark:text-zinc-400"
                >
                  +{hiddenPosts} more {hiddenPosts === 1 ? "post" : "posts"},
                  keep typing to narrow
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div
        className={`items-center justify-between gap-4 border-zinc-300 border-t px-4 py-2 text-xs text-zinc-600 dark:border-zinc-700 dark:text-zinc-400 ${notice ? "flex" : "hidden sm:flex"}`}
      >
        <span>{notice || " "}</span>
        <span aria-hidden="true" className="hidden gap-3 sm:flex">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </span>
      </div>

      {/* Screen readers: result count / action feedback. */}
      <div role="status" aria-live="polite" className="sr-only">
        {status}
      </div>
    </dialog>
  );
};

export default CommandMenuDialog;
