
// Created samuel girardin @samuelgirardin - 2018
// License Creative Commons Attribution-NonCommercial-ShareAlike 4.0 Unported License.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var PhysicMaterial = (function () {
    function PhysicMaterial(name) {
        this.name = name;
        this.dxMaterial = Energy.dMaterialCreate(0);
        PhysicMaterial.Instances.push(this);
    }
    PhysicMaterial.prototype.setMaterialParameter = function (param, value) {
        Energy.dMaterialSetParameter(this.dxMaterial, param, value);
    };
    PhysicMaterial.prototype.getMaterialParameter = function (param) {
        return Energy.dMaterialGetParameter(this.dxMaterial, param);
    };
    PhysicMaterial.GetDefault = function () {
        PhysicMaterial.DefaultMaterial = new PhysicMaterial('defaultPhysicMaterial');
        return PhysicMaterial.DefaultMaterial;
    };
    PhysicMaterial.DefaultMaterial = null;
    PhysicMaterial.Instances = new Array();
    return PhysicMaterial;
}());
var Djoint = (function () {
    function Djoint() {
    }
    Djoint.prototype.dJointAttach = function (b1, b2) {
        Energy.dJointAttach(this.dxJoint, b1, b2);
    };
    Djoint.prototype.dJointSetFeedback = function (dxJoint, dJointFeedback) {
        Energy.dJointSetFeedback(dxJoint, dJointFeedback);
    };
    Djoint.prototype.dJointSetParam = function (parameter, value) {
        if (this instanceof (DJointHinge)) {
            Energy.dJointSetHingeParam(this.dxJoint, parameter, value);
        }
        if (this instanceof (DJointHinge2)) {
            Energy.dJointSetHinge2Param(this.dxJoint, parameter, value);
        }
        if (this instanceof (DJointSlider)) {
            Energy.dJointSetSliderParam(this.dxJoint, parameter, value);
        }
        if (this instanceof (DJointBall)) {
            Energy.dJointSetBallParam(this.dxJoint, parameter, value);
        }
    };
    Djoint.prototype.dJointDestroy = function () {
        Energy.dJointDestroy(this.dxJoint);
    };
    Djoint.Instances = new Array();
    return Djoint;
}());
var DJointBall = (function (_super) {
    __extends(DJointBall, _super);
    function DJointBall(dxWorld, dxJointGRoup, uniqID, name) {
        if (name === void 0) { name = ""; }
        var _this = _super.call(this) || this;
        _this.dxWorld = dxWorld;
        _this.dxJointGRoup = dxJointGRoup;
        _this.name = name;
        _this.uniqID = uniqID;
        _this.dxJoint = Energy.dJointCreateBall(_this.dxWorld, _this.dxJointGRoup);
        Djoint.Instances.push(_this);
        return _this;
    }
    DJointBall.prototype.dJointSetBallAnchor = function (x, y, z) {
        Energy.dJointSetBallAnchor(this.dxJoint, x, y, z);
    };
    DJointBall.prototype.dJointSetBallAnchor2 = function (x, y, z) {
        Energy.dJointSetBallAnchor2(this.dxJoint, x, y, z);
    };
    DJointBall.prototype.dJointGetBallAnchor = function () {
        if (this.anchor == undefined) {
            this.anchor = EnergyTools.Malloc_new_Vector3();
        }
        Energy.dJointGetBallAnchor(this.dxJoint, this.anchor);
        return EnergyTools.Pointer_To_Vector3(this.anchor, true);
    };
    DJointBall.prototype.dJointGetBallAnchor2 = function () {
        if (this.anchor2 == undefined) {
            this.anchor2 = EnergyTools.Malloc_new_Vector3();
        }
        Energy.dJointGetBallAnchor2(this.dxJoint, this.anchor2);
        return EnergyTools.Pointer_To_Vector3(this.anchor, true);
    };
    return DJointBall;
}(Djoint));
var DJointHinge = (function (_super) {
    __extends(DJointHinge, _super);
    function DJointHinge(dxWorld, dxJointGRoup, uniqID, name) {
        if (name === void 0) { name = ""; }
        var _this = _super.call(this) || this;
        _this.dxWorld = dxWorld;
        _this.dxJointGRoup = dxJointGRoup;
        _this.uniqID = uniqID;
        _this.name = name;
        _this.dxJoint = Energy.dJointCreateHinge(_this.dxWorld, _this.dxJointGRoup);
        Djoint.Instances.push(_this);
        return _this;
    }
    DJointHinge.prototype.dJointSetHingeAnchor = function (x, y, z) {
        Energy.dJointSetHingeAnchor(this.dxJoint, x, y, z);
    };
    DJointHinge.prototype.dJointSetHingeAxis = function (x, y, z) {
        Energy.dJointSetHingeAxis(this.dxJoint, x, y, z);
    };
    DJointHinge.prototype.dJointGetHingeAnchor = function () {
        if (this.anchor == undefined) {
            this.anchor = EnergyTools.Malloc_new_Vector3();
        }
        Energy.dJointGetHingeAnchor(this.dxJoint, this.anchor);
        return EnergyTools.Pointer_To_Vector3(this.anchor, true);
    };
    DJointHinge.prototype.dJointGetHingeAnchor2 = function () {
        if (this.anchor2 == undefined) {
            this.anchor2 = EnergyTools.Malloc_new_Vector3();
        }
        Energy.dJointGetHingeAnchor2(this.dxJoint, this.anchor2);
        return EnergyTools.Pointer_To_Vector3(this.anchor2, true);
    };
    DJointHinge.prototype.dJointGetHingeAxis = function () {
        if (this.axis == undefined) {
            this.axis = EnergyTools.Malloc_new_Vector3();
        }
        Energy.dJointGetHingeAxis(this.dxJoint, this.axis);
        return EnergyTools.Pointer_To_Vector3(this.axis, true);
    };
    DJointHinge.prototype.dJointGetHingeAngle = function () {
        console.log("test");
        return Energy.dJointGetHingeAngle(this.dxJoint);
    };
    DJointHinge.prototype.dJointGetHingeAngleRate = function () {
        return Energy.dJointGetHingeAngleRate(this.dxJoint);
    };
    return DJointHinge;
}(Djoint));
var DJointHinge2 = (function (_super) {
    __extends(DJointHinge2, _super);
    function DJointHinge2(dxWorld, dxJointGRoup, uniqID, name) {
        if (name === void 0) { name = ""; }
        var _this = _super.call(this) || this;
        _this.dxWorld = dxWorld;
        _this.dxJointGRoup = dxJointGRoup;
        _this.uniqID = uniqID;
        _this.name = name;
        _this.dxJoint = Energy.dJointCreateHinge2(_this.dxWorld, _this.dxJointGRoup);
        Djoint.Instances.push(_this);
        return _this;
    }
    DJointHinge2.prototype.dJointSetHinge2Anchor = function (x, y, z) {
        Energy.dJointSetHinge2Anchor(this.dxJoint, x, y, z);
    };
    DJointHinge2.prototype.dJointSetHinge2Axis1 = function (x, y, z) {
        Energy.dJointSetHinge2Axis1(this.dxJoint, x, y, z);
    };
    DJointHinge2.prototype.dJointSetHinge2Axis2 = function (x, y, z) {
        Energy.dJointSetHinge2Axis2(this.dxJoint, x, y, z);
    };
    DJointHinge2.prototype.dJointGetHinge2Angle1 = function () {
        return Energy.dJointGetHinge2Angle1(this.dxJoint);
    };
    DJointHinge2.prototype.dJointGetHinge2Anchor = function () {
        if (this.anchor == undefined) {
            this.anchor = EnergyTools.Malloc_new_Vector3();
        }
        Energy.dJointGetHinge2Anchor(this.dxJoint, this.anchor);
        return EnergyTools.Pointer_To_Vector3(this.anchor, true);
    };
    DJointHinge2.prototype.dJointGetHinge2Anchor2 = function () {
        if (this.anchor2 == undefined) {
            this.anchor2 = EnergyTools.Malloc_new_Vector3();
        }
        Energy.dJointGetHinge2Anchor2(this.dxJoint, this.anchor2);
        return EnergyTools.Pointer_To_Vector3(this.anchor2, true);
    };
    DJointHinge2.prototype.dJointGetHinge2Axis1 = function () {
        if (this.axis1 == undefined) {
            this.axis1 = EnergyTools.Malloc_new_Vector3();
        }
        Energy.dJointGetHinge2Axis1(this.dxJoint, this.axis1);
        return EnergyTools.Pointer_To_Vector3(this.axis1, true);
    };
    DJointHinge2.prototype.dJointGetHinge2Axis2 = function () {
        if (this.axis2 == undefined) {
            this.axis2 = EnergyTools.Malloc_new_Vector3();
        }
        Energy.dJointGetHinge2Axis2(this.dxJoint, this.axis2);
        return EnergyTools.Pointer_To_Vector3(this.axis2, true);
    };
    return DJointHinge2;
}(Djoint));
var DJointSlider = (function (_super) {
    __extends(DJointSlider, _super);
    function DJointSlider(dxWorld, dxJointGRoup, uniqID, name) {
        if (name === void 0) { name = ""; }
        var _this = _super.call(this) || this;
        _this.dxWorld = dxWorld;
        _this.dxJointGRoup = dxJointGRoup;
        _this.name = name;
        _this.uniqID = uniqID;
        _this.dxJoint = Energy.dJointCreateSlider(_this.dxWorld, _this.dxJointGRoup);
        Djoint.Instances.push(_this);
        return _this;
    }
    DJointSlider.prototype.dJointSetSliderAxis = function (x, y, z) {
        Energy.dJointSetSliderAxis(this.dxJoint, x, y, z);
    };
    return DJointSlider;
}(Djoint));
var DJointFixed = (function (_super) {
    __extends(DJointFixed, _super);
    function DJointFixed(dxWorld, dxJointGRoup, uniqID, name) {
        if (name === void 0) { name = ""; }
        var _this = _super.call(this) || this;
        _this.dxWorld = dxWorld;
        _this.dxJointGRoup = dxJointGRoup;
        _this.name = name;
        _this.uniqID = uniqID;
        _this.dxJoint = Energy.dJointCreateFixed(_this.dxWorld, _this.dxJointGRoup);
        Djoint.Instances.push(_this);
        return _this;
    }
    return DJointFixed;
}(Djoint));
var DJointTransmission = (function (_super) {
    __extends(DJointTransmission, _super);
    function DJointTransmission(dxWorld, dxJointGRoup, uniqID, name) {
        if (name === void 0) { name = ""; }
        var _this = _super.call(this) || this;
        _this.dxWorld = dxWorld;
        _this.dxJointGRoup = dxJointGRoup;
        _this.name = name;
        _this.uniqID = uniqID;
        _this.dxJoint = Energy.dJointCreateTransmission(_this.dxWorld, _this.dxJointGRoup);
        Djoint.Instances.push(_this);
        return _this;
    }
    DJointTransmission.prototype.dJointSetTransmissionMode = function (mode) {
        Energy.dJointSetTransmissionMode(this.dxJoint, mode);
    };
    DJointTransmission.prototype.dJointSetTransmissionRatio = function (ratio) {
        Energy.dJointSetTransmissionRatio(this.dxJoint, ratio);
    };
    DJointTransmission.prototype.dJointSetTransmissionAnchor1 = function (x, y, z) {
        Energy.dJointSetTransmissionAnchor1(this.dxJoint, x, y, z);
    };
    DJointTransmission.prototype.dJointSetTransmissionAnchor2 = function (x, y, z) {
        Energy.dJointSetTransmissionAnchor2(this.dxJoint, x, y, z);
    };
    DJointTransmission.prototype.dJointSetTransmissionAxis = function (x, y, z) {
        Energy.dJointSetTransmissionAxis(this.dxJoint, x, y, z);
    };
    DJointTransmission.prototype.dJointSetTransmissionBacklash = function (backlash) {
        Energy.dJointSetTransmissionBacklash(this.dxJoint, backlash);
    };
    return DJointTransmission;
}(Djoint));
var DynamicObject = (function () {
    function DynamicObject() {
        this.isDisable = false;
        this.geomContact = [];
        this.posRq = new Array(7);
    }
    DynamicObject.prototype.addContact = function (timeStamp, geomID) {
        if (timeStamp == this.lastTimeStamp || this.lastTimeStamp == null) {
            this.geomContact.push(geomID);
            this.lastTimeStamp = timeStamp;
        }
        else {
            this.geomContact = [];
            this.geomContact.push(geomID);
            this.lastTimeStamp = timeStamp;
        }
    };
    DynamicObject.prototype.getDxBodyPointersAndFlag = function () {
        Energy.dMassAdjust(this.dxMass, this.density);
        Energy.dBodySetMass(this.dxBody, this.dxMass);
        Energy.dGeomSetBody(this.dxGeom, this.dxBody);
        this.pointer_pos = Energy.dBodyGetPosition(this.dxBody);
        this.pointer_rot = Energy.dBodyGetQuaternion(this.dxBody);
        this.dxFlags = Energy.dBodyGetDxFlags(this.dxBody);
        EnergyTools.Free_dMass_Struc();
    };
    DynamicObject.prototype.dGeomSetMaterial = function (pmat) {
        if (this.dxGeom != null) {
            this.physicMaterial = pmat;
            this.dxMaterial = this.physicMaterial.dxMaterial;
            Energy.dGeomSetMaterial(this.dxGeom, this.physicMaterial.dxMaterial);
        }
        else {
            console.log("assign material failed, dxGeom is null");
        }
    };
    DynamicObject.prototype.dBodySetPosition = function (x, y, z) {
        Module._dBodySetPosition(this.dxBody, x, y, z);
    };
    DynamicObject.prototype.dBodySetRotation = function (R) {
        Energy.dBodySetRotation(this.dxBody, R);
    };
    DynamicObject.prototype.dBodySetQuaternion = function (w, x, y, z) {
        var q = EnergyTools.Malloc_Quaternion(w, x, y, z);
        Module._dBodySetQuaternion(this.dxBody, q);
    };
    DynamicObject.prototype.dGeomSetPosition = function (x, y, z) {
        Module._dGeomSetPosition(this.dxGeom, x, y, z);
    };
    DynamicObject.prototype.dGeomGetPosition = function () {
        return [Module.HEAPF64[((this.pointer_pos) >> 3)], Module.HEAPF64[((this.pointer_pos + 16) >> 3)], Module.HEAPF64[((this.pointer_pos + 8) >> 3)]];
    };
    DynamicObject.prototype.dGeomGetQuaternion = function () {
        var q = EnergyTools.Malloc_new_quaternion();
        Energy.dGeomGetQuaternion(this.dxGeom, q);
        return EnergyTools.Pointer_To_Vector4(q, true);
    };
    DynamicObject.prototype.dGeomSetQuaternion = function (w, x, y, z) {
        if (this.dxBody != null) {
            var q = EnergyTools.Malloc_Quaternion(w, x, y, z);
            Energy.dBodySetQuaternion(this.dxBody, q);
        }
        else {
            var q = EnergyTools.Malloc_Quaternion(w, x, y, z);
            Energy.dGeomSetQuaternion(this.dxGeom, q);
            this.pointer_rot = q;
        }
    };
    DynamicObject.prototype.dBodySetLinearVel = function (x, y, z) {
        Energy.dBodySetLinearVel(this.dxBody, x, y, z);
    };
    DynamicObject.prototype.dBodySetAngularVel = function (x, y, z) {
        Energy.dBodySetAngularVel(this.dxBody, x, y, z);
    };
    DynamicObject.prototype.dBodyAddForce = function (fx, fy, fz, useLocal) {
        if (useLocal) {
            Energy.dBodyAddRelForce(this.dxBody, fx, fy, fz);
        }
        else {
            Energy.dBodyAddForce(this.dxBody, fx, fy, fz);
        }
    };
    DynamicObject.prototype.dBodyGetForce = function () {
        return EnergyTools.Pointer_To_Vector3(Energy.dBodyGetForce(this.dxBody), true);
    };
    DynamicObject.prototype.dBodySetForce = function (fx, fy, fz) {
        Energy.dBodySetForce(this.dxBody, fx, fy, fz);
    };
    DynamicObject.prototype.dBodyAddTorque = function (fx, fy, fz, useLocal) {
        if (useLocal) {
            Energy.dBodyAddRelTorque(this.dxBody, fx, fy, fz);
        }
        else {
            Energy.dBodyAddTorque(this.dxBody, fx, fy, fz);
        }
    };
    DynamicObject.prototype.dBodySetTorque = function (fx, fy, fz) {
        Energy.dBodySetTorque(this.dxBody, fx, fy, fz);
    };
    DynamicObject.prototype.dBodySetFiniteRotationMode = function (v) {
        Energy.dBodySetFiniteRotationMode(this.dxBody, v);
    };
    DynamicObject.prototype.dBodySetGyroscopicMode = function (v) {
        Energy.dBodySetGyroscopicMode(this.dxBody, v);
    };
    DynamicObject.prototype.dBodyGetTorque = function () {
        return EnergyTools.Pointer_To_Vector3(Energy.dBodyGetTorque(this.dxBody), true);
    };
    DynamicObject.prototype.dBodyGetLinearVel = function () {
        return EnergyTools.Pointer_To_Vector3(Energy.dBodyGetLinearVel(this.dxBody), true);
    };
    DynamicObject.prototype.dBodyGetAngularVel = function () {
        return EnergyTools.Pointer_To_Vector3(Energy.dBodyGetAngularVel(this.dxBody), true);
    };
    DynamicObject.prototype.dBodyIsEnabled = function () {
        return Module.HEAP32[((this.dxFlags) >> 2)] & dxBodyDisabled;
    };
    DynamicObject.prototype.dBodySetNotification_interval = function (interval) {
        Energy.dBodySetNotification_interval(this.dxBody, interval);
    };
    DynamicObject.prototype.destroyDynamicObject = function () {
        if (this.dxGeom) {
            this.dGeomDestroy();
            this.dxGeom = null;
        }
        ;
        if (this.dxBody) {
            this.dBodyDestroy();
            this.dxBody = null;
        }
    };
    DynamicObject.prototype.dBodyGetFlags = function () {
        return Energy.dBodyGetFlags(this.dxBody);
    };
    DynamicObject.prototype.dBodySetFlags = function (flags) {
        Energy.dBodySetFlags(this.dxBody, flags);
    };
    DynamicObject.prototype.dBodyDestroy = function () {
        Module._dBodyDestroy(this.dxBody);
    };
    DynamicObject.prototype.dGeomDestroy = function () {
        Module._dGeomDestroy(this.dxBody);
    };
    DynamicObject.prototype.dBodyGetMass = function () {
        return Module.HEAPF64[((this.dxMass) >> 3)];
    };
    DynamicObject.prototype.dBodySetMass = function (density) {
        this.density = density;
        Energy.dMassAdjust(this.dxMass, this.density);
        Energy.dBodySetMass(this.dxBody, this.dxMass);
    };
    DynamicObject.prototype.getPosRqDouble = function () {
        this.posRq[0] = Module.getValue(this.pointer_pos + 0, 'double');
        this.posRq[1] = Module.getValue(this.pointer_pos + 8, 'double');
        this.posRq[2] = Module.getValue(this.pointer_pos + 16, 'double');
        this.posRq[3] = Module.getValue(this.pointer_rot + 0, 'double');
        this.posRq[4] = -Module.getValue(this.pointer_rot + 8, 'double');
        this.posRq[5] = -Module.getValue(this.pointer_rot + 16, 'double');
        this.posRq[6] = -Module.getValue(this.pointer_rot + 24, 'double');
        return this.posRq;
    };
    DynamicObject.prototype.getPosRqSingle = function () {
        this.posRq[0] = Module.getValue(this.pointer_pos + 0, 'float');
        this.posRq[1] = Module.getValue(this.pointer_pos + 4, 'float');
        this.posRq[2] = Module.getValue(this.pointer_pos + 8, 'float');
        this.posRq[3] = Module.getValue(this.pointer_rot + 0, 'float');
        this.posRq[4] = -Module.getValue(this.pointer_rot + 4, 'float');
        this.posRq[5] = -Module.getValue(this.pointer_rot + 8, 'float');
        this.posRq[6] = -Module.getValue(this.pointer_rot + 12, 'float');
        return this.posRq;
    };
    DynamicObject.NotifyState = function (pointer) {
        for (var i = 0; i < DynamicObject.Instances.length; i++) {
            if (pointer == DynamicObject.Instances[i].dxBody) {
                break;
            }
        }
    };
    DynamicObject.NotifyState2 = function (pointer) {
        for (var i = 0; i < DynamicObject.Instances.length; i++) {
            if (pointer == DynamicObject.Instances[i].dxBody) {
                break;
            }
        }
    };
    DynamicObject.Instances = new Array();
    DynamicObject.OInstances = {};
    return DynamicObject;
}());
var DynamicBox = (function (_super) {
    __extends(DynamicBox, _super);
    function DynamicBox(mesh, dxSpace, dxWorld, density, lx, ly, lz, uniqID, name) {
        if (name === void 0) { name = ""; }
        var _this = _super.call(this) || this;
        _this.lx = 0;
        _this.ly = 0;
        _this.lz = 0;
        _this.mesh = mesh;
        _this.dxWorld = dxWorld;
        _this.density = density;
        _this.dxSpace = dxSpace;
        _this.density = density;
        _this.uniqID = uniqID;
        _this.name = name;
        _this.lx = lx;
        _this.ly = ly;
        _this.lz = lz;
        _this.dxGeom = Energy.dCreateBox(_this.dxSpace, _this.lx, _this.ly, _this.lz);
        if (density != 0) {
            _this.dxBody = Energy.dBodyCreate(_this.dxWorld);
            _this.dxMass = EnergyTools.Malloc_dMass_Struct();
            Energy.dMassSetBox(_this.dxMass, _this.density, _this.lx, _this.ly, _this.lz);
            Energy.dMassAdjust(_this.dxMass, _this.density);
            Energy.dBodySetMass(_this.dxBody, _this.dxMass);
            Energy.dGeomSetBody(_this.dxGeom, _this.dxBody);
            _this.pointer_pos = Energy.dBodyGetPosition(_this.dxBody);
            _this.pointer_rot = Energy.dBodyGetQuaternion(_this.dxBody);
            EnergyTools.Free_dMass_Struc();
        }
        else {
            _this.pointer_pos = Energy.dGeomGetPosition(_this.dxGeom);
            _this.pointer_rot = EnergyTools.Malloc_new_quaternion();
            Energy.dGeomGetQuaternion(_this.dxGeom, _this.pointer_rot);
        }
        _this.dGeomSetMaterial(PhysicMaterial.GetDefault());
        DynamicObject.Instances.push(_this);
        DynamicObject.OInstances[_this.dxGeom] = _this;
        return _this;
    }
    return DynamicBox;
}(DynamicObject));
var DynamicSphere = (function (_super) {
    __extends(DynamicSphere, _super);
    function DynamicSphere(dxSpace, dxWorld, density, radius, uniqID, name) {
        if (name === void 0) { name = ""; }
        var _this = _super.call(this) || this;
        _this.radius = 0;
        _this.dxWorld = dxWorld;
        _this.density = density;
        _this.dxSpace = dxSpace;
        _this.uniqID = uniqID;
        _this.radius = radius;
        _this.name = name;
        _this.dxGeom = Energy.dCreateSphere(_this.dxSpace, _this.radius);
        if (density != 0) {
            _this.dxBody = Energy.dBodyCreate(_this.dxWorld);
            _this.dxMass = EnergyTools.Malloc_dMass_Struct();
            Energy.dMassSetSphere(_this.dxMass, _this.density, _this.radius);
            Energy.dMassAdjust(_this.dxMass, _this.density);
            Energy.dBodySetMass(_this.dxBody, _this.dxMass);
            Energy.dGeomSetBody(_this.dxGeom, _this.dxBody);
            _this.pointer_pos = Energy.dBodyGetPosition(_this.dxBody);
            _this.pointer_rot = Energy.dBodyGetQuaternion(_this.dxBody);
        }
        else {
            _this.pointer_pos = Energy.dGeomGetPosition(_this.dxGeom);
            _this.pointer_rot = EnergyTools.Malloc_new_quaternion();
            Energy.dGeomGetQuaternion(_this.dxGeom, _this.pointer_rot);
        }
        _this.dGeomSetMaterial(PhysicMaterial.GetDefault());
        DynamicObject.Instances.push(_this);
        return _this;
    }
    return DynamicSphere;
}(DynamicObject));
var DynamicCylinder = (function (_super) {
    __extends(DynamicCylinder, _super);
    function DynamicCylinder(dxSpace, dxWorld, density, radius, length, direction, uniqID, name) {
        if (name === void 0) { name = ""; }
        var _this = _super.call(this) || this;
        _this.dxWorld = dxWorld;
        _this.density = density;
        _this.dxSpace = dxSpace;
        _this.density = density;
        _this.dxBody = Energy.dBodyCreate(_this.dxWorld);
        _this.dxMass = EnergyTools.Malloc_dMass_Struct();
        _this.uniqID = uniqID;
        _this.name = name;
        _this.radius = radius;
        _this.length = length;
        _this.direction = direction;
        _this.dxGeom = Energy.dCreateCylinder(_this.dxSpace, _this.radius, _this.length);
        if (_this.density != 0) {
            Energy.dMassSetCylinder(_this.dxMass, _this.density, _this.direction, _this.radius, _this.length);
            Energy.dMassAdjust(_this.dxMass, _this.density);
            Energy.dBodySetMass(_this.dxBody, _this.dxMass);
            Energy.dGeomSetBody(_this.dxGeom, _this.dxBody);
            _this.pointer_pos = Energy.dBodyGetPosition(_this.dxBody);
            _this.pointer_rot = Energy.dBodyGetQuaternion(_this.dxBody);
        }
        else {
            _this.pointer_pos = Energy.dGeomGetPosition(_this.dxGeom);
            _this.pointer_rot = EnergyTools.Malloc_new_quaternion();
            Energy.dGeomGetQuaternion(_this.dxGeom, _this.pointer_rot);
        }
        _this.dGeomSetMaterial(PhysicMaterial.GetDefault());
        DynamicObject.Instances.push(_this);
        return _this;
    }
    return DynamicCylinder;
}(DynamicObject));
var DynamicCapsule = (function (_super) {
    __extends(DynamicCapsule, _super);
    function DynamicCapsule() {
        return _super.call(this) || this;
    }
    return DynamicCapsule;
}(DynamicObject));
var DynamicConvex = (function (_super) {
    __extends(DynamicConvex, _super);
    function DynamicConvex() {
        return _super.call(this) || this;
    }
    return DynamicConvex;
}(DynamicObject));
var DynamicRay = (function (_super) {
    __extends(DynamicRay, _super);
    function DynamicRay(dxSpace, length) {
        var _this = _super.call(this) || this;
        _this.dxSpace = dxSpace;
        _this.length = length;
        _this.dxGeom = Energy.dCreateRay(_this.dxSpace, _this.length);
        console.log("ray", _this.dxGeom);
        _this.setRay(0, 10, 0, 0, -10, 0);
        DynamicObject.Instances.push(_this);
        return _this;
    }
    DynamicRay.prototype.setRay = function (px, py, pz, dx, dy, dz) {
        Energy.dGeomRaySet(this.dxGeom, px, pz, py, dx, dz, dy);
    };
    DynamicRay.Instances = new Array();
    return DynamicRay;
}(DynamicObject));
var DynamicHeightmap = (function (_super) {
    __extends(DynamicHeightmap, _super);
    function DynamicHeightmap(dxSpace, dxWorld, heightData, width, depth, widthSamples, depthSamples, scale, offset, thickness, bWrap, uniqID, name) {
        if (name === void 0) { name = ""; }
        var _this = _super.call(this) || this;
        _this.dxWorld = dxWorld;
        _this.dxSpace = dxSpace;
        _this.uniqID = uniqID;
        _this.name = name;
        var pHeightData = EnergyTools.Malloc_Float64Array(heightData);
        _this.dxHeightfieldData = Energy.dGeomHeightfieldDataCreate();
        Energy.dGeomHeightfieldDataBuildDouble(_this.dxHeightfieldData, pHeightData, 0, width, depth, widthSamples + 1, depthSamples + 1, scale, offset, thickness, bWrap);
        Energy.dGeomHeightfieldDataSetBounds(_this.dxHeightfieldData, -30, 30);
        _this.dxGeom = Energy.dCreateHeightfield(_this.dxSpace, _this.dxHeightfieldData, 1);
        _this.pointer_pos = Energy.dGeomGetPosition(_this.dxGeom);
        _this.pointer_rot = EnergyTools.Malloc_new_quaternion();
        Energy.dGeomGetQuaternion(_this.dxGeom, _this.pointer_rot);
        _this.dGeomSetMaterial(PhysicMaterial.GetDefault());
        DynamicObject.Instances.push(_this);
        return _this;
    }
    return DynamicHeightmap;
}(DynamicObject));
var dynamicTriMesh = (function (_super) {
    __extends(dynamicTriMesh, _super);
    function dynamicTriMesh(dxSpace, dxWorld, vertices, indices, density, uniqID, name) {
        var _this = _super.call(this) || this;
        _this.dxWorld = dxWorld;
        _this.dxSpace = dxSpace;
        _this.uniqID = uniqID;
        _this.name = name;
        _this.density = density;
        var verticesPointer = EnergyTools.Malloc_Float32Array(vertices);
        var indicesPointer = EnergyTools.Malloc_Int32(indices);
        _this.dxTriMeshData = Energy.dGeomTriMeshDataCreate();
        Energy.dGeomTriMeshDataBuildSingle(_this.dxTriMeshData, verticesPointer, vertices.BYTES_PER_ELEMENT * 3, vertices.length / 3, indicesPointer, indices.length, indices.BYTES_PER_ELEMENT);
        _this.dxGeom = Energy.dCreateTriMesh(_this.dxSpace, _this.dxTriMeshData, 0, 0, 0);
        if (_this.density != 0) {
            _this.dxBody = Energy.dBodyCreate(_this.dxWorld);
            _this.dxMass = EnergyTools.Malloc_dMass_Struct();
            _this.pointer_pos = Energy.dBodyGetPosition(_this.dxBody);
            _this.pointer_rot = Energy.dBodyGetQuaternion(_this.dxBody);
            Energy.dMassSetTrimesh(_this.dxMass, _this.density, _this.dxGeom);
            Energy.dGeomSetBody(_this.dxGeom, _this.dxBody);
            var mc = EnergyTools.Pointer_To_Vector3(_this.dxMass + 8, false);
            Energy.dMassTranslate(_this.dxMass, -mc[0], -mc[1], -mc[2]);
            Energy.dBodySetMass(_this.dxBody, _this.dxMass);
        }
        else {
            _this.pointer_pos = Energy.dGeomGetPosition(_this.dxGeom);
            _this.pointer_rot = EnergyTools.Malloc_new_quaternion();
            Energy.dGeomGetQuaternion(_this.dxGeom, _this.pointer_rot);
        }
        _this.dGeomSetMaterial(PhysicMaterial.GetDefault());
        DynamicObject.Instances.push(_this);
        return _this;
    }
    return dynamicTriMesh;
}(DynamicObject));
var StaticPlane = (function () {
    function StaticPlane(dxSpace, a, b, c, d) {
        this.dxGeom = Energy.dCreatePlane(dxSpace, a, b, c, d);
        Energy.dGeomSetMaterial(this.dxGeom, PhysicMaterial.GetDefault().dxMaterial);
    }
    StaticPlane.prototype.getDxGeom = function () {
        return this.dxGeom;
    };
    return StaticPlane;
}());
var Energy = (function () {
    function Energy(scene, gravity, solver, contactFlagMode, numStep, numQuickStepIterations) {
        if (numStep === void 0) { numStep = 1; }
        if (numQuickStepIterations === void 0) { numQuickStepIterations = 20; }
        var _this = this;
        this.energyRawData = new Float64Array(24000);
        this.registeredMeshes = new Array();
        this.jointID = 0;
        this.stepSize = 0;
        this.maxContact = 3;
        this.dxJointGroup = 0;
        this.isRunning = false;
        this.t0 = 0;
        this.t1 = 0;
        this.timeT = 0;
        this.scene = scene;
        this._simloop = function () { return _this.simloop(); };
        this._simloopSafe = function () { return _this.simloopSafe(); };
        this.container = document.getElementById("fps");
        var energyInitialize = {
            gravity: gravity,
            solver: solver,
            numStep: numStep,
            numQuickStepIterations: numQuickStepIterations,
            contactFlagMode: contactFlagMode
        };
        this.initEnergy(energyInitialize);
    }
    Energy.AllReady = function () {
        console.log("allisready");
    };
    Energy.prototype.initEnergy = function (data) {
        Energy.dInitODE2(0);
        this.numStep = data.numStep;
        this.dxWorld = Energy.dWorldCreate();
        Energy.dWorldSetGravity(this.dxWorld, data.gravity.x, data.gravity.z, data.gravity.y);
        this.dxSpace = Energy.dSimpleSpaceCreate(0);
        this.solver = data.solver;
        if (this.solver == Energy.QUICK_STEP) {
            console.log("QuickStep mode");
            Energy.dWorldSetQuickStepNumIterations(this.dxWorld, data.numQuickStepIterations);
        }
        else {
            console.log("NormalStep mode");
        }
        this.dxContactgroup = Energy.dJointGroupCreate(0);
        Energy.init(this.dxWorld, this.dxSpace, this.dxContactgroup, data.contactFlagMode);
    };
    Energy.prototype.setTimeStep = function (stepSize) {
        this.stepSize = stepSize;
    };
    Energy.prototype.getTimeStep = function () {
        return this.stepSize;
    };
    Energy.prototype.setTimeStepAndNumStep = function (stepSize, numStep) {
        this.stepSize = stepSize;
        Energy.setTimestep(stepSize, numStep);
    };
    Energy.prototype.setMotionVector = function (mesh, v) {
        var geom = DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dxGeom;
        var v_ptr = EnergyTools.Malloc_Vector3(v.x, v.z, v.y);
        Energy.dGeomSetMotionVector(geom, v_ptr);
    };
    Energy.prototype.setMaxContact = function (maxContact) {
        this.maxContact = maxContact;
        Energy.setMaxContact(maxContact);
    };
    Energy.prototype.getMaxContact = function () {
        return this.maxContact;
    };
    Energy.prototype.dWorldSetERP = function (value) {
        Energy.dWorldSetERP(this.dxWorld, value);
    };
    Energy.prototype.dWorldSetCFM = function (value) {
        Energy.dWorldSetCFM(this.dxWorld, value);
    };
    Energy.prototype.dWorldGetERP = function () {
        return Energy.dWorldGetERP(this.dxWorld);
    };
    Energy.prototype.dWorldGetCFM = function () {
        return Energy.dWorldGetCFM(this.dxWorld);
    };
    Energy.prototype.dWorldSetFlags = function (flag) {
        Energy.dWorldSetFlags(this.dxWorld, flag);
    };
    Energy.prototype.dWorldSetAutoDisableFlag = function (do_auto_disable) {
        Energy.dWorldSetAutoDisableFlag(this.dxWorld, do_auto_disable);
    };
    Energy.prototype.dWorldSetAutoDisableAverageSamplesCount = function (value) {
        Energy.dWorldSetAutoDisableAverageSamplesCount(this.dxWorld, value);
    };
    Energy.prototype.dWorldSetAutoDisableLinearThreshold = function (linearThreshold) {
        Energy.dWorldSetAutoDisableLinearThreshold(this.dxWorld, linearThreshold);
    };
    Energy.prototype.dWorldSetAutoDisableAngularThreshold = function (angularThreshold) {
        Energy.dWorldSetAutoDisableAngularThreshold(this.dxWorld, angularThreshold);
    };
    Energy.prototype.dWorldSetAutoDisableSteps = function (steps) {
        Energy.dWorldSetAutoDisableSteps(this.dxWorld, steps);
    };
    Energy.prototype.dWorldSetAutoDisableTime = function (time) {
        Energy.dWorldSetAutoDisableSteps(this.dxWorld, time);
    };
    Energy.prototype.dWorldSetNotificationInterval = function (interval) {
        Energy.dWorldSetNotificationInterval(this.dxWorld, interval);
    };
    Energy.prototype.dWorldGetGravity2 = function () {
        var ar = EnergyTools.Pointer_To_Vector3(Energy.dWorldGetGravity2(this.dxWorld), true);
        return new BABYLON.Vector3(ar[0], ar[1], ar[2]);
    };
    Energy.prototype.dWorldSetGravity = function (x, y, z) {
        Energy.dWorldSetGravity(this.dxWorld, x, z, y);
    };
    Energy.prototype.startSimulation = function () {
        console.log("just before startSimulation");
        if (!this.isRunning) {
            console.log("startSimulation");
            this.scene.registerBeforeRender(this._simloop);
            this.isRunning = true;
        }
    };
    Energy.prototype.pauseSimulation = function () {
        if (this.isRunning) {
            this.scene.unregisterBeforeRender(this._simloop);
            this.isRunning = false;
        }
    };
    Energy.prototype.deleteSimulation = function (disposeMesh) {
    };
    Energy.prototype.simloopSafe = function () {
        var index = 0;
        for (var i = 0; i < DynamicObject.Instances.length; i++) {
            var arr = DynamicObject.Instances[i].getPosRqSingle();
            for (var j = 0; j < 7; j++) {
                this.energyRawData[index++] = arr[j];
            }
        }
        this.t0 = Date.now();
        var index = 0;
        for (var i = 0; i < this.registeredMeshes.length; i++) {
            this.registeredMeshes[i].position.x = this.energyRawData[index++];
            this.registeredMeshes[i].position.z = this.energyRawData[index++];
            this.registeredMeshes[i].position.y = this.energyRawData[index++];
            this.registeredMeshes[i].rotationQuaternion.w = this.energyRawData[index++];
            this.registeredMeshes[i].rotationQuaternion.x = this.energyRawData[index++];
            this.registeredMeshes[i].rotationQuaternion.z = this.energyRawData[index++];
            this.registeredMeshes[i].rotationQuaternion.y = this.energyRawData[index++];
        }
        this.doStep();
        this.t1 = Date.now() - this.t0;
    };
    Energy.prototype.simloop = function () {
        if (!this.isRunning) {
            return;
        }
        this.t0 = Date.now();
        this.doStep();
        for (var i = 0; i < this.registeredMeshes.length; i++) {
            this.p = DynamicObject.Instances[i].pointer_pos;
            this.registeredMeshes[i].position.x = Module.HEAPF64[((this.p) >> 3)];
            this.registeredMeshes[i].position.z = Module.HEAPF64[((this.p + 8) >> 3)];
            this.registeredMeshes[i].position.y = Module.HEAPF64[((this.p + 16) >> 3)];
            this.r = DynamicObject.Instances[i].pointer_rot;
            this.registeredMeshes[i].rotationQuaternion.w = Module.HEAPF64[((this.r) >> 3)];
            this.registeredMeshes[i].rotationQuaternion.x = -Module.HEAPF64[((this.r + 8) >> 3)];
            this.registeredMeshes[i].rotationQuaternion.z = -Module.HEAPF64[((this.r + 16) >> 3)];
            this.registeredMeshes[i].rotationQuaternion.y = -Module.HEAPF64[((this.r + 24) >> 3)];
        }
        this.t1 = Date.now() - this.t0;
    };
    Energy.prototype.collision = function () {
        this.timeT++;
        var nCol = Energy.getGeomsCollisionDataLength();
        var pointer_pos = Energy.getGeomsCollisionData();
        var pointer_body = Energy.getGeomsCollisionBody();
        for (var i = 0; i < nCol * 3; i = i + 3) {
            Energy.Col[i] = Module.HEAPF64[((pointer_pos) >> 3)];
            Energy.Col[i + 1] = Module.HEAPF64[((pointer_pos + 8) >> 3)];
            Energy.Col[i + 2] = Module.HEAPF64[((pointer_pos + 16) >> 3)];
            var t1 = Module.HEAP32[((pointer_body) >> 2)];
            var t2 = Module.HEAP32[((pointer_body + 4) >> 2)];
            if (DynamicObject.OInstances[t1] && DynamicObject.OInstances[t2]) {
                DynamicObject.OInstances[t1].addContact(this.timeT, DynamicObject.OInstances[t2].dxGeom);
            }
            pointer_pos += 24;
            pointer_body += 8;
        }
    };
    Energy.prototype.doStep = function () {
        if (!this.isRunning) {
            return;
        }
        if (this.solver == Energy.QUICK_STEP) {
            for (var i = 0; i < this.numStep; i++) {
                Module._run();
                Module._dWorldQuickStep(this.dxWorld, this.stepSize);
            }
        }
        else {
            Module._run();
            Module._dWorldStep(this.dxWorld, this.stepSize);
        }
        Module._dJointGroupEmpty(this.dxContactgroup);
    };
    Energy.prototype.destroyObjectFromSimulation = function (mesh) {
        for (var i = 0; i < this.registeredMeshes.length; i++) {
            if (this.registeredMeshes[i] == mesh) {
                this.registeredMeshes.splice(i, 1);
                mesh.dispose();
                DynamicObject.Instances[i].destroyDynamicObject();
                DynamicObject.Instances.splice(i, 1);
                break;
            }
        }
    };
    Energy.prototype.destroySimulation = function () {
        console.log("energy.js : destroy simulation *");
        this.pauseSimulation();
        for (var i = 0; i < DynamicObject.Instances.length; i++) {
            Energy.dGeomDestroy(DynamicObject.Instances[i].dxGeom);
        }
        for (var i = 0; i < Djoint.Instances.length; i++) {
            Djoint.Instances[i].dJointDestroy();
        }
        Module._dWorldDestroy(this.dxWorld);
        for (var i = 0; i < this.registeredMeshes.length; i++) {
            this.registeredMeshes[i].dispose();
        }
        DynamicObject.Instances = [];
        Djoint.Instances = [];
        this.registeredMeshes = [];
    };
    Energy.prototype.__destroySimulation = function () {
        Energy.dWorldDestroy(this.dxWorld);
        for (var i = 0; i < this.registeredMeshes.length; i++) {
            this.registeredMeshes[i].dispose();
        }
        DynamicObject.Instances = [];
        Djoint.Instances = [];
    };
    Energy.prototype.dJointDestroy = function (jointID) {
        var dJoint = Djoint.Instances[this.getJointByID(jointID)];
        dJoint.dJointDestroy();
    };
    Energy.prototype.dBodyEnable = function (mesh) {
        Energy.dBodyEnable(DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dxBody);
    };
    Energy.prototype.dBodyDisable = function (mesh) {
        Energy.dBodyDisable(DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dxBody);
    };
    Energy.prototype.dBodyIsEnabled = function (mesh) {
        return DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dBodyIsEnabled();
    };
    Energy.prototype.addDJointHinge2 = function (body1, body2, anchor, axis1, axis2, name) {
        if (body1 == null || body2 == null) {
            throw new Error("addDJointHinge2 body1 or/and body2 is null, we need 2 valid mesh");
        }
        var uniqID = this.jointID++;
        var joint = {
            body1ID: body1.uniqueId,
            body2ID: body2 != null ? body2.uniqueId : 0,
            anchor: anchor,
            axis1: axis1,
            axis2: axis2,
            uniqID: uniqID,
            name: name
        };
        var dJointHinge2 = new DJointHinge2(this.dxWorld, this.dxJointGroup, joint.uniqID, joint.name);
        var b1 = DynamicObject.Instances[this.getDynamicObjectByID(joint.body1ID)].dxBody;
        var b2 = DynamicObject.Instances[this.getDynamicObjectByID(joint.body2ID)].dxBody;
        dJointHinge2.dJointAttach(b1, b2);
        dJointHinge2.dJointSetHinge2Anchor(joint.anchor.x, joint.anchor.z, joint.anchor.y);
        dJointHinge2.dJointSetHinge2Axis1(joint.axis1.x, joint.axis1.z, joint.axis1.y);
        dJointHinge2.dJointSetHinge2Axis2(joint.axis2.x, joint.axis2.z, joint.axis2.y);
        return uniqID;
    };
    Energy.prototype.addDJointBall = function (body1, body2, anchor, name) {
        if (body1 == null) {
            throw new Error("addDJointBall body1 is null, only body2 can be null");
        }
        var uniqID = this.jointID++;
        var joint = {
            body1ID: body1.uniqueId,
            body2ID: body2 != null ? body2.uniqueId : 0,
            anchor: anchor,
            uniqID: uniqID,
            name: name
        };
        var dJointBall = new DJointBall(this.dxWorld, this.dxJointGroup, joint.uniqID, joint.name);
        var b1 = DynamicObject.Instances[this.getDynamicObjectByID(joint.body1ID)].dxBody;
        var b2;
        if (joint.body2ID != null) {
            b2 = DynamicObject.Instances[this.getDynamicObjectByID(joint.body2ID)].dxBody;
        }
        else {
            b2 = 0;
        }
        dJointBall.dJointAttach(b1, b2);
        dJointBall.dJointSetBallAnchor(joint.anchor.x, joint.anchor.z, joint.anchor.y);
        return uniqID;
    };
    Energy.prototype.addDJointFixed = function (body1, body2, anchor) {
        var uniqID = this.jointID++;
        var joint = {
            body1ID: body1.uniqueId,
            body2ID: body2 != null ? body2.uniqueId : null,
            anchor: anchor,
            uniqID: uniqID,
            name: name
        };
        var dJointFixed = new DJointFixed(this.dxWorld, this.dxJointGroup, joint.uniqID, joint.name);
        var b1 = DynamicObject.Instances[this.getDynamicObjectByID(joint.body1ID)].dxBody;
        var b2;
        if (joint.body2ID != null) {
            b2 = DynamicObject.Instances[this.getDynamicObjectByID(joint.body2ID)].dxBody;
        }
        else {
            b2 = 0;
        }
        dJointFixed.dJointAttach(b1, b2);
        return uniqID;
    };
    Energy.prototype.addDJointHinge = function (body1, body2, anchor, axis, name) {
        if (body1 == null) {
            throw new Error("addDJointHinge body1 is null, only body2 can be null");
        }
        var uniqID = this.jointID++;
        var joint = {
            body1ID: body1.uniqueId,
            body2ID: body2 != null ? body2.uniqueId : null,
            anchor: anchor,
            axis: axis,
            uniqID: uniqID,
            name: name
        };
        var dJointHinge = new DJointHinge(this.dxWorld, this.dxJointGroup, joint.uniqID, joint.name);
        var b1 = DynamicObject.Instances[this.getDynamicObjectByID(joint.body1ID)].dxBody;
        var b2;
        if (joint.body2ID != null) {
            b2 = DynamicObject.Instances[this.getDynamicObjectByID(joint.body2ID)].dxBody;
        }
        else {
            b2 = 0;
        }
        dJointHinge.dJointAttach(b1, b2);
        dJointHinge.dJointSetHingeAnchor(joint.anchor.x, joint.anchor.z, joint.anchor.y);
        dJointHinge.dJointSetHingeAxis(joint.axis.x, joint.axis.z, joint.axis.y);
        return uniqID;
    };
    Energy.prototype.dJointSetParam = function (joint, parameter, value) {
        var jointParameter = {
            jointID: joint,
            parameter: parameter,
            value: value
        };
        var dJoint = Djoint.Instances[this.getJointByID(jointParameter.jointID)];
        dJoint.dJointSetParam(jointParameter.parameter, jointParameter.value);
    };
    Energy.prototype.dJointGetHinge2Angle1 = function (jointID) {
        var dJointHinge = Djoint.Instances[this.getJointByID(jointID)];
        return dJointHinge.dJointGetHinge2Angle1();
    };
    Energy.prototype.dBodyGetTorque = function (body) {
        return DynamicObject.Instances[this.getDynamicObjectByID(body.uniqueId)].dBodyGetTorque();
    };
    Energy.prototype.dBodyGetForce = function (mesh) {
        return DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dBodyGetForce();
    };
    Energy.prototype.getdjointHinge2Anchor = function (jointID) {
        var dJointHinge = Djoint.Instances[this.getJointByID(jointID)];
        return dJointHinge.dJointGetHinge2Anchor();
    };
    Energy.prototype.getdjointHinge2Anchor2 = function (jointID) {
        var dJointHinge = Djoint.Instances[this.getJointByID(jointID)];
        return dJointHinge.dJointGetHinge2Anchor2();
    };
    Energy.prototype.getdjointHinge2Axis1 = function (jointID) {
        var dJointHinge = Djoint.Instances[this.getJointByID(jointID)];
        return dJointHinge.dJointGetHinge2Axis1();
    };
    Energy.prototype.getdjointHinge2Axis2 = function (jointID) {
        var dJointHinge = Djoint.Instances[this.getJointByID(jointID)];
        return dJointHinge.dJointGetHinge2Axis2();
    };
    Energy.prototype.getdjointHingeAnchor = function (jointID) {
        var dJointHinge = Djoint.Instances[this.getJointByID(jointID)];
        return dJointHinge.dJointGetHingeAnchor();
    };
    Energy.prototype.getdjointHingeAnchor2 = function (jointID) {
        var dJointHinge = Djoint.Instances[this.getJointByID(jointID)];
        return dJointHinge.dJointGetHingeAnchor2();
    };
    Energy.prototype.getdjointGetHingeAngle = function (jointID) {
        var dJointHinge = Djoint.Instances[this.getJointByID(jointID)];
        return dJointHinge.dJointGetHingeAngle();
    };
    Energy.prototype.getdjointGetHingeAngleRate = function (jointID) {
        var dJointHinge = Djoint.Instances[this.getJointByID(jointID)];
        return dJointHinge.dJointGetHingeAngleRate();
    };
    Energy.prototype.getdjointHingeAxis = function (jointID) {
        var dJointHinge = Djoint.Instances[this.getJointByID(jointID)];
        return dJointHinge.dJointGetHingeAxis();
    };
    Energy.prototype.addDJointSlider = function (body1, body2, axis, name) {
        if (body1 == null) {
            throw new Error("addDJointSlider body1 is null, only body2 can be null");
        }
        var uniqID = this.jointID++;
        var joint = {
            body1ID: body1.uniqueId,
            body2ID: body2 != null ? body2.uniqueId : null,
            axis: axis,
            uniqID: uniqID,
            name: name
        };
        var dJointSlider = new DJointSlider(this.dxWorld, this.dxJointGroup, joint.uniqID, joint.name);
        var b1 = DynamicObject.Instances[this.getDynamicObjectByID(joint.body1ID)].dxBody;
        var b2;
        if (joint.body2ID != null) {
            b2 = DynamicObject.Instances[this.getDynamicObjectByID(joint.body2ID)].dxBody;
        }
        else {
            b2 = 0;
        }
        dJointSlider.dJointAttach(b1, b2);
        dJointSlider.dJointSetSliderAxis(joint.axis.x, joint.axis.z, joint.axis.y);
        return uniqID;
    };
    Energy.prototype.addDJointTransmission = function (body1, body2, transmissionMode, ratio, anchor1, anchor2, axis, name) {
        if (body1 == null || body2 == null) {
            throw new Error("addDJointTransmission body1 or/and body2 is null, we need 2 valid mesh");
        }
        var uniqID = this.jointID++;
        var joint = {
            body1ID: body1.uniqueId,
            body2ID: body2 != null ? body2.uniqueId : null,
            transmissionMode: transmissionMode,
            ratio: ratio,
            anchor1: anchor1,
            anchor2: anchor2,
            axis: axis,
            uniqID: uniqID,
            name: name
        };
        var dJointTransmission = new DJointTransmission(this.dxWorld, this.dxJointGroup, joint.uniqID, joint.name);
        var b1 = DynamicObject.Instances[this.getDynamicObjectByID(joint.body1ID)].dxBody;
        var b2 = DynamicObject.Instances[this.getDynamicObjectByID(joint.body2ID)].dxBody;
        dJointTransmission.dJointAttach(b1, b2);
        dJointTransmission.dJointSetTransmissionMode(joint.transmissionMode);
        dJointTransmission.dJointSetTransmissionRatio(joint.ratio);
        dJointTransmission.dJointSetTransmissionAnchor1(joint.anchor1.x, joint.anchor1.z, joint.anchor1.y);
        dJointTransmission.dJointSetTransmissionAnchor2(joint.anchor2.x, joint.anchor2.z, joint.anchor2.y);
        dJointTransmission.dJointSetTransmissionAxis(joint.axis.x, joint.axis.z, joint.axis.y);
        return uniqID;
    };
    Energy.prototype.addStaticPlane = function (a, b, c, d) {
        new StaticPlane(this.dxSpace, a, b, c, d);
    };
    Energy.prototype.addDynamicRay = function (length) {
        var ray = new DynamicRay(this.dxSpace, length);
    };
    Energy.prototype.addDynamicTriMesh = function (mesh, density) {
        if (mesh.rotationQuaternion == null) {
            var q = BABYLON.Quaternion.RotationYawPitchRoll(mesh.rotation.y, mesh.rotation.x, mesh.rotation.z);
            mesh.rotationQuaternion = q;
        }
        else {
        }
        var vb = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        var vertices = new Float32Array(vb.length);
        var index = 0;
        for (var i = 0; i < vb.length; i = i + 3) {
            vertices[index++] = vb[i];
            vertices[index++] = vb[i + 2];
            vertices[index++] = vb[i + 1];
        }
        var indices = mesh.getIndices();
        var indices32 = new Int32Array(indices.length);
        index = 0;
        for (var i = 0; i < indices.length; i = i + 3) {
            indices32[index++] = indices[i + 2];
            indices32[index++] = indices[i + 0];
            indices32[index++] = indices[i + 1];
        }
        this.registeredMeshes.push(mesh);
        var dynTriMesh = new dynamicTriMesh(this.dxSpace, this.dxWorld, vertices, indices32, density, mesh.uniqueId, mesh.name);
        dynTriMesh.dGeomSetPosition(mesh.position.x, mesh.position.z, mesh.position.y);
        var rotationQuaternion = mesh.rotationQuaternion.asArray();
        dynTriMesh.dGeomSetQuaternion(rotationQuaternion[3], -rotationQuaternion[0], -rotationQuaternion[2], -rotationQuaternion[1]);
    };
    Energy.prototype.addDynamicHeightmap = function (mesh, width, depth, widthSamples, depthSamples, scale, offset, thickness, bWrap) {
        var vb = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        var heightsData = new Float64Array(vb.length / 3);
        var index = 0;
        for (var i = 0; i < vb.length; i += 3) {
            heightsData[index++] = vb[i + 1];
        }
        if (mesh.rotationQuaternion == null) {
            var q = BABYLON.Quaternion.RotationYawPitchRoll(mesh.rotation.y, mesh.rotation.x, mesh.rotation.z);
            var qForDXGeom = BABYLON.Quaternion.RotationYawPitchRoll(mesh.rotation.y, mesh.rotation.x - Math.PI / 2, mesh.rotation.z);
            mesh.rotationQuaternion = q;
        }
        else {
        }
        var heightmap = {
            type: Energy.HEIGHTFIELD,
            heightData: heightsData,
            position: mesh.position,
            rotation: qForDXGeom,
            width: width,
            depth: depth,
            widthSamples: widthSamples,
            depthSamples: depthSamples,
            scale: scale,
            offset: offset,
            thickness: thickness,
            bWrap: bWrap,
            uniqID: mesh.uniqueId,
            name: mesh.name
        };
        var dynamicHeightmap = new DynamicHeightmap(this.dxSpace, this.dxWorld, heightmap.heightData, heightmap.width, heightmap.depth, heightmap.widthSamples, heightmap.depthSamples, heightmap.scale, heightmap.offset, heightmap.thickness, heightmap.bWrap, heightmap.uniqID, heightmap.name);
        dynamicHeightmap.dGeomSetPosition(heightmap.position.x, heightmap.position.z, heightmap.position.y);
        dynamicHeightmap.dGeomSetQuaternion(heightmap.rotation.w, -heightmap.rotation.x, -heightmap.rotation.z, -heightmap.rotation.y);
    };
    Energy.prototype.addDynamicObject = function (mesh, meshType, density, direction) {
        mesh.computeWorldMatrix(true);
        if (mesh instanceof BABYLON.Mesh) {
            var bbox = mesh.getBoundingInfo().boundingBox;
        }
        else if (mesh instanceof BABYLON.InstancedMesh) {
            var bbox = mesh.getBoundingInfo().boundingBox;
        }
        if (mesh.rotationQuaternion == null) {
            var q = BABYLON.Quaternion.RotationYawPitchRoll(mesh.rotation.y, mesh.rotation.x, mesh.rotation.z);
            mesh.rotationQuaternion = q;
        }
        var lx = bbox.maximumWorld.x - bbox.minimumWorld.x;
        var ly = bbox.maximumWorld.y - bbox.minimumWorld.y;
        var lz = bbox.maximumWorld.z - bbox.minimumWorld.z;
        var radius;
        var length;
        var diameter;
        switch (meshType) {
            case Energy.SPHERE:
                radius = Math.max((lx), (ly), (lz)) / 2;
                var sphere = {
                    type: meshType,
                    radius: radius,
                    density: density,
                    rotation: mesh.rotationQuaternion.asArray(),
                    position: mesh.position,
                    name: mesh.name,
                    uniqID: mesh.uniqueId
                };
                this.registeredMeshes.push(mesh);
                var dynamicSphere = new DynamicSphere(this.dxSpace, this.dxWorld, sphere.density, sphere.radius, sphere.uniqID, sphere.name);
                dynamicSphere.dGeomSetPosition(sphere.position.x, sphere.position.z, sphere.position.y);
                dynamicSphere.dGeomSetQuaternion(sphere.rotation[3], -sphere.rotation[0], -sphere.rotation[2], -sphere.rotation[1]);
                break;
            case Energy.BOX:
                var x = bbox.vectorsWorld[0].subtract(bbox.vectorsWorld[2]).length();
                var z = bbox.vectorsWorld[0].subtract(bbox.vectorsWorld[4]).length();
                var y = bbox.vectorsWorld[0].subtract(bbox.vectorsWorld[3]).length();
                var box = {
                    type: meshType,
                    size: [x, y, z],
                    density: density,
                    rotation: mesh.rotationQuaternion.asArray(),
                    position: mesh.position.asArray(),
                    name: mesh.name,
                    uniqID: mesh.uniqueId
                };
                this.registeredMeshes.push(mesh);
                var dynamicBox = new DynamicBox(mesh, this.dxSpace, this.dxWorld, box.density, box.size[0], box.size[2], box.size[1], box.uniqID, box.name);
                dynamicBox.dGeomSetPosition(box.position[0], box.position[2], box.position[1]);
                dynamicBox.dGeomSetQuaternion(box.rotation[3], -box.rotation[0], -box.rotation[2], -box.rotation[1]);
                break;
            case Energy.CYLINDER:
                (lx == ly) ? (diameter = lx, length = lz) : (lx == lz) ? (diameter = lx, length = ly) : (ly == lz) ? (diameter == ly, length = lx) : null;
                var cylinder = {
                    type: meshType,
                    radius: diameter / 2,
                    length: length,
                    density: density,
                    direction: direction,
                    position: mesh.position,
                    rotation: mesh.rotationQuaternion.asArray(),
                    name: mesh.name,
                    uniqID: mesh.uniqueId
                };
                console.log(this.registeredMeshes.length);
                this.registeredMeshes.push(mesh);
                var dynamicCylinder = new DynamicCylinder(this.dxSpace, this.dxWorld, cylinder.density, cylinder.radius, cylinder.length, cylinder.direction, cylinder.uniqID, cylinder.name);
                dynamicCylinder.dGeomSetPosition(cylinder.position.x, cylinder.position.z, cylinder.position.y);
                dynamicCylinder.dGeomSetQuaternion(cylinder.rotation[3], -cylinder.rotation[0], -cylinder.rotation[2], -cylinder.rotation[1]);
        }
    };
    Energy.prototype.dBodySetPosition = function (mesh, p) {
        var data = {
            bodyID: mesh.uniqueId,
            position: p,
        };
        DynamicObject.Instances[this.getDynamicObjectByID(data.bodyID)].dBodySetPosition(data.position.x, data.position.z, data.position.y);
    };
    Energy.prototype.dBodySetQuaternion = function (mesh, q) {
        var data = {
            bodyID: mesh.uniqueId,
            rotation: q
        };
        DynamicObject.Instances[this.getDynamicObjectByID(data.bodyID)].dGeomSetQuaternion(data.rotation.w, -data.rotation.x, -data.rotation.z, -data.rotation.y);
    };
    Energy.prototype.dBodySetMass = function (mesh, density) {
        DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dBodySetMass(density);
    };
    Energy.prototype.dBodyGetMass = function (mesh) {
        return DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dBodyGetMass();
    };
    Energy.prototype.dBodyAddTorque = function (mesh, f, useLocal) {
        var data = {
            bodyID: mesh.uniqueId,
            force: f,
            useLocal: useLocal,
        };
        DynamicObject.Instances[this.getDynamicObjectByID(data.bodyID)].dBodyAddTorque(data.force.x, data.force.z, data.force.y, data.useLocal);
    };
    Energy.prototype.dBodyAddForce = function (mesh, f, useLocal) {
        if (useLocal === void 0) { useLocal = false; }
        var data = {
            bodyID: mesh.uniqueId,
            force: f,
            useLocal: useLocal
        };
        DynamicObject.Instances[this.getDynamicObjectByID(data.bodyID)].dBodyAddForce(data.force.x, data.force.z, data.force.y, data.useLocal);
    };
    Energy.prototype.getDynamicObjectByMesh = function (mesh) {
        return DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)];
    };
    Energy.prototype.getDynamicObjectByID = function (bodyID) {
        for (var i = 0; i < DynamicObject.Instances.length; i++) {
            if (DynamicObject.Instances[i].uniqID == bodyID) {
                return i;
                break;
            }
        }
        return 0;
    };
    Energy.prototype.getJointByID = function (jointID) {
        for (var i = 0; i < Djoint.Instances.length; i++) {
            if (Djoint.Instances[i].uniqID == jointID) {
                return i;
                break;
            }
        }
        return 0;
    };
    Energy.prototype.createPhysicMaterial = function (name) {
        var physicMaterial = new PhysicMaterial(name);
        return physicMaterial.dxMaterial;
    };
    Energy.prototype.getPhysicMaterialByID = function (dxMaterial) {
        for (var i = 0; i < PhysicMaterial.Instances.length; i++) {
            if (PhysicMaterial.Instances[i].dxMaterial == dxMaterial) {
                return i;
                break;
            }
        }
        return 0;
    };
    Energy.prototype.dBodySetSurfaceParameter = function (mesh, parameter, value) {
        var dxMaterial = this.getDynamicObjectByMesh(mesh).dxMaterial;
        this.setPhysicMaterialParameter(dxMaterial, parameter, value);
    };
    Energy.prototype.dBodyGetSurfaceParameter = function (mesh, parameter) {
        var dxMaterial = this.getDynamicObjectByMesh(mesh).dxMaterial;
        var physicMaterial = PhysicMaterial.Instances[this.getPhysicMaterialByID(dxMaterial)];
        return physicMaterial.getMaterialParameter(parameter);
    };
    Energy.prototype.setPhysicMaterialParameter = function (dxMaterial, parameter, value) {
        var physicMaterial = PhysicMaterial.Instances[this.getPhysicMaterialByID(dxMaterial)];
        physicMaterial.setMaterialParameter(parameter, value);
    };
    Energy.prototype.assignPhysicMaterialToMesh = function (dxMaterial, mesh) {
        var dynmamicObject = DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)];
        var physicMaterial = PhysicMaterial.Instances[this.getPhysicMaterialByID(dxMaterial)];
        dynmamicObject.dGeomSetMaterial(physicMaterial);
    };
    Energy.prototype.dBodyGetPosition = function (mesh) {
        return;
    };
    Energy.prototype.dBodySetTorque = function (mesh, f) {
        var data = {
            bodyID: mesh.uniqueId,
            force: f
        };
        DynamicObject.Instances[this.getDynamicObjectByID(data.bodyID)].dBodySetTorque(data.force.x, data.force.z, data.force.y);
    };
    Energy.prototype.dBodySetForce = function (mesh, f) {
        var data = {
            bodyID: mesh.uniqueId,
            force: f
        };
        DynamicObject.Instances[this.getDynamicObjectByID(data.bodyID)].dBodySetForce(data.force.x, data.force.z, data.force.y);
    };
    Energy.prototype.dBodySetLinearVel = function (mesh, f) {
        var data = {
            bodyID: mesh.uniqueId,
            force: f
        };
        DynamicObject.Instances[this.getDynamicObjectByID(data.bodyID)].dBodySetLinearVel(data.force.x, data.force.z, data.force.y);
    };
    Energy.prototype.dBodySetAngularVel = function (mesh, f) {
        var data = {
            bodyID: mesh.uniqueId,
            force: f
        };
        DynamicObject.Instances[this.getDynamicObjectByID(data.bodyID)].dBodySetAngularVel(data.force.x, data.force.z, data.force.y);
    };
    Energy.prototype.dBodySetZeroForce = function (mesh) {
        this.dBodyDisable(mesh);
        this.dBodySetForce(mesh, new BABYLON.Vector3(0, 0, 0));
        this.dBodySetTorque(mesh, new BABYLON.Vector3(0, 0, 0));
        this.dBodySetLinearVel(mesh, new BABYLON.Vector3(0, 0, 0));
        this.dBodySetAngularVel(mesh, new BABYLON.Vector3(0, 0, 0));
        this.dBodyEnable(mesh);
    };
    Energy.prototype.dBodyGetLinearVel = function (mesh) {
        return DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dBodyGetLinearVel();
    };
    Energy.prototype.dBodyGetAngularVel = function (mesh) {
        return DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dBodyGetAngularVel();
    };
    Energy.prototype.dBodyGetFlags = function (mesh) {
        return DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dBodyGetFlags();
    };
    Energy.prototype.dBodySetFlags = function (mesh, flags) {
        DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dBodySetFlags(flags);
    };
    Energy.prototype.dBodySetNotification_interval = function (mesh, interval) {
        DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dBodySetNotification_interval(interval);
    };
    Energy.prototype.dBodySetFiniteRotationMode = function (mesh, value) {
        DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dBodySetFiniteRotationMode(value);
    };
    Energy.prototype.dBodySetGyroscopicMode = function (mesh, value) {
        DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dBodySetGyroscopicMode(value);
    };
    Energy.prototype.dGeomGetPosition = function (mesh) {
        return DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dGeomGetPosition();
    };
    Energy.prototype.dGeomSetPosition = function (mesh, v) {
        DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dGeomSetPosition(v.x, v.z, v.y);
    };
    Energy.prototype.dGeomGetQuaternion = function (mesh) {
        return DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dGeomGetQuaternion();
    };
    Energy.prototype.dGeomSetQuaternion = function (mesh, q) {
        DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dGeomSetQuaternion(q.w, -q.x, -q.z, -q.y);
    };
    Energy.TEST = function () { console.log("hello from c"); };
    Energy.SPHERE = 0;
    Energy.BOX = 1;
    Energy.CYLINDER = 2;
    Energy.HEIGHTFIELD = 3;
    Energy.NORMAL_STEP = 0;
    Energy.QUICK_STEP = 1;
    Energy.Col = [];
    Energy.dBodyAddForce = Module.cwrap('dBodyAddForce', '', ['number', 'number', 'number', 'number']);
    Energy.dBodyAddRelForce = Module.cwrap('dBodyAddRelForce', '', ['number', 'number', 'number', 'number']);
    Energy.dBodyAddRelTorque = Module.cwrap('dBodyAddRelTorque', '', ['number', 'number', 'number', 'number']);
    Energy.dBodyAddTorque = Module.cwrap('dBodyAddTorque', '', ['number', 'number', 'number', 'number']);
    Energy.dBodyCreate = Module.cwrap('dBodyCreate', 'number', ['number']);
    Energy.dBodyDestroy = Module.cwrap('dBodyDestroy', '', ['number']);
    Energy.dBodyDisable = Module.cwrap('dBodyDisable', '', ['number']);
    Energy.dBodyEnable = Module.cwrap('dBodyEnable', '', ['number']);
    Energy.dBodyGetAngularVel = Module.cwrap('dBodyGetAngularVel', 'number', ['number']);
    Energy.dBodyGetForce = Module.cwrap('dBodyGetForce', 'number', ['number']);
    Energy.dBodyGetLinearVel = Module.cwrap('dBodyGetLinearVel', 'number', ['number']);
    Energy.dBodyGetPosition = Module.cwrap('dBodyGetPosition', 'number', ['number']);
    Energy.dBodyGetQuaternion = Module.cwrap('dBodyGetQuaternion', 'number', ['number']);
    Energy.dBodyGetTorque = Module.cwrap('dBodyGetTorque', 'number', ['number']);
    Energy.dBodyIsEnabled = Module.cwrap('dBodyIsEnabled', 'number', ['number']);
    Energy.dBodySetAngularVel = Module.cwrap('dBodySetAngularVel', '', ['number', 'number', 'number', 'number']);
    Energy.dBodySetAutoDisableAngularThreshold = Module.cwrap('dBodySetAutoDisableAngularThreshold', '', ['number', 'number']);
    Energy.dBodySetAutoDisableAverageSamplesCount = Module.cwrap('dBodySetAutoDisableTime', '', ['number', 'number']);
    Energy.dBodySetAutoDisableFlag = Module.cwrap('dBodySetAutoDisableFlag', '', ['number', 'number']);
    Energy.dBodySetAutoDisableLinearThreshold = Module.cwrap('dBodySetAutoDisableLinearThreshold', '', ['number', 'number']);
    Energy.dBodySetAutoDisableTime = Module.cwrap('dBodySetAutoDisableTime', '', ['number', 'number']);
    Energy.dBodySetFiniteRotationMode = Module.cwrap('dBodySetFiniteRotationMode', '', ['number', 'number']);
    Energy.dBodySetGyroscopicMode = Module.cwrap('dBodySetGyroscopicMode', '', ['number', 'number']);
    Energy.dBodySetForce = Module.cwrap('dBodySetForce', '', ['number', 'number', 'number', 'number']);
    Energy.dBodySetLinearVel = Module.cwrap('dBodySetLinearVel', '', ['number', 'number', 'number', 'number']);
    Energy.dBodySetMass = Module.cwrap('dBodySetMass', '', ['number', 'number']);
    Energy.dBodyGetMass = Module.cwrap('dBodyGetMass', '', ['number', 'number']);
    Energy.dBodySetPosition = Module.cwrap('dBodySetPosition', '', ['number', 'number', 'number', 'number']);
    Energy.dBodySetQuaternion = Module.cwrap('dBodySetQuaternion', '', ['number', 'number']);
    Energy.dBodySetRotation = Module.cwrap('dBodySetRotation', '', ['number', 'number']);
    Energy.dBodySetTorque = Module.cwrap('dBodySetTorque', '', ['number', 'number', 'number', 'number']);
    Energy.dBodyGetDxFlags = Module.cwrap('dBodyGetDxFlags', 'number', ['number']);
    Energy.dBodyGetFlags = Module.cwrap('dBodyGetFlags', 'number', ['number']);
    Energy.dBodySetFlags = Module.cwrap('dBodySetFlags', '', ['number', 'number']);
    Energy.dBodySetNotification_interval = Module.cwrap('dBodySetNotification_interval', '', ['number', 'number']);
    Energy.dCreateBox = Module.cwrap('dCreateBox', 'number', ['number', 'number', 'number', 'number']);
    Energy.dCreateCylinder = Module.cwrap('dCreateCylinder', 'number', ['number', 'number']);
    Energy.dCreateHeightfield = Module.cwrap('dCreateHeightfield', 'number', ['number', 'number', 'number']);
    Energy.dCreatePlane = Module.cwrap('dCreatePlane', 'number', ['number', 'number', 'number', 'number', 'number']);
    Energy.dCreateSphere = Module.cwrap('dCreateSphere', 'number', ['number', 'number']);
    Energy.dCreateTriMesh = Module.cwrap('dCreateTriMesh', 'number', ['number', 'number', 'number', 'number', 'number']);
    Energy.dCreateRay = Module.cwrap("dCreateRay", "number", ['number', 'number']);
    Energy.dGeomRaySet = Module.cwrap("dGeomRaySet", "", ['number', 'number', 'number', 'number', 'number', 'number', 'number']);
    Energy.dGeomDestroy = Module.cwrap('dGeomDestroy', '', ['number']);
    Energy.dGeomGetMaterial = Module.cwrap('dGeomGetMaterial', 'number', ['number']);
    Energy.dGeomGetPosition = Module.cwrap('dGeomGetPosition', 'number', ['number']);
    Energy.dGeomGetQuaternion = Module.cwrap('dGeomGetQuaternion', '', ['number', 'number']);
    Energy.dGeomHeightfieldDataBuildDouble = Module.cwrap('dGeomHeightfieldDataBuildDouble', '', ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number']);
    Energy.dGeomHeightfieldDataCreate = Module.cwrap('dGeomHeightfieldDataCreate', 'number', []);
    Energy.dGeomHeightfieldDataSetBounds = Module.cwrap('dGeomHeightfieldDataSetBounds', '', ['number', 'number', 'number']);
    Energy.dGeomSetBody = Module.cwrap('dGeomSetBody', '', ['number', 'number']);
    Energy.dGeomSetMaterial = Module.cwrap('dGeomSetMaterial', '', ['number', 'number']);
    Energy.dGeomSetMotionVector = Module.cwrap('dGeomSetMotionVector', '', ['number', 'number']);
    Energy.dGeomSetOffsetPosition = Module.cwrap('dGeomSetOffsetPosition', '', ['number', 'number', 'number']);
    Energy.dGeomSetPosition = Module.cwrap('dGeomSetPosition', '', ['number', 'number', 'number', 'number']);
    Energy.dGeomSetQuaternion = Module.cwrap('dGeomSetQuaternion', '', ['number', 'number']);
    Energy.dGeomTriMeshDataBuildSingle = Module.cwrap('dGeomTriMeshDataBuildSingle', '', []);
    Energy.dGeomTriMeshDataCreate = Module.cwrap('dGeomTriMeshDataCreate', 'number', []);
    Energy.getGeomsCollisionData = Module.cwrap('getGeomsCollisionData', 'number', []);
    Energy.getGeomsCollisionBody = Module.cwrap('getGeomsCollisionBody', 'number', []);
    Energy.getGeomsCollisionDataLength = Module.cwrap('getGeomsCollisionDataLength', 'number', []);
    Energy.dInitODE2 = Module.cwrap('dInitODE2', '', ['number']);
    Energy.dInitODE = Module.cwrap('dInitODE', '', []);
    Energy.dJointAttach = Module.cwrap('dJointAttach', '', ['number', 'number', 'number']);
    Energy.dJointCreateBall = Module.cwrap('dJointCreateBall', 'number', ['number', 'number']);
    Energy.dJointCreateHinge2 = Module.cwrap('dJointCreateHinge2', 'number', ['number', 'number']);
    Energy.dJointCreateHinge = Module.cwrap('dJointCreateHinge', 'number', ['number', 'number']);
    Energy.dJointCreateSlider = Module.cwrap('dJointCreateSlider', 'number', ['number', 'number']);
    Energy.dJointCreateTransmission = Module.cwrap('dJointCreateTransmission', '', ['number', 'number']);
    Energy.dJointCreateAMotor = Module.cwrap('dJointCreateAMotor', '', ['number', 'number']);
    Energy.dJointCreateLMotor = Module.cwrap('dJointCreateLMotor', '', ['number', 'number']);
    Energy.dJointCreateUniversal = Module.cwrap('dJointCreateUniversal', '', ['number', 'number']);
    Energy.dJointCreatePiston = Module.cwrap('dJointCreatePiston', '', ['number', 'number']);
    Energy.dJointCreateFixed = Module.cwrap('dJointCreateFixed', '', ['number', 'number']);
    Energy.dJointDestroy = Module.cwrap('dJointDestroy', '', ['number']);
    Energy.dJointGetHinge2Anchor2 = Module.cwrap('dJointGetHinge2Anchor2', '', ['number', 'number']);
    Energy.dJointGetHinge2Anchor = Module.cwrap('dJointGetHinge2Anchor', '', ['number', 'number']);
    Energy.dJointGetHinge2Angle1 = Module.cwrap('dJointGetHinge2Angle1', '', ['number']);
    Energy.dJointGetHinge2Axis1 = Module.cwrap('dJointGetHinge2Axis1', '', ['number', 'number']);
    Energy.dJointGetHinge2Axis2 = Module.cwrap('dJointGetHinge2Axis2', '', ['number', 'number']);
    Energy.dJointGetHingeAnchor2 = Module.cwrap('dJointGetHingeAnchor2', '', ['number', 'number']);
    Energy.dJointGetHingeAnchor = Module.cwrap('dJointGetHingeAnchor', '', ['number', 'number']);
    Energy.dJointGetHingeAxis = Module.cwrap('dJointGetHingeAxis', '', ['number', 'number']);
    Energy.dJointGetHingeAngle = Module.cwrap('dJointGetHingeAngle', 'number', ['number']);
    Energy.dJointGetHingeAngleRate = Module.cwrap('dJointGetHingeAngleRate', 'number', ['number']);
    Energy.dJointGroupCreate = Module.cwrap('dJointGroupCreate', 'number', ['number']);
    Energy.dJointGroupDestroy = Module.cwrap('dJointGroupDestroy', '', ['number']);
    Energy.dJointGroupEmpty = Module.cwrap('dJointGroupEmpty', '', ['number']);
    Energy.dJointSetBallAnchor = Module.cwrap('dJointSetBallAnchor', '', ['number', 'number', 'number', 'number']);
    Energy.dJointSetBallAnchor2 = Module.cwrap('dJointSetBallAnchor2', '', ['number', 'number', 'number', 'number']);
    Energy.dJointSetBallParam = Module.cwrap('dJointSetBallParam', '', ['number', 'number', 'number']);
    Energy.dJointGetBallAnchor = Module.cwrap('dJointGetBallAnchor', '', ['number', 'number']);
    Energy.dJointGetBallAnchor2 = Module.cwrap('dJointGetBallAnchor2', '', ['number', 'number']);
    Energy.dJointSetFeedback = Module.cwrap('dJointSetFeedback', '', ['number', 'number']);
    Energy.dJointSetHinge2Anchor = Module.cwrap('dJointSetHinge2Anchor', '', ['number', 'number', 'number', 'number']);
    Energy.dJointSetHinge2Axis1 = Module.cwrap('dJointSetHinge2Axis1', '', ['number', 'number', 'number', 'number']);
    Energy.dJointSetHinge2Axis2 = Module.cwrap('dJointSetHinge2Axis2', '', ['number', 'number', 'number', 'number']);
    Energy.dJointSetHinge2Param = Module.cwrap('dJointSetHinge2Param', '', ['number', 'number', 'number']);
    Energy.dJointSetHingeAnchor = Module.cwrap('dJointSetHingeAnchor', '', ['number', 'number', 'number', 'number']);
    Energy.dJointSetHingeAxis = Module.cwrap('dJointSetHingeAxis', '', ['number', 'number', 'number', 'number']);
    Energy.dJointSetHingeParam = Module.cwrap('dJointSetHingeParam', '', ['number', 'number', 'number']);
    Energy.dJointSetSliderAxis = Module.cwrap('dJointSetSliderAxis', '', ['number', 'number', 'number', 'number']);
    Energy.dJointSetSliderParam = Module.cwrap('dJointSetSliderParam', '', ['number', 'number', 'number']);
    Energy.dJointSetTransmissionAnchor1 = Module.cwrap('dJointSetTransmissionAnchor1', '', ['number', 'number', 'number', 'number']);
    Energy.dJointSetTransmissionAnchor2 = Module.cwrap('dJointSetTransmissionAnchor2', '', ['number', 'number', 'number', 'number']);
    Energy.dJointSetTransmissionAxis1 = Module.cwrap('dJointSetTransmissionAxis1', '', ['number', 'number', 'number', 'number']);
    Energy.dJointSetTransmissionAxis2 = Module.cwrap('dJointSetTransmissionAxis2', '', ['number', 'number', 'number', 'number']);
    Energy.dJointSetTransmissionAxis = Module.cwrap('dJointSetTransmissionAxis', '', ['number', 'number', 'number', 'number']);
    Energy.dJointSetTransmissionBacklash = Module.cwrap('dJointSetTransmissionBacklash', '', ['number', 'number']);
    Energy.dJointSetTransmissionMode = Module.cwrap('dJointSetTransmissionMode', '', ['number', 'number']);
    Energy.dJointSetTransmissionRatio = Module.cwrap('dJointSetTransmissionRatio', '', ['number', 'number']);
    Energy.dMassAdjust = Module.cwrap('dMassAdjust', '', ['number', 'number']);
    Energy.dMassSetBox = Module.cwrap('dMassSetBox', '', ['number', 'number', 'number', 'number']);
    Energy.dMassSetCylinder = Module.cwrap('dMassSetCylinder', '', ['number', 'number', 'number', 'number', 'number']);
    Energy.dMassSetSphere = Module.cwrap('dMassSetSphere', '', ['number', 'number', 'number']);
    Energy.dMassSetTrimesh = Module.cwrap('dMassSetTrimesh', '', ['number', 'number', 'number']);
    Energy.dMassTranslate = Module.cwrap('dMassTranslate', '', ['number', 'number', 'number']);
    Energy.dMaterialCreate = Module.cwrap('dMaterialCreate', 'number', ['number']);
    Energy.dMaterialGetParameter = Module.cwrap('dMaterialGetParameter', 'number', ['number', 'number']);
    Energy.dMaterialSetParameter = Module.cwrap('dMaterialSetParameter', '', ['number', 'number', 'number']);
    Energy.dRFromAxisAndAngle = Module.cwrap('dRFromAxisAndAngle', '', ['number', 'number', 'number', 'number', 'number']);
    Energy.dRFromZAxis = Module.cwrap('dRFromZAxis', '', ['number', 'number', 'number', 'number']);
    Energy.dRSetIdentity = Module.cwrap('dRSetIdentity', '', ['number']);
    Energy.dAreConnected = Module.cwrap('dAreConnected', 'number', ['number', 'number']);
    Energy.dAreConnectedExcluding = Module.cwrap('dAreConnectedExcluding', 'number', ['number', 'number', 'number']);
    Energy.dSimpleSpaceCreate = Module.cwrap('dSimpleSpaceCreate', 'number', ['number']);
    Energy.dHashSpaceCreate = Module.cwrap('dHashSpaceCreate', 'number', ['number']);
    Energy.dHashSpaceSetLevels = Module.cwrap('dHashSpaceSetLevels', '', ['number', 'number', 'number']);
    Energy.dSpaceDestroy = Module.cwrap('dSpaceDestroy', '', ['number']);
    Energy.dSpaceCollide = Module.cwrap('dSpaceCollide', '', ['number', 'number', 'number']);
    Energy.dWorldCreate = Module.cwrap('dWorldCreate', '', ['number']);
    Energy.dWorldGetGravity2 = Module.cwrap('dWorldGetGravity2', 'number', ['number']);
    Energy.dWorldDestroy = Module.cwrap('dWorldDestroy', '', ['number']);
    Energy.dWorldGetQuickStepNumIterations = Module.cwrap('dWorldGetQuickStepNumIterations', 'number', ['number']);
    Energy.dWorldQuickStep = Module.cwrap('dWorldQuickStep', 'number', ['number', 'number']);
    Energy.dWorldSetGravity = Module.cwrap('dWorldSetGravity', '', ['number', 'number', 'number', 'number']);
    Energy.dWorldSetQuickStepNumIterations = Module.cwrap('dWorldSetQuickStepNumIterations', '', ['number', 'number']);
    Energy.dWorldStep = Module.cwrap('dWorldStep', 'number', ['number', 'number']);
    Energy.dWorldSetAutoDisableAverageSamplesCount = Module.cwrap('dWorldSetAutoDisableAverageSamplesCount', '', ['number', 'number']);
    Energy.dWorldSetAutoDisableFlag = Module.cwrap('dWorldSetAutoDisableFlag', '', ['number', 'number']);
    Energy.dWorldSetAutoDisableLinearThreshold = Module.cwrap('dWorldSetAutoDisableLinearThreshold', '', ['number', 'number']);
    Energy.dWorldSetAutoDisableAngularThreshold = Module.cwrap('dWorldSetAutoDisableAngularThreshold', '', ['number', 'number']);
    Energy.dWorldSetAutoDisableSteps = Module.cwrap('dWorldSetAutoDisableSteps', '', ['number', 'number']);
    Energy.dWorldSetAutoDisableTime = Module.cwrap('dWorldSetAutoDisableTime', '', ['number', 'number']);
    Energy.dWorldSetNotificationInterval = Module.cwrap('dWorldSetNotificationInterval', '', ['number', 'number']);
    Energy.dWorldSetFlags = Module.cwrap('dWorldSetFlags', '', ['number', 'number']);
    Energy.dWorldGetFlags = Module.cwrap('dWorldGetFlags', 'number', ['number']);
    Energy.dWorldGetDxFlags = Module.cwrap('dWorldGetDxFlags', 'number', ['number']);
    Energy.dWorldSetERP = Module.cwrap('dWorldSetERP', '', ['number', 'number']);
    Energy.dWorldSetCFM = Module.cwrap('dWorldSetCFM', '', ['number', 'number']);
    Energy.dWorldGetERP = Module.cwrap('dWorldGetERP', 'number', ['number']);
    Energy.dWorldGetCFM = Module.cwrap('dWorldGetCFM', 'number', ['number']);
    Energy.init = Module.cwrap('init', 'boolean', ['number', 'number', 'number', 'number']);
    Energy.setFlagmode = Module.cwrap('setFlagmode', '', ['number']);
    Energy.setFlagmode2 = Module.cwrap('setFlagmode2', '', ['number']);
    Energy.setMaxContact = Module.cwrap('setMaxContact', '', ['number']);
    Energy.setTimestep = Module.cwrap('setTimestep', '', ['number', 'number']);
    Energy.run = Module.cwrap('run', '', []);
    Energy.closeEnergy = Module.cwrap('dCloseODE', '', []);
    return Energy;
}());
var dParamLoStop = 0;
var dParamHiStop = 1;
var dParamVel = 2;
var dParamLoVel = 3;
var dParamHiVel = 4;
var dParamFMax = 5;
var dParamFudgeFactor = 6;
var dParamBounce = 7;
var dParamCFM = 8;
var dParamStopERP = 9;
var dParamStopCFM = 10;
var dParamSuspensionERP = 11;
var dParamSuspensionCFM = 12;
var dParamERP = 13;
var dParamFMax2 = 261;
var dParamVel2 = 258;
var dTransmissionParallelAxes = 0;
var dTransmissionIntersectingAxes = 1;
var dTransmissionChainDrive = 2;
var dContactMu2 = 0x001;
var dContactAxisDep = 0x001;
var dContactFDir1 = 0x002;
var dContactBounce = 0x004;
var dContactSoftERP = 0x008;
var dContactSoftCFM = 0x010;
var dContactMotion1 = 0x020;
var dContactMotion2 = 0x040;
var dContactMotionN = 0x080;
var dContactSlip1 = 0x100;
var dContactSlip2 = 0x200;
var dContactRolling = 0x400;
var dContactApprox0 = 0x0000;
var dContactApprox1_1 = 0x1000;
var dContactApprox1_2 = 0x2000;
var dContactApprox1_N = 0x4000;
var dContactApprox1 = 0x7000;
var mu = 0x001;
var mu2 = 0x002;
var bounce = 0x004;
var bounce_vel = 0x008;
var soft_erp = 0x010;
var soft_cfm = 0x020;
var rho = 0x040;
var rho2 = 0x080;
var rhoN = 0x100;
var motion1 = 0x200;
var motion2 = 0x400;
var motionN = 0x800;
var slip1 = 0x1000;
var slip2 = 0x2000;
var dJointTypeNone = 0;
var dJointTypeBall = 1;
var dJointTypeHinge = 2;
var dJointTypeSlider = 3;
var dJointTypeContact = 4;
var dJointTypeUniversal = 5;
var dJointTypeHinge2 = 6;
var dJointTypeFixed = 7;
var dJointTypeNull = 8;
var dJointTypeAMotor = 9;
var dJointTypeLMotor = 10;
var dJointTypePlane2D = 11;
var dJointTypePR = 12;
var dJointTypePU = 13;
var dJointTypePiston = 1;
4;
var dJointTypeDBall = 15;
var dJointTypeDHinge = 16;
var dJointTypeTransmission = 17;
var dxBodyFlagFiniteRotation = 1;
var dxBodyFlagFiniteRotationAxis = 2;
var dxBodyDisabled = 4;
var dxBodyNoGravity = 8;
var dxBodyAutoDisable = 16;
var dxBodyLinearDamping = 32;
var dxBodyAngularDamping = 64;
var dxBodyMaxAngularSpeed = 128;
var dxBodyGyroscopic = 256;
var dxBodyStateNotifyEnergy = 512;
var EnergyTools = (function () {
    function EnergyTools() {
    }
    EnergyTools.Malloc_Float64Array = function (f64) {
        var nDataBytes = f64.length * f64.BYTES_PER_ELEMENT;
        var q = _malloc(nDataBytes);
        var dataHeap = new Uint8Array(Module.HEAPU8.buffer, q, nDataBytes);
        dataHeap.set(new Uint8Array(f64.buffer));
        return q;
    };
    EnergyTools.Malloc_Float32Array = function (f32) {
        var nDataBytes = f32.length * f32.BYTES_PER_ELEMENT;
        var q = _malloc(nDataBytes);
        var dataHeap = new Uint8Array(Module.HEAPU8.buffer, q, nDataBytes);
        dataHeap.set(new Uint8Array(f32.buffer));
        return q;
    };
    EnergyTools.Malloc_Int32 = function (uint32) {
        var nDataBytes = uint32.length * uint32.BYTES_PER_ELEMENT;
        var q = _malloc(nDataBytes);
        var dataHeap = new Uint8Array(Module.HEAPU8.buffer, q, nDataBytes);
        dataHeap.set(new Uint8Array(uint32.buffer));
        return q;
    };
    EnergyTools.Malloc_Vector3 = function (x, y, z) {
        var size = new Float64Array([x, y, z]);
        var nDataBytes = size.length * size.BYTES_PER_ELEMENT;
        var v = _malloc(nDataBytes);
        var dataHeap = new Uint8Array(Module.HEAPU8.buffer, v, nDataBytes);
        dataHeap.set(new Uint8Array(size.buffer));
        return v;
    };
    EnergyTools.Malloc_Quaternion = function (w, x, y, z) {
        var size = new Float64Array([w, x, y, z]);
        var nDataBytes = size.length * size.BYTES_PER_ELEMENT;
        var q = _malloc(nDataBytes);
        var dataHeap = new Uint8Array(Module.HEAPU8.buffer, q, nDataBytes);
        dataHeap.set(new Uint8Array(size.buffer));
        return q;
    };
    EnergyTools.Malloc_new_quaternion = function () {
        var size = new Float64Array(4);
        var nDataBytes = size.length * size.BYTES_PER_ELEMENT;
        var q = _malloc(nDataBytes);
        var dataHeap = new Uint8Array(Module.HEAPU8.buffer, q, nDataBytes);
        dataHeap.set(new Uint8Array(size.buffer));
        return q;
    };
    EnergyTools.Malloc_new_Vector3 = function () {
        var size = new Float64Array(3);
        var nDataBytes = size.length * size.BYTES_PER_ELEMENT;
        var v3 = _malloc(nDataBytes);
        var dataHeap = new Uint8Array(Module.HEAPU8.buffer, v3, nDataBytes);
        dataHeap.set(new Uint8Array(size.buffer));
        return v3;
    };
    EnergyTools.Malloc_dMass_Struct = function () {
        var size = new Float64Array(17);
        var nDataBytes = size.length * size.BYTES_PER_ELEMENT;
        var m = _malloc(nDataBytes);
        var dataHeap = new Uint8Array(Module.HEAPU8.buffer, m, nDataBytes);
        dataHeap.set(new Uint8Array(size.buffer));
        return m;
    };
    EnergyTools.Malloc_dMatrix3x3 = function () {
        var size = new Float64Array(12);
        var nDataBytes = size.length * size.BYTES_PER_ELEMENT;
        EnergyTools.DMatrix3_ptr = _malloc(nDataBytes);
        var dataHeap = new Uint8Array(Module.HEAPU8.buffer, EnergyTools.DMatrix3_ptr, nDataBytes);
        dataHeap.set(new Uint8Array(size.buffer));
        return EnergyTools.DMatrix3_ptr;
    };
    EnergyTools.Malloc_feedback_struct = function () {
        var size = new Float64Array(16);
        var nDataBytes = size.length * size.BYTES_PER_ELEMENT;
        EnergyTools.feedBack = _malloc(nDataBytes);
        var dataHeap = new Uint8Array(Module.HEAPU8.buffer, EnergyTools.feedBack, nDataBytes);
        dataHeap.set(new Uint8Array(size.buffer));
        return EnergyTools.feedBack;
    };
    EnergyTools.Free_DMatrix3_Ptr = function (ptr) {
    };
    EnergyTools.Free_dMass_Struc = function () {
    };
    EnergyTools.Pointer_To_Vector3 = function (ptr, swapTOxzy) {
        var x = Module.getValue(ptr + 0, 'double');
        var y = Module.getValue(ptr + 8, 'double');
        var z = Module.getValue(ptr + 16, 'double');
        if (!swapTOxzy) {
            return new Array(x, y, z);
        }
        else {
            return new Array(x, z, y);
        }
    };
    EnergyTools.Pointer_To_Vector4 = function (ptr, isQuaternion) {
        if (isQuaternion) {
            var w = Module.getValue(ptr + 0, 'double');
            var x = -Module.getValue(ptr + 8, 'double');
            var y = -Module.getValue(ptr + 16, 'double');
            var z = -Module.getValue(ptr + 24, 'double');
        }
        else {
            var w = Module.getValue(ptr + 0, 'double');
            var x = Module.getValue(ptr + 8, 'double');
            var y = Module.getValue(ptr + 16, 'double');
            var z = Module.getValue(ptr + 24, 'double');
        }
        return new Array(w, x, y, z);
    };
    return EnergyTools;
}());
var EnergyMath = (function () {
    function EnergyMath() {
    }
    EnergyMath.dPlaneSpace = function (n) {
        EnergyMath.n_ptr = EnergyTools.Malloc_Vector3(n.x, n.z, n.y);
        EnergyMath.p_ptr = EnergyTools.Malloc_new_Vector3();
        EnergyMath.q_ptr = EnergyTools.Malloc_new_Vector3();
        EnergyMath._dPlaneSpace(EnergyMath.n_ptr, EnergyMath.p_ptr, EnergyMath.q_ptr);
        var p = EnergyTools.Pointer_To_Vector3(EnergyMath.p_ptr, true);
        var q = EnergyTools.Pointer_To_Vector3(EnergyMath.q_ptr, true);
        console.log(p);
        console.log(q);
        return [new BABYLON.Vector3(p[0], p[1], p[2]), new BABYLON.Vector3(q[0], q[1], q[2])];
    };
    EnergyMath._dPlaneSpace = Module.cwrap('dPlaneSpace', '', ['number', 'number', 'number']);
    return EnergyMath;
}());
var Data = (function () {
    function Data() {
    }
    Data.Body = [
        ["Select a mesh", "", "", "", ""],
        ["Position", "dGeomGetPosition", "dGeomSetPosition", "Mesh_Vector3", ""],
        ["Quaternion", "dBodyGetQuaternion", "dBodySetQuaternion", "Mesh_Vector4", ""],
        ["Linear Velocity", "dBodyGetLinearVel", "dBodySetLinearVel", "Mesh_Vector3", ""],
        ["Angular Velocity", "dBodyGetAngularVel", "dBodySetAngularVel", "Mesh_Vector3", ""],
        ["Mass or Density", "dBodyGetMass", "dBodySetMass", "Mesh_number", ""],
    ];
    Data.World = [
        ["dWorld INFOS", "", "", "", ""],
        ["Timestep", "getTimeStep", "setTimeStep", "number", "Stepsize between each simulation step. Ideally 1/60,0.0166"],
        ["MaxContact", "getMaxContact", "setMaxContact", "number", "Maximum number of contacts allowed between two entities. "],
        ["Gravity", "dWorldGetGravity2", "dWorldSetGravity", "Vector3", "Set and get the world's global gravity vector. In the SI units the Earth's gravity vector would be (0,-9.81,0), assuming that +y is up. The default is no gravity, i.e. (0,0,0)."],
        ["ERP", "dWorldGetERP", "dWorldSetERP", "number", "Set and get the global ERP value, that controls how much error correction is performed in each time step. Typical values are in the range 0.1-0.8. The default is 0.2."],
        ["CFM", "dWorldGetCFM", "dWorldSetCFM", "number", "Set and get the global CFM (constraint force mixing) value. Typical values are in the range 10-9 -- 1. The default is 10-5 if single precision is being used, or 10-10 if double precision is being used."],
        ["AutoDisableFlag", "dWorldGetAutoDisableFlag", "dWorldSetAutoDisableFlag", "number", "Global parameter applied for each world's body - Set and get the auto-disable flag of a body. If the do_auto_disable is nonzero the body will be automatically disabled when it has been idle for long enough.\nDefault parameter : disabled 0"],
        ["AutoDisableLinearThreshold", "dWorldGetAutoDisableLinearThreshold", "dWorldSetAutoDisableLinearThreshold", "number", "Global parameter applied for each world's body - Set and get a body's linear velocity threshold for automatic disabling. The body's linear velocity magnitude must be less than this threshold for it to be considered idle. Set the threshold to dInfinity to prevent the linear velocity from being considered.\nDefault parameter : 0.01"],
        ["AutoDisableAngularThreshold", "dWorldGetAutoDisableAngularThreshold", "dWorldSetAutoDisableAngularThreshold", "number", "Global parameter applied for each world's body - Set and get a body's angular velocity threshold for automatic disabling. The body's linear angular magnitude must be less than this threshold for it to be considered idle. Set the threshold to dInfinity to prevent the angular velocity from being considered.\nDefault parameter : 0.01"],
        ["AutoDisableSteps", "dWorldGetAutoDisableSteps", "dWorldGetAutoDisableSteps", "number", "Global parameter applied for each world's body - Set and get the number of simulation steps that a body must be idle before it is automatically disabled. Set this to zero to disable consideration of the number of steps.\nDefault parameter : 10"],
        ["AutoDisableTime", "dWorldGetAutoDisableTime", "dWorldSetAutoDisableTime", "number", "Global parameter applied for each world's body - Set and get the amount of simulation time that a body must be idle before it is automatically disabled. Set this to zero to disable consideration of the amount of simulation time.\nDefault parameter : 0"],
        ["LinearDamping", "", "", "", ""],
        ["AngularDamping", "", "", "", ""],
        ["LinearDampingThreshold", "", "", "", ""],
        ["AngularDampingThreshold", "", "", "", ""],
        ["MaxAngularSpeed", "", "", "", ""],
        ["ContactSurfaceLayer", "", "", "", ""],
        ["QuickStepNumIterations", "", "", "", ""],
        ["QuickStepW", "", "", "", ""],
    ];
    return Data;
}());
//# sourceMappingURL=energy_w.js.map