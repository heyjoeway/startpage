<style>
.bg-element {   
    position: fixed;
    font-size: 350px;
    opacity: 0.075;
    
	animation-timing-function: cubic-bezier(0, 0.55, 0.45, 1);
	animation-duration: 1s;
	animation-fill-mode: forwards;
	filter: opacity(0%);
    font-weight: bold;
    
    user-select: none;
}

#bg-top-left { 
    animation-name: blur-in-top;
    font-size: calc(min(40vw, 350px));
    top: -4.1vw;
    left: 0.95vh;
    animation-delay: 0.1s;
    overflow-x: hidden;
}

@keyframes blur-in-top {
    from {
        -webkit-filter: contrast(1.5) brightness(1.5) grayscale(1) blur(128px) opacity(0%);
        filter: contrast(1.5) brightness(1.5) grayscale(1) blur(128px) opacity(0%);
        transform: scale(2) rotateZ(15deg);
    }
    to {
        -webkit-filter: contrast(1.5) brightness(0.7) grayscale(1) blur(calc(min(40vw, 350px) / 32)) opacity(100%);
        filter: contrast(1.5) brightness(0.7) grayscale(1) blur(calc(min(40vw, 350px) / 32)) opacity(100%);
        transform: scale(1) rotateZ(0deg);
    }
}

#bg-bottom-right { 
    animation-name: blur-in-bottom;
    font-size: calc(min(92vw, 1000px));
    bottom: -0.3em;
    right: -0.09em;
    animation-delay: 0.5s;
}

@keyframes blur-in-bottom {
    from {
        -webkit-filter: contrast(1.5) brightness(1.5) grayscale(1) blur(128px) opacity(0%);
        filter: contrast(1.5) brightness(1.5) grayscale(1) blur(128px) opacity(0%);
        transform: scale(2) rotateZ(60deg);
    }
    to {
        -webkit-filter: contrast(1.5) brightness(0.7) grayscale(1) blur(calc(min(40vw, 350px) / 32)) opacity(100%);
        filter: contrast(1.5) brightness(0.7) grayscale(1) blur(calc(min(40vw, 350px) / 32)) opacity(100%);
        transform: scale(1) rotateZ(45deg);
    }
}
</style>

<script lang="ts">

function randomElement(arr: any[]) {
    return arr[Math.round(Math.random() * (arr.length - 1))];
}
let htmlDiceEntities = ["&#x2680;", "&#x2681;", "&#x2682;", "&#x2683;", "&#x2684;", "&#x2685;"];
let roll = randomElement(htmlDiceEntities);

</script>

<div class="bg-element" id="bg-top-left">start</div>
<div class="bg-element" id="bg-bottom-right">{@html roll}</div>