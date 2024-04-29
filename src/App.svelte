<style lang="scss">
@import "./style/fonts.scss";

:root {
    scrollbar-color: #111 #000;
}

#categories {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}

</style>

<script lang="ts">
import Background from "./Background.svelte";
import Category from "./Category.svelte";

let rootNode: chrome.bookmarks.BookmarkTreeNode | undefined = undefined;
const colors = [
	"orange",
	"palevioletred",
	"skyblue"
]

chrome.bookmarks.getTree(
	itemsRaw => {
		const bookmarkBarRegex = /(bookmarks (tool)?bar|favou?rites bar|mobile bookmarks)/i;
		rootNode = itemsRaw[0];
		let rootNodeCandidate = itemsRaw[0]?.children?.find(
			x => bookmarkBarRegex.test(x.title)
		);
		if (rootNodeCandidate) {
			rootNode = rootNodeCandidate;
		}
	}
);

let rootNodeChildren: chrome.bookmarks.BookmarkTreeNode[] = [];
$: rootNodeChildren = (() => {
	if (rootNode?.children)
		return rootNode.children;
	
	return [] as chrome.bookmarks.BookmarkTreeNode[];
})();

</script>

<Background />
<div id="categories">
	{#each rootNodeChildren as child, index}
		{#if child.children} <!-- folder -->
			<Category
				node={child}
				color={colors[index % colors.length]}
			/>
		{/if}
	{/each}
</div>
