window.stop()

const NOVEL = document.querySelector('#reader-main').firstElementChild.textContent.split(" ").filter(x => x.replace(/\n/ig, '') != "").join(" ")
const CAP = document.title
const TEXTS = [...document.querySelector(".full-text").children].filter(x => x.textContent != "" && x.tagName.toUpperCase() === "P").map(x => x.textContent)
const CREDITS = document.querySelector('.project-credits').textContent

const LINKS = {
    prevCap: document.querySelector('a.prev').getAttribute("href"),
    nextCap: document.querySelector('a.next').getAttribute("href"),
    chapters: [...document.querySelector('select').children].map(x => { return { href: x.getAttribute("value"), title: x.textContent } }),
    novelPage: document.querySelectorAll('.action-button')[1].getAttribute("href")
}

const READER = () => document.querySelector('.reader')
const READER_BODY = () => document.querySelector('.reader-body')
const OPTIONS = () => document.querySelector('.options')

const setTitle = (title) => {
    document.querySelector('.title').textContent = title
}

const setSubtitle = (subtitle) => {
    document.querySelector('.subtitle').textContent = subtitle
    document.querySelector('#namecap').textContent = subtitle
    document.title = subtitle
}

const setCredits = (credits) => {
    document.querySelector('#credits').textContent = credits
}

const setTexts = (texts) => {
    const bodyReader = READER_BODY()
    for (const e of bodyReader.children) {
        e.remove()
    }
    for (const text of texts) {
        const textElement = document.createElement("p")
        textElement.classList.add("text")
        textElement.textContent = text
        bodyReader.appendChild(textElement)
    }
}

const reverseColors = (element) => {
    element.className = element.className.replace("background", "reverse-background").replace("color", "reverse-color");
}

const defaultColors = (element) => {
    element.className = element.className.replace("reverse-background", "background").replace("reverse-color", "color");
}



const MaxPalette = 3;
const MaxPadding = 20;
const DATA = {
    palette: parseInt(localStorage.getItem("palette")) || 1,
    bold: localStorage.getItem("bold") == "true",
    maximize: localStorage.getItem("maximize") == "true",
    currentListChaptersScrollTop: -1,
    padding: parseInt(localStorage.getItem("paddingText")) || 1
}

const changePaletteInClass = (element) => {
    element.className = element.className.split('-').map(x => {
        if (x.length < 2) return DATA.palette
        const xSplit = x.split(' ')
        if (xSplit[0].length < 2) return `${DATA.palette} ${xSplit[1]}`
        return x
    }).join('-')
}

const updatePalette = () => {
    changePaletteInClass(document.body)
    changePaletteInClass(READER())
    changePaletteInClass(document.querySelector('.subtitle'))
    changePaletteInClass(document.querySelector('.title'))
    changePaletteInClass(READER_BODY())
    changePaletteInClass(OPTIONS())
    changePaletteInClass(document.querySelector('#namecap'))
    changePaletteInClass(document.querySelector('#credits'))
    changePaletteInClass(document.querySelector('.version'))
    changePaletteInClass(document.querySelector('.notify'))
    for (const btn of document.querySelectorAll('.button')) {
        changePaletteInClass(btn)
    }

    for (const btn of document.querySelectorAll('.button-list')) {
        changePaletteInClass(btn)
    }

}

const updateBold = () => {
    if (DATA.bold) {
        READER_BODY().classList.add("text-bold")
        reverseColors(document.querySelector(".button[action='boldtext']"))
    } else {
        READER_BODY().classList.remove("text-bold")
        defaultColors(document.querySelector(".button[action='boldtext']"))
    }
}

const updateMaximize = () => {
    if (DATA.maximize) {
        document.body.classList.add("maximize")
    } else {
        document.body.classList.remove("maximize")
    }
}

const updatePadding = () => {
    READER_BODY().classList.add(`p${DATA.padding}x`)
}

var oldInterval, c, close
const notify = text => {
    document.querySelector('.notify').style.cssText = "display: flex; opacity: 0;"
    document.querySelector('.notify').textContent = text
    var opened = false
    var count = 0.1
    clearInterval(oldInterval)
    clearInterval(c)
    clearInterval(close)
    c = setInterval(() => {
        count += 0.1
        document.querySelector('.notify').style.cssText = `display:flex; opacity:${count}`
        if(count >= 1) {
            opened = true;
            clearInterval(c)
        }
    }, 50)

    oldInterval = setInterval(() => {
        if(opened) {
            
            count = 1;
            close = setInterval(() => {
                count -= 0.1
                document.querySelector('.notify').style.cssText = `display:flex; opacity:${count};`
                if(count <= 0) {
                    
                    document.querySelector('.notify').style.cssText = `display:none; opacity:0;`
                    clearInterval(c)
                }
            }, 50)
            clearInterval(oldInterval)
            opened = false;
        }
    }, 2500)
}

var disqusLoad = false;
const initDisqus = () => {

    const s = document.createElement('script');
    s.src = 'https://saikaiscan-1.disqus.com/embed.js';
    s.setAttribute('data-timestamp', + new Date());
    (document.head || document.body).appendChild(s);

    const disqus_config = function () {
        Array.prototype.last = function () {
            return this[this.length - 1];
        };
        this.page.identifier = `${window.location.pathname.split("/").last()}_${window.location.href}`
        this.page.url = window.location.href
        this.page.api_key = "eg0LmKpmfW84i9wSEVE69gwSj7jsuY95NUP8ak7twA6e5LQYksReePJ330bI6XBI"
    }

    var interval = setInterval(() => {
        if (document.querySelector('#disqus_thread').children.length >= 3) {
            if (document.querySelector('#disqus_thread').clientHeight > 0) {
                for (const frame of document.querySelector('#disqus_thread').children) {
                    if (frame.tagName.toUpperCase() == "IFRAME" && frame.src.length > 0 && !frame.src.includes("https://disqus.com/embed/comments/")) {
                        frame.remove()
                    }
                }
                disqusLoad = true;
                document.querySelector('.loading-disqus').remove()
                var c = 0;
                var i = setInterval(() => {
                    if (c == 10) {
                        clearInterval(i)
                    }
                    for (const frame of document.querySelector('#disqus_thread').children) {
                        if (frame.tagName.toUpperCase() == "IFRAME" && frame.src.length > 0 && !frame.src.includes("https://disqus.com/embed/comments/")) {
                            frame.remove()
                        }
                    }
                    c++;
                }, 1000)
                clearInterval(interval)
            }
        }
    }, 100)
}




fetch(chrome.extension.getURL('/interface/model.html')).then(data => data.text()).then(text => {
    [...document.querySelector('html').children].map(x => x.remove())
    document.querySelector('html').innerHTML = text
    
    // document.querySelector('#stylepage').setAttribute("href", chrome.extension.getURL('/interface/css/style.css'))
    fetch(chrome.extension.getURL('/interface/css/style.css')).then(d => d.text()).then(t => {
        document.querySelector('#style').appendChild(document.createTextNode(`
            @font-face { 
                font-family: IconFont;
                font-style: normal;
                font-weight: 400;
                src: url(${chrome.extension.getURL('/interface/fonts/iconfont.ttf')}) format('truetype');
            }

            ${t}
        `))

        document.querySelector('#hidden-temporary').remove()
    })
    document.querySelector('.notify').style.cssText = "display: none; opacity: 0;"
    document.querySelector('html').setAttribute("lang", "pt-br")
    updatePalette()
    updateBold()
    updateMaximize()
    updatePadding()
    setup()

    console.log()

    for (const btn of document.querySelectorAll('.button')) {
        const attr = btn.getAttribute("action")
        if (attr) {
            if (eval(`typeof ${attr}`) != "undefined") {
                btn.addEventListener('click', eval(`${attr}`))
            }
        }
    }
})