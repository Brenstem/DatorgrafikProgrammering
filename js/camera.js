/*

 createCamera(): Initierar kameran

 rotateCameraX(): Roterar kameran kring x-axeln
 rotateCameraY(): Roterar kameran kring y-axeln
 rotateCameraZ(): Roterar kameran kring z-axeln

 translateCameraX(): Translerar kameran utmed x-axeln
 translateCameraY(): Translerar kameran utmed y-axeln
 translateCameraZ(): Translerar kameran utmed z-axeln

 updateCamera(): Beräknar transformationsmatrisen för kameran

*/



function createCamera(positionX, positionY, positionZ)
{
	var camera = {};

	camera.matrix = mat4.create();

	camera.position = vec3.fromValues(positionX, positionY, positionZ);

	camera.right = vec3.fromValues(1, 0, 0);
	camera.up = vec3.fromValues(0, 1, 0);
	camera.forward = vec3.fromValues(0, 0, 1);
	camera.upReference = vec3.fromValues(0, 1, 0);

	camera.temporaryVector = vec3.create();
	camera.temporaryQuat = quat.create();

	return camera;
}



function translateCameraX(camera, amount, viewRelative)
{
	if (viewRelative)
	{
		vec3.scaleAndAdd(camera.position, camera.position, camera.right, -amount);
	}
	else
	{
		vec3.set(camera.temporaryVector, amount, 0, 0);
		vec3.add(camera.position, camera.position, camera.temporaryVector);
	}
}



function translateCameraY(camera, amount, viewRelative)
{
	if (viewRelative)
	{
		vec3.scaleAndAdd(camera.position, camera.position, camera.up, amount);
	}
	else
	{
		vec3.set(camera.temporaryVector, 0, amount, 0);
		vec3.add(camera.position, camera.position, camera.temporaryVector);
	}
}



function translateCameraZ(camera, amount, viewRelative)
{
	if (viewRelative)
	{
		vec3.scaleAndAdd(camera.position, camera.position, camera.forward, amount);
	}
	else
	{
		vec3.set(camera.temporaryVector, 0, 0, amount);
		vec3.add(camera.position, camera.position, camera.temporaryVector);
	}
}



function rotateCameraX(camera, angle)
{
	quat.setAxisAngle(camera.temporaryQuat, camera.right, -angle);
	vec3.transformQuat(camera.forward, camera.forward, camera.temporaryQuat);
}



function rotateCameraY(camera, angle)
{
	quat.setAxisAngle(camera.temporaryQuat, camera.up, -angle);
	vec3.transformQuat(camera.forward, camera.forward, camera.temporaryQuat);
}



function rotateCameraZ(camera, angle)
{
	quat.setAxisAngle(camera.temporaryQuat, camera.forward, angle);
	vec3.transformQuat(camera.up, camera.up, camera.temporaryQuat);
}



function updateCamera(camera)
{
	vec3.cross(camera.right, camera.forward, camera.upReference);
	vec3.normalize(camera.right, camera.right);

	mat4.identity(camera.matrix);
	vec3.set(camera.temporaryVector, 0, 0, 0);
	mat4.lookAt(camera.matrix, camera.temporaryVector, camera.forward, camera.up);

	vec3.negate(camera.temporaryVector, camera.position);
	mat4.translate(camera.matrix, camera.matrix, camera.temporaryVector);
}
