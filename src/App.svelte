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
	opacity: 0.5;
    font-size: 22px;
    transform: scaleX(-100%);
    transition: ease-out opacity 0.1s;
	
	&:hover {
		opacity: 0.8;
	}
}

#container {
	position: absolute;
	max-width: 808px;
	width: 100%;
	box-sizing: border-box;
	padding: 8px;
	top: 14vh;
}

</style>

<script lang="ts">	
import Background from "./Background.svelte";
import Category from "./Category.svelte";
import Title from "./Title.svelte";
import Search from "./Search.svelte";
import Breadcrumbs from "./Breadcrumbs.svelte";
import Folder from "./Folder.svelte";
import Theme from "./Theme";

import { blurFall, blurSink } from "./Animations";
import Clickable from "./Clickable.svelte";

let nodeStack: chrome.bookmarks.BookmarkTreeNode[] = [];

async function getNodeRoot() {
	let itemsRaw = await chrome.bookmarks.getTree();
	
	const bookmarkBarRegex = /(bookmarks (tool)?bar|favou?rites bar|mobile bookmarks)/i;
	let rootNode = itemsRaw[0];
	let rootNodeCandidate = itemsRaw[0]?.children?.find(
		x => bookmarkBarRegex.test(x.title)
	);
	if (rootNodeCandidate) {
		rootNode = rootNodeCandidate;
	}
	return rootNode;
}

(async () => nodeStack = [await getNodeRoot()])();

async function refreshNodeStack() {
	let newStack = [];
	for (let i = 0; i < nodeStack.length; i++) {
		newStack.push((await chrome.bookmarks.getSubTree(nodeStack[i].id))[0]);
	}
	nodeStack = newStack;
}

chrome.bookmarks.onChanged.addListener(refreshNodeStack);
chrome.bookmarks.onMoved.addListener(refreshNodeStack);
chrome.bookmarks.onRemoved.addListener(refreshNodeStack);
chrome.bookmarks.onCreated.addListener(refreshNodeStack);

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

<div id="edit"
	style:color={$Theme.text.primary.color}
>
	<Clickable
		onClick={openEditor}
		width="48px"
		height="48px"
	>
		&#x270e;			
	</Clickable>
</div>

{#if nodeStack.length === 1}
	<div id="container" in:blurFall out:blurSink>
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
							color={$Theme.category.colors[index % $Theme.category.colors.length]}
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
	id="container"
>

	<Breadcrumbs
		nodeStack={nodeStack}
		onClick={index => {
			nodeStack = nodeStack.slice(0, index + 1);
		}}
	/>

	<Title color={$Theme.text.primary.color}>
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

