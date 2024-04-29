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

import Clickable from "./Clickable.svelte";

export let node: chrome.bookmarks.BookmarkTreeNode;
export let onFolderClick: (node: chrome.bookmarks.BookmarkTreeNode) => void = () => {};

let displayURL: string;
$: if (node.url) {
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
}

let faviconURL: string = "./folder.png";
let onClick: string | (() => void) = "";
$: if (node.url) {
    onClick = node.url;
    
    // Get domain name from URL
    let faviconDomain = node.url;
    if (faviconDomain) {
        try {
            faviconDomain = new URL(faviconDomain).hostname;
        } catch (e) { }
    }
    
    faviconURL = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${node.url}&size=128`;
} else {
    onClick = () => onFolderClick(node);
};

let underlineBGRepeat = 50;
let underlineBGRange = Array.from({ length: underlineBGRepeat }, (_, i) => i);

</script>

<Clickable onClick={onClick}>
    <div class="item">
        <div class="underline">
            <!-- yes, i'm pretty sure this is the only way without a CORS proxy. -->
            {#each underlineBGRange as i}
                <div style="background-image:url({faviconURL})"></div>
            {/each}
        </div>
        <div class="favicon">
            <!-- svelte-ignore a11y-missing-attribute -->
            <img src="{faviconURL}" />
        </div>
        <div class="text">
            <div class="title">{node.title}</div>
            {#if node.url}
                <div class="url">{displayURL}</div>
            {/if}
        </div>
    </div>
</Clickable>