function updateData(formData) {
    for (var [key, value] of formData.entries()) {
        if (localStorage.getItem(key) != value) {
            console.log(`Updated: ${key} = ${value}`)
            localStorage.setItem(key, value)
            update({key, newValue: value})
        }
        
    }
}

function updateScore() {
    updateData(new FormData(document.getElementById("score-form")))
}

function resetSettings() {
    localStorage.removeItem('numTeams')

    document.getElementById("settings-form").reset()
    updateSettings()

    document.querySelectorAll("fieldset.extra-team").forEach(x => {
        x.remove()
    })
}

function updateSettings() {
    updateData(new FormData(document.getElementById("settings-form")))
}


function onLoad() {

    var teamCount = localStorage.getItem('numTeams')
    if (!teamCount) {
        localStorage.setItem('numTeams', '2')
    } else {
        for (var i = 0; i < teamCount - 2; i++) {
            addTeam()
        }
    }

    /*for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i)
        var value = localStorage.getItem(key)
        var element = document.getElementsByName(key)[0]
        
        if (element) {
            //console.log(element)
            element.textContent = value
        }
    }*/

    updateAll()
}

var numTeams = 2

function addTeam() {
    numTeams++;
    localStorage.setItem('numTeams', numTeams)

    var template = document.getElementById("team-settings-template")
    var team = template.cloneNode(true)
    team.innerHTML = team.innerHTML
                    .replace(/{{x}}/gi, numTeams)
                    .replace(/{{defaultColor}}/gi, "#000000")
                    .replace(/{{defaultName}}/gi, "Name")
    team = team.content
    template.parentElement.insertBefore(team, template)
    

    template = document.getElementById("team-score-template")
    team = template.cloneNode(true)
    team.innerHTML = team.innerHTML
                    .replace(/{{x}}/gi, numTeams)
                    .replace(/{{defaultColor}}/gi, "#000000")
                    .replace(/{{name}}/gi, "Name")
    team = team.content
    template.parentElement.insertBefore(team, template)
}

function removeTeam(i) {
    document.querySelector(`#team-${i}-settings`).remove()
    document.querySelector(`#team-${i}-score`).remove()
    numTeams--;

    localStorage.setItem('numTeams', numTeams)
    localStorage.setItem('lastRemovedTeam', numTeams+1)
}
