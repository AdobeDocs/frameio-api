# Frame.io v4 Developer API Changelog

## September 22, 2025

### Added:

- Added PATCH Reorder version stacks endpoint in experimental
- Added POST Import file from external storage endpoint in experimental
    
## September 15, 2025

### Added:

- Added GET list files to stable
- Added GET show file with metadata to stable
- Added GET show file upload status to stable
- Added POST copy file to stable
- PATCH move file to stable
- Added PATCH update file to stable
- Added POST create version stack to stable
- Added POST copy version stack to stable
- Added PATCH move version stack to stable
- Added GET list version stack children to stable
- Added GET list version stacks to stable

### Changed:

- Removed GET show file with metadata in experimental, see stable API 
- Removed GET show file upload status to stable in experimental, see stable API 
- Removed POST copy file, PATCH move file in experimental, see stable API 
- Removed PATCH update file in experimental, see stable API 
- Removed POST create version stack in experimental, see stable API 
- Removed POST copy version stack in experimental, see stable API 
- Removed PATCH move version stack in experimental, see stable API 
- Removed GET list version stack children in experimental, see stable API 
- Removed GET list version stacks in experimental, see stable API 
    
## September 8, 2025

### Changed:

- Removed POST Add reviewers to secure share, see stable API 
- Removed DELETE Delete share, see stable API 
- Removed GET Show share, see stable API 
- Removed GET List share reviewers (restricted only), see stable API 
- Removed DELETE Remove reviewers from share, see stable API 
    
## September 2, 2025

### Added:

- Added GET audit log endpoint to collection in experimental 

    
## August 25, 2025

### Added:

- Added GET List version stacks in experimental 
- Added GET List version stacks with media links in experimental 
- Added GET List version stacks with metadata in experimental 

### Changed:

- Removed GET List user roles for account in experimental , see stable API 
- Removed GET List user roles for workspace in experimental , see stable API 
- Removed PATCH Update user role in a workspace in experimental , see stable API 
- Removed DELETE Delete user from a workspace in experimental , see stable API 
- Removed GET List user roles for project in experimental , see stable API 
- Removed PATCH Update user role in a Project in experimental , see stable API 
- Removed DELETE Delete user from a project in experimental , see stable API 
- Modified POST Copy version stack to use `version_stack_id` value in experimental , see stable API 

## August 20, 2025

### Changed:

- Modified request bodies to standardize placeholder example and comments

## August 11, 2025

### Added:

- Added GET list version stack children in experimental 
- Added GET list version stack children with media links in experimental 
- Added GET list version stack children with metadata in experimental 

### Changed:

- Removed webhooks in experimental, see stable API 
 
    
## August 5, 2025
### Added:

- Added PATCH metadata field definitions in experimental 

    
## July 28, 2025
 
### Changed:

- Modified request bodies to standardize placeholder example and comments
    
## July 21, 2025

### Added:

- Added PATCH files move file in experimental 
- Added POST files copy file in experimental 
- Added PATCH folders move folder in experimental 
- Added POST folders copy folder in experimental 
- Added PATCH version stacks move version stack in experimental 
- Added POST version stacks copy version stack in experimental 

### Changed:
- Moved from calling our experimental version of the API from `Alpha` to `experimental`

## July 14, 2025

### Added:

- Added DELETE Field Definitions move file in alpha 

### Changed:

- Moved Create account level field definitions in alpha 
- Moved List account field definitions in alpha 
    
## June 23, 2025

### Added:

- Added GET files show file upload status in alpha 
- Added GET metadata List account field definitions in alpha 

    
## June 16, 2025

### Added:

- Added POST metadata Create account level field definitions

    
## June 9, 2025

### Added:

- Added webhooks APIs to stable
- Added all the user management APIs to stable
- Added all the shares APIs from alpha to stable
- Added POST create file (remote upload) to stable
- Added POST create file (local upload) to stable
- Added GET show file with media links to stable

### Changed:

- Removed webhooks APIs in experimental , see stable API 
- Removed all the user management APIs in experimental , see stable API 
- Removed all the shares APIs from alpha in experimental , see stable API 
- Removed POST create file (remote upload) in experimental , see stable API 
- Removed POST create file (local upload) in experimental , see stable API 
- Removed GET show file with media links in experimental , see stable API 
    
## May 28, 2025

 
### Fixed:

- Fixes 'Worspace Management" to "Workspace Management"


## May 27, 2025

### Added:

- Added POST create file (local upload) in alpha
 
    
## May 19, 2025

### Added:

- Added POST files create file (remote upload) in alpha
- Added GET files show file with metadata in alpha
- Added GET file show file with metadata links in alpha

### Changed:

- Modified GET show file with media links expanded to include 'high_quality' and 'efficient'

 
    
## May 12, 2025

### Added:

- Added GET shares show share in alpha
- Added DELETE Custom Actions delete action in alpha
- Added GET Custom Actions get action in alpha
- Added GET Custom Actions list action in alpha
- Added PATCH Custom Actions update action in alpha