function updateAll() {
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i)
        var value = localStorage.getItem(key)
        
        update({key, newValue: value})
    }
}

function update(e) {
    var key = e.key
    var value = e.newValue

    if (e.key === 'lastRemovedTeam') {
        removeTeam(e.value)
    }

    var elements = document.getElementsByName(key)
    if (elements) {
        console.log(`Updated: ${key} = ${value}`)
        elements.forEach(element => {
            if ([null, undefined, ""].includes(value)) value = element.getAttribute('default') || value
            console.log(element)
            if (element) {
                if (element.tagName === 'INPUT') {
                    element.value = value
                } else {
                    element.textContent = value
                }
            }
        })
    }
    if (key.endsWith('.color')) {
        var base = key.slice(0, -1 * '.color'.length)
        var elements = document.querySelectorAll(`.${base}-colorable`)

        if (elements) {
            console.log(`Updated Color: ${base}.color`)
            console.log(elements)
            elements.forEach(element => {
                element.style = `color: #fff; background-color: ${value}`
            })         
        }
    }

}
window.addEventListener('storage', update)
