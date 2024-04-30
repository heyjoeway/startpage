<style lang="scss">

.category {
    padding-top: 16px;
    padding-bottom: 8px;
}

</style>

<script lang="ts">
    import Item from "./Item.svelte";
    import Title from "./Title.svelte";
    
    export let node: chrome.bookmarks.BookmarkTreeNode;
    export let color: string = "white";
    export let onFolderClick: (node: chrome.bookmarks.BookmarkTreeNode) => void = () => {};
    
    let nodeChildren: chrome.bookmarks.BookmarkTreeNode[] = [];
    $: if (node.children) {
        nodeChildren = node.children;
        
        // Sort folders first (a node is a folder is url is undefined)
        nodeChildren.sort((a, b) => {
            if (a.url && !b.url) return 1;
            if (!a.url && b.url) return -1;
            return 0;
        });
        
    } else nodeChildren = [];
</script>

<div class="category">
    <Title color={color}>{node.title}</Title>
    {#each nodeChildren as child (child.id)}
        <Item node={child} onFolderClick={onFolderClick} />
    {/each}
</div>