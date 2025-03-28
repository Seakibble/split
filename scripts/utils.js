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

// MARK: titleCase()
function titleCase(str) {
    str = str.split('')
    str[0] = str[0].toUpperCase()
    return str.join('')
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