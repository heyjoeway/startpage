<style lang="scss">

.folder {
	display: flex;
	flex-direction: row;
	// justify-content: center;
	width: fit-content;
	flex-wrap: wrap;
	
	.itemmargin {
		margin: 4px;
	}
}

</style>

<script lang="ts">
    import Item from "./Item.svelte";
    export let showSubFolders: boolean = false;
    export let onFolderClick: (node: chrome.bookmarks.BookmarkTreeNode) => void = () => {};
    export let currentNodeChildren: chrome.bookmarks.BookmarkTreeNode[];
</script>

<div class="folder">
    {#each currentNodeChildren as child (child.id)}
        {#if child.url || (showSubFolders && !child.url)} <!-- item -->
            <div class="itemmargin">
                <Item
                    node={child}
                    onFolderClick={onFolderClick}
                />
            </div>
        {/if}
    {/each}
</div>