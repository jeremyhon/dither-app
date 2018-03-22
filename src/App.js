import React, { Component } from "react";
import "./App.css";

class App extends Component {
  state = {
    file: "",
    previewUrl: ""
  };

  handleDither = e => {
    e.preventDefault();
  };

  handleImageChange = e => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => this.setState({ file, previewUrl: reader.result });
    reader.readAsDataURL(file);
  };

  renderImage = () => {
    if (this.state.previewUrl) {
      const img = new Image();
      img.src = this.state.previewUrl;
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        const aspectRatio = width / height;
        const canvasWidth = this.canvas.width;

        const argv = [img, 0, 0, canvasWidth, canvasWidth / aspectRatio];
        this.canvas.getContext("2d").drawImage(...argv);
      };

      return (
        <canvas
          ref={canvas => (this.canvas = canvas)}
          src={this.state.previewUrl}
        />
      );
    }
    return (
      <div className="previewText">Please select an Image for Preview</div>
    );
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Dither Domain</h1>
        </header>
        <input
          className="fileInput"
          type="file"
          onChange={e => this.handleImageChange(e)}
        />
        <button
          className="submitButton"
          type="submit"
          onClick={e => this.handleDither(e)}
        >
          Dither Image
        </button>
        <div className="imgPreview">{this.renderImage()}</div>
      </div>
    );
  }
}

export default App;
