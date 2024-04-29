<style lang="scss">
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
    
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>

<script lang="ts">
    export let color: string = "white";
</script>

<div class="title" style='color:{color}'><slot></slot></div>
