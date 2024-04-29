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
import Item from "./Item.svelte";

export let searchQuery = "";
let searchNodes: chrome.bookmarks.BookmarkTreeNode[] = [];
function search(event: Event) {
    searchQuery = (event.target as HTMLInputElement).value;
    if (searchQuery === "") {
        searchNodes = [];
        return;
    }
    
    chrome.bookmarks.search(searchQuery, results => {
        searchNodes = results;
    });
}

</script>

<!-- svelte-ignore a11y-autofocus -->
<input
    id="search"
    type="text"
    placeholder="Search Bookmarks..."
    autofocus
    on:input={search}
    on:keydown={event => {
        if (event.key !== "Enter") return;
        // Open first search result
        searchNodes[0]?.url && window.open(searchNodes[0].url, "_self");
    }}
/>

{#if searchQuery.length > 0}
    <div class="folder">
        {#each searchNodes as child (child.id)}
            {#if child.url} <!-- item -->
                <div class="itemmargin">
                    <Item node={child} />
                </div>
            {/if}
        {/each}
    </div>
{/if}