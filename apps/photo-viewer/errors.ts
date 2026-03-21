/**
 * Error types and utilities for the Photo Viewer application
 * Handles file access errors, permission errors, and corrupted files
 * Validates: Error Handling section
 */

/**
 * Base error class for Photo Viewer errors
 */
export class PhotoViewerError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: Error,
  ) {
    super(message)
    this.name = 'PhotoViewerError'
  }
}

/**
 * Error thrown when a file cannot be found
 */
export class FileNotFoundError extends PhotoViewerError {
  constructor(filePath: string, originalError?: Error) {
    super(`File not found: ${filePath}`, 'FILE_NOT_FOUND', originalError)
    this.name = 'FileNotFoundError'
  }
}

/**
 * Error thrown when a file cannot be accessed due to permissions
 */
export class PermissionDeniedError extends PhotoViewerError {
  constructor(filePath: string, originalError?: Error) {
    super(`Permission denied: ${filePath}`, 'PERMISSION_DENIED', originalError)
    this.name = 'PermissionDeniedError'
  }
}

/**
 * Error thrown when a file is corrupted or cannot be parsed
 */
export class CorruptedFileError extends PhotoViewerError {
  constructor(filePath: string, reason?: string, originalError?: Error) {
    const message = reason
      ? `Corrupted file: ${filePath} (${reason})`
      : `Corrupted file: ${filePath}`
    super(message, 'CORRUPTED_FILE', originalError)
    this.name = 'CorruptedFileError'
  }
}

/**
 * Error thrown when a folder cannot be accessed
 */
export class FolderAccessError extends PhotoViewerError {
  constructor(folderPath: string, originalError?: Error) {
    super(`Unable to access folder: ${folderPath}`, 'FOLDER_ACCESS_ERROR', originalError)
    this.name = 'FolderAccessError'
  }
}

/**
 * Error thrown when an unsupported file format is encountered
 */
export class UnsupportedFormatError extends PhotoViewerError {
  constructor(filePath: string, format: string, originalError?: Error) {
    super(`Unsupported format: ${format} (${filePath})`, 'UNSUPPORTED_FORMAT', originalError)
    this.name = 'UnsupportedFormatError'
  }
}

/**
 * Categorizes an error and returns a user-friendly message
 * @param error - The error to categorize
 * @returns User-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof FileNotFoundError) {
    return `The file could not be found. It may have been moved or deleted.`
  }

  if (error instanceof PermissionDeniedError) {
    return `You don't have permission to access this file.`
  }

  if (error instanceof CorruptedFileError) {
    return `The file appears to be corrupted and cannot be opened.`
  }

  if (error instanceof FolderAccessError) {
    return `The folder could not be accessed. Please check the path and try again.`
  }

  if (error instanceof UnsupportedFormatError) {
    return `This file format is not supported.`
  }

  if (error instanceof PhotoViewerError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unknown error occurred.'
}

/**
 * Determines if an error is recoverable (user can continue using the app)
 * @param error - The error to check
 * @returns true if the error is recoverable, false otherwise
 */
export function isRecoverableError(error: unknown): boolean {
  return (
    error instanceof FileNotFoundError ||
    error instanceof PermissionDeniedError ||
    error instanceof CorruptedFileError ||
    error instanceof UnsupportedFormatError
  )
}
