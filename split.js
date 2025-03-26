const $start = document.getElementById('start')
const $end = document.getElementById('end')
const $split = document.getElementById('split')
const $type = document.getElementById('type')

const $heading = document.getElementById('heading')
const $splits = document.getElementById('splits')
const $task = document.getElementById('task')

let sessionStart = null
let sessionTimer = null
let sessionActive = false
let timeObject = null

let splitTimes = []
let data = localStorage.getItem('data')

if (data == null) {
    data = {
        id: 0,
        sessions: []
    }
} else {
    data = JSON.parse(data)
    let session = data.sessions[data.sessions.length - 1]

    if (session.active) {
        session.splits.forEach(split => {
            displaySplit(split)
        })

        splitTimes = session.splits
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



let types = {
    generic: '⏱️',
    working: '✔️',
    
    // bedtime: '🛏️',
    // cleaning: '🧹',        
    coding: '🖥️',
    commuting: '🚗',
    creating: '🎨',

    eating: '🌯',
    errand: '🏃‍♀️',
    exercise: '🏋️‍♀️',
    hygiene: '🧼',

    journaling: '📓',
    meditating: '👁️',
    phone: '📱',
    recreation: '🎮',
    relaxing: '🏖️',
    
    socializing: '🍻',
    // writing: '🖋️',
    
}
for (const type in types) {
    $type.innerHTML += `<option value="${type}"><span>${types[type]}</span> <span>${titleCase(type)}</span></option>`
}



$start.addEventListener('click', (e) => {
    sessionActive = true
    
    $splits.innerHTML = `
        <div class="split">
            <div class='name'>Item</div>
            <div class='duration'>Elapsed</div>
            <div class='timestamp'>Timestamp</div>
        </div>`
    data.id++
    sessionStart = Date.now()
    
    startTimer()

    $task.value = '🚀 Start'
    split('start')

    $start.classList.add('active')
    $start.disabled = true

    setTimeout(() => {
        $type.disabled = false
        $task.disabled = false
        $split.disabled = false
        $end.disabled = false
    }, 500)
})

$end.addEventListener('click', (e) => {
    sessionActive = false
    $task.value = '🏁 End'
    split('end')

    $start.classList.remove('active')
    $start.disabled = false
    $end.disabled = true
    $type.disabled = true
    $task.disabled = true
    $split.disabled = true

    document.querySelector('h1').classList.remove('active')
    document.querySelector('h1').classList.add('done')

    clearInterval(sessionTimer)
    sessionStart = null
    splitTimes = []
})

$split.addEventListener('click', () => {
    handleSplit()
})
$task.addEventListener('keypress', (e)=>{
    if (e.code == "Enter") {
        handleSplit()
    }
})

function startTimer() {
    timeObject = makeTimeObject((Date.now() - sessionStart))
    document.querySelector('h1').classList.add('active')
    $heading.innerText = timeObject.toString()

    sessionTimer = setInterval(() => {
        timeObject = makeTimeObject((Date.now() - sessionStart))
        $heading.innerText = timeObject.toString()
    }, 1000)
}

function titleCase(str) {
    str = str.split('')
    str[0] = str[0].toUpperCase()
    return str.join('')
}

function handleSplit() {
    if ($task.value == '') {
        if ($type.value == 'generic') {
            $task.value = types[$type.value] + ' -'
        } else {
            $task.value = types[$type.value] + ' ' + titleCase($type.value)
        }
    } else {
        $task.value = types[$type.value] + ' ' + $task.value
    }
        
    split($type.value)
}


function split(type = false) {
    if (sessionTimer != null) {
        let diff = makeTimeObject(Date.now() - sessionStart)
        if (splitTimes.length > 0) {
            diff = timeObject.i - splitTimes[splitTimes.length - 1].i
            diff = makeTimeObject(diff)
        }

        let name = '-'
        if ($task.value) {
            name = $task.value
            $task.value = ''
        }

        let split = {
            name: name,
            diff: diff.toText(),
            timestamp: timeObject.toString(true),
            type: type,
            i: timeObject.i
        }
        splitTimes.push(split)

        save()

        displaySplit(split)
    }
}

function displaySplit(split) {
    let $newSplit = document.createElement('div')
    $newSplit.classList.add('split')

    if (split.type) {
        $newSplit.classList.add(split.type)
    }


    $newSplit.innerHTML += `
                <div class='name'>${split.name}</div> 
                <div class='duration'>${split.diff}</div>
                <div class='timestamp'>${split.timestamp}</div>`
    $splits.append($newSplit)

    window.scrollTo(0, document.body.scrollHeight);
}

function makeTimeObject(input) {
    let seconds = (input / 1000) % 60
    let minutes = Math.floor(input / 60000)
    let hours = Math.floor(minutes / 60)
    minutes = minutes % 60

    return {
        i: input,
        s: seconds,
        m: minutes,
        h: hours,
        toString: function (full = false) {
            let s = Math.floor(this.s)
            let m = this.m
            let h = this.h

            if (s < 10) s = '0' + s
            if (m < 10) m = '0' + m
            if (h < 10) h = '0' + h

            let string = `${h}:${m}`
            if (full) string += ':' + s
            return string
        },
        toText: function () {
            if (Math.floor(this.s) == 0 && this.m == 0 && this.h == 0 ) {
                return '-'
            }

            let s = Math.floor(this.s)
            if (s == 1) {
                s += '<span class="hide"> </span>s<span class="hide">econd</span>'
            } else {
                s += '<span class="hide"> </span>s<span class="hide">econds</span>'
            }

            let m = ''
            if (this.m > 1) {
                m = this.m + '<span class="hide"> </span>m<span class="hide">inutes,</span> '
            } else if (this.m == 1) {
                m = this.m + '<span class="hide"> </span>m<span class="hide">inute,</span> '
            }

            let h = ''
            if (this.h > 1) {
                h = this.h + '<span class="hide"> </span>h<span class="hide">ours,</span> '
            } else if (this.h == 1) {
                h = this.h + '<span class="hide"> </span>h<span class="hide">our,</span> '
            }

            return `${h}${m}${s}`
        }
    }
}


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