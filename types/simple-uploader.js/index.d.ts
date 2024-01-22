/* eslint-disable */

declare module "simple-uploader.js" {
  export = Uploader;
}

interface UploaderOptions {
  target?: string;
  singleFile?: boolean;
  chunkSize?: number;
  forceChunkSize?: boolean;
  simultaneousUploads?: number;
  fileParameterName?: string;
  query?: string;
  headers?: {
    [key: string]: string;
  };
  withCredentials?: boolean;

  testChunks?: boolean;
  method?: string;
  testMethod?: string;
  uploadMethod?: string;
  allowDuplicateUploads?: boolean;
  prioritizeFirstAndLastChunk?: boolean;
  preprocess?: () => boolean;
  initFileFn?: (file: UploadFile) => void;
  generateUniqueIdentifier?: (file: UploadFile) => string;
}

interface UploadFile {
  uploader: Uploader;
  // @ts-ignore
  name: string;
  averageSpeed: number;
  currentSpeed: number;
  paused: boolean;
  error: boolean;
  isFolder: boolean;
  file: File;
  relativePath: string;
  size: number;
  uniqueIdentifier: string;
  webkitRelativePath?: string;
  fileName?: string;
  getRoot: () => UploadFile;
  progress: () => number;
  pause: () => void;
  cancel: () => void;
  retry: () => void;
  bootstrap: () => void;
  isUploading: () => boolean;
  icComplete: () => boolean;
  sizeUploading: () => number;
  timeRemaining: () => number;
  getExtension: () => string;
  getType: () => string;
}

declare class Uploader {
  support: boolean;
  supportDirectory: boolean;
  opt: string;
  files: UploadFile[];
  fileList: UploadFile[];

  public constructor(options: UploaderOptions);

  assignBrowse: (
    domNodes: HTMLElement | HTMLElement[],
    isDirectory: boolean,
    singleFile: boolean,
    attributes?: unknown
  ) => void;

  assignDrop: (domNodes: HTMLElement | HTMLElement[]) => void;

  unAssignDrop: (domNodes: HTMLElement | HTMLElement[]) => void;

  on: (event: string, callback: (...args: any[]) => void) => void;

  off: (event: string, callback?: () => void) => void;
  upload: () => void;
  pause: () => void;
  resume: () => void;
  cancel: () => void;
  progress: () => number;
  isUploading: () => boolean;
  addFile: (file: File) => void;
  removeFile: (file: File) => void;
  getFromUniqueIdentifier(uniqueIdentifier: string): UploadFile;
  getSize: () => number;
  sizeUploaded: () => number;
  timeRemaining: () => number;
  webkitReadDataTransfer: (dataTransfer: DataTransfer) => void;
  addFiles: (fileList: FileList) => void;
}
