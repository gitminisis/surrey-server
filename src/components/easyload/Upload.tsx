import React, { ReactElement, useEffect, useRef, useState } from "react";
import { FilePondInitialFile } from "filepond";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { DeleteAsset, UploadAssetChunk } from "@/lib/upload";
import { CommitAssetUpload } from "../../lib/upload";
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

interface FilesUploaderProps {
  visible?: boolean | undefined;
  preview?: boolean | undefined;
  instantUpload?: boolean | undefined;
  chunkMaxBytes?: number | undefined;
  maxFiles?: number | undefined;
}

const Upload = ({
  preview,
  instantUpload = false,
  chunkMaxBytes = 512 * 1024,
  maxFiles = 10,
  visible = true,
}: FilesUploaderProps): ReactElement => {
  const [files, setFiles] = useState<
    Array<FilePondInitialFile | Blob | string>
  >([]);

  const filePondRef = useRef<FilePond>(null);

  const sliceChunks = (
    file: Blob & { readonly lastModified: number; readonly name: string },
    chunkSize: number
  ) => {
    let startPointer = 0;
    const endPointer = file.size;
    const chunks = new Array<Blob>();
    while (startPointer < endPointer) {
      const newStartPointer = startPointer + chunkSize;
      chunks.push(file.slice(startPointer, newStartPointer));
      startPointer = newStartPointer;
    }
    return chunks;
  };

  return (
    <div>
      <FilePond
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
        name="EasyLoadUploader"
        server={{
          revert: async (uniqueFieldId, load, error) => {
            const deleteResult = await DeleteAsset(uniqueFieldId);
            if (deleteResult.success) load();
            else
              error(
                deleteResult.message ||
                  `Error reverting file id ${uniqueFieldId}`
              );
          },
          process: async (
            fieldName,
            file,
            metadata,
            load,
            error,
            progress,
            abort,
            transfer,
            options
          ) => {
            const controller = new AbortController();

            const chunks = sliceChunks(file, options.chunkSize);
            const blockIds = new Array<string>();
            console.log(chunks);
            // for (let index = 0; index < chunks.length; index++) {
            //   const fileChunk = chunks[index];
            //   const uploadResult = await UploadAssetChunk(
            //     fileChunk,
            //     index + 1,
            //     metadata.fileId,
            //     file.name,
            //     index * options.chunkSize,
            //     file.size,
            //     progress,
            //     controller
            //   );
            //   if (!uploadResult.success) {
            //     error(
            //       uploadResult.message ||
            //         `Error uploading chunk ${index + 1} of ${file.name}`
            //     );
            //   } else {
            //     const blockId = uploadResult.data as string;
            //     blockIds.push(blockId);
            //     transfer(blockId);
            //   }
            // }

            // if (blockIds.length === chunks.length) {
            //   const commitResult = await CommitAssetUpload(
            //     metadata.fileId,
            //     file.name,
            //     file.type,
            //     blockIds
            //   );
            //   if (commitResult.success) load(commitResult.data as string);
            //   else
            //     error(
            //       commitResult.message ||
            //         `Error commiting upload of ${file.name}`
            //     );
            // }

            // return {
            //   options,
            //   abort: () => {
            //     controller.abort();
            //     abort();
            //   },
            // };
          },
        }}
        ref={filePondRef}
        allowReorder={true}
        allowImagePreview={preview}
        maxFiles={maxFiles}
        maxParallelUploads={5}
        chunkUploads
        chunkForce
        chunkSize={chunkMaxBytes}
        instantUpload={instantUpload}
        allowMultiple
        forceRevert
        files={files}
        onaddfile={(error, file) => {
          if (error) return;
          const metadata = file.getMetadata();
          if (!metadata.fileId) {
            file.setMetadata("fileId", crypto.randomUUID());
          }
        }}
        onupdatefiles={(items) => setFiles(items.map((f) => f.file))}
        // onremovefile={(_, file) => dispatch(removeMediaFileById(file.id))}
      />
    </div>
  );
};

export default Upload;
