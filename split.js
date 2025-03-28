// MARK: Variables
const $start = document.getElementById('start')
const $end = document.getElementById('end')
const $split = document.getElementById('split')
const $type = document.getElementById('type')

const $heading = document.getElementById('heading')
const $splits = document.getElementById('splits')
const $task = document.getElementById('task')
const $stats = document.getElementById('stats')

const $editSplit = document.getElementById('editSplit')
const $editSelect = document.getElementById('editSplit__select')
const $editInput = document.getElementById('editSplit__input')
const $editUpdate = document.getElementById('editSplit__update')
const $editCancel = document.getElementById('editSplit__cancel')

let types = {
    generic: '⏱️',
    working: '✔️',

    bedtime: '🛏️',
    cleaning: '🧹',        
    coding: '🖥️',
    cooking: '🌯',
    commuting: '🚗',
    creating: '🎨',

    eating: '🍽️',
    errand: '🏃‍♀️',
    exercise: '🏋️‍♀️',
    hygiene: '🧼',

    journaling: '📓',
    maintenance: '🔧',
    meditating: '👁️',
    phone: '📱',
    recreation: '🎮',
    relaxing: '🏖️',

    socializing: '🍻',
    writing: '🖋️',
}

// MARK: Populate Type Options
for (const type in types) {
    $type.innerHTML += `<option value="${type}"><span>${types[type]}</span> <span>${titleCase(type)}</span></option>`
}

$editSelect.innerHTML = $type.innerHTML

// MARK: Initialize Data
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

// MARK: Start Button
$start.addEventListener('click', (e) => {
    sessionActive = true

    $splits.innerHTML = `
        <div class="split split_header">
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

// MARK: End Button
$end.addEventListener('click', (e) => {
    sessionActive = false
    if ($task.value) {
        $task.value = '🏁 ' + $task.value
    } else {
        $task.value = '🏁 End'
    }
    
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

// MARK: Split Button
$split.addEventListener('click', () => {
    handleSplit()
})

// MARK: Task Keypress
$task.addEventListener('keypress', (e) => {
    if (e.code == "Enter") {
        handleSplit()
    }
})

// MARK: Edit Split
let editing = null
$splits.addEventListener('click', (e) => {
    let clicky = e.target.closest('.split')
    if (clicky.classList.contains('split_header')) {
        return
    }
    
    if (clicky.classList.contains('split')) {
        editing = clicky
        let name = clicky.querySelector('.name').innerText
        name = name.split(' ')
        name.shift()
        name = name.join(' ')
        $editInput.value = name
        
        let type = clicky.classList.value.replace('split ', '')
        $editSelect.value = type

        $editSplit.classList.remove('hide')
        // focus($editInput)
    }
})

// MARK: Update Button
$editUpdate.addEventListener('click', () => {
    $editSplit.classList.add('hide')

    let split = splitTimes[editing.dataset.index]

    let newName = types[$editSelect.value] + ' ' + $editInput.value
    let newType = $editSelect.value

    editing.classList.remove(split.type)
    editing.classList.add(newType)
    editing.querySelector('.name').innerText = newName
    split.name = newName
    split.type = newType
    
    editing = null
    save()
    getStats()
})

// MARK: Cancel Button
$editCancel.addEventListener('click', () => {
    $editSplit.classList.add('hide')
    
    editing = null
})

// MARK: startTimer()
function startTimer() {
    timeObject = makeTimeObject((Date.now() - sessionStart))
    document.querySelector('h1').classList.add('active')
    $heading.innerText = toString(timeObject)

    sessionTimer = setInterval(() => {
        timeObject = makeTimeObject((Date.now() - sessionStart))
        $heading.innerText = toString(timeObject)
    }, 1000)
}

// MARK: titleCase()
function titleCase(str) {
    str = str.split('')
    str[0] = str[0].toUpperCase()
    return str.join('')
}

// MARK: handleSplit()
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

// MARK: split()
function split(type = false) {
    if (sessionTimer != null) {
        let diff = Date.now() - sessionStart
        if (splitTimes.length > 0) {
            diff = timeObject.i - splitTimes[splitTimes.length - 1].i
        }

        let name = '-'
        if ($task.value) {
            name = $task.value
            $task.value = ''
        }

        let split = {
            name: name,
            diff: diff,
            timestamp: toString(timeObject, true),
            type: type,
            i: timeObject.i
        }
        splitTimes.push(split)

        save()

        displaySplit(split, splitTimes.length-1)
    }
}

// MARK: displaySplit()
function displaySplit(split, index = null) {
    let $newSplit = document.createElement('div')
    $newSplit.classList.add('split')
    $newSplit.dataset.index = index

    if (split.type) {
        $newSplit.classList.add(split.type)
    }

    let diffTime = makeTimeObject(split.diff)
    let diffText = toText(diffTime)

    $newSplit.innerHTML += `
                <div class='name'>${split.name}</div> 
                <div class='duration'>${diffText}</div>
                <div class='timestamp'>${split.timestamp}</div>`
    $splits.append($newSplit)

    window.scrollTo(0, document.body.scrollHeight);

    getStats()
}

// MARK: makeTimeObject()
function makeTimeObject(input) {
    let seconds = (input / 1000) % 60
    let minutes = Math.floor(input / 60000)
    let hours = Math.floor(minutes / 60)
    minutes = minutes % 60

    return {
        i: input,
        s: seconds,
        m: minutes,
        h: hours
    }
}

// MARK: toString()
function toString(obj, full = false) {
    let s = Math.floor(obj.s)
    let m = obj.m
    let h = obj.h

    if (s < 10) s = '0' + s
    if (m < 10) m = '0' + m
    if (h < 10) h = '0' + h

    let string = `${h}:${m}`
    if (full) string += ':' + s
    return string
}

// MARK: toText()
function toText(obj) {
    if (Math.floor(obj.s) == 0 && obj.m == 0 && obj.h == 0) {
        return '-'
    }

    let s = Math.floor(obj.s)
    if (s == 1) {
        s += '<span class="hide"> </span>s<span class="hide">econd</span>'
    } else {
        s += '<span class="hide"> </span>s<span class="hide">econds</span>'
    }

    let m = ''
    if (obj.m > 1) {
        m = obj.m + '<span class="hide"> </span>m<span class="hide">inutes,</span> '
    } else if (obj.m == 1) {
        m = obj.m + '<span class="hide"> </span>m<span class="hide">inute,</span> '
    }

    let h = ''
    if (obj.h > 1) {
        h = obj.h + '<span class="hide"> </span>h<span class="hide">ours,</span> '
    } else if (obj.h == 1) {
        h = obj.h + '<span class="hide"> </span>h<span class="hide">our,</span> '
    }

    return `${h}${m}${s}`
}

// MARK: getStats()
function getStats() {
    let categories = {}
    splitTimes.forEach(split => {
        if (split.type === 'start' || split.type === 'end') {
            return
        }
        if (categories[split.type] === undefined) {
            categories[split.type] = 0
        }
        categories[split.type] += split.diff
    })

    let total = 0
    let keys = []
    for (category in categories) {
        total += categories[category]
        let time = toString(makeTimeObject(categories[category]), true)
        // time = time.split(' ')[0]
        keys.push([category, categories[category], time])
    }

    keys.sort((a, b) => {
        return b[1] - a[1]
    })

    $stats.innerHTML = `<div class='stat total'>
            <b>Total Time</b> <span><span class="hide">|</span> ${toString(makeTimeObject(total), true)}</span> <span>(100%)</span>
        </div>`
    for (const key in keys) {
        $stats.innerHTML += `<div class='stat ${keys[key][0]}'>
            <b>${types[keys[key][0]]} ${titleCase(keys[key][0])}</b> <span><span class="hide">|</span> ${keys[key][2]}</span> <span>(${Math.round(keys[key][1] / total * 1000) / 10}%)</span>
        </div>`
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