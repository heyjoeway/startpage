<style lang="scss">
    
#search {
	width: 100%;
	border: none;
	padding: 10px 12px;
	border-radius: 24px;
	background: rgba(255, 255, 255, 0.1);
	backdrop-filter: blur(32px);
	color: white;
	
	&:focus {
		outline: none;
	}
}

</style>

<script lang="ts">
import Folder from "./Folder.svelte";
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

<!-- svelte-ignore a11y-autofocus -->
<input
    id="search"
    type="text"
    placeholder="Search Bookmarks..."
    autofocus
    bind:value={searchQuery}
    on:input={search}
    on:keydown={event => {
        if (event.key !== "Enter") return;
        // Open first search result
        console.log(searchNodes[0]);
        searchNodes[0]?.url && window.open(searchNodes[0].url, "_self");
    }}
/>

{#if searchQuery.length > 0}
    <Folder
        bind:nodes={searchNodes}
        alignCenter={true}
    />
{/if}