module.exports = function (source) {
  this.cacheable && this.cacheable();
  // Parse the GLB data from the source string (assuming it's base64 encoded)
  const glbData = atob(source);
  // Create a Uint8Array from the decoded data
  const buffer = new Uint8Array(glbData.length);
  for (let i = 0; i < glbData.length; i++) {
    buffer[i] = glbData.charCodeAt(i);
  }
  // Return the Uint8Array as the module export
  return `module.exports = ${buffer};`;
};
