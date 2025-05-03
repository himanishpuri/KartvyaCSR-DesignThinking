document.addEventListener('DOMContentLoaded', function() {
    // File Upload Handling
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const uploadList = document.getElementById('uploadList');
    const browseFiles = document.getElementById('browseFiles');
    const startUpload = document.getElementById('startUpload');

    // Drag and Drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    // Browse Files
    browseFiles.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // Handle Selected Files
    function handleFiles(files) {
        Array.from(files).forEach(file => {
            addFileToUploadList(file);
        });
        startUpload.disabled = false;
    }

    function addFileToUploadList(file) {
        const item = document.createElement('div');
        item.className = 'upload-item';
        item.innerHTML = `
            <div class="file-icon ${getFileIconClass(file.type)}">
                <i class="fas ${getFileIcon(file.type)}"></i>
            </div>
            <div class="upload-item-info">
                <div class="fw-medium">${file.name}</div>
                <small class="text-muted">${formatFileSize(file.size)}</small>
            </div>
            <div class="upload-item-progress">
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: 0%"></div>
                </div>
            </div>
            <button class="btn btn-sm btn-outline-danger remove-file">
                <i class="fas fa-times"></i>
            </button>
        `;

        uploadList.appendChild(item);

        // Remove file handler
        item.querySelector('.remove-file').addEventListener('click', () => {
            item.remove();
            if (uploadList.children.length === 0) {
                startUpload.disabled = true;
            }
        });
    }

    // Start Upload
    startUpload.addEventListener('click', async () => {
        const uploadItems = uploadList.children;
        if (uploadItems.length === 0) return;

        startUpload.disabled = true;
        
        for (let item of uploadItems) {
            const progressBar = item.querySelector('.progress-bar');
            
            try {
                // Simulate upload progress
                await simulateFileUpload(progressBar);
                
                // Show success state
                item.querySelector('.upload-item-progress').innerHTML = `
                    <span class="text-success">
                        <i class="fas fa-check"></i> Complete
                    </span>
                `;
            } catch (error) {
                // Show error state
                item.querySelector('.upload-item-progress').innerHTML = `
                    <span class="text-danger">
                        <i class="fas fa-exclamation-circle"></i> Failed
                    </span>
                `;
            }
        }

        // Show completion message
        Swal.fire({
            icon: 'success',
            title: 'Upload Complete',
            text: 'All files have been uploaded successfully!',
            confirmButtonColor: '#2b6cb0'
        }).then(() => {
            // Clear upload list
            uploadList.innerHTML = '';
            const modal = bootstrap.Modal.getInstance(document.getElementById('uploadFileModal'));
            modal.hide();
        });
    });

    // Folder Actions
    document.querySelectorAll('.folder-card').forEach(folder => {
        folder.addEventListener('click', function(e) {
            if (!e.target.closest('.folder-actions')) {
                // Navigate to folder
                const folderName = this.querySelector('h6').textContent;
                navigateToFolder(folderName);
            }
        });
    });

    // File Actions
    document.querySelectorAll('.document-table .btn-group .btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.querySelector('i').className;
            const fileName = this.closest('tr').querySelector('.file-info span').textContent;

            if (action.includes('download')) {
                downloadFile(fileName);
            } else if (action.includes('share')) {
                shareFile(fileName);
            } else if (action.includes('trash')) {
                deleteFile(fileName);
            }
        });
    });

    // Utility Functions
    function getFileIconClass(type) {
        if (type.includes('pdf')) return 'file-pdf';
        if (type.includes('word') || type.includes('doc')) return 'file-doc';
        if (type.includes('image')) return 'file-image';
        return 'file-default';
    }

    function getFileIcon(type) {
        if (type.includes('pdf')) return 'fa-file-pdf';
        if (type.includes('word') || type.includes('doc')) return 'fa-file-word';
        if (type.includes('image')) return 'fa-file-image';
        return 'fa-file';
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async function simulateFileUpload(progressBar) {
        return new Promise((resolve) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 30;
                if (progress > 100) progress = 100;
                progressBar.style.width = progress + '%';
                if (progress === 100) {
                    clearInterval(interval);
                    resolve();
                }
            }, 500);
        });
    }

    function navigateToFolder(folderName) {
        // Implement folder navigation
        console.log(`Navigating to folder: ${folderName}`);
    }

    function downloadFile(fileName) {
        // Implement file download
        console.log(`Downloading file: ${fileName}`);
    }

    function shareFile(fileName) {
        // Implement file sharing
        Swal.fire({
            title: 'Share File',
            html: `
                <div class="mb-3">
                    <label class="form-label">Share with (email addresses)</label>
                    <input type="text" class="form-control" id="shareEmails" placeholder="Enter email addresses">
                </div>
                <div class="mb-3">
                    <label class="form-label">Permission</label>
                    <select class="form-select" id="sharePermission">
                        <option value="view">View only</option>
                        <option value="edit">Can edit</option>
                    </select>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Share',
            confirmButtonColor: '#2b6cb0'
        });
    }

    function deleteFile(fileName) {
        Swal.fire({
            title: 'Delete File?',
            text: `Are you sure you want to delete "${fileName}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                // Implement file deletion
                Swal.fire(
                    'Deleted!',
                    'The file has been deleted.',
                    'success'
                );
            }
        });
    }
});