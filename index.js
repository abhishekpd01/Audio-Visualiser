
// getting access to the audio input.
document.getElementById("audio")

    // adding an event listener whenever the audio file is inputed.
    .addEventListener("change", (event) => {
        const file = event.target.files[0];  // getting access to the file that is input.
        
        const reader = new FileReader();  // creating a new instance of FileReader() constructor to read the audio file. 

        reader.addEventListener("load", (event) => {
            const arrayBuffer = event.target.result;  // This callback fun executes when the below readAsArrayBuffer() is called.

            // Ṇow we convert this arraybuffer into an audioBuffer using audioContext method.
            const audioContext = new (window.AudioContext || window.webkitAudioContext) ();

            audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
                visualize(audioBuffer, audioContext);
            })
        });

        reader.readAsArrayBuffer(file);   // here we convert the file into an audioBuffer array which has data in form of binary. This readAsArrayBuffer() method is an asyn function which does not return any thing. So, in order to get the return value we make use of eventListener in the above line.
    });

// function to visualize the audio on canvas.
function visualize(audioBuffer, audioContext) {
    const canvas = document.getElementById("canvas");
    canvas.width = canvas.clientWidth;
    canvas.height = 500;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 128;
    
    const frequencyBufferLength = analyser.frequencyBinCount;
    const frequencyData = new Uint8Array(frequencyBufferLength);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    source.start()

    // To draw something on the canvas we need a cnvasContext.
    const canvasContext = canvas.getContext("2d");

    const barWidth = canvas.width / frequencyBufferLength;

    function draw() {
        requestAnimationFrame(draw);   // calls the draw function itself again before the next repaint.

        canvasContext.fillStyle = "#F4C2C2"
        // clearing the canvas every time to plot new rectangles.
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);

        analyser.getByteFrequencyData(frequencyData);

        for(let i = 0; i < frequencyBufferLength; i++) {
            canvasContext.fillStyle = `rgba(82, 113, 255, ${frequencyData[i] / 255})`;      // plotting rectangles on the canvas.
            canvasContext.fillRect(
                i * barWidth,
                canvas.height - frequencyData[i],
                barWidth - 1,
                frequencyData[i]
            );
        }

    }
    draw();
}