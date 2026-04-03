/**
 * Storage provider abstraction.
 * Implement this interface to support different storage backends
 * (AWS S3, MinIO, Alibaba Cloud OSS, etc.).
 */
export interface StorageProvider {
  /**
   * Upload a file to the given key.
   * @param key     Object key / path within the bucket
   * @param body    Raw file content
   * @param contentType  MIME type (e.g. "image/jpeg")
   */
  uploadFile(key: string, body: Buffer, contentType: string): Promise<void>;

  /**
   * Delete a file by its object key.
   * Silently succeeds even if the key does not exist.
   */
  deleteFile(key: string): Promise<void>;
}
