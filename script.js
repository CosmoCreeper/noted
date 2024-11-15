const homeContents = [
    `<h2>To-do lists. <span class="acrylic">Reimagined.</span></h2><p>There is a to-do list for everything. <br> You just have to find it.</p>`,
    `<h2>Forged in fire.</h2><p>Noted versions go through multiple stages <br> of testing before they can be released.</p>`,
    `<h2>Simplicity, Performance, & Capacity</h2><p>Noted is a simplistic, low performance-requiring, high capacity<br> of capabilities app that supports Windows, Linux, & Android.</p>`,
    `<h2>Efficient & Reliable</h2><p>Noted performs most tasks at lightning speed <br> and does not rely on the Internet to run.`,
    `<h2>Open Sorcery™</h2><p>The majority of Noted is open source and uses open <br> source technology including React, TailwindCSS, and Electron.</p>`,
    `<h2><span class="acrylic mono">Online Demo</span></h2><p>An online demo with all features, except sounds, boot on startup, <br> the resizer, and frequent updates, is available on <a href="https://cosmocreeper.github.io/noted-online">GitHub Pages</a>.</p>`,
    `<h2><span class="acrylic mono">Downloads</span></h2><p>A full list of downloads (>v1.3.1) is available on <a href="https://github.com/CosmoCreeper/noted/releases">GitHub</a>.</p>`
];

let i = 0;

const content = document.getElementById("content");

window.addEventListener("wheel", event => scrollEvent(event));

const scrollEvent = (event) => {
    const delta = Math.sign(event.deltaY);
    setTimeout(() => {
        if (delta === 1 && i < homeContents.length - 1) i++;
        else if (delta === -1 && i > 0) i--;
        else if (i === 0) i = homeContents.length - 1;
        else if (i === homeContents.length - 1) i = 0;
        content.innerHTML = homeContents[i];
    }, 100);
}

const navigate = (newI) => {
    i = newI;
    content.innerHTML = homeContents[i];
}