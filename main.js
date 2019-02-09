// Setup and constants
const pxW = 36
const pxH = 24
const numPx = pxW * pxH
const numBytes = numPx / 8
const aspectRatio = pxH / pxW
const canvasW = 500
const canvasH = canvasW * aspectRatio
const pxSize = canvasW / pxW
const outputEl = document.querySelector('#output')
const inputEl = document.querySelector('#input')

// Convert binary to hex
const binToHex = bin => `0x${parseInt(bin, 2).toString(16)}`
// Convert hex to binary
const hexToBin = hex => (parseInt(hex, 16).toString(2)).padStart(8, '0')

// Strip spaces from string
const stripString = t => t.replace(/[\n\r]+/g, '').replace(/\s{2,10}/g, ' ').trim();

// Canvas and context to draw on
const canvasEl = document.querySelector('#canvas')
const ctx = canvasEl.getContext('2d')
canvasEl.width = canvasW
canvasEl.height = canvasH

// Create array for all pixels, filled with 0s
let pixels = new Array(numPx).fill(0)

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

// Output binary array to hex
const output = (binArray) => {
    // Empty array to store hex vals
    const hexArr = []

    // Loop through number of bytes needed to create
    for (let i = 0; i < numBytes; i++) {
        // Create empty binary string to build up
        let bin = ''
        // Loop through number of bits per byte
        // Get the position in array and add to binary string
        // Must work backwards because the visual output is in reverse order per byte
        for (let j = 7; j > -1; j--) {
            const arrPos = (i * 8) + j
            bin += pixels[arrPos]
        }

        // Convert bin to hex and add to hex array
        hexArr.push(binToHex(bin))
    }


    // Output hex array
    outputEl.value = hexArr
}

// Set pixels based on input hex
const input = (hexList) => {
    // Strip spaces from hex inputted and update the textarea with the reformated version
    hexList = stripString(hexList)
    inputEl.value = hexList

    // Will populate this array with new 1s and 0s
    let newPixels = []

    // Convert string of hexes to array of hexes
    const hexArr = hexList.split(',')

    // Alert user if wrong number of bytes
    if (hexArr.length !== numBytes) {
        window.alert('Wrong number of bytes in hex array!')
    }

    // Build up new pixels array
    for (let i = 0; i < numBytes; i++) {
        const bin = hexToBin(hexArr[i])
        // Must reverse the digits for each byte to output correctly
        const arr = bin.split('').reverse()
        newPixels = newPixels.concat(arr)
    }

    // Update and output pixels with new ones
    pixels = newPixels
    output(pixels)
}

// Set pixel as 0 or 1 depending on mouseState
const setPixel = (e) => {
    if (mouseState === 'left') {
        pixels[getMousePos(e)] = '1'
    } else if (mouseState === 'right') {
        pixels[getMousePos(e)] = '0'
1    }
    
    if (mouseState !== 'none') {
        output(pixels)
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

// Update pixel values if input textarea changes
inputEl.addEventListener('change', () => {
    input(inputEl.value)
})

const animate = () => {
    // Draw green bg
    ctx.fillStyle = colors.green
    ctx.fillRect(0, 0, canvasW, canvasH)

    // Only drawing black pixels so set the fillStyle outside of the loop
    ctx.fillStyle = colors.black

    // Loop through pixels array
    for (let i = 0; i < numPx; i++) {
        // Only draw if array value is 1
        if (pixels[i] === '1') {
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