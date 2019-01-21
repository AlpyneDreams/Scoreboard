function scoreboardInit() {

    var teamCount = localStorage.getItem('numTeams') || 2
    for (var i = 0; i < teamCount - 2; i++) {
        addTeam()
    }

    updateAll()
}

var numTeams = 2

function addTeam() {
    numTeams++;

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
    //document.querySelector(`#team-${i}-settings`).remove()
    var score = document.querySelector(`#team-${i}-score`)
    if (!score) return
    score.remove()
    numTeams--;
}
