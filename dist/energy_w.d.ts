declare class PhysicMaterial {
    dxMaterial: DxMaterial;
    name: string;
    static DefaultMaterial: PhysicMaterial;
    static Instances: Array<PhysicMaterial>;
    constructor(name: string);
    setMaterialParameter(param: number, value: number): void;
    getMaterialParameter(param: number): number;
    static GetDefault(): PhysicMaterial;
}
declare class Djoint {
    dxJoint: DxJoint;
    dxWorld: DxWorld;
    dxJointGRoup: DxJointGroup;
    uniqID: number;
    name: string;
    static Instances: Array<Djoint>;
    constructor();
    dJointAttach(b1: DxBody, b2: DxBody): void;
    dJointSetFeedback(dxJoint: DxJoint, dJointFeedback: DJointFeedback): void;
    dJointSetParam(parameter: number, value: number): void;
    dJointDestroy(): void;
}
declare class DJointBall extends Djoint {
    private anchor;
    private anchor2;
    constructor(dxWorld: DxWorld, dxJointGRoup: DxJointGroup, uniqID: number, name?: string);
    dJointSetBallAnchor(x: number, y: number, z: number): void;
    dJointSetBallAnchor2(x: number, y: number, z: number): void;
    dJointGetBallAnchor(): Array<number>;
    dJointGetBallAnchor2(): Array<number>;
}
declare class DJointHinge extends Djoint {
    private anchor;
    private anchor2;
    private axis;
    constructor(dxWorld: DxWorld, dxJointGRoup: DxJointGroup, uniqID: number, name?: string);
    dJointSetHingeAnchor(x: number, y: number, z: number): void;
    dJointSetHingeAxis(x: number, y: number, z: number): void;
    dJointGetHingeAnchor(): Array<number>;
    dJointGetHingeAnchor2(): Array<number>;
    dJointGetHingeAxis(): Array<number>;
    dJointGetHingeAngle(): number;
    dJointGetHingeAngleRate(): number;
}
declare class DJointHinge2 extends Djoint {
    private anchor;
    private anchor2;
    private axis1;
    private axis2;
    constructor(dxWorld: DxWorld, dxJointGRoup: DxJointGroup, uniqID: number, name?: string);
    dJointSetHinge2Anchor(x: number, y: number, z: number): void;
    dJointSetHinge2Axis1(x: number, y: number, z: number): void;
    dJointSetHinge2Axis2(x: number, y: number, z: number): void;
    dJointGetHinge2Angle1(): number;
    dJointGetHinge2Anchor(): Array<number>;
    dJointGetHinge2Anchor2(): number[];
    dJointGetHinge2Axis1(): number[];
    dJointGetHinge2Axis2(): number[];
}
declare class DJointSlider extends Djoint {
    constructor(dxWorld: DxWorld, dxJointGRoup: DxJointGroup, uniqID: number, name?: string);
    dJointSetSliderAxis(x: number, y: number, z: number): void;
}
declare class DJointFixed extends Djoint {
    constructor(dxWorld: DxWorld, dxJointGRoup: DxJointGroup, uniqID: number, name?: string);
}
declare class DJointTransmission extends Djoint {
    constructor(dxWorld: DxWorld, dxJointGRoup: DxJointGroup, uniqID: number, name?: string);
    dJointSetTransmissionMode(mode: number): void;
    dJointSetTransmissionRatio(ratio: number): void;
    dJointSetTransmissionAnchor1(x: number, y: number, z: number): void;
    dJointSetTransmissionAnchor2(x: number, y: number, z: number): void;
    dJointSetTransmissionAxis(x: number, y: number, z: number): void;
    dJointSetTransmissionBacklash(backlash: number): void;
}
interface DynObject {
    mesh: BABYLON.Mesh | BABYLON.InstancedMesh;
    dxBody: DxBody;
    dxGeom: DxGeom;
    dxMass: DMass;
    dxWorld: DxWorld;
    dxSpace: DxSpace;
    dxMaterial: DxMaterial;
    physicMaterial: PhysicMaterial;
    pointer_pos: Pointer;
    pointer_rot: Pointer;
    dxFlags: Pointer;
    name: string;
    uniqID: number;
    density: number;
    isDisable: boolean;
    geomContact: any[];
}
declare class DynamicObject {
    mesh: BABYLON.Mesh | BABYLON.InstancedMesh;
    dxBody: DxBody;
    dxGeom: DxGeom;
    dxMass: DMass;
    dxWorld: DxWorld;
    dxSpace: DxSpace;
    dxMaterial: DxMaterial;
    physicMaterial: PhysicMaterial;
    pointer_pos: Pointer;
    pointer_rot: Pointer;
    dxFlags: Pointer;
    name: string;
    uniqID: number;
    density: number;
    isDisable: boolean;
    geomContact: any[];
    lastTimeStamp: number;
    posRq: Array<number>;
    static Instances: Array<DynamicObject>;
    static OInstances: DynObject;
    addContact(timeStamp: number, geomID: DxGeom): void;
    getDxBodyPointersAndFlag(): void;
    dGeomSetMaterial(pmat: PhysicMaterial): void;
    dBodySetPosition(x: number, y: number, z: number): void;
    dBodySetRotation(R: DMatrix3x3): void;
    dBodySetQuaternion(w: number, x: number, y: number, z: number): void;
    dGeomSetPosition(x: number, y: number, z: number): void;
    dGeomGetPosition(): Array<number>;
    dGeomGetQuaternion(): Array<number>;
    dGeomSetQuaternion(w: number, x: number, y: number, z: number): void;
    dBodySetLinearVel(x: number, y: number, z: number): void;
    dBodySetAngularVel(x: number, y: number, z: number): void;
    dBodyAddForce(fx: number, fy: number, fz: number, useLocal: boolean): void;
    dBodyGetForce(): Array<number>;
    dBodySetForce(fx: number, fy: number, fz: number): void;
    dBodyAddTorque(fx: number, fy: number, fz: number, useLocal: boolean): void;
    dBodySetTorque(fx: number, fy: number, fz: number): void;
    dBodySetFiniteRotationMode(v: number): void;
    dBodySetGyroscopicMode(v: number): void;
    dBodyGetTorque(): Array<number>;
    dBodyGetLinearVel(): Array<number>;
    dBodyGetAngularVel(): Array<number>;
    dBodyIsEnabled(): number;
    dBodySetNotification_interval(interval: number): void;
    destroyDynamicObject(): void;
    dBodyGetFlags(): number;
    dBodySetFlags(flags: number): void;
    private dBodyDestroy();
    private dGeomDestroy();
    dBodyGetMass(): number;
    dBodySetMass(density: number): void;
    getPosRqDouble(): Array<number>;
    getPosRqSingle(): Array<number>;
    static NotifyState(pointer: DxBody): void;
    static NotifyState2(pointer: DxBody): void;
}
declare class DynamicBox extends DynamicObject {
    private lx;
    private ly;
    private lz;
    constructor(mesh: BABYLON.Mesh | BABYLON.InstancedMesh, dxSpace: DxSpace, dxWorld: DxWorld, density: number, lx: number, ly: number, lz: number, uniqID: number, name?: string);
}
declare class DynamicSphere extends DynamicObject {
    private radius;
    constructor(dxSpace: DxSpace, dxWorld: DxWorld, density: number, radius: number, uniqID: number, name?: string);
}
declare class DynamicCylinder extends DynamicObject {
    private radius;
    private length;
    private direction;
    constructor(dxSpace: DxSpace, dxWorld: DxWorld, density: number, radius: number, length: number, direction: number, uniqID: number, name?: string);
}
declare class DynamicCapsule extends DynamicObject {
    constructor();
}
declare class DynamicConvex extends DynamicObject {
    constructor();
}
declare class DynamicRay extends DynamicObject {
    dxSpace: DxSpace;
    dxGeom: DxGeom;
    private length;
    static Instances: Array<DynamicRay>;
    constructor(dxSpace: DxSpace, length: number);
    setRay(px: number, py: number, pz: number, dx: number, dy: number, dz: number): void;
}
declare class DynamicHeightmap extends DynamicObject {
    private dxHeightfieldData;
    constructor(dxSpace: DxSpace, dxWorld: DxWorld, heightData: Float64Array, width: number, depth: number, widthSamples: number, depthSamples: number, scale: number, offset: number, thickness: number, bWrap: number, uniqID: number, name?: string);
}
declare class dynamicTriMesh extends DynamicObject {
    private dxTriMeshData;
    constructor(dxSpace: DxSpace, dxWorld: DxWorld, vertices: Float32Array, indices: Int32Array, density: number, uniqID: number, name: string);
}
declare class StaticPlane {
    dxGeom: DxGeom;
    constructor(dxSpace: DxSpace, a: number, b: number, c: number, d: number);
    getDxGeom(): DxGeom;
}
declare class Energy {
    private scene;
    energyRawData: Float64Array;
    registeredMeshes: Array<BABYLON.Mesh | BABYLON.InstancedMesh>;
    private jointID;
    private solver;
    private numStep;
    private stepSize;
    private maxContact;
    dxWorld: DxWorld;
    dxContactgroup: DxContactGroup;
    dxSpace: DxSpace;
    dxJointGroup: DxJointGroup;
    private _simloop;
    private _simloopSafe;
    private isRunning;
    private p;
    private r;
    private container;
    private t0;
    private t1;
    static SPHERE: number;
    static BOX: number;
    static CYLINDER: number;
    static HEIGHTFIELD: number;
    static NORMAL_STEP: number;
    static QUICK_STEP: number;
    constructor(scene: BABYLON.Scene, gravity: BABYLON.Vector3, solver: number, contactFlagMode: number, numStep?: number, numQuickStepIterations?: number);
    static AllReady(): void;
    initEnergy(data: EnergyInitialize): void;
    setTimeStep(stepSize: number): void;
    getTimeStep(): number;
    setTimeStepAndNumStep(stepSize: number, numStep: number): void;
    setMotionVector(mesh: BABYLON.AbstractMesh, v: BABYLON.Vector3): void;
    setMaxContact(maxContact: number): void;
    getMaxContact(): number;
    dWorldSetERP(value: number): void;
    dWorldSetCFM(value: number): void;
    dWorldGetERP(): number;
    dWorldGetCFM(): number;
    dWorldSetFlags(flag: number): void;
    dWorldSetAutoDisableFlag(do_auto_disable: number): void;
    dWorldSetAutoDisableAverageSamplesCount(value: number): void;
    dWorldSetAutoDisableLinearThreshold(linearThreshold: number): void;
    dWorldSetAutoDisableAngularThreshold(angularThreshold: number): void;
    dWorldSetAutoDisableSteps(steps: number): void;
    dWorldSetAutoDisableTime(time: number): void;
    dWorldSetNotificationInterval(interval: number): void;
    dWorldGetGravity2(): BABYLON.Vector3;
    dWorldSetGravity(x: number, y: number, z: number): void;
    startSimulation(): void;
    pauseSimulation(): void;
    deleteSimulation(disposeMesh: boolean): void;
    simloopSafe(): void;
    simloop(): void;
    static Col: any[];
    private timeT;
    collision(): void;
    doStep(): any;
    destroyObjectFromSimulation(mesh: BABYLON.Mesh | BABYLON.InstancedMesh): void;
    destroySimulation(): void;
    __destroySimulation(): void;
    dJointDestroy(jointID: number): void;
    dBodyEnable(mesh: BABYLON.AbstractMesh): void;
    dBodyDisable(mesh: BABYLON.AbstractMesh): void;
    dBodyIsEnabled(mesh: BABYLON.AbstractMesh): number;
    addDJointHinge2(body1: BABYLON.Mesh, body2: BABYLON.Mesh, anchor: BABYLON.Vector3, axis1: BABYLON.Vector3, axis2: BABYLON.Vector3, name: string): number;
    addDJointBall(body1: BABYLON.AbstractMesh, body2: BABYLON.AbstractMesh, anchor: BABYLON.Vector3, name: string): number;
    addDJointFixed(body1: BABYLON.Mesh, body2: BABYLON.Mesh, anchor: BABYLON.Vector3): number;
    addDJointHinge(body1: any, body2: any, anchor: BABYLON.Vector3, axis: BABYLON.Vector3, name: string): number;
    dJointSetParam(joint: number, parameter: number, value: number): void;
    dJointGetHinge2Angle1(jointID: number): number;
    dBodyGetTorque(body: BABYLON.Mesh): number[];
    dBodyGetForce(mesh: BABYLON.Mesh): number[];
    getdjointHinge2Anchor(jointID: number): number[];
    getdjointHinge2Anchor2(jointID: number): number[];
    getdjointHinge2Axis1(jointID: number): number[];
    getdjointHinge2Axis2(jointID: number): number[];
    getdjointHingeAnchor(jointID: number): number[];
    getdjointHingeAnchor2(jointID: number): number[];
    getdjointGetHingeAngle(jointID: number): number;
    getdjointGetHingeAngleRate(jointID: number): number;
    getdjointHingeAxis(jointID: number): number[];
    addDJointSlider(body1: BABYLON.AbstractMesh, body2: any, axis: BABYLON.Vector3, name: string): number;
    addDJointTransmission(body1: BABYLON.AbstractMesh, body2: BABYLON.AbstractMesh, transmissionMode: number, ratio: number, anchor1: BABYLON.Vector3, anchor2: BABYLON.Vector3, axis: BABYLON.Vector3, name: string): number;
    addStaticPlane(a: number, b: number, c: number, d: number): void;
    addDynamicRay(length: number): void;
    addDynamicTriMesh(mesh: BABYLON.Mesh | BABYLON.InstancedMesh, density: number): void;
    addDynamicHeightmap(mesh: BABYLON.Mesh | BABYLON.InstancedMesh, width: number, depth: number, widthSamples: number, depthSamples: number, scale: number, offset: number, thickness: number, bWrap: number): void;
    addDynamicObject(mesh: BABYLON.Mesh | BABYLON.InstancedMesh, meshType: number, density: number, direction?: number): void;
    dBodySetPosition(mesh: BABYLON.AbstractMesh, p: BABYLON.Vector3): void;
    dBodySetQuaternion(mesh: BABYLON.AbstractMesh, q: BABYLON.Quaternion): void;
    dBodySetMass(mesh: BABYLON.Mesh, density: number): void;
    dBodyGetMass(mesh: BABYLON.Mesh): number;
    dBodyAddTorque(mesh: BABYLON.Mesh, f: BABYLON.Vector3, useLocal: boolean): void;
    dBodyAddForce(mesh: BABYLON.AbstractMesh, f: BABYLON.Vector3, useLocal?: boolean): void;
    getDynamicObjectByMesh(mesh: BABYLON.AbstractMesh): DynamicObject;
    getDynamicObjectByID(bodyID: number): number;
    getJointByID(jointID: number): number;
    createPhysicMaterial(name: string): DxMaterial;
    getPhysicMaterialByID(dxMaterial: DxMaterial): number;
    dBodySetSurfaceParameter(mesh: BABYLON.AbstractMesh, parameter: number, value: number): void;
    dBodyGetSurfaceParameter(mesh: BABYLON.AbstractMesh, parameter: number): number;
    setPhysicMaterialParameter(dxMaterial: DxMaterial, parameter: number, value: number): void;
    assignPhysicMaterialToMesh(dxMaterial: DxMaterial, mesh: BABYLON.Mesh | BABYLON.InstancedMesh): void;
    dBodyGetPosition(mesh: any): BABYLON.Vector3;
    dBodySetTorque(mesh: BABYLON.AbstractMesh, f: BABYLON.Vector3): void;
    dBodySetForce(mesh: BABYLON.AbstractMesh, f: BABYLON.Vector3): void;
    dBodySetLinearVel(mesh: BABYLON.AbstractMesh, f: BABYLON.Vector3): void;
    dBodySetAngularVel(mesh: BABYLON.AbstractMesh, f: BABYLON.Vector3): void;
    dBodySetZeroForce(mesh: BABYLON.AbstractMesh): void;
    dBodyGetLinearVel(mesh: BABYLON.AbstractMesh): number[];
    dBodyGetAngularVel(mesh: BABYLON.AbstractMesh): number[];
    dBodyGetFlags(mesh: BABYLON.AbstractMesh): number;
    dBodySetFlags(mesh: BABYLON.AbstractMesh, flags: number): void;
    dBodySetNotification_interval(mesh: BABYLON.AbstractMesh, interval: number): void;
    dBodySetFiniteRotationMode(mesh: BABYLON.AbstractMesh, value: number): void;
    dBodySetGyroscopicMode(mesh: BABYLON.AbstractMesh, value: number): void;
    dGeomGetPosition(mesh: BABYLON.AbstractMesh): Array<number>;
    dGeomSetPosition(mesh: BABYLON.AbstractMesh, v: BABYLON.Vector3): void;
    dGeomGetQuaternion(mesh: BABYLON.AbstractMesh): Array<number>;
    dGeomSetQuaternion(mesh: BABYLON.AbstractMesh, q: BABYLON.Quaternion): void;
    static TEST(): void;
    static dBodyAddForce: (dxBody: DxBody, fx: number, fy: number, fz: number) => void;
    static dBodyAddRelForce: (dxBody: DxBody, fx: number, fy: number, fz: number) => void;
    static dBodyAddRelTorque: (dxBody: DxBody, fx: number, fy: number, fz: number) => void;
    static dBodyAddTorque: (dxBody: DxBody, fx: number, fy: number, fz: number) => void;
    static dBodyCreate: (dxWorld: DxWorld) => DxBody;
    static dBodyDestroy: (dxBody: DxBody) => void;
    static dBodyDisable: (dxBody: DxBody) => void;
    static dBodyEnable: (dxBody: DxBody) => void;
    static dBodyGetAngularVel: (dxBody: DxBody) => number;
    static dBodyGetForce: (dxBody: DxBody) => Vector3_Ptr;
    static dBodyGetLinearVel: (dxBody: DxBody) => number;
    static dBodyGetPosition: (dxBody: DxBody) => Vector3_Ptr;
    static dBodyGetQuaternion: (dxBody: DxBody) => Vector4_Ptr;
    static dBodyGetTorque: (dxBody: DxBody) => Vector3_Ptr;
    static dBodyIsEnabled: (dxBody: DxBody) => number;
    static dBodySetAngularVel: (dxBody: DxBody, x: number, y: number, z: number) => void;
    static dBodySetAutoDisableAngularThreshold: (dxBody: DxBody, angular_threshold: number) => void;
    static dBodySetAutoDisableAverageSamplesCount: (dxBody: DxBody, average_samples_count: number) => void;
    static dBodySetAutoDisableFlag: (dxBody: DxBody, do_auto_disable: number) => void;
    static dBodySetAutoDisableLinearThreshold: (dxBody: DxBody, linear_threshold: number) => void;
    static dBodySetAutoDisableTime: (dxBody: DxBody, time: number) => void;
    static dBodySetFiniteRotationMode: (DxBody: DxBody, mode: number) => void;
    static dBodySetGyroscopicMode: (DxBody: DxBody, mode: number) => void;
    static dBodySetForce: (dxBody: DxBody, x: number, y: number, z: number) => void;
    static dBodySetLinearVel: (dxBody: DxBody, x: number, y: number, z: number) => void;
    static dBodySetMass: (dxBody: DxBody, dMassStructPtr: DMass) => void;
    static dBodyGetMass: (dxBody: DxBody, dMassStrucPtr: DMass) => void;
    static dBodySetPosition: (dxBody: DxBody, x: number, y: number, z: number) => void;
    static dBodySetQuaternion: (dxBody: DxBody, q: Vector4_Ptr) => void;
    static dBodySetRotation: (dxBody: DxBody, R: DMatrix3x3) => void;
    static dBodySetTorque: (dxBody: DxBody, x: number, y: number, z: number) => void;
    static dBodyGetDxFlags: (dxBody: DxBody) => Pointer;
    static dBodyGetFlags: (dxBody: DxBody) => number;
    static dBodySetFlags: (dxBody: DxBody, flags: number) => void;
    static dBodySetNotification_interval: (dxBody: DxBody, interval: number) => void;
    static dCreateBox: (dxSpace: DxSpace, x: number, y: number, z: number) => DxGeom;
    static dCreateCylinder: (dxSpace: DxSpace, radius: number, length: number) => DxGeom;
    static dCreateHeightfield: (dxSpace: DxSpace, heightid: Pointer, placeable: number) => number;
    static dCreatePlane: (dxSpace: DxSpace, a: number, b: number, c: number, d: number) => DxGeom;
    static dCreateSphere: (dxSpace: DxSpace, radius: number) => DxGeom;
    static dCreateTriMesh: (dxSpace: DxSpace, Data: DxTriMeshData, dTriCallback: any, dTriArrayCallback: any, dTriRayCallback: any) => DxGeom;
    static dCreateRay: (dxSpace: DxSpace, length: number) => DxGeom;
    static dGeomRaySet: (dxGeom: DxGeom, px: number, py: number, pz: number, dx: number, dy: number, dz: number) => void;
    static dGeomDestroy: (dxGeom: DxGeom) => void;
    static dGeomGetMaterial: (dxGeom: DxGeom) => DxMaterial;
    static dGeomGetPosition: (dxGeom: DxGeom) => Vector3_Ptr;
    static dGeomGetQuaternion: (dxGeom: DxGeom, result: Vector4_Ptr) => void;
    static dGeomHeightfieldDataBuildDouble: (dxHeightfieldData: DxHeightfieldData, pHeightData: Pointer, bCopyHeightData: number, width: number, depth: number, widthSamples: number, depthSamples: number, scale: number, offset: number, thickness: number, bWrap: number) => void;
    static dGeomHeightfieldDataCreate: () => DxHeightfieldData;
    static dGeomHeightfieldDataSetBounds: (d: number, minHeight: number, maxHeight: number) => void;
    static dGeomSetBody: (dxGeom: DxGeom, dxBody: DxBody) => void;
    static dGeomSetMaterial: (dxGeom: DxGeom, dxMaterial: DxMaterial) => void;
    static dGeomSetMotionVector: (dxGeom: DxGeom, motionVector: Vector3_Ptr) => void;
    static dGeomSetOffsetPosition: (dxGeom: DxGeom, mc0: number, mc1: number, mc2: number) => void;
    static dGeomSetPosition: (dxGeom: DxGeom, x: number, y: number, z: number) => void;
    static dGeomSetQuaternion: (dxGeom: DxGeom, q: Vector4_Ptr) => void;
    static dGeomTriMeshDataBuildSingle: (dxTriMeshData: DxTriMeshData, vertices: Pointer, VertexStride: number, VertexCount: number, Indices: Pointer, IndexCount: number, TriStride: number) => void;
    static dGeomTriMeshDataCreate: () => DxTriMeshData;
    static getGeomsCollisionData: () => Pointer;
    static getGeomsCollisionBody: () => Pointer;
    static getGeomsCollisionDataLength: () => number;
    static dInitODE2: (a: number) => void;
    static dInitODE: () => void;
    static dJointAttach: (dxJoint: DxJoint, dxBody1: DxBody, dxBody2: DxBody) => void;
    static dJointCreateBall: (dxWorld: DxWorld, dxJointGroup: DxJointGroup) => DxJoint;
    static dJointCreateHinge2: (dxWorld: DxJoint, dxJointGroup: number) => number;
    static dJointCreateHinge: (dxWorld: DxJoint, dxJointGroup: number) => number;
    static dJointCreateSlider: (xxWorld: DxWorld, dxJointGroup: DxJointGroup) => DxJoint;
    static dJointCreateTransmission: (dxWorld: DxWorld, dxJointGroup: DxJointGroup) => DxJoint;
    static dJointCreateAMotor: (dxWorld: DxWorld, dxJointGroup: DxJointGroup) => DxJoint;
    static dJointCreateLMotor: (dxWorld: DxWorld, dxJointGroup: DxJointGroup) => DxJoint;
    static dJointCreateUniversal: (dxWorld: DxWorld, dxJointGroup: DxJointGroup) => DxJoint;
    static dJointCreatePiston: (dxWorld: DxWorld, dxJointGroup: DxJointGroup) => DxJoint;
    static dJointCreateFixed: (dxWorld: DxWorld, dxJointGroup: DxJointGroup) => DxJoint;
    static dJointDestroy: (dxJoint: DxJoint) => void;
    static dJointGetHinge2Anchor2: (dxJoint: DxJoint, result: Vector3_Ptr) => void;
    static dJointGetHinge2Anchor: (dxJoint: DxJoint, result: Vector3_Ptr) => void;
    static dJointGetHinge2Angle1: (dxJoint: DxJoint) => number;
    static dJointGetHinge2Axis1: (dxJoint: DxJoint, result: Vector3_Ptr) => void;
    static dJointGetHinge2Axis2: (dxJoint: DxJoint, result: Vector3_Ptr) => void;
    static dJointGetHingeAnchor2: (dxJoint: DxJoint, result: Vector3_Ptr) => void;
    static dJointGetHingeAnchor: (dxJoint: DxJoint, result: Vector3_Ptr) => void;
    static dJointGetHingeAxis: (dxJoint: DxJoint, result: Vector3_Ptr) => void;
    static dJointGetHingeAngle: (dxJoint: DxJoint) => number;
    static dJointGetHingeAngleRate: (dxJoint: DxJoint) => number;
    static dJointGroupCreate: (max_size: number) => DxJointGroup;
    static dJointGroupDestroy: (contactGroup: DxContactGroup) => void;
    static dJointGroupEmpty: (dxJointGroup: DxJointGroup) => void;
    static dJointSetBallAnchor: (dxJoint: DxJoint, x: number, y: number, z: number) => void;
    static dJointSetBallAnchor2: (dxJoint: DxJoint, x: number, y: number, z: number) => void;
    static dJointSetBallParam: (dxJoint: DxJoint, parameter: number, value: number) => void;
    static dJointGetBallAnchor: (dxJoint: DxJoint, result: Vector3_Ptr) => void;
    static dJointGetBallAnchor2: (dxJoint: DxJoint, result: Vector3_Ptr) => void;
    static dJointSetFeedback: (DxJoint: DxJoint, dJointFeedback: DJointFeedback) => void;
    static dJointSetHinge2Anchor: (dxJoint: DxJoint, x: number, y: number, z: number) => void;
    static dJointSetHinge2Axis1: (dxJoint: DxJoint, x: number, y: number, z: number) => void;
    static dJointSetHinge2Axis2: (dxJoint: DxJoint, x: number, y: number, z: number) => void;
    static dJointSetHinge2Param: (dxJoint: DxJoint, parameter: number, value: number) => void;
    static dJointSetHingeAnchor: (dxJoint: DxJoint, x: number, y: number, z: number) => void;
    static dJointSetHingeAxis: (dxJoint: DxJoint, x: number, y: number, z: number) => void;
    static dJointSetHingeParam: (dxJoint: DxJoint, parameter: number, value: number) => void;
    static dJointSetSliderAxis: (dxJoint: DxJoint, x: number, y: number, z: number) => void;
    static dJointSetSliderParam: (dxJoint: DxJoint, parameter: number, value: number) => void;
    static dJointSetTransmissionAnchor1: (dxJoint: DxJoint, x: number, y: number, z: number) => void;
    static dJointSetTransmissionAnchor2: (dxJoint: DxJoint, x: number, y: number, z: number) => void;
    static dJointSetTransmissionAxis1: (dxJoint: DxJoint, x: number, y: number, z: number) => void;
    static dJointSetTransmissionAxis2: (dxJoint: DxJoint, x: number, y: number, z: number) => void;
    static dJointSetTransmissionAxis: (dxJoint: DxJoint, x: number, y: number, z: number) => void;
    static dJointSetTransmissionBacklash: (dxJoint: DxJoint, backlash: number) => void;
    static dJointSetTransmissionMode: (dxJoint: DxJoint, mode: number) => void;
    static dJointSetTransmissionRatio: (dxJoint: DxJoint, ration: number) => void;
    static dMassAdjust: (dMass: DMass, newMass: number) => void;
    static dMassSetBox: (dMass: DMass, density: number, lx: number, ly: number, lz: number) => void;
    static dMassSetCylinder: (dMass: DMass, density: number, direction: number, radius: number, length: number) => void;
    static dMassSetSphere: (dMass: DMass, density: number, radius: number) => void;
    static dMassSetTrimesh: (dMass: DMass, density: number, dxGeom: number) => void;
    static dMassTranslate: (dMass: DMass, mc0: number, mc1: number, mc2: number) => void;
    static dMaterialCreate: (value: DxWorld) => Pointer;
    static dMaterialGetParameter: (DxMaterial: DxMaterial, parameter: number) => number;
    static dMaterialSetParameter: (DxMaterial: DxMaterial, parameter: number, value: number) => void;
    static dRFromAxisAndAngle: (R: DMatrix3x3, ax: number, ay: number, az: number, angle: number) => void;
    static dRFromZAxis: (R: DMatrix3x3, ax: number, ay: number, az: number) => void;
    static dRSetIdentity: (R: DMatrix3x3) => void;
    static dAreConnected: (b1: DxBody, b2: DxBody) => number;
    static dAreConnectedExcluding: (b1: DxBody, b2: DxBody, jointType: DxJointType) => number;
    static dSimpleSpaceCreate: (dxSpace: DxSpace) => DxSpace;
    static dHashSpaceCreate: (dSpaceID: number) => DxSpace;
    static dHashSpaceSetLevels: (dSpaceID: number, minlevel: number, maxlevel: number) => void;
    static dSpaceDestroy: (dxSpace: DxSpace) => void;
    static dSpaceCollide: (dxSpace: DxSpace, dxData: number, nearCallback: any) => void;
    static dWorldCreate: () => DxWorld;
    static dWorldGetGravity2: (dxWorld: DxWorld) => Vector3_Ptr;
    static dWorldDestroy: (dxWorld: DxWorld) => void;
    static dWorldGetQuickStepNumIterations: (dxWorld: DxWorld) => number;
    static dWorldQuickStep: (dxWorld: DxWorld, stepsize: number) => number;
    static dWorldSetGravity: (dxWorld: DxWorld, x: number, y: number, z: number) => void;
    static dWorldSetQuickStepNumIterations: (dxWorld: DxWorld, num: number) => void;
    static dWorldStep: (dxWorld: DxWorld, stepsize: number) => number;
    static dWorldSetAutoDisableAverageSamplesCount: (dxWorld: DxWorld, value: number) => void;
    static dWorldSetAutoDisableFlag: (dxWorld: DxWorld, value: number) => void;
    static dWorldSetAutoDisableLinearThreshold: (dxWorld: DxWorld, linearThreshold: number) => void;
    static dWorldSetAutoDisableAngularThreshold: (dxWorld: DxWorld, angularThreshold: number) => void;
    static dWorldSetAutoDisableSteps: (dxWorld: DxWorld, steps: number) => void;
    static dWorldSetAutoDisableTime: (dxWorld: DxWorld, steps: number) => void;
    static dWorldSetNotificationInterval: (dxWorld: DxWorld, interval: number) => void;
    static dWorldSetFlags: (dxWorld: DxWorld, flag: number) => void;
    static dWorldGetFlags: (dxWorld: DxWorld) => number;
    static dWorldGetDxFlags: (dxWorld: DxWorld) => Pointer;
    static dWorldSetERP: (dxWorld: DxWorld, erp: number) => void;
    static dWorldSetCFM: (dxWorld: DxWorld, cfm: number) => void;
    static dWorldGetERP: (dxWorld: DxWorld) => number;
    static dWorldGetCFM: (dxWorld: DxWorld) => number;
    static init: (dxWorld: DxWorld, dxSpace: DxSpace, dxContactGroup: DxContactGroup, contactFlagMode: number) => boolean;
    static setFlagmode: (contactFlagMode: number) => void;
    static setFlagmode2: (contactFlagMode: number) => void;
    static setMaxContact: (maxContact: number) => void;
    static setTimestep: (step: number, numStep: number) => void;
    static run: () => void;
    static closeEnergy: () => void;
}
interface EnergyInitialize {
    gravity: BABYLON.Vector3;
    solver: number;
    numStep: number;
    numQuickStepIterations: number;
    contactFlagMode: number;
}
interface ISetDynamicObjectPosition {
    bodyID: number;
    position: BABYLON.Vector3;
}
interface ISetDynamicObjectRotation {
    bodyID: number;
    rotation: BABYLON.Quaternion;
}
interface IAddForce {
    bodyID: number;
    force: BABYLON.Vector3;
    useLocal: boolean;
}
interface IAddTorque {
    bodyID: number;
    force: BABYLON.Vector3;
    useLocal: boolean;
}
interface ISetTorque {
    bodyID: number;
    force: BABYLON.Vector3;
}
interface ISetForce {
    bodyID: number;
    force: BABYLON.Vector3;
}
interface IEnergyDynamicHeightmap {
    type: number;
    heightData: Float64Array;
    position: BABYLON.Vector3;
    rotation: BABYLON.Quaternion;
    width: number;
    depth: number;
    widthSamples: number;
    depthSamples: number;
    scale: number;
    offset: number;
    thickness: number;
    bWrap: number;
    name: string;
    uniqID: number;
}
interface IEnergyDynamicSphere {
    type: number;
    radius: number;
    density: number;
    position: BABYLON.Vector3;
    rotation: Array<number>;
    name: string;
    uniqID: number;
}
interface IEnergyDynamicBox {
    type: number;
    size: Array<number>;
    density: number;
    position: Array<number>;
    rotation: Array<number>;
    name: string;
    uniqID: number;
}
interface IEnergyDynamicCylinder {
    type: number;
    radius: number;
    length: number;
    density: number;
    direction: number;
    position: BABYLON.Vector3;
    rotation: Array<number>;
    name: string;
    uniqID: number;
}
interface IDJointHinge {
    body1ID: number;
    body2ID: number;
    anchor: BABYLON.Vector3;
    axis: BABYLON.Vector3;
    uniqID: number;
    name: string;
}
interface IDJointBall {
    body1ID: number;
    body2ID: number;
    anchor: BABYLON.Vector3;
    uniqID: number;
    name: string;
}
interface IDJointFixed {
    body1ID: number;
    body2ID: number;
    anchor: BABYLON.Vector3;
    uniqID: number;
    name: string;
}
interface IDJointHinge2 {
    body1ID: number;
    body2ID: number;
    anchor: BABYLON.Vector3;
    axis1: BABYLON.Vector3;
    axis2: BABYLON.Vector3;
    uniqID: number;
    name: string;
}
interface ISetDJointParameter {
    jointID: number;
    parameter: number;
    value: number;
}
interface IDJointSlider {
    body1ID: number;
    body2ID: number;
    axis: BABYLON.Vector3;
    uniqID: number;
    name: string;
}
interface IDjointTransmission {
    body1ID: number;
    body2ID: number;
    transmissionMode: number;
    ratio: number;
    anchor1: BABYLON.Vector3;
    anchor2: BABYLON.Vector3;
    axis: BABYLON.Vector3;
    uniqID: number;
    name: string;
}
declare var Runtime: {
    dynCall: (t: string, pointer: number, arg: any[]) => any;
};
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
    _dBodyDestroy;
    any;
    _dGeomDestroy: any;
    _pdBodyIsEnabled: any;
    _dHashSpaceSetLevels: any;
    _dJointGroupDestroy: any;
    _dSpaceDestroy: any;
    _dWorldDestroy: any;
    onRuntimeInitialized: any;
    _onRuntimeInitialized: any;
};
declare var _malloc: (number: any) => number;
declare var _free: (number: any) => void;
declare type DxSpace = number;
declare type DxWorld = number;
declare type DxBody = number;
declare type DxGeom = number;
declare type DxJoint = number;
declare type DxJointGroup = number;
declare type DxJointType = number;
declare type DxContactGroup = number;
declare type DxTriMeshData = number;
declare type DxHeightfieldData = number;
declare type DxMaterial = number;
declare type DMass = number;
declare type DMatrix3x3 = number;
declare type DJointFeedback = number;
declare type Pointer = number;
declare type Vector4_Ptr = number;
declare type Vector3_Ptr = number;
declare const dParamLoStop = 0;
declare const dParamHiStop = 1;
declare const dParamVel = 2;
declare const dParamLoVel = 3;
declare const dParamHiVel = 4;
declare const dParamFMax = 5;
declare const dParamFudgeFactor = 6;
declare const dParamBounce = 7;
declare const dParamCFM = 8;
declare const dParamStopERP = 9;
declare const dParamStopCFM = 10;
declare const dParamSuspensionERP = 11;
declare const dParamSuspensionCFM = 12;
declare const dParamERP = 13;
declare const dParamFMax2 = 261;
declare const dParamVel2 = 258;
declare const dTransmissionParallelAxes = 0;
declare const dTransmissionIntersectingAxes = 1;
declare const dTransmissionChainDrive = 2;
declare const dContactMu2 = 1;
declare const dContactAxisDep = 1;
declare const dContactFDir1 = 2;
declare const dContactBounce = 4;
declare const dContactSoftERP = 8;
declare const dContactSoftCFM = 16;
declare const dContactMotion1 = 32;
declare const dContactMotion2 = 64;
declare const dContactMotionN = 128;
declare const dContactSlip1 = 256;
declare const dContactSlip2 = 512;
declare const dContactRolling = 1024;
declare const dContactApprox0 = 0;
declare const dContactApprox1_1 = 4096;
declare const dContactApprox1_2 = 8192;
declare const dContactApprox1_N = 16384;
declare const dContactApprox1 = 28672;
declare const mu = 1;
declare const mu2 = 2;
declare const bounce = 4;
declare const bounce_vel = 8;
declare const soft_erp = 16;
declare const soft_cfm = 32;
declare const rho = 64;
declare const rho2 = 128;
declare const rhoN = 256;
declare const motion1 = 512;
declare const motion2 = 1024;
declare const motionN = 2048;
declare const slip1 = 4096;
declare const slip2 = 8192;
declare const dJointTypeNone = 0;
declare const dJointTypeBall = 1;
declare const dJointTypeHinge = 2;
declare const dJointTypeSlider = 3;
declare const dJointTypeContact = 4;
declare const dJointTypeUniversal = 5;
declare const dJointTypeHinge2 = 6;
declare const dJointTypeFixed = 7;
declare const dJointTypeNull = 8;
declare const dJointTypeAMotor = 9;
declare const dJointTypeLMotor = 10;
declare const dJointTypePlane2D = 11;
declare const dJointTypePR = 12;
declare const dJointTypePU = 13;
declare const dJointTypePiston = 1;
declare const dJointTypeDBall = 15;
declare const dJointTypeDHinge = 16;
declare const dJointTypeTransmission = 17;
declare const dxBodyFlagFiniteRotation = 1;
declare const dxBodyFlagFiniteRotationAxis = 2;
declare const dxBodyDisabled = 4;
declare const dxBodyNoGravity = 8;
declare const dxBodyAutoDisable = 16;
declare const dxBodyLinearDamping = 32;
declare const dxBodyAngularDamping = 64;
declare const dxBodyMaxAngularSpeed = 128;
declare const dxBodyGyroscopic = 256;
declare const dxBodyStateNotifyEnergy = 512;
declare class EnergyTools {
    private static Mass_ptr;
    private static DMatrix3_ptr;
    private static feedBack;
    static Malloc_Float64Array(f64: Float64Array): Pointer;
    static Malloc_Float32Array(f32: Float32Array): Pointer;
    static Malloc_Int32(uint32: Int32Array): Pointer;
    static Malloc_Vector3(x: number, y: number, z: number): Vector3_Ptr;
    static Malloc_Quaternion(w: number, x: number, y: number, z: number): Vector4_Ptr;
    static Malloc_new_quaternion(): Vector4_Ptr;
    static Malloc_new_Vector3(): Vector3_Ptr;
    static Malloc_dMass_Struct(): DMass;
    static Malloc_dMatrix3x3(): DMatrix3x3;
    static Malloc_feedback_struct(): DMatrix3x3;
    static Free_DMatrix3_Ptr(ptr: Pointer): void;
    static Free_dMass_Struc(): void;
    static Pointer_To_Vector3(ptr: Vector3_Ptr, swapTOxzy: boolean): Array<number>;
    static Pointer_To_Vector4(ptr: Vector4_Ptr, isQuaternion: boolean): number[];
}
declare class EnergyMath {
    static n_ptr: Vector3_Ptr;
    static p_ptr: Vector3_Ptr;
    static q_ptr: Vector3_Ptr;
    static dPlaneSpace(n: BABYLON.Vector3): Array<BABYLON.Vector3>;
    static _dPlaneSpace: (n: Vector3_Ptr, p: Vector3_Ptr, q: Vector3_Ptr) => void;
}
declare class Data {
    static Body: Array<Array<string>>;
    static World: Array<Array<string>>;
}
