
var broadcast = new BroadcastChannel('scoreboard')

// evaluate all localStorage values
function updateAll() {
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i)
        var value = localStorage.getItem(key)
        
        update(key, value)
    }
}

function update(key, value) {
    var elements = document.getElementsByName(key)
    if (elements) {
        console.log(`Updated: ${key} = ${value}`)
        elements.forEach(element => {
            if ([null, undefined, ""].includes(value)) value = element.getAttribute('default') || value
            //console.log(element)
            if (element) {
                if (element.tagName === 'INPUT') {
                    if (element.getAttribute('type') === 'checkbox') {
                        element.checked = value
                    } else {
                        element.value = value
                    }
                } else {
                    element.textContent = value
                }
            }
        })
    }
    if (key && key.endsWith('.color')) {
        var base = key.slice(0, -1 * '.color'.length)
        var elements = document.querySelectorAll(`.${base}-colorable`)

        
        if (elements) {
            //console.log(elements)
            elements.forEach(element => {
                element.style = `color: #fff; background-color: ${value}`
            })
        }

        elements = document.querySelectorAll(`.${base}-colorable-text`)

        if (elements) {
            elements.forEach(element => {
                element.style = `color: ${value};` + element.style
            })
        }
    }

}

broadcast.onmessage = function(e) {
    update(e.data, localStorage.getItem(e.data))
}

/**
 * @param {HTMLFormElement} form
 * @returns {Object}
 */
function getFormData(form) {

    if (!form) return null

    var obj = {}
    for (var el of form.elements) {
        if (el.name && ['TEXTAREA', 'SELECT'].includes(el.tagName)) {
            obj[el.name] = el.value
        } else if (el.tagName === 'INPUT') switch (el.type) {
            case 'button':
                break;
            case 'checkbox':
                obj[el.name] = el.checked
                break;
            case 'radio':
                if (el.checked) {
                    obj[el.name] = el.value
                } else {
                    var selection = document.querySelector(`input[name=${el.name}]:checked`)
                    obj[el.name] = selection ? selection.value : null
                }
                break;
            default:
                obj[el.name] = el.value
                break;
        } else {
            // fieldset, button, etc
        }
    }

    return obj
}

// update localStorage data
function writeData(formData) {

    if (!formData) return

    for (var [key, value] of Object.entries(formData)) {
        if (localStorage.getItem(key) !== value) {
            //console.log(`Written: ${key} = ${value}`)
            localStorage.setItem(key, value)
            broadcast.postMessage(key)
            update(key, value)
        }
    }

}

function writeScore() {
    writeData(getFormData(document.getElementById("score-form")))
}

function onChangeScore() {
    if (document.querySelector("#auto-update").checked) {
        writeScore()
    }
}

function changeAutoUpdate() {
    if (!document.querySelector("#auto-update").checked)
        writeData({autoUpdate: document.querySelector('#auto-update').checked})
}

function writeSettings() {
    writeData(getFormData(document.getElementById("settings-form")))
}

function resetSettings() {
    document.getElementById("settings-form").reset()
    writeSettings()
}

var currentOpenWindow = null

function openWindow() {
    if (!currentOpenWindow)
        currentOpenWindow = window.open(location.origin + '/scoreboard.html', '', 'width=960,height=720,centerscreen,dependent,alwaysRaised')

    var button = document.getElementById('btn-open-window')
    button.classList.replace('btn-outline-success', 'btn-outline-danger')
    button.textContent = "Close Window"
    button.onclick = closeWindow
    currentOpenWindow.addEventListener('beforeunload', closeWindow)

    document.getElementById('btn-fullscreen').disabled = false
}

function closeWindow() {
    if (currentOpenWindow)
        currentOpenWindow.close()
    
    currentOpenWindow = null

    var button = document.getElementById('btn-open-window')
    button.classList.replace('btn-outline-danger', 'btn-outline-success')
    button.textContent = "Open Window"
    button.onclick = openWindow

    document.getElementById('btn-fullscreen').disabled = true
}

/**
 * 
 * @param {Screen} s
 */
function screenString(s) {
    return `${s.width}x${s.height} ${s.orientation.type} ${s.colorDepth} ${s.pixelDepth}`
}

function winFullscreen(force = false) {
    if (!currentOpenWindow) return

    if (!force && screenString(currentOpenWindow.screen) === screenString(window.screen)) {

        document.getElementById('alert-modal-button').addEventListener('click', () => {
            winFullscreen(true)
        }, {once: true})
        $('#alert-modal').modal()
        return
    }

    currentOpenWindow.focus()
    if (!currentOpenWindow.document.fullscreenElement)
        currentOpenWindow.document.documentElement.requestFullscreen()
    else
        currentOpenWindow.document.exitFullscreen()
}

function onLoad() {

    updateAll()
    writeSettings()
    writeScore()

    document.querySelectorAll(".btn-increment").forEach(btn => {
        var input = btn.parentElement.parentElement.parentElement.querySelector("input")
        btn.addEventListener('click', () => {
            input.value = parseInt(input.value) + parseInt(btn.getAttribute('amount'))
            onChangeScore()
        })
    })
}

function onBeforeUnload() {
    if (currentOpenWindow)
        closeWindow()
}
window.addEventListener('beforeunload', onBeforeUnload)


