<style lang="scss">

#breadcrumbs {
    width: 100%;
    text-align: left;
    margin-left: 12px;
    user-select: none;
    cursor: pointer;
}

</style>

<script lang="ts">
    import { currentTheme } from "./Theme";
    
    export let nodeStack: chrome.bookmarks.BookmarkTreeNode[] = [];
    export let onClick: (index: number) => void = () => {};
</script>

<div id="breadcrumbs" style:color={$currentTheme.text.secondary.color}>
    {#each nodeStack as node, index (node.id)}
        {#if index < nodeStack.length - 1}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <span
                class="breadcrumb"
                on:click={() => {
                    onClick(index);
                }}
            >
                {node.title} &#x25B6;
            </span>
        {/if}
    {/each}
</div>
