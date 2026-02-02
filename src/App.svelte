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
import { download, upload } from "./Download";
import Background from "$joeysvelte/Background.svelte";
import Animations from "$joeysvelte/Animations.ts";

const blurFall = Animations.blurFall;
const blurSink = Animations.blurSink;

import {
	bundledThemesStore,
	savedThemesStore,
	getPropStore,
	getCssVar,
	currentThemeKey,
	currentThemeStore
} from "$joeysvelte/Theming.ts";
import Modal from "$joeysvelte/Modal.svelte";
import Button from "$joeysvelte/Button.svelte";
import Textfield from "$joeysvelte/Textfield.svelte";
import Dropdown from "$joeysvelte/Dropdown.svelte";
import DropdownOption from "$joeysvelte/DropdownOption.svelte";
import DropdownGroup from "$joeysvelte/DropdownGroup.svelte";
import Clickable from "$joeysvelte/Clickable.svelte";
import Navbar from "$joeysvelte/Navbar.svelte";
import TextfieldList from "$joeysvelte/TextfieldList.svelte";
import ImageUpload from "$joeysvelte/ImageUpload.svelte";

import Fa from "svelte-fa";
import { faPencil, faGear } from '@fortawesome/free-solid-svg-icons';
    import ThemeProvider from "$joeysvelte/ThemeProvider.svelte";

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

const themeStoreTextColorsPrimary           = getPropStore("text.colors.primary");
const themeStoreTextColorsSecondary         = getPropStore("text.colors.secondary");
const themeStoreTextfieldBackgroundColor    = getPropStore("textfield.backgroundColor");
const themeStoreBgBackgroundImage           = getPropStore("bg.backgroundImage");
const themeStoreBgBackgroundColor           = getPropStore("bg.backgroundColor");
const themeStoreBgTopLeftText               = getPropStore("bg.topLeft.text");
const themeStoreBgTopLeftColor              = getPropStore("bg.topLeft.color");
const themeStoreBgBottomRightColor          = getPropStore("bg.bottomRight.color");
// const themeStoreCategoryColors              = getPropStore("category.colors");
const themeStoreItemFolderColor             = getPropStore("item.folder.color");
// const themeStoreItemLiveStreamColorChecking = getPropStore("item.liveStream.colorChecking");
// const themeStoreItemLiveStreamColorOnline   = getPropStore("item.liveStream.colorOnline");
const themeStoreFrameBackgroundColor        = getPropStore("frame.background.color");
// const themeStoreFrameBorderColor            = getPropStore("frame.border.color");
const themeStoreFrameBorderWidth            = getPropStore("frame.border.width");
const themeStoreActionColorsConfirm         = getPropStore("action.colors.confirm");
const themeStoreActionColorsWarning         = getPropStore("action.colors.warning");
const themeStoreActionColorsDanger          = getPropStore("action.colors.danger");
const themeStoreClickableColorsHover        = getPropStore("clickable.colors.hover");
const themeStoreClickableColorsActive       = getPropStore("clickable.colors.active");

</script>

<ThemeProvider>
<Background>
	<span slot="topLeft">
		{$bgTextStore}
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
			color={getCssVar("action.colors.confirm")}
			onClick={() => {
				if (!$currentThemeStore) return;
				$savedThemesStore[themeSelectValue] = $currentThemeStore;
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
			$currentThemeKey = themeSelectValue;
		}}>
			<DropdownGroup label="Saved">
				{#each Object.keys($savedThemesStore) as key}
					<DropdownOption value={key}>
						{key}
					</DropdownOption>
				{/each}
			</DropdownGroup>
			<DropdownGroup label="Bundled">
				{#each Object.keys($bundledThemesStore) as key}
					<DropdownOption value={key}>
						{key}
					</DropdownOption>
				{/each}
			</DropdownGroup>
		</Dropdown>
		<div
			style:display="flex"
			style:flex-direction="row"
			style:justify-content="end"
		>
			<Button onClick={async () => {
				let file = await upload();
				if (file) {
					$currentThemeStore = JSON.parse(file);
				}
			}}>
				Import
			</Button>
			<Button onClick={() => download(
				JSON.stringify($currentThemeStore, null, 4),
				`theme.json`,
				"application/json"
			)}>
				Export
			</Button>
			<Button
				color={getCssVar("action.colors.danger")}
				onClick={() => {
					delete $savedThemesStore[themeSelectValue];
					$savedThemesStore = $savedThemesStore; // trigger reactivity
					themeSelectValue = "";
				}}
			>
				Delete
			</Button>
			<Button
				color={getCssVar("action.colors.confirm")}
				onClick={() => saveThemeModalOpen = true}
			>
				Save
			</Button>
		</div>
	
		<h3>Text</h3>
		<Textfield label="Primary Color" bind:value={$themeStoreTextColorsPrimary} />
		<Textfield label="Secondary Color" bind:value={$themeStoreTextColorsSecondary} />
		<h3>Text Fields</h3>
		<Textfield label="Background Color" bind:value={$themeStoreTextfieldBackgroundColor} />
		<h3>Background</h3>
		<ImageUpload label="Image" bind:value={$themeStoreBgBackgroundImage} />
		<Textfield label="Color" bind:value={$themeStoreBgBackgroundColor} />
		<h4>Top Left</h4>
		<Textfield label="Text" bind:value={$themeStoreBgTopLeftText} />
		<Textfield label="Color" bind:value={$themeStoreBgTopLeftColor} />
		<h4>Bottom Right</h4>
		<Textfield label="Color" bind:value={$themeStoreBgBottomRightColor} />
		<h3>Category</h3>
		<!-- <h4>Colors</h4>
		<TextfieldList bind:value={$themeStoreCategoryColors} /> -->
		<h3>Item</h3>
		<Textfield label="Folder Color" bind:value={$themeStoreItemFolderColor} />
		<!-- <h4>Livestream Indicator</h4>
		<Textfield label="Checking Color" bind:value={$themeStoreItemLiveStreamColorChecking} />
		<Textfield label="Live Color" bind:value={$themeStoreItemLiveStreamColorOnline} /> -->
		<h3>Frame</h3>
		<Textfield label="Background Color" bind:value={$themeStoreFrameBackgroundColor} />
		<!-- <Textfield label="Border Color" bind:value={$themeStoreFrameBorderColor} /> -->
		<Textfield label="Border Width" bind:value={$themeStoreFrameBorderWidth} />
		<h3>Actions</h3>
		<Textfield label="Confirm Color" bind:value={$themeStoreActionColorsConfirm} />
		<Textfield label="Warning Color" bind:value={$themeStoreActionColorsWarning} />
		<Textfield label="Danger Color" bind:value={$themeStoreActionColorsDanger} />
		<h3>Clickables</h3>
		<Textfield label="Hover Color" bind:value={$themeStoreClickableColorsHover} />
		<Textfield label="Active Color" bind:value={$themeStoreClickableColorsActive} />
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
	<div id="container" in:blurFall out:blurSink>
		<Search
			rootNode={nodeStack[0]}
			bind:searchQuery={searchQuery}
		/>

		{#if searchQuery.length === 0}
			<Folder alignCenter={true} bind:nodes={currentNodeChildren} />

			<div id="categories">
				{#each currentNodeChildren as child, index (child.id)}
					{#if child.children} <!-- folder -->
					<!-- color={$currentTheme.category.colors[index % $currentTheme.category.colors.length]} -->
						<Category
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