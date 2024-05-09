<style lang="scss">
.bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    backdrop-filter: blur(8px);
}

.outer-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.inner-container {
    width: 350px;
    margin: 8px;
    
    border-style: solid;
    backdrop-filter: blur(32px);
    -webkit-backdrop-filter: blur(32px);
    
    box-shadow: 0 4px 10px rgba(0,0,0,0.5);
    
    padding: 16px;
}

h1 {
    margin-top: 0;
    user-select: none;
}

.footer {
    margin-top: 16px;
    text-align: right;
}

</style>

<script lang="ts">
    import Theme from './Theme';
    
    import { fade } from 'svelte/transition';
    import { quartOut } from 'svelte/easing';
    
    import Overlay from "./Overlay.svelte";
    
    export let open: boolean = false;
</script>

{#if open}

<!-- svelte-ignore a11y-no-static-element-interactions -->
<Overlay>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        class="bg"
        transition:fade={{
            duration: 500,
            easing: quartOut
        }}
    />
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
        class="outer-container"
        on:click={() => open = false}
        transition:fade={{
            duration: 100,
            easing: quartOut
        }}
    >
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="inner-container"
            style:background-color={$Theme.frame.background.color}
            style:border-color={$Theme.frame.border.color}
            style:border-width={$Theme.frame.border.width}
            on:click|stopPropagation
        >
            <h1 style:color={$Theme.text.primary.color}><slot name="header"></slot></h1>
            <slot name="body"></slot>
            <div class="footer"><slot name="footer"></slot></div>
        </div>
    </div>
</Overlay>

{/if}