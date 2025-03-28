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