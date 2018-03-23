import React, { Component } from "react";
import { draw } from "./dither";
import "./App.css";

class App extends Component {
  state = {
    file: "",
    uploadedDataUrl: "",
    imgPreviewUrl: "",
    shouldUpdateCanvas: false
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    if (this.state.uploadedDataUrl !== nextState.uploadedDataUrl) {
      return true;
    }
    if (this.state.imgPreviewUrl !== nextState.imgPreviewUrl) {
      return true;
    }
    if (this.state.file !== nextState.file) {
      return true;
    }
    return false;
  };

  handleDither = e => {
    e.preventDefault();
    console.log("dithering!");
    const displayImageData = this.canvas
      .getContext("2d")
      .getImageData(0, 0, this.canvas.width, this.canvas.height);
    draw(displayImageData, this.canvas.width).then(ditheredImageData => {
      this.canvas.getContext("2d").putImageData(ditheredImageData, 0, 0);
      this.setState({ imgPreviewUrl: this.canvas.toDataURL("image/png") });
      console.log("done!");
    });
  };

  handleImageChange = e => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    this.setState({ shouldUpdateCanvas: true });

    reader.onloadend = () =>
      this.setState({ file, uploadedDataUrl: reader.result });
    reader.readAsDataURL(file);
  };

  renderCanvas = () => {
    if (this.state.uploadedDataUrl && this.state.shouldUpdateCanvas) {
      const img = new Image();
      img.src = this.state.uploadedDataUrl;
      img.onload = () => {
        this.canvas.width = img.width;
        this.canvas.height = img.height;

        this.canvas.getContext("2d").drawImage(img, 0, 0);
        const imgPreviewUrl = this.canvas.toDataURL("image/png");
        this.setState({ imgPreviewUrl, shouldUpdateCanvas: false });
      };
    }

    return (
      <canvas
        style={{ display: "none" }}
        ref={canvas => (this.canvas = canvas)}
        src={this.state.uploadedDataUrl}
      />
    );
  };

  renderImage = () => {
    if (this.state.imgPreviewUrl) {
      return (
        <img
          alt="preview"
          className="imgPreview"
          src={this.state.imgPreviewUrl}
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
          <p>Upload an image to dither it! (uses Atkinson method)</p>
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
          disabled={!this.state.uploadedDataUrl}
        >
          Dither Image
        </button>
        {this.renderImage()}
        {this.renderCanvas()}
      </div>
    );
  }
}

export default App;
