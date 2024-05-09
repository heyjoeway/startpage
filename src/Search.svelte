<script lang="ts">
import Folder from "./Folder.svelte";
import Textfield from "./Textfield.svelte";

import Fuse from 'fuse.js'

export let searchQuery = "";
export let rootNode: chrome.bookmarks.BookmarkTreeNode;

function getAllNodes() {
    let nodes: chrome.bookmarks.BookmarkTreeNode[] = [];
    function getNodes(node: chrome.bookmarks.BookmarkTreeNode) {
        if (node.children) {
            node.children.forEach(child => getNodes(child));
        } else {
            nodes.push(node);
        }
    }
    getNodes(rootNode);
    return nodes;
}

let searchNodes: chrome.bookmarks.BookmarkTreeNode[] = [];
function search(event: Event) {
    let nodes = getAllNodes();
    let fuse = new Fuse(nodes, {
        keys: ["title", "url"],
        threshold: 0.3
    });
    searchNodes = fuse.search(searchQuery).map(result => result.item);
}

</script>

<Textfield
    placeholder="Search Bookmarks..."
    autofocus
    bind:value={searchQuery}
    onInput={search}
    onKeydown={event => {
        if (event.key !== "Enter") return;
        // Open first search result
        searchNodes[0]?.url && window.open(searchNodes[0].url, "_self");
    }}
/>

{#if searchQuery.length > 0}
    <Folder
        bind:nodes={searchNodes}
        alignCenter={true}
    />
{/if}