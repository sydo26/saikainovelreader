function setup() {
    setTitle(NOVEL)
    setSubtitle(CAP)
    setCredits(CREDITS)
    setTexts(TEXTS)
    
    if(!LINKS.nextCap) {
        document.querySelector('div[action="nextcap"]').remove()
    }
    if(!LINKS.prevCap) {
        document.querySelector('div[action="prevcap"]').remove()
    }
}


function nextpalette() {
    DATA.palette = DATA.palette == MaxPalette ? DATA.palette = 1 : DATA.palette += 1
    localStorage.setItem("palette", DATA.palette)
    updatePalette()
    notify(`Paleta de cores ${DATA.palette}`)
}

function nextcap() {
    window.location = LINKS.nextCap
}

function prevcap() {
    window.location = LINKS.prevCap
}

function novelpage() {
    window.location = LINKS.novelPage
}

function opendisqus() {
    const DISQUS = document.querySelector(".disqus-hidden")
    if(!(document.querySelector('#disqus_thread').children.length > 0)) initDisqus()
    if(DISQUS) DISQUS.className = "disqus"
}

function closedisqus() {
    const disqus = document.querySelector('.disqus')
    if(disqus) {
        disqus.className = [disqus.className, "hidden"].join("-")
    }
}


function boldtext() {
    const classList = READER_BODY().classList
    if(classList.contains("text-bold")) {
        classList.remove("text-bold")
        defaultColors(this)
        localStorage.setItem("bold", false);
        notify("BOLD Desativado")
    }else {
        classList.add("text-bold")
        reverseColors(this)
        localStorage.setItem("bold", true);
        notify("BOLD Ativado")
    }
}


function maximizereader() {
    document.body.classList.add("maximize")
    localStorage.setItem("maximize", true)
    notify("Tela aberta")
}

function minimizereader() {
    document.body.classList.remove("maximize")
    localStorage.setItem("maximize", false)
    notify("Tela padrão")
}

function showcaps(e) {
    if(!document.querySelector("#chapters")) {
        const list = document.createElement('div')
        const div = document.createElement('div')
        list.classList.add('button-list')
        list.classList.add(`button-list-${DATA.palette}`)
        list.classList.add(`background-${DATA.palette}`)
        list.classList.add(`color-${DATA.palette}`)
        list.id = "chapters";
        const currentPost = `post${window.location.pathname.split("/")[window.location.pathname.split("/").length - 1]}`;
        let count = 0, scrollPosition = 0
        for(const chapter of LINKS.chapters) {
            const link = document.createElement('a');
            link.textContent = chapter.title
            
            link.id = `post${chapter.href.split('/')[chapter.href.split('/').length - 1]}`
            if(link.id === currentPost) {
                link.classList.add("button-item")
                link.classList.add(`reverse-color-${DATA.palette}`)
                link.classList.add(`reverse-background-${DATA.palette}`)
                scrollPosition = (count * 39)
            }else {
                link.classList.add("button-item")
                link.classList.add(`color-${DATA.palette}`)
                link.classList.add(`background-${DATA.palette}`)
                count++;
            }
            link.href = chapter.href
            div.appendChild(link)
        }

        list.appendChild(div)


        document.body.appendChild(list)

        
        if(DATA.currentListChaptersScrollTop < 0) {
            div.scrollTop = scrollPosition
            DATA.currentListChaptersScrollTop = div.scrollTop
        }else {
            div.scrollTop = DATA.currentListChaptersScrollTop
        }
        div.onscroll = (e) => {
            DATA.currentListChaptersScrollTop = e.target.scrollTop
        }
        let c = true
        list.addEventListener('click', () => {
            c = true
        })

        document.addEventListener('click', () => {
            if(!c && list) {
                list.remove()
            }
            c = false;
            
        })
    }else {
        document.querySelector('#chapters').remove()
    }
}


function paddingchange () {
    const bodyReader = READER_BODY()
    bodyReader.classList.remove(`p${DATA.padding}x`)

    if(DATA.padding == MaxPadding) {
        DATA.padding = 1;
    }else {
        DATA.padding += 1;
    }
    bodyReader.classList.add(`p${DATA.padding}x`)
    localStorage.setItem("paddingText", DATA.padding)

    notify(`Espaçamento de ${DATA.padding * 10}px`)
}