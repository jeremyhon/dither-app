export const toGreyscale = image => {
  return new Promise(resolve => {
    for (let i = 0; i <= image.data.length; i += 4) {
      const averagedRGB =
        (image.data[i] + image.data[i + 1] + image.data[i + 2]) / 3;
      const integerGreyValue = parseInt(averagedRGB, 10);
      image.data[i] = image.data[i + 1] = image.data[i + 2] = integerGreyValue;
    }
    resolve();
  });
};

export const ditherByThreshold = (image, threshold) => {
  return new Promise(resolve => {
    for (let i = 0; i <= image.data.length; i += 4) {
      image.data[i] = image.data[i] > threshold ? 255 : 0;
      image.data[i + 1] = image.data[i + 1] > threshold ? 255 : 0;
      image.data[i + 2] = image.data[i + 2] > threshold ? 255 : 0;
    }
    resolve();
  });
};

export const ditherByAtkinson = (image, imageWidth) => {
  return new Promise(resolve => {
    for (let i = 0; i <= image.data.length; i++) {
      spreadError(image.data, imageWidth, i);
    }
    resolve();
  });
};

const spreadError = (imageData, imageWidth, currentPixel) => {
  let newPixelColour = 255;
  if (imageData[currentPixel] <= 128) {
    newPixelColour = 0;
  }

  let err = parseInt((imageData[currentPixel] - newPixelColour) / 8, 10);

  //pixel err dispersal (currentPixel = X)
  //[ . X A B ]
  //[ C D E . ]
  //[ . F . . ]

  imageData[currentPixel] = newPixelColour; // X
  imageData[currentPixel + 4] += err; // A
  imageData[currentPixel + 8] += err; // B
  imageData[currentPixel + 4 * imageWidth - 4] += err; // C
  imageData[currentPixel + 4 * imageWidth] += err; // D
  imageData[currentPixel + 4 * imageWidth + 4] += err; // E
  imageData[currentPixel + 8 * imageWidth] += err; // F
};

export const draw = async (imageData, imageWidth) => {
  await ditherByAtkinson(imageData, imageWidth);
  return imageData;
};
