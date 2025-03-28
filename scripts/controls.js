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