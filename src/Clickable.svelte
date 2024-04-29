<style lang="scss">
.clickable {
    cursor: pointer;
    transform: scale(100%);
    transition: opacity 0.1s, scale 0.05s;
    transition-timing-function: cubic-bezier(0, 0.55, 0.45, 1);
    display: flex;
    align-items:center;
    justify-content:center;
    user-select:none;
}

.clickable:hover {
    opacity: 100%;
    background-color: rgba(255,255,255,0.1);
}

.clickable:active {
    transform: scale(90%);
    opacity: 90%;
    background-color: rgba(255,255,255,0.05);
}

a {
    color: white;
    text-decoration: none   ;
}

a:hover {
    color: white;
}
</style>

<script lang="ts">
    export let width: strin = "default";
    export let height: string = "default";
    export let onClick: (() => void) | string | undefined = undefined;
    
    function handleClick() {
        if (typeof onClick === 'function')
            onClick();
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="clickable" on:click={handleClick} style="width:{width};height:{height}">
    {#if typeof onClick === 'string'}
        <a href={onClick}><slot></slot></a>
    {:else}
        <slot></slot>
    {/if}
</div>
