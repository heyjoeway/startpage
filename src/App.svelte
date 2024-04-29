<style lang="scss">
@import "./style/fonts.scss";

#categories {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}

#edit {
    width: 48px;
    height: 48px;
    position: fixed;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255,255,255,0.5);
    font-size: 22px;
    transform: scaleX(-100%);
    transition: ease-out color 0.1s;
	
	&:hover {
		color: rgba(255,255,255,0.8);
	}
}


</style>

<script lang="ts">
import Background from "./Background.svelte";
import Category from "./Category.svelte";
import Title from "./Title.svelte";
import Search from "./Search.svelte";
import Breadcrumbs from "./Breadcrumbs.svelte";
import Folder from "./Folder.svelte";

import { blurFall, blurSink } from "./Animations";
import Clickable from "./Clickable.svelte";

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

let searchQuery = "";


function openEditor() {
	chrome.tabs.create({ url: `chrome://bookmarks?id=${currentNode?.id}` });
}

</script>

<Background />

<div id="edit">
	<Clickable
		onClick={openEditor}
		width="48px"
		height="48px"
	>
		&#x270e;			
	</Clickable>
</div>

{#if nodeStack.length === 1}
	<div style="position:absolute;width:100%" in:blurFall out:blurSink>
		<Search
			rootNode={nodeStack[0]}
			bind:searchQuery={searchQuery}
		/>

		{#if searchQuery.length === 0}
			<Folder bind:nodes={currentNodeChildren} />

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
		{/if}
	</div>
{/if}
{#if nodeStack.length > 1}

{#key currentNode?.id}
<div
	in:blurFall|global
	out:blurSink|global
	style="position:absolute;"
>

	<Breadcrumbs
		nodeStack={nodeStack}
		onClick={index => {
			nodeStack = nodeStack.slice(0, index + 1);
		}}
	/>

	<Title color="white">
		{currentNode?.title}
	</Title>
	
	<Folder
		bind:nodes={currentNodeChildren}
		showSubFolders={true}
		onFolderClick={node => {
			nodeStack = [...nodeStack, node];
		}}
	/>
</div>
{/key}

{/if}

