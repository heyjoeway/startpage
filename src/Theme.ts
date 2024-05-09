import { persisted } from 'svelte-persisted-store'

export default persisted('theme', {
    text: {
        primary: {
            color: "white"
        },
        secondary: {
            color: "rgba(255, 255, 255, 0.6)"
        }
    },
    textfield: {
        background: {
            color: "rgba(128, 128, 128, 0.05)"
            // color: "rgba(255, 255, 255, 0.1)"
        }
    },
    background: {
        color: "black",
        topLeft: {
            text: "start",
            color: "rgba(128, 128, 128, 0.15)"
        },
        bottomRight: {
            color: "rgba(128, 128, 128, 0.15)"   
        }
    },
    category: {
        colors: [
            "orange",
            "palevioletred",
            "skyblue"
        ]
    },
    item: {
        liveStream: {
            colorChecking: "orange",
            colorOnline: "red"
        }
    },
    frame: {
        background: {
            color: "rgba(46, 46, 46, 0.4)"
            // color: "rgba(255, 255, 255, 0.6)"
        },
        border: {
            width: "1px",
            color: "#222"
        }
    },
    action: {
        colors: {
            confirm: "lightgreen",
            warning: "orange",
            danger: "red"
        }
    }
});