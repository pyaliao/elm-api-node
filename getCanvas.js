
/* <button id="save">Save</button>
<canvas width="3875" height="4335" aria-label="页码 4" style="width: 22299px; height: 24937px; transform: rotate(0deg) scale(1, 1);" id="xxxxx"></canvas> */

const gCanvas = document.querySelector('#xxxxx');

function onSave () {
  gCanvas.toBlob((blob) => {
    const timestamp = Date.now().toString();
    const a = document.createElement('a');
    document.body.append(a);
    a.download = `${timestamp}.png`;
    a.href = URL.createObjectURL(blob);
    a.click();
    a.remove();
  });
}

document.querySelector('#save').addEventListener('click', onSave);
document.getElementById("save").click()
