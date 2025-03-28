
// MARK: Initialize Data
let sessionStart = null
let sessionTimer = null
let sessionActive = false
let timeObject = null

let splitTimes = []
let data = localStorage.getItem('data')


// MARK: Populate Type Options
for (const type in types) {
    $type.innerHTML += `<option value="${type}"><span>${types[type]}</span> <span>${titleCase(type)}</span></option>`
}

// Sync edit select with type select
$editSelect.innerHTML = $type.innerHTML

// MARK: Load Data
if (data == null) {
    data = {
        id: 0,
        sessions: []
    }
} else {
    data = JSON.parse(data)
    let session = data.sessions[data.sessions.length - 1]

    if (session.active) {
        splitTimes = session.splits

        session.splits.forEach((split, index) => {
            displaySplit(split, index)
        })

        sessionStart = session.start

        startTimer()

        $start.disabled = true
        $end.disabled = false

        $type.disabled = false
        $task.disabled = false
        $split.disabled = false
        sessionActive = true
    }
}


// MARK: save()
function save() {
    let lastSession = data.sessions[data.sessions.length - 1]
    if (lastSession && lastSession.id == data.id) {
        lastSession.splits = splitTimes
        lastSession.date = Date.now()
        lastSession.active = sessionActive
    } else {
        let session = {
            id: data.id,
            date: Date.now(),
            splits: splitTimes,
            start: sessionStart,
            active: sessionActive
        }
        data.sessions.push(session)
    }

    localStorage.setItem('data', JSON.stringify(data))
}