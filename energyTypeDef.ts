
// Created samuel girardin @samuelgirardin - 2018
// License Creative Commons Attribution-NonCommercial-ShareAlike 4.0 Unported License.


// Emscripten part

declare var Runtime: {

    dynCall: (t: string, pointer: number, arg: any[]) => any;

}

declare var Module: {
    cwrap: (name: string, returnType: string, params: string[]) => any;
    setValue: (ptr: number, value: number, type: string) => void;
    getValue: (ptr: number, typeArray: string) => number;
    HEAP8: any;
    HEAP16: any;
    HEAP32: any;
    HEAPF32: any;
    HEAPF64: any;
    HEAPU8: any;
    HEAPU16: any;
    HEAPU32: any;
    _run: any;
    _dWorldQuickStep: any;
    _dWorldStep: any;
    _dJointGroupEmpty: any;
    _dGeomSetPosition: Function;
    _dGeomSetQuaternion: any;
    _dBodySetQuaternion: any;
    _dBodySetPosition: any;
    _dBodyDestroy; any;
    _dGeomDestroy: any;
    _pdBodyIsEnabled: any;
    _dHashSpaceSetLevels: any;
    _dJointGroupDestroy: any;
    _dSpaceDestroy: any;
    _dWorldDestroy: any;
    onRuntimeInitialized: any;
    _onRuntimeInitialized : any ;


}



declare var _malloc: (number: any) => number;
declare var _free: (number: any) => void;


// Alias for pointer
type DxSpace = number;
type DxWorld = number;
type DxBody = number;
type DxGeom = number;
type DxJoint = number;
type DxJointGroup = number;
type DxJointType = number;
type DxContactGroup = number;
type DxTriMeshData = number;
type DxHeightfieldData = number;
type DxMaterial = number;

type DMass = number;
type DMatrix3x3 = number;
type DJointFeedback = number;
type Pointer = number;
type Vector4_Ptr = number;
type Vector3_Ptr = number;

/* Parameters for limits and motors */
const dParamLoStop = 0;
const dParamHiStop = 1;
const dParamVel = 2;
const dParamLoVel = 3;
const dParamHiVel = 4;
const dParamFMax = 5;
const dParamFudgeFactor = 6;
const dParamBounce = 7;
const dParamCFM = 8;
const dParamStopERP = 9;
const dParamStopCFM = 10;

/* parameters for suspension */
const dParamSuspensionERP = 11;
const dParamSuspensionCFM = 12;
const dParamERP = 13;

const dParamFMax2 = 261;
const dParamVel2 = 258;
//  joint transmission  param 
const dTransmissionParallelAxes = 0;
const dTransmissionIntersectingAxes = 1;
const dTransmissionChainDrive = 2;


// 'contact'  parameter need for callback on the 'c++' side

const dContactMu2 = 0x001;      /**< Use axis dependent friction */
const dContactAxisDep = 0x001;      /**< Same as above */
const dContactFDir1 = 0x002;      /**< Use FDir for the first friction value */
const dContactBounce = 0x004;      /**< Restore collision energy anti-parallel to the normal */
const dContactSoftERP = 0x008;      /**< Don't use global erp for penetration reduction */
const dContactSoftCFM = 0x010;      /**< Don't use global cfm for penetration constraint */
const dContactMotion1 = 0x020;      /**< Use a non-zero target velocity for the constraint */
const dContactMotion2 = 0x040;
const dContactMotionN = 0x080;
const dContactSlip1 = 0x100;      /**< Force-dependent slip. */
const dContactSlip2 = 0x200;
const dContactRolling = 0x400;      /**< Rolling/Angular friction */
const dContactApprox0 = 0x0000;
const dContactApprox1_1 = 0x1000;
const dContactApprox1_2 = 0x2000;
const dContactApprox1_N = 0x4000;   /**< For rolling friction */
const dContactApprox1 = 0x7000;

// surface parameter
const mu = 0x001;
const mu2 = 0x002;
const bounce = 0x004;
const bounce_vel = 0x008;
const soft_erp = 0x010;
const soft_cfm = 0x020;
const rho = 0x040;
const rho2 = 0x080;
const rhoN = 0x100;
const motion1 = 0x200;
const motion2 = 0x400;
const motionN = 0x800;
const slip1 = 0x1000;
const slip2 = 0x2000

//joints type
const dJointTypeNone = 0; 		/* or "unknown" */
const dJointTypeBall = 1;
const dJointTypeHinge = 2;
const dJointTypeSlider = 3;
const dJointTypeContact = 4;
const dJointTypeUniversal = 5;
const dJointTypeHinge2 = 6;
const dJointTypeFixed = 7;
const dJointTypeNull = 8;
const dJointTypeAMotor = 9;
const dJointTypeLMotor = 10;
const dJointTypePlane2D = 11;
const dJointTypePR = 12;
const dJointTypePU = 13;
const dJointTypePiston = 1; 4
const dJointTypeDBall = 15;
const dJointTypeDHinge = 16;
const dJointTypeTransmission = 17;

const dxBodyFlagFiniteRotation = 1;  // use finite rotations
const dxBodyFlagFiniteRotationAxis = 2;  // use finite rotations only along axis
const dxBodyDisabled = 4;  // body is disabled
const dxBodyNoGravity = 8;  // body is not influenced by gravity
const dxBodyAutoDisable = 16; // enable auto-disable on body
const dxBodyLinearDamping = 32; // use linear damping
const dxBodyAngularDamping = 64; // use angular damping
const dxBodyMaxAngularSpeed = 128;// use maximum angular speed
const dxBodyGyroscopic = 256; // use gyroscopic term
const dxBodyStateNotifyEnergy = 512;// Tell to energy.jscpp to notify enerjy.ts


// old surface parameter
/*const dSurfacemu = 1;
const dSurfacemu2 = 2;
const dSurfacerho = 3;
const dSurfacerho2 = 4;
const dSurfacerhoN = 5;
const dSurfacebounce = 6;
const dSurfacebounce_vel = 7;
const dSurfacesoft_erp = 8;
const dSurfacesoft_cfm = 9;
const dSurfacemotion1 = 10;
const dSurfacemotion2 = 11;
const dSurfacemotionN = 12;
const dSurfaceslip1 = 13;
const dSurfaceslip2 = 14;*/