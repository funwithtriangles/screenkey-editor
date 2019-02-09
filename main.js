// Setup and constants
const pxW = 36
const pxH = 24
const numPx = pxW * pxH
const aspectRatio = pxH / pxW
const canvasW = 500
const canvasH = canvasW * aspectRatio
const pxSize = canvasW / pxW
const outputEl = document.querySelector('#output')

// Canvas and context to draw on
const canvasEl = document.querySelector('#canvas')
const ctx = canvasEl.getContext('2d')
canvasEl.width = canvasW
canvasEl.height = canvasH

// Get the position of the canvas once in order to calc mouse pos
// This would need to be updated if canvas moves/changes size
const canvRect = canvas.getBoundingClientRect();

// Canvas colors to choose from
const colors = {
    green: '#008209',
    black: '#111111'
}

// mouseState will change when left/right mouse button
let mouseState = 'none'

// Return the mouse position as an index in the pixelsarray
const getMousePos = (evt) => {
    const x = evt.clientX - canvRect.left
    const y = evt.clientY - canvRect.top

    const i = pxW - Math.ceil(x / pxSize)
    const j = Math.floor(y / pxSize) * pxW

    return i + j
}

// Set pixel as 0 or 1 depending on mouseState
const setPixel = (e) => {
    if (mouseState === 'left') {
        pixels[getMousePos(e)] = 1
    } else if (mouseState === 'right') {
        pixels[getMousePos(e)] = 0
    }
    
    if (mouseState !== 'none') {
        outputEl.value = pixels
    }
}

// Set global mouseState based on mouse event
const setMouseState = (e) => {
    const b = e.button
    if (b === 0) {
        mouseState = 'left'
    } else if (b === 2) {
        mouseState = 'right'
    }
}

// Prevent default right click behaviour on canvas
canvasEl.addEventListener('contextmenu', e => e.preventDefault())

// Set mouseState and the update the pixel array on click
canvasEl.addEventListener('mousedown', (e) => {
    setMouseState(e)
    setPixel(e)
})

// Update the pixel array on mouse movve
window.addEventListener('mousemove', setPixel)

// Reset mouse state when not clicking
canvasEl.addEventListener('mouseup', (e) => {
    mouseState = 'none'
})

// Empty pixel array
const pixels = []

// Populate array with 0s for empty pixels
for (let i = 0; i < numPx; i++) {
   pixels.push(0)
}

const animate = () => {
    // Draw green bg
    ctx.fillStyle = colors.green
    ctx.fillRect(0, 0, canvasW, canvasH)

    // Only drawing black pixels so set the fillStyle outside of the loop
    ctx.fillStyle = colors.black

    // Loop through pixels array
    for (let i = 0; i < numPx; i++) {
        // Only draw if array value is 1
        if (pixels[i] === 1) {
            // Get left and top pos of pixel based on array index
            const left = canvasW - ((i * pxSize) % canvasW) - pxSize
            const top = Math.floor(i / pxW) * pxSize
            // Draw pixel
            ctx.fillRect(left, top, pxSize, pxSize)
        }
    }

    // Call animate() every frame
    requestAnimationFrame(animate)
}

animate()