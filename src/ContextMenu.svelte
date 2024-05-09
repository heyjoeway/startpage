<style lang="scss">

div {
    min-width: 200px;
    position: absolute;

    border-width: 1px;
    border-style: solid;
    border-color: #222;
    background-color: #2e2e2e66;
    backdrop-filter: blur(32px);
    -webkit-backdrop-filter: blur(32px);
    
    box-shadow: 0 4px 10px rgba(0,0,0,0.5);
    
    padding: 8px 0;
}

</style>

<script lang="ts">

import { clickoutside } from '@svelte-put/clickoutside';
import { fade } from 'svelte/transition';

import Overlay from "./Overlay.svelte";

export let open: boolean = false;

export let x, y: number;

</script>

{#if open}
    <Overlay>
        <div
            transition:fade={{ duration: 100 }}
            use:clickoutside={{ event: 'mousedown' }}
            on:clickoutside={() => open = false}
            style="top:{y}px; left:{x}px;"
        >
            <slot />
        </div>
    </Overlay>
{/if}