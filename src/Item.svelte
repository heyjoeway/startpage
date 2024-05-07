<style lang="scss">

.item {
    width: 256px;

    text-align: left;
    height: 48px;
    box-sizing: border-box;
    
    font-family: 'Microsoft Sans Serif';
    font-size: 14px;
    opacity: 75%;
    /* padding-left: 52px; */
    overflow: hidden;
        
    display: flex;
    align-items: center;
    
    position: relative;
    
    &:hover {
        opacity: 100%;
        
        > .underline {
            width: 4px;
        }
    }
}

.underline {
    position: relative;
    height: 100%;
    overflow: hidden;
    transition: ease-out width 0.025s;
    
    div {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-position: center;
        background-size: cover;
        filter: blur(16px);
    }
}

.title {
    font-size: 14px;
    text-transform: lowercase;
}

.favicon {
    user-select: none;
    
    width: 48px;
    height: 48px;
    min-width: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    
    img {
        width: 24px;
        image-rendering: pixelated;
    }
}

.title, .url {
    font-family: 'Microsoft Sans Serif';
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.url {
    font-size: 10px;
    color: #AAA;
    padding-top: 2px;
    max-width: calc((256px - 48px) - 4px);
    
}
</style>

<script lang="ts">
import * as cheerio from 'cheerio';
import { persisted } from 'svelte-persisted-store'
import { FastAverageColor } from 'fast-average-color';

interface CacheInterface {
    [key: string]: string;
}

const faviconCache = persisted('faviconCache', {} as CacheInterface);
const colorCache = persisted('colorCache', {} as CacheInterface);

import Clickable from "./Clickable.svelte";

export let node: chrome.bookmarks.BookmarkTreeNode;
export let onFolderClick: (node: chrome.bookmarks.BookmarkTreeNode) => void = () => {};

let nodeHTML: string = "";
let displayURL: string;

let onClick: string | (() => void) = "";

enum LiveStreamStatus {
    NA,
    Loading,
    Offline,
    Live
}

let liveStreamStatus = LiveStreamStatus.NA;

type FetchTextResponse = {
    text?: string;
    error?: string;
};

type FetchDataUrlResponse = {
    dataUrl?: string;
    error?: string;
};

async function bgFetchText(url: string): Promise<string> {
    return await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
            { type: "fetchText", url },
            (response: FetchTextResponse) => {
                if (response.text) resolve(response.text);
                else reject(response.error);
            }
        );
    });
}

async function bgFetchDataUrl(url: string): Promise<string> {
    return await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
            { type: "fetchDataUrl", url },
            (response: FetchDataUrlResponse) => {
                if (response.dataUrl) resolve(response.dataUrl);
                else reject(response.error);
            }
        );
    });
}

let isTwitchStream: boolean = false;
let isYoutubeStreamVideo: boolean = false;
let isYoutubeStreamPermalink: boolean = false;

function updateDisplayURL(url: string) {
    displayURL = url;
    // Remove HTTP/HTTPS
    displayURL = displayURL.replace(/(^\w+:|^)\/\//, '');
    // Remove www
    displayURL = displayURL.replace(/^www\./, '');
    // Remove query string
    displayURL = displayURL.replace(/\?.*$/, '');
    // Remove hash
    displayURL = displayURL.replace(/#.*$/, '');
    // Remove trailing slash
    displayURL = displayURL.replace(/\/$/, '');
}

$: if (node.url) {
    let faviconCacheHit = $faviconCache[node.url];
    if (faviconCacheHit) {
        faviconContent = faviconCacheHit;
        color = $colorCache[node.url];
    }
    
    isTwitchStream = node.url.match(/twitch.tv\/[^\/]+$/) ? true : false;
    isYoutubeStreamVideo = node.url.match(/youtube.com\/watch\?v=[^&]+/) ? true : false;
    isYoutubeStreamPermalink = node.url.match(/youtube.com\/@[^\/]+\/live/) ? true : false;

    // Used for livestream checking and favicon
    if (
           isTwitchStream
        || isYoutubeStreamVideo
        || isYoutubeStreamPermalink
        || (faviconCacheHit === undefined)
    ) {
        updateHTML(node.url);
    }
    
    onClick = node.url;
    
    // Get display URL for subtitle
    displayURL = node.url;
    // Remove HTTP/HTTPS
    displayURL = displayURL.replace(/(^\w+:|^)\/\//, '');
    // Remove www
    displayURL = displayURL.replace(/^www\./, '');
    // Remove query string
    displayURL = displayURL.replace(/\?.*$/, '');
    // Remove hash
    displayURL = displayURL.replace(/#.*$/, '');
    // Remove trailing slash
    displayURL = displayURL.replace(/\/$/, '');
} else {
    displayURL = "";
    liveStreamStatus = LiveStreamStatus.NA;
    onClick = () => onFolderClick(node);
    faviconContent = "./folder.png";
};

// We should only need to run this once per instantiation
// I've been having some issues with it running multiple times so, this is a hacky fix
let updateHTMLTriggered = false;
async function updateHTML(url: string) {
    if (updateHTMLTriggered) return;
    updateHTMLTriggered = true;
    
    if (isTwitchStream || isYoutubeStreamVideo || isYoutubeStreamPermalink) {
        if (!isYoutubeStreamVideo) {
            liveStreamStatus = LiveStreamStatus.Loading;
        }
        url += "?nocache=" + Date.now();
    }
    nodeHTML = await bgFetchText(url);

    if (isTwitchStream || isYoutubeStreamPermalink) {
        if (nodeHTML.includes("isLiveBroadcast")) {
            liveStreamStatus = LiveStreamStatus.Live;
        } else {
            liveStreamStatus = LiveStreamStatus.Offline;
        }
    } else if (isYoutubeStreamVideo) {
        if (nodeHTML.includes("isLiveBroadcast")) {
            liveStreamStatus = LiveStreamStatus.Live;
        } else {
            liveStreamStatus = LiveStreamStatus.NA;
        }
    }
    
    let faviconCacheHit = $faviconCache[node.url as string];    
    if (faviconCacheHit === undefined) updateFavicon();
}

let faviconContent: string = "";
let color: string = "";

async function updateFavicon() {
    let faviconURL = "/favicon.ico";
    
    let $ = cheerio.load(nodeHTML);
    let url = node.url as string;
    
    // Parse html to find favicon
    let faviconMatch = $("link[rel*='icon']").attr("href");
    if (faviconMatch) faviconURL = faviconMatch;
    
    // Check if url is at root
    // Make sure to remove query string, hash, and trailing slash
    let rootURL = new URL(url).origin;
    let isRoot = rootURL === url.replace(/\?.*$/, '').replace(/#.*$/, '').replace(/\/$/, '');
    if (!isRoot) {
        // Find social graph image
        let socialGraphMatch = $("meta[property='og:image']").attr("content");
        if (socialGraphMatch) faviconURL = socialGraphMatch;
    }
    
    if (!faviconURL) return
    // If relative URL, make it absolute
    if (!faviconURL.match(/^(http|https):\/\//))
        faviconURL = new URL(faviconURL, node.url).href;
    
    faviconContent = await bgFetchDataUrl(faviconURL);
    $faviconCache[url] = faviconContent;
    
    let fac = new FastAverageColor();
    let img = new Image();
    img.src = faviconContent;
    await new Promise(resolve => img.onload = resolve);
    let colorRaw = await fac.getColorAsync(faviconContent, { algorithm: 'sqrt' });
    color = colorRaw.hex;
    $colorCache[url] = color;
}


</script>

<Clickable onClick={onClick}>
    <div class="item">
        <div class="underline" style="background-color:{color}"></div>
        <div class="favicon">
            <!-- svelte-ignore a11y-missing-attribute -->
            <img src="{faviconContent}" />
        </div>
        <div class="text">
            <div class="title">{node.title}</div>
            {#if liveStreamStatus == LiveStreamStatus.Loading}
                <div class="url" style="color:orange">
                    &#x2B24;&nbsp;&nbsp;Checking...
                </div>
            {:else if liveStreamStatus == LiveStreamStatus.Live}
                <div class="url" style="color:red">
                    &#x2B24;&nbsp;&nbsp;Live
                </div>
            {:else if liveStreamStatus == LiveStreamStatus.Offline}
                <div class="url">
                    &#x2B24;&nbsp;&nbsp;Offline
                </div>
            {:else if node.url}
                <div class="url">{displayURL}</div>
            {/if}
        </div>
    </div>
</Clickable>