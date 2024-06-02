
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
                visualize(audioBuffer);
            })
        });

        reader.readAsArrayBuffer(file);   // here we convert the file into an audioBuffer array which has data in form of binary. This readAsArrayBuffer() method is an asyn function which does not return any thing. So, in order to get the return value we make use of eventListener in the above line.
    });

// function to visualize the audio on canvas.
function visualize(audioBuffer) {
    const canvas = document.getElementById("canvas");
    canvas.width = 800;
    canvas.height = 200;

    

    // To draw something on the canvas we need a cnvasContext.
    const canvasContext = canvas.getContext("2d");

    // PCM(Pulse Code Modulation) data.
    const channelData = audioBuffer.getChannelData(0);
    
    const numberOfChunks = 400;
    const chunkSize = Math.ceil(channelData.length / numberOfChunks);

    // plotting rectangles on the canvas.
    canvasContext.fillStyle = "#5271FF";

    const center = canvas.height / 2;
    const barWidth = canvas.width / numberOfChunks;

    for(let i = 0; i < numberOfChunks; i++) {
        const chunk = channelData.slice(i * chunkSize, (i + 1) * chunkSize);

        const min = Math.min(...chunk) * 20;
        const max = Math.max(...chunk) * 20;

        canvasContext.fillRect(
            i * barWidth,
            center - max,
            barWidth,
            max + Math.abs(min)
        );
    }
}