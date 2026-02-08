
<script lang="ts">
    import Button from "$joeysvelte/Button.svelte";
    import Dropdown from "$joeysvelte/Dropdown.svelte";
    import DropdownGroup from "$joeysvelte/DropdownGroup.svelte";
    import DropdownOption from "$joeysvelte/DropdownOption.svelte";
    import ImageUpload from "$joeysvelte/ImageUpload.svelte";
    import Modal from "$joeysvelte/Modal.svelte";
    import Textfield from "$joeysvelte/Textfield.svelte";
    import TextfieldList from "$joeysvelte/TextfieldList.svelte";
    import {
        bundledThemesStore,
        currentThemeIsBundled,
        currentThemeKey,
        currentThemeStore,
        getCssVar,
        getPropStore,
        savedThemesStore
    } from "$joeysvelte/Theming.ts";
    import { download, upload } from "./Download";

    const themeStoreTextColorsPrimary           = getPropStore("text.colors.primary");
    const themeStoreTextColorsSecondary         = getPropStore("text.colors.secondary");
    const themeStoreTextfieldBackgroundColor    = getPropStore("textfield.backgroundColor");
    const themeStoreBgBackgroundImage           = getPropStore("bg.backgroundImage");
    const themeStoreBgBackgroundColor           = getPropStore("bg.backgroundColor");
    const themeStoreBgTopLeftText               = getPropStore("bg.topLeft.text");
    const themeStoreBgTopLeftColor              = getPropStore("bg.topLeft.color");
    const themeStoreBgBottomRightColor          = getPropStore("bg.bottomRight.color");
    const themeStoreHeaderColors              	= getPropStore("header.colors");
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

    export let open = false;
    let saveThemeModalOpen = false;
    let themeSelectValue = "";
</script>

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

<Modal bind:open={open}>
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
            style:gap="var(--joeysvelte-general-gap-sm)"
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
        
        {#if !$currentThemeIsBundled}
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
            <h4>Colors</h4>
            <TextfieldList bind:value={$themeStoreHeaderColors} />
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
        {/if}
    </div>
    <svelte:fragment slot="footer">
        <Button onClick={() => open = false}>
            Close
        </Button>
    </svelte:fragment>
</Modal>