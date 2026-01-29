<style lang="scss">

.outer {
    display: flex;
    justify-content: center;
}

.inner {
    padding-top: 16px;
    padding-bottom: 8px;
    
    display: flex;
    flex-direction: column;
}

.children {
    display: flex;
    flex-wrap: wrap;
    width: fit-content;
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
        
        // Sort folders first (a node is a folder when url is undefined)
        nodeChildren.sort((a, b) => {
            if (a.url && !b.url) return 1;
            if (!a.url && b.url) return -1;
            return 0;
        });
        
    } else nodeChildren = [];
</script>

<div class="outer">
    <div class="inner">
        <Title color={color}>{node.title}</Title>
        <div class="children">
            {#each nodeChildren as child (child.id)}
                <Item node={child} onFolderClick={onFolderClick} />
            {/each}
        </div>
    </div>
</div>