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

        displaySplit(split, splitTimes.length - 1)
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