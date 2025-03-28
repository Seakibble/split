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
