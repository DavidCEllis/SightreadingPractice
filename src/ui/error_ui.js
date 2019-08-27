// Error Message Box
let errorContents = ''
let errorDiv = document.getElementById('srt-error-dialog')

function errorDialog (contents) {
  errorContents = (errorContents === '') ? contents : errorContents + '<br/>' + contents
  errorDiv.innerHTML = `
  <div class="alert alert-warning" role="alert">
    ${errorContents}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  `
}

export { errorDialog }
