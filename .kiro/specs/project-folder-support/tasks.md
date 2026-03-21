# Implementation Plan: Project Folder Support

## Overview

This implementation plan breaks down the project folder support feature into discrete, incremental coding tasks. Each task builds on previous work, with property-based tests validating correctness properties at key points. The implementation follows a bottom-up approach: first enhancing the Virtual File System, then integrating with File Explorer, Photo Viewer, and Notepad.

## Tasks

- [-] 1. Enhance Virtual File System for Project Folders
  - [x] 1.1 Add path normalization for project folder paths
    - Implement `normalizePath()` to handle `/projects/...` paths
    - Support removing trailing slashes and normalizing separators
    - _Requirements: 5.1, 5.2_
  
  - [ ]* 1.2 Write property test for path normalization
    - **Property 12: Path Normalization Idempotence**
    - **Validates: Requirements 5.1**
  
  - [x] 1.3 Add path validation for project folders
    - Implement `isValidPath()` to reject invalid characters and path traversal attempts
    - Support special character handling safely
    - _Requirements: 5.5_
  
  - [ ]* 1.4 Write property test for path validation
    - **Property 15: Special Character Handling**
    - **Validates: Requirements 5.5**
  
  - [x] 1.5 Enhance cache invalidation for nested paths
    - Implement `invalidateCache()` with prefix-based invalidation
    - Support invalidating parent and child paths
    - _Requirements: 5.3, 5.4_
  
  - [ ]* 1.6 Write property tests for caching
    - **Property 13: Cache Hit Performance**
    - **Property 14: Cache Invalidation**
    - **Validates: Requirements 5.3, 5.4, 9.2, 9.4**

- [~] 2. Create Project Adapter Component
  - [x] 2.1 Create project-adapter.ts file
    - Implement `isProjectFolder()` to detect project structure
    - Implement `getProjectMediaFiles()` to filter media by type
    - Implement `getProjectDetails()` to find details.txt
    - _Requirements: 1.1, 4.1, 4.2_
  
  - [ ]* 2.2 Write property tests for project detection
    - **Property 1: Project Folder Detection**
    - **Validates: Requirements 1.1, 1.2**
  
  - [x] 2.3 Implement file type detection for project files
    - Detect `.txt` files as documents
    - Detect image extensions (`.jpg`, `.png`, `.gif`, `.webp`) as images
    - Detect video extensions (`.mp4`, `.webm`) as videos
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [ ]* 2.4 Write property tests for file type detection
    - **Property 7: File Type Detection Consistency**
    - **Property 8: Image File Detection**
    - **Property 9: Video File Detection**
    - **Property 11: Folder Type Consistency**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

- [~] 3. Enhance File Explorer for Project Navigation
  - [x] 3.1 Replace mock data with Virtual File System integration
    - Update File Explorer to call `listFiles()` instead of using hardcoded data
    - Support dynamic folder navigation
    - _Requirements: 1.2, 2.1_
  
  - [ ]* 3.2 Write property test for folder listing
    - **Property 2: Nested Path Support**
    - **Validates: Requirements 1.3, 5.1, 5.2**
  
  - [x] 3.3 Implement breadcrumb trail updates
    - Update breadcrumbs when navigating to new paths
    - Call `getBreadcrumbs()` to generate trail
    - _Requirements: 2.2_
  
  - [ ]* 3.4 Write property test for breadcrumbs
    - **Property 5: Breadcrumb Trail Accuracy**
    - **Validates: Requirements 2.2**
  
  - [x] 3.5 Implement parent directory navigation
    - Enable "up" button to navigate to parent folder
    - Support navigating from nested project folders
    - _Requirements: 2.3_
  
  - [ ]* 3.6 Write property test for parent navigation
    - **Property 6: Parent Directory Navigation**
    - **Validates: Requirements 2.3**
  
  - [x] 3.7 Implement navigation history (back/forward)
    - Track navigation history as user moves between folders
    - Support back and forward buttons
    - _Requirements: 2.4_
  
  - [x] 3.8 Implement mixed content display
    - Display both files and folders in the same view
    - Show appropriate icons for each type
    - _Requirements: 2.5, 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ]* 3.9 Write property test for mixed content
    - **Property 3: Mixed Content Listing**
    - **Validates: Requirements 1.4, 2.5**

- [x] 4. Checkpoint - File Explorer Navigation
  - Ensure all tests pass, ask the user if questions arise.

- [~] 5. Enhance Photo Viewer for Project Media
  - [x] 5.1 Integrate Project Adapter with Photo Viewer
    - Import and use Project Adapter for media detection
    - Call `getProjectMediaFiles()` when in project folders
    - _Requirements: 4.1, 4.2_
  
  - [ ]* 5.2 Write property test for media filtering
    - **Property 10: Media Filtering**
    - **Validates: Requirements 4.3**
  
  - [x] 5.3 Implement media file filtering
    - Filter images from images/ subfolder
    - Filter videos from videos/ subfolder
    - _Requirements: 4.1, 4.2, 4.3_
  
  - [x] 5.4 Maintain folder context during navigation
    - Track current folder path when navigating between media files
    - Preserve path context for file operations
    - _Requirements: 4.5_
  
  - [ ]* 5.5 Write property test for folder context
    - **Property 4: Path Hierarchy Preservation**
    - **Validates: Requirements 1.5, 2.1**

- [~] 6. Enhance Notepad for Project Text Files
  - [x] 6.1 Add file path parameter support
    - Accept file path when opening from File Explorer
    - Read file contents from provided path
    - _Requirements: 3.1, 3.2_
  
  - [x] 6.2 Implement text file reading
    - Read details.txt and other text files from project folders
    - Display file contents correctly
    - _Requirements: 3.2_

- [~] 7. Implement File Type Detection
  - [x] 7.1 Enhance file type detection in Virtual File System
    - Update `detectFileType()` to recognize project file types
    - Support all required extensions
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ]* 7.2 Write property test for metadata completeness
    - **Property 20: Metadata Completeness**
    - **Validates: Requirements 3.4**

- [~] 8. Implement Error Handling
  - [x] 8.1 Add error handling for invalid paths
    - Return appropriate error codes for different failure scenarios
    - Provide descriptive error messages
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  
  - [ ]* 8.2 Write property test for error objects
    - **Property 16: Error Object Structure**
    - **Validates: Requirements 8.4**

- [~] 9. Verify Component Integration
  - [x] 9.1 Test File Explorer and Photo Viewer path consistency
    - Verify both components can access the same project paths
    - Test navigation between components
    - _Requirements: 7.1_
  
  - [ ]* 9.2 Write property test for component integration
    - **Property 19: Component Path Consistency**
    - **Validates: Requirements 7.1**
  
  - [x] 9.3 Test Notepad file opening from File Explorer
    - Verify text files open correctly in Notepad
    - Test file path passing between components
    - _Requirements: 3.1, 3.2_

- [~] 10. Verify Backward Compatibility
  - [x] 10.1 Test non-project folder navigation
    - Verify File Explorer works with non-project folders
    - Test existing folder structures
    - _Requirements: 10.1, 10.2_
  
  - [ ]* 10.2 Write property test for backward compatibility
    - **Property 17: Backward Compatibility - Non-Project Paths**
    - **Property 18: Backward Compatibility - File Types**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5**
  
  - [x] 10.3 Test Photo Viewer with non-project folders
    - Verify Photo Viewer displays media from non-project locations
    - Test existing Photo Viewer functionality
    - _Requirements: 10.3_
  
  - [x] 10.4 Test Notepad with non-project files
    - Verify Notepad opens files from non-project locations
    - Test existing Notepad functionality
    - _Requirements: 10.4_

- [x] 11. Final Checkpoint - All Tests Pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- All property tests should run minimum 100 iterations
