<style lang="scss">

div {
    display: flex;
    flex-direction: column;
    
    label {
        margin-left: 12px;
        margin-bottom: 4px;
        opacity: 0.5;
        user-select: none  ;
    }
    
    input {
        width: 100%;
        border: none;
        padding: 10px 12px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(32px);
        color: white;
        box-sizing: border-box;
        
        &:focus {
            outline: none;
        }
    }
}


</style>

<script lang="ts">

export let value: string = "";
export let label: string = "";
export let placeholder: string = "";
export let autofocus: boolean = false;

export let onInput: (event: Event) => void = () => {};
export let onKeydown: (event: KeyboardEvent) => void = () => {};

</script>

<div>
    {#if label}
        <label for={label}>{label}</label>
    {/if}
    <!-- svelte-ignore a11y-autofocus -->
    <input
        name={label}
        type="text"
        placeholder={placeholder}
        autofocus={autofocus}
        bind:value={value}
        on:input={onInput}
        on:keydown={onKeydown}
    />
</div>
