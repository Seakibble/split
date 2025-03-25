const $start = document.getElementById('start')
const $split = document.getElementById('split')
const $break = document.getElementById('break')

const $heading = document.getElementById('heading')
const $splits = document.getElementById('splits')
const $task = document.getElementById('task')


let sessionStart = null
let sessionTimer = null
let timeObject = null

let splitTimes = []

$start.addEventListener('click', (e) => {
    sessionStart = Date.now()
    
    timeObject = formatTime((Date.now() - sessionStart))
    $heading.innerText = timeObject.toString()
    sessionTimer = setInterval(()=> {
        timeObject = formatTime((Date.now() - sessionStart))
        $heading.innerText = timeObject.toString()
    }, 1000)

    $task.value = 'Start'
    split('start')

    document.querySelector('h1').classList.add('active')
})

$split.addEventListener('click', ()=>{
    split()
})
$task.addEventListener('keypress', (e)=>{
    if (e.code == "Enter") {
        split()
    }
})

$break.addEventListener('click', (e)=>{
    $task.value = 'Break'
    split('break')
})

function split(type = false) {
    if (sessionTimer != null) {
        let diff = formatTime(Date.now() - sessionStart)
        if (splitTimes.length > 0) {
            diff = timeObject.i - splitTimes[splitTimes.length-1].i
            diff = formatTime(diff)
        }

        let id = splitTimes.length + 1
        let name = '-'
        if ($task.value) {
            name = $task.value
            $task.value = ''
        }

        let $newSplit = document.createElement('div')
        $newSplit.classList.add('split')
        if (type) {
            $newSplit.classList.add(type)    
        }
        $newSplit.innerHTML += `
                <div class='id'>${id}</div> 
                <div class='name'>${name}</div> 
                <div class='duration'>${diff.toText()}</div>
                <div class='timestamp'>${timeObject.toString(true)}</div>`
        $splits.append($newSplit)
        splitTimes.push(timeObject)
    }
}


function formatTime(input) {
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