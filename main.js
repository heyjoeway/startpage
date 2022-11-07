let profiles;
let exampleProfiles = {
    "home": {
        "name": "home",
        "categories": [
            {
                "name": "intranet",
                "color": "orange",
                "items": [
                    {
                        "name": "proxmox",
                        "href": ""
                    },
                    {
                        "name": "truenas",
                        "href": ""
                    },
                    {
                        "name": "home assistant",
                        "href": ""
                    }
                ]
            },
            {
                "name": "internet",
                "color": "blue",
                "items": [
                    {
                        "name": "youtube",
                        "href": "https://youtube.com"
                    },
                    {
                        "name": "github",
                        "href": "https://github.com"
                    },
                    {
                        "name": "google drive",
                        "href": "https://drive.google.com"
                    },
                    {
                        "name": "dropbox",
                        "href": "https://dropbox.com"
                    }
                ]
            }
        ]
    }
};

function activateProfile(profiles, profileKey) {
    let profile = profiles[profileKey];
    let $categories = $("#categories");
    $categories.html("");
    profile.categories.forEach(category => {
        let $category = $('<div></div>')
            .addClass("category");
        let $categoryTitle = $('<div></div>')
            .addClass("category-title")
            .addClass("blur-in")
            .css("color", category.color)
            .text(category.name);
        $category.append($categoryTitle);

        category.items.forEach(item => {
            let $link = $('<a></a>')
                .attr("href", item.href)
                .addClass("category-item")
                .addClass("clickable")
                .addClass("blur-in")
                .text(item.name);
            $category.append($link);
        });

        $categories.append($category);
    });

    localStorage.setItem("profileKey", profileKey);
}

function updateProfiles(profiles) {
    let $profiles = $("#profiles");
    Object.keys(profiles).forEach(profileKey => {
        let profile = profiles[profileKey];
        let $e = $('<div></div>')
            .addClass("profile")
            .addClass("clickable")
            .addClass("blur-in")
            .text(profile.name)
            .click(() => activateProfile(profiles, profileKey));
        $profiles.append($e);
    });
}

// I don't know why I have to do this, I think localStorage is fucking with the string or something
function stringifyJSONButGood(json) {
    let str = JSON.stringify(json);
    if (str[0] == '"') str = str.slice(1);
    if (str.slice(-1)[0] == '"') str = str.slice(0,-1);
    str = str.replaceAll('\\"','"');
    return str;    
}

function configure() {
    let json = prompt(
        "Please input your configuration below.",
        stringifyJSONButGood(profiles)
    );
    if (json == null) return;

    // We parse then stringify to clean input (CLEAN, NOT SANITIZE! THIS DOES NOT ENSURE SECURITY!!!)
    let jsonClean = stringifyJSONButGood(JSON.parse(json));
    console.log(jsonClean);
    localStorage.setItem(
        "profiles",
        jsonClean
    );
    window.location.reload();
}

$("#config").click(configure);

// Dice roll!
$("#bg-bottom-right").text(
    "⚀⚁⚂⚃⚄⚅"[Math.round(Math.random()*6)]
);

try {
    profiles = localStorage.getItem("profiles");
    if (profiles == null) profiles = exampleProfiles;
    else profiles = JSON.parse(profiles);

    updateProfiles(profiles);
    activateProfile(
        profiles,
        localStorage.getItem("profileKey")
    );
} catch(e) { }