/****** Setup and constants ******/
const pxW = 36
const pxH = 24
const numPx = pxW * pxH
const aspectRatio = pxH / pxW
const canvasW = 500
const canvasH = canvasW * aspectRatio
const pxSize = canvasW / pxW

const colors = {
    green: '#008209',
    black: '#111111'
}

let mouseState = 'none'

const canvasEl = document.querySelector('#canvas')
canvasEl.width = canvasW
canvasEl.height = canvasH

const outputEl = document.querySelector('#output')

const canvRect = canvas.getBoundingClientRect();

const ctx = canvasEl.getContext('2d')

const getMousePos = (evt) => {
    const x = evt.clientX - canvRect.left
    const y = evt.clientY - canvRect.top

    const i = Math.floor(x / pxSize)
    const j = Math.floor(y / pxSize) * pxW

    return i + j
}

canvasEl.addEventListener('contextmenu', e => e.preventDefault())

canvasEl.addEventListener('mousedown', (e) => {
    const b = e.button
    if (b === 0) {
        mouseState = 'left'
    } else if (b === 2) {
        mouseState = 'right'
    }
})

canvasEl.addEventListener('mouseup', (e) => {
    mouseState = 'none'
})


/****** Logic ******/
window.addEventListener('mousemove', (e) => {
    if (mouseState === 'left') {
        pixels[getMousePos(e)] = 1
    } else if (mouseState === 'right') {
        pixels[getMousePos(e)] = 0
    }
    
    if (mouseState !== 'none') {
        outputEl.value = pixels
    }
 })

const pixels = []

for (let i = 0; i < numPx; i++) {
   //  pixels.push(Math.round(Math.random()))
   pixels.push(0)
}


const animate = () => {
    // Draw
    ctx.fillStyle = colors.green
    ctx.fillRect(0, 0, canvasW, canvasH)

    for (let i = 0; i < numPx; i++) {
        const left = (i * pxSize) % canvasW
        const top = Math.floor(i / pxW) * pxSize
        ctx.fillStyle = pixels[i] === 1 ? colors.black : colors.green
        ctx.fillRect(left, top, pxSize, pxSize)
    }

    requestAnimationFrame(animate)
}

animate()