class ByteArrayBuilder {
  private chunks: Uint8Array[] = [];
  private totalLength = 0;

  /**
   * Appends a new Uint8Array to the list of chunks.
   */
  append(data: Uint8Array): void {
    this.chunks.push(data);
    this.totalLength += data.length;
  }

  /**
   * Merges all the chunks into a single Uint8Array.
   */
  build(): Uint8Array {
    const result = new Uint8Array(this.totalLength);
    let offset = 0;
    for (const chunk of this.chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    return result;
  }
}

export default ByteArrayBuilder;
