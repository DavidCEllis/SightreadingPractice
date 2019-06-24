export default class AUDIOStats {
  constructor (div) {
    this.div = div
    this.lastValidNote = 'N/A'
    this.lastConfidence = -1
    this.lastLevel = -1
    this.quietestLevel = 1.0 // 1 is the maximum
    this.loudestLevel = 0.0 // 0 is the minimum
  }

  /**
   * Create statistics layout in div and reveal div
   */
  setup () {
    this.div.hidden = false
    // this.div.style = 'border: 2px solid black; width: 300px;'
    this.render()
  }

  /**
   * Clear statistics from div and hide div
   */
  teardown () {
    this.div.hidden = true
    this.div.innerHTML = ''
  }

  reset () {
    this.lastValidNote = 'N/A'
    this.lastConfidence = -1
    this.lastLevel = -1
    this.quietestLevel = 1.0
    this.loudestLevel = 0.0
  }

  /**
   * update statistics in div
   */
  render () {
    // language=HTML
    this.div.innerHTML = `
    <div class="col">
      <p class="text-left">Quietest Level: ${(this.quietestLevel * 10000).toFixed(2)}</p>
    </div>
    <div class="col">
      <p class="text-left">
        Last Note Level: ${(this.lastLevel * 10000).toFixed(2)}
        <br>
        Loudest Level: ${(this.loudestLevel * 10000).toFixed(2)}
      </p>
    </div>
    <div class="col">
      <p class="text-left">
        Last Note Confidence: ${(this.lastConfidence * 100).toFixed(2)}%
        <br>
        Last Note: ${this.lastValidNote}
      </p>  
    </div>
    `.trim()
  }
}
