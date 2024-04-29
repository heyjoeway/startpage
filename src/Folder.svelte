<style lang="scss">

.folder {
	display: flex;
	flex-direction: row;
	width: 100%;
	flex-wrap: wrap;
	
	.itemmargin {
		margin: 4px;
	}
}

.align-center {
	justify-content: center;
}

</style>

<script lang="ts">
	import Item from "./Item.svelte";
	export let showSubFolders: boolean = false;
	export let onFolderClick: (node: chrome.bookmarks.BookmarkTreeNode) => void = () => {};
	export let nodes: chrome.bookmarks.BookmarkTreeNode[];
	export let alignCenter: boolean = false;
</script>

<div class="folder {alignCenter ? "align-center" : ""}">
	{#each nodes as child (child.id)}
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
