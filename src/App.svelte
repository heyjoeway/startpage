<style lang="scss">
@import "./style/fonts.scss";

#categories {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
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
import Category from "./Category.svelte";
import Title from "./Title.svelte";
import Search from "./Search.svelte";
import Breadcrumbs from "./Breadcrumbs.svelte";
import Folder from "./Folder.svelte";
import { download, upload } from "./Download";
import {
	Animations,
	Background
} from "joeysvelte";
const blurFall = Animations.blurFall;
const blurSink = Animations.blurSink;

import { bundledThemes, savedThemes } from "./Theme";
import {
	Modal,
	Button,
	Textfield,
	Dropdown,
	Clickable,
	Navbar,
	TextfieldList,
	ImageUpload,
	Theme
} from "joeysvelte";

import Fa from "svelte-fa";
import { faPencil, faGear } from '@fortawesome/free-solid-svg-icons';

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

</script>

<Background>
	<span slot="topLeft">
		{$Theme.background.topLeft.text}
	</span>
	<span slot="bottomRight">
		{@html randomElement(htmlDiceEntities)}
	</span>
</Background>

<Modal bind:open={saveThemeModalOpen}>
    <span slot="header">Save Theme</span>
	<div slot="body">
		<Textfield label="Name" bind:value={themeSelectValue} />
	</div>
	<svelte:fragment slot="footer">
		<Button
			color={$Theme.action.colors.confirm}
			onClick={() => {
				$savedThemes[themeSelectValue] = $Theme;
				saveThemeModalOpen = false;
			}}
		>
			Save
		</Button>
		<Button onClick={() => saveThemeModalOpen = false}>
			Close
		</Button>
	</svelte:fragment>
</Modal>

<Modal bind:open={settingsModalOpen}>
	<span slot="header">Settings</span>
	<div slot="body">
		<h2>Theme</h2>
		<Dropdown bind:value={themeSelectValue} onChange={() =>{
			$Theme = (
				bundledThemes[themeSelectValue]
			 || $savedThemes[themeSelectValue]
			 || $Theme
			);
		}}>
			<optgroup label="Saved">
				{#each Object.keys($savedThemes) as key}
					<option value={key}>{key}</option>
				{/each}
			</optgroup>
			<optgroup label="Bundled">
				{#each Object.keys(bundledThemes) as key}
					<option value={key}>{key}</option>
				{/each}
			</optgroup>
		</Dropdown>
		<div
			style:display="flex"
			style:flex-direction="row"
			style:justify-content="end"
		>
			<Button onClick={async () => {
				let file = await upload();
				if (file) {
					$Theme = JSON.parse(file);
				}
			}}>
				Import
			</Button>
			<Button onClick={() => download(
				JSON.stringify($Theme, null, 4),
				`theme.json`,
				"application/json"
			)}>
				Export
			</Button>
			<Button
				color={$Theme.action.colors.danger}
				onClick={() => {
					delete $savedThemes[themeSelectValue];
					$savedThemes = $savedThemes; // trigger reactivity
					themeSelectValue = "";
				}}
			>
				Delete
			</Button>
			<Button color={$Theme.action.colors.confirm} onClick={() => saveThemeModalOpen = true}>
				Save
			</Button>
		</div>
	

		<h3>Text</h3>
		<Textfield label="Primary Color" bind:value={$Theme.text.primary.color} />
		<Textfield label="Secondary Color" bind:value={$Theme.text.secondary.color} />
		<h3>Text Fields</h3>
		<Textfield label="Background Color" bind:value={$Theme.textfield.background.color} />
		<h3>Background</h3>
		<ImageUpload label="Image" bind:value={$Theme.background.image} />
		<Textfield label="Color" bind:value={$Theme.background.color} />
		<h4>Top Left</h4>
		<Textfield label="Text" bind:value={$Theme.background.topLeft.text} />
		<Textfield label="Color" bind:value={$Theme.background.topLeft.color} />
		<h4>Bottom Right</h4>
		<Textfield label="Color" bind:value={$Theme.background.bottomRight.color} />
		<h3>Category</h3>
		<h4>Colors</h4>
		<TextfieldList bind:value={$Theme.category.colors} />
		<h3>Item</h3>
		<Textfield label="Folder Color" bind:value={$Theme.item.folder.color} />
		<h4>Livestream Indicator</h4>
		<Textfield label="Checking Color" bind:value={$Theme.item.liveStream.colorChecking} />
		<Textfield label="Live Color" bind:value={$Theme.item.liveStream.colorOnline} />
		<h3>Frame</h3>
		<Textfield label="Background Color" bind:value={$Theme.frame.background.color} />
		<Textfield label="Border Color" bind:value={$Theme.frame.border.color} />
		<Textfield label="Border Width" bind:value={$Theme.frame.border.width} />
		<h3>Actions</h3>
		<Textfield label="Confirm Color" bind:value={$Theme.action.colors.confirm} />
		<Textfield label="Warning Color" bind:value={$Theme.action.colors.warning} />
		<Textfield label="Danger Color" bind:value={$Theme.action.colors.danger} />
		<h3>Clickables</h3>
		<Textfield label="Hover Color" bind:value={$Theme.clickable.colors.hover} />
		<Textfield label="Active Color" bind:value={$Theme.clickable.colors.active} />
    </div>
    <svelte:fragment slot="footer">
        <Button onClick={() => settingsModalOpen = false}>
            Close
        </Button>
    </svelte:fragment>
</Modal>

<Navbar>
	<svelte:fragment slot="right">
		<Clickable width="48px" height="48px" onClick={() => settingsModalOpen = true}>
			<Fa icon={faGear} color={$Theme.text.primary.color} size="lg" />			
		</Clickable>
		<Clickable width="48px" height="48px" onClick={openEditor}>
			<Fa icon={faPencil} color={$Theme.text.primary.color} size="lg" />			
		</Clickable>
	</svelte:fragment>
</Navbar>

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