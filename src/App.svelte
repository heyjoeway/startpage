<style lang="scss">
@import "./style/fonts.scss";

#categories {
	width: 100%;
}

#container {
	position: absolute;
	max-width: 768px;
	width: calc(round(down, 100%, 256px));
	box-sizing: border-box;
	top: 14vh;
	padding-bottom: 14vh;
}

</style>

<script lang="ts">	
import Category from "./Category.svelte";
import Title from "./Title.svelte";
import Search from "./Search.svelte";
import Breadcrumbs from "./Breadcrumbs.svelte";
import Folder from "./Folder.svelte";
import Background from "$joeysvelte/Background.svelte";
import { shift } from "$joeysvelte/Animations.ts";

import { getPropStore } from "$joeysvelte/Theming.ts";
import Clickable from "$joeysvelte/Clickable.svelte";
import Navbar from "$joeysvelte/Navbar.svelte";

import Fa from "svelte-fa";
import { faPencil, faGear } from '@fortawesome/free-solid-svg-icons';
    import ThemeProvider from "$joeysvelte/ThemeProvider.svelte";
    import Settings from "./Settings.svelte";

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

let settingsModalOpen = false;
let saveThemeModalOpen = false;
let themeSelectValue = "";

function randomElement(arr: any[]) {
    return arr[Math.round(Math.random() * (arr.length - 1))];
}
let htmlDiceEntities = ["&#x2680;", "&#x2681;", "&#x2682;", "&#x2683;", "&#x2684;", "&#x2685;"];

let bgTextStore = getPropStore("bg.topLeft.text");
const themeStoreHeaderColors = getPropStore("header.colors");

</script>

{#if settingsModalOpen}
	<Settings bind:open={settingsModalOpen} />
{/if}

<ThemeProvider>
<Background>
	<span slot="topLeft">
		{$bgTextStore}
	</span>
	<span slot="bottomRight">
		{@html randomElement(htmlDiceEntities)}
	</span>
</Background>


<Navbar>
	<svelte:fragment slot="right">
		<Clickable width="48px" height="48px" onClick={() => settingsModalOpen = true}>
			<Fa
				icon={faGear} size="lg"
				color="var(--joeysvelte-text-colors-primary)" 
			/>
		</Clickable>
		<Clickable width="48px" height="48px" onClick={openEditor}>
			<Fa
				icon={faPencil} size="lg"
				color="var(--joeysvelte-text-colors-primary)"
			/>
		</Clickable>
	</svelte:fragment>
</Navbar>

{#if nodeStack.length === 1}
	<div id="container" in:shift out:shift={{ direction: "down" }}>
		<Search
			rootNode={nodeStack[0]}
			bind:searchQuery={searchQuery}
		/>

		{#if searchQuery.length === 0}
			<Folder alignCenter={true} bind:nodes={currentNodeChildren} />

			<div id="categories">
				{#each currentNodeChildren as child, index (child.id)}
					{#if child.children} <!-- folder -->
						{@const colors = $themeStoreHeaderColors || []}
						<Category
								color={colors[index % colors.length]}
								node={child}
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
	in:shift|global
	out:shift|global={{ direction: "down" }}
	id="container"
>

	<Breadcrumbs
		nodeStack={nodeStack}
		onClick={index => {
			nodeStack = nodeStack.slice(0, index + 1);
		}}
	/>

	<Title color="var(--joeysvelte-text-colors-primary)">
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
</ThemeProvider>