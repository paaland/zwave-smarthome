**Overview:** Controllers that manage Z-Wave devices.



**Author:** Martin Vach




* * *

# Global





* * *

## ZwaveManageController
The controller that renders and handles data in the Z-Wave/Manage section.

### ZwaveManageController.allSettled() 

Load all promises


### ZwaveManageController.runZwaveCmd() 

Run zwave CMD


### ZwaveManageController.setZwaveApiData(elements) 

Set zwave devices

**Parameters**

**elements**: `array`

**Returns**: `undefined`

### ZwaveManageController.setElements(elements) 

Set elements created by zWave device

**Parameters**

**elements**: `array`

**Returns**: `undefined`

### ZwaveManageController.getInstances() 

Get selected instances status



## ZwaveInterviewController
The controller that handles interview process in the Z-Wave/Network section.

### ZwaveInterviewController.startConfiguration() 

Start configuration


### ZwaveInterviewController.cancelConfiguration() 

Cancel configuration


### ZwaveInterviewController.forceInterview() 

Force interview


### ZwaveInterviewController.resetConfiguration() 

Reset configuration


### ZwaveInterviewController.checkInterview() 

Check interview


### ZwaveInterviewController.setSecureInclusion() 

Set secure inclusion



## ZwaveInterviewController
The controller that handles Z-Wave exclusion process.

### ZwaveInterviewController.loadZwaveApiData() 

Load z-wave devices


### ZwaveInterviewController.refreshZwaveApiData() 

Refresh z-wave devices


### ZwaveInterviewController.runZwaveCmd() 

Run ExpertUI command


### ZwaveInterviewController.removeFailedNode() 

Run ExpertUI command - remove failed node



## ZwaveManageIdController
The controller that renders and handles configuration data for a single Z-Wave device.

### ZwaveManageIdController.allSettled() 

Load all promises


### ZwaveManageIdController.addRoom() 

Add room


### ZwaveManageIdController.updateAllDevices() 

Update all devices


### ZwaveManageIdController.zwaveConfigApiData() 

Get zwaveApiData




* * *
