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

#breadcrumbs {
	width: 100%;
	text-align: left;
	margin-left: 12px;
	user-select: none;
	cursor: pointer;
	color: #888;
}

</style>

<script lang="ts">
import Background from "./Background.svelte";
import Category from "./Category.svelte";
import Item from "./Item.svelte";
import Title from "./Title.svelte";

import { blurFall, blurSink } from "./Animations";

let nodeStack: chrome.bookmarks.BookmarkTreeNode[] = [];

const colors = [
	"orange",
	"palevioletred",
	"skyblue"
]

chrome.bookmarks.getTree(
	itemsRaw => {
		const bookmarkBarRegex = /(bookmarks (tool)?bar|favou?rites bar|mobile bookmarks)/i;
		let rootNode = itemsRaw[0];
		let rootNodeCandidate = itemsRaw[0]?.children?.find(
			x => bookmarkBarRegex.test(x.title)
		);
		if (rootNodeCandidate) {
			rootNode = rootNodeCandidate;
		}
		nodeStack = [rootNode];
	}
);

let currentNodeChildren: chrome.bookmarks.BookmarkTreeNode[] = [];
let currentNode: chrome.bookmarks.BookmarkTreeNode | undefined = undefined;
$: {
	currentNode = nodeStack[nodeStack.length - 1];
	if (currentNode?.children) {
		currentNodeChildren = currentNode.children;
		
		// Sort folders first (a node is a folder is url is undefined)
		currentNodeChildren.sort((a, b) => {
			if (a.url && !b.url) return 1;
			if (!a.url && b.url) return -1;
			return 0;
		});
	} else currentNodeChildren = [];
}

import { quintOut } from 'svelte/easing';
import { fade } from 'svelte/transition';
</script>

<Background />

{#if nodeStack.length === 1}
	<div style="position:absolute" in:blurFall out:blurSink>
		<div class="folder">
			{#each currentNodeChildren as child (child.id)}
				{#if child.url} <!-- item -->
					<div class="itemmargin">
						<Item node={child} />
					</div>
				{/if}
			{/each}
		</div>

		<div id="categories">
			{#each currentNodeChildren as child, index (child.id)}
				{#if child.children} <!-- folder -->
					<Category
						node={child}
						color={colors[index % colors.length]}
						onFolderClick={node => {
							nodeStack = [...nodeStack, node];
						}}
					/>
				{/if}
			{/each}
		</div>
	</div>
{/if}
{#if nodeStack.length > 1}

{#key currentNode?.id}
<div
	in:blurFall|global
	out:blurSink|global
	style="position:absolute;"
>
	<div id="breadcrumbs">
		{#each nodeStack as node, index (node.id)}
			{#if index < nodeStack.length - 1}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<span
					class="breadcrumb"
					on:click={() => {
						nodeStack = nodeStack.slice(0, index + 1);
					}}
				>
					{node.title} &#x25B6;
				</span>
			{/if}
		{/each}
	</div>

	<Title color="white">
		{currentNode?.title}
	</Title>
	
	<div class="folder">
		{#each currentNodeChildren as child (child.id)}
			<div class="itemmargin">
				<Item
					node={child}
					onFolderClick={node => {
						nodeStack = [...nodeStack, node];
					}}
				/>
			</div>
		{/each}
	</div>
</div>
{/key}

{/if}

