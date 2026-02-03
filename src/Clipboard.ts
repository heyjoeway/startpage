import { writable } from "svelte/store";

export let clipboardStore = writable<chrome.bookmarks.BookmarkTreeNode | null>(null);