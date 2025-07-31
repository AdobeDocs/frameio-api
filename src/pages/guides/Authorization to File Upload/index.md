# How to: Upload

This guide details the full flow to upload files using the Frame.io V4 API.  

## Prerequisites

1. You have a Frame.io V4 account administered via the [Adobe Admin Console](https://adminconsole.adobe.com/), OR you have [switched to Adobe authentication](https://help.frame.io/en/articles/11758018-connecting-to-adobe-authentication) for your account user
2. You have logged into the [Adobe Developer Console](https://developer.adobe.com/console) and have added the Frame.io API to a new or existing project
3. You have generated the [appropriate Authentication credentials](https://developer.adobe.com/frameio/guides/Authentication/) for your project
4. You have succfully used those credentials to generate an access token

## Choosing your upload method

There are two ways to upload a file using the Frame.io API: `Create File (local upload)` and `Create File (remote upload)`. The local endpoint would be used when the media is locally accessible to your application, similar to dragging a file from your desktop; the remote upload option would be used when the media is accessed over the network, such as through an intergration with another service. In this guide we'll start with the simpler case of completing a remote upload.

## Remote Upload

To create a file through remote upload, select the **Create File (remote upload)** endpoint. The request body requires the file name and its source url.

```json
{ 
    "data": {
        "name": "my_file.jpg",
        "source_url": "https://upload.wikimedia.org/wikipedia/commons/e/e1/White_Pixel_1x1.jpg"
    }
}
```

```json
{
    "data": {
        "id": "93e4079d-0a8a-4bf3-96cd-e6a03c465e5e",
        "name": "my_file.jpg",
        "status": "created",
        "type": "file",
        "file_size": 518,
        "updated_at": "2025-06-26T20:14:33.796116Z",
        "media_type": "image/jpeg",
        "parent_id": "2e426fe0-f965-4594-8b2b-b4dff1dc00ec",
        "project_id": "7e46e495-4444-4555-8649-bee4d391a997",
        "created_at": "2025-06-26T20:14:33.159489Z",
        "view_url": "https://next.frame.io/project/7e46e495-4444-4555-8649-bee4d391a997/view/93e4079d-0a8a-4bf3-96cd-e6a03c465e5e"
    },
    "links": {
        "status": "/v4/accounts/6f70f1bd-7e89-4a7e-b4d3-7e576585a181/files/93e4079d-0a8a-4bf3-96cd-e6a03c465e5e/status"
    }
}
```

## Local Upload

To create a file through local upload, select the **Create File (local upload)** endpoint. The request body requires the file name and its file size.

```json
{ 
"data": {
    "name": "my_file.jpg",
    "file_size": 50645
  }
}
```

If the request is successful, a placeholder file resource is created without any content. Depending on the file size, the response body will include one or more `upload_urls`. Given this example, we will need to manage this upload in multiple parts. See [Multi-part Upload](#multi-part-upload) for next steps.

``` json
{
    "data": {
        "id": "fa18ba7b-b3ee-4dd6-9b31-bd07e554241d",
        "name": "my_file.jpg",
        "status": "created",
        "type": "file",
        "file_size": 50645990,
        "updated_at": "2025-06-26T20:08:06.823170Z",
        "media_type": "image/jpeg",
        "parent_id": "2e426fe0-f965-4594-8b2b-b4dff1dc00ec",
        "project_id": "7e46e495-4444-4555-8649-bee4d391a997",
        "created_at": "2025-06-26T20:08:06.751313Z",
        "upload_urls": [
            {
                "size": 16881997,
                "url": "https://frameio-uploads-development.s3-accelerate.amazonaws.com/parts/fa18ba7b-b3ee-4dd6-9b31-bd07e554241d/part_1?..."
            },
            {
                "size": 16881997,
                "url": "https://frameio-uploads-development.s3-accelerate.amazonaws.com/parts/fa18ba7b-b3ee-4dd6-9b31-bd07e554241d/part_2?..."
            },
            {
                "size": 16881996,
                "url": "https://frameio-uploads-development.s3-accelerate.amazonaws.com/parts/fa18ba7b-b3ee-4dd6-9b31-bd07e554241d/part_3?..."
            },

        ],
        "view_url": "https://next.frame.io/project/7e46e495-4444-4555-8649-bee4d391a997/view/fa18ba7b-b3ee-4dd6-9b31-bd07e554241d"
    }
}
```

**NOTE:** These are important details to keep in mind when sending the subsequent upload request(s).

> * The HTTP request method must be `PUT`.
> * The `x-amz-acl` header must be included and be set to private.
> * The `Content-Type` header must match the `media_type` specified in the original **Create File (local upload)** request. This is true even when uploading the file as separate parts.


**Multi-part Uploads**

When a given file results in more than one upload url, it may be useful to compose a shell script that splits up the source file into chunks and issues the same number of subsequent requests.


In the sample Python script below, we're passing in one upload url in the `upload_urls` parameter, though as noted above, you may have more than one provided to you based on the file size set in the request body for **Create File (local upload).**

``` python
import requests
import math
from typing import List
from tqdm import tqdm  # For progress bar

def upload_file_in_chunks(file_path: str, upload_urls: list[str], content_type: str | None = None, chunk_size: int | None = None) -> bool:
    """
    Upload a file in chunks using presigned URLs.
    """
    try:
        # Auto-detect content type based on file extension
        if content_type is None:
            detected_content_type, _ = mimetypes.guess_type(file_path)
            content_type = detected_content_type # Default fallback
        
        print(f"Detected content type: {content_type}")
        
        # Get file size
        with open(file_path, 'rb') as f:
            f.seek(0, 2)  # Seek to end of file
            file_size = f.tell()
        
        # Calculate chunk size if not provided
        if chunk_size is None:
            chunk_size = math.ceil(file_size / len(upload_urls))
        
        print(f"File size: {file_size} bytes")
        print(f"Chunk size: {chunk_size} bytes")
        print(f"Number of chunks: {len(upload_urls)}")
        
        # Upload each chunk
        with open(file_path, 'rb') as f:
            with tqdm(total=len(upload_urls), desc="Uploading chunks") as pbar:
                for i, url in enumerate(upload_urls):
                    start_byte = i * chunk_size
                    end_byte = min(start_byte + chunk_size, file_size)
                    
                    # Read chunk from file
                    f.seek(start_byte)
                    chunk = f.read(end_byte - start_byte)
                    
                    print(f"Uploading chunk {i+1}: {len(chunk)} bytes")
                    
                    # Upload chunk with minimal headers matching the signature
                    response = requests.put(
                        url,
                        data=chunk,
                        headers={
                            'content-type': content_type,  
                            'x-amz-acl': 'private'       
                        }
                    )
                    
                    if response.status_code != 200:
                        print(f"Failed to upload chunk {i+1}. Status code: {response.status_code}")
                        print(f"Response text: {response.text}")
                        print(f"Response headers: {dict(response.headers)}")
                        return False
                    else:
                        print(f"Chunk {i+1} uploaded successfully!")
                    
                    pbar.update(1)
        
        return True
    
    except Exception as e:
        print(f"Error during upload: {str(e)}")
        return False

# Example usage
if __name__ == "__main__":
    # Replace these with your actual values
    file_path =  "/Users/MyComputer/local_upload/sample.jpg"  # Path to your file
    upload_urls = ["https://frameio-uploads-development.s3-accelerate.amazonaws.com/parts/fa18ba7b-b3ee-4dd6-9b31-bd07e554241d/part_1?...", "https://frameio-uploads-development.s3-accelerate.amazonaws.com/parts/fa18ba7b-b3ee-4dd6-9b31-bd07e554241d/part_2?...", "https://frameio-uploads-development.s3-accelerate.amazonaws.com/parts/fa18ba7b-b3ee-4dd6-9b31-bd07e554241d/part_3?..."]
    # Optional: specify chunk size in bytes (e.g., 10MB = 10 * 1024 * 1024)
    content_type = "image/jpeg"
    chunk_size = 10 * 1024 * 1024  # 10MB
    
    print("Starting file upload...")
    success = upload_file_in_chunks(file_path, upload_urls, content_type, chunk_size)
    
    if success:
        print("File upload completed successfully!")
    else:
        print("File upload failed!")
```
