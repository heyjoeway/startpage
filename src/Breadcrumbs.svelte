<style lang="scss">

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
    export let nodeStack: chrome.bookmarks.BookmarkTreeNode[] = [];
</script>

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
