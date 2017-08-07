**Overview:** Controllers that handle all custom icon actions – displays and uploads.



**Author:** Martin Vach




* * *

# Global





* * *

## LocalIconController
The controller that renders and upload icons.

### LocalIconController.allSettled() 

Load all promises

**Returns**: `undefined`

### LocalIconController.setFilter(val) 

Set a filter

**Parameters**

**val**: `string`

**Returns**: `undefined`

### LocalIconController.checkUploadedFile(files, info) 

Check and validate an uploaded file

**Parameters**

**files**: `object`

**info**: `object`

**Returns**: `undefined`

### LocalIconController.toggleAll(status) 

Check all icons

**Parameters**

**status**: `boolean`

**Returns**: `undefined`

### LocalIconController.deleteIcon(icon, message) 

Delete an icon from the storage

**Parameters**

**icon**: `object`

**message**: `string`

**Returns**: `undefined`

### LocalIconController.deleteChecked(message) 

Delete all checked icons from the storage

**Parameters**

**message**: `string`

**Returns**: `undefined`

### LocalIconController.uploadFile(files) 

Upload a file

**Parameters**

**files**: `object`

**Returns**: `undefined`

### LocalIconController.setIcons(icons) 

Set list with uploaded icons

**Parameters**

**icons**: `object`

**Returns**: `undefined`

### LocalIconController.iconUsedInDevice(devices) 

Build an object with icons that are used in devices

**Parameters**

**devices**: `object`

**Returns**: `object`


## OnlineIconController
The controller that renders and download icons from the app store.

### OnlineIconController.loadOnlineIcons() 

Load on-line icons

**Returns**: `undefined`

### OnlineIconController.allSettled() 

Load all promises

**Returns**: `undefined`

### OnlineIconController.handleOnlineIconModal() 

Open a modal window and load icon previews

**Returns**: `undefined`

### OnlineIconController.downloadIconSet(icon) 

Download an icon set

**Parameters**

**icon**: `object`

**Returns**: `undefined`

### OnlineIconController.setOnlineIcons(response) 

Set online icons $scope

**Parameters**

**response**: `object`

**Returns**: `undefined`

### OnlineIconController.setLocalIcons(response) 

Set online icons $scope

**Parameters**

**response**: `object`

**Returns**: `undefined`

### OnlineIconController.getSource(source) 

Get source/name from source

**Parameters**

**source**: `object`

**Returns**: `undefined`

### OnlineIconController.getId(source) 

Get id from source

**Parameters**

**source**: `object`

**Returns**: `undefined`



* * *
