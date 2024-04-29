<style lang="scss">
@import "./style/blur-in.scss";

.category {
    animation-duration: 0.5s;
    padding-top: 24px;
    padding-bottom: 24px;
}

.title {
    user-select: none;
    
    font-size: 40px;
    margin-left: 12px;
    
    font-family: 'franklin_gothicregular';
    text-transform: lowercase;

    display: block;
    width: 100%;
    text-align: left;
    height: 48px;
    box-sizing: border-box;

    animation-duration: 0.7s;
}

</style>

<script lang="ts">
    import Item from "./Item.svelte";
    
    export let node: chrome.bookmarks.BookmarkTreeNode;
    export let color: string = "white";
    
    let nodeChildren: chrome.bookmarks.BookmarkTreeNode[] = [];
    $: nodeChildren = (() => {
        if (node.children)
            return node.children;
        return [];
    })();
</script>

<div class="category blur-in">
    <div class="title" style='color:{color}'>{node.title}</div>
    {#each nodeChildren as child}
        <Item node={child} />
    {/each}
</div>