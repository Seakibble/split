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