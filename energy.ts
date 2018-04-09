
// Created samuel girardin @samuelgirardin - 2018
// License Creative Commons Attribution-NonCommercial-ShareAlike 4.0 Unported License.




class Energy {

    private scene: BABYLON.Scene;

    // single thread side
   // private energy: Energy

    public energyRawData: Float64Array = new Float64Array(24000);


    public registeredMeshes: Array<BABYLON.Mesh | BABYLON.InstancedMesh> = new Array<BABYLON.Mesh | BABYLON.InstancedMesh>();


    // maybe retrieve the pointer directly
    private jointID: number = 0;
    private solver: number;


    // timestep
    private numStep: number;
    private stepSize: number = 0;

    // max contact
    private maxContact: number = 3;

    // energy pointers
    public dxWorld: DxWorld;
    public dxContactgroup: DxContactGroup
    public dxSpace: DxSpace;
    public dxJointGroup: DxJointGroup = 0;


    //helper
    private _simloop: () => void;
    private _simloopSafe: () => void;
    private isRunning: boolean = false;

    //frequently used var   
    private p: Pointer;
    private r: Pointer;

    // debug       
    private container: any;
    private t0: number = 0;
    private t1: number = 0;


    // share some static const
    static SPHERE: number = 0;
    static BOX: number = 1;
    static CYLINDER: number = 2;
    static HEIGHTFIELD: number = 3;

    static NORMAL_STEP: number = 0;
    static QUICK_STEP: number = 1;

   


    /**
    *
    *  Warning energy.ts use RightHanded ODE system coordinate , babylon is left
    *
    */

    constructor(scene: BABYLON.Scene, gravity: BABYLON.Vector3, solver: number, contactFlagMode: number, numStep: number = 1, numQuickStepIterations: number = 20) {

      
    

        this.scene = scene;
        this._simloop = () => this.simloop();
        this._simloopSafe = () => this.simloopSafe();
        this.container = document.getElementById("fps");

        //TODO degager l'interface'
        var energyInitialize: EnergyInitialize = {
            gravity: gravity,
            solver: solver,
            numStep: numStep,
            numQuickStepIterations: numQuickStepIterations,
            contactFlagMode: contactFlagMode
        }

        // this the no worker version                           
        // this.energy = new Energy();
        this.initEnergy(energyInitialize);

    }

    static AllReady() {
        console.log("allisready"); 
    }

    public initEnergy(data: EnergyInitialize): void {

        Energy.dInitODE2(0);
       // Energy.dInitODE();
        this.numStep = data.numStep;
        this.dxWorld = Energy.dWorldCreate();
        Energy.dWorldSetGravity(this.dxWorld, data.gravity.x, data.gravity.z, data.gravity.y);

        this.dxSpace = Energy.dSimpleSpaceCreate(0);
        //  this.dxSpace = Energy.dHashSpaceCreate(0);       
        // Module._dHashSpaceSetLevels(this.dxSpace, -10, 10); 
        // Energy.dHashSpaceSetLevels(this.dxSpace, -100, 100); 
        //TODO _dQuadTreeSpaceCreate

        this.solver = data.solver;
        if (this.solver == Energy.QUICK_STEP) {
            console.log("QuickStep mode");
            Energy.dWorldSetQuickStepNumIterations(this.dxWorld, data.numQuickStepIterations);
        } else {
            console.log("NormalStep mode");
        }

        this.dxContactgroup = Energy.dJointGroupCreate(0);

        Energy.init(this.dxWorld, this.dxSpace, this.dxContactgroup, data.contactFlagMode);

    }

    public setTimeStep(stepSize: number) {
        this.stepSize = stepSize;
    }

    public getTimeStep(): number {
        return this.stepSize;
    }

    public setTimeStepAndNumStep(stepSize: number, numStep: number) {
        this.stepSize = stepSize;
        // send to energy.cpp for convenient use
        Energy.setTimestep(stepSize, numStep);

    }

    public setMotionVector(mesh: BABYLON.AbstractMesh, v: BABYLON.Vector3): void {
        var geom: DxGeom = DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dxGeom;
        //malloc vec3
        var v_ptr: Vector3_Ptr = EnergyTools.Malloc_Vector3(v.x, v.z, v.y);
        Energy.dGeomSetMotionVector(geom, v_ptr);

    }

    public setMaxContact(maxContact: number): void {
        //min 1 max 128
        this.maxContact = maxContact;
        Energy.setMaxContact(maxContact);
    }

    public getMaxContact(): number {
        //min 1 max 128
        return this.maxContact;
    }

    public dWorldSetERP(value: number): void {
        Energy.dWorldSetERP(this.dxWorld, value);
    }

    public dWorldSetCFM(value: number): void {
        Energy.dWorldSetCFM(this.dxWorld, value);
    }

    public dWorldGetERP(): number {
        return Energy.dWorldGetERP(this.dxWorld);
    }
    public dWorldGetCFM(): number {
        return Energy.dWorldGetCFM(this.dxWorld);
    }

    public dWorldSetFlags(flag: number): void {
        Energy.dWorldSetFlags(this.dxWorld, flag);
    }

    //TODO getflag and getFlagPointer

    /**
    * @ Set auto disable flag.
    * @ Set t the auto-disable flag of a body. If the do_auto_disable is nonzero
    * @ the body will be automatically disabled when it has been idle for long enough.
    * @ param do_auto_disable 0 or 1
    */
    public dWorldSetAutoDisableFlag(do_auto_disable: number) {
        Energy.dWorldSetAutoDisableFlag(this.dxWorld, do_auto_disable);
    }

    public dWorldSetAutoDisableAverageSamplesCount(value: number) {
        Energy.dWorldSetAutoDisableAverageSamplesCount(this.dxWorld, value);
    }

    public dWorldSetAutoDisableLinearThreshold(linearThreshold: number) {
        Energy.dWorldSetAutoDisableLinearThreshold(this.dxWorld, linearThreshold);
    }
    public dWorldSetAutoDisableAngularThreshold(angularThreshold: number) {
        Energy.dWorldSetAutoDisableAngularThreshold(this.dxWorld, angularThreshold);
    }

    public dWorldSetAutoDisableSteps(steps: number) {
        Energy.dWorldSetAutoDisableSteps(this.dxWorld, steps);
    }
    public dWorldSetAutoDisableTime(time: number) {
        Energy.dWorldSetAutoDisableSteps(this.dxWorld, time);
    }
    public dWorldSetNotificationInterval(interval: number) {
        Energy.dWorldSetNotificationInterval(this.dxWorld, interval);
    }
    public dWorldGetGravity2(): BABYLON.Vector3 {
        var ar = EnergyTools.Pointer_To_Vector3(Energy.dWorldGetGravity2(this.dxWorld), true);
        return new BABYLON.Vector3(ar[0], ar[1], ar[2]);
    }

    public dWorldSetGravity(x: number, y: number, z: number): void {
        Energy.dWorldSetGravity(this.dxWorld, x, z, y);
    }



    


    public startSimulation(): void {
        console.log("just before startSimulation");
        if (!this.isRunning) {
            console.log("startSimulation");
           
            this.scene.registerBeforeRender(this._simloop);
            this.isRunning = true;
           // this.scene.registerAfterRender(this._simloop);
          
        }

    }

    public pauseSimulation(): void {
        if (this.isRunning) {          
            this.scene.unregisterBeforeRender(this._simloop);
            this.isRunning = false;
        }

        //TODO
    }

    public deleteSimulation(disposeMesh: boolean): void {
        //TODO
    }

    //normal loop

    public simloopSafe(): void {


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
       // this.container.innerHTML = this.t1 + "ms no worker";

    }

    public simloop(): void {

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

            //todo check if the offset is  always the same 128 ? quite sure ... maybe not ?
            //this.p += 128 is false to get quaternion when the dynamicObject is only a geom
            this.r = DynamicObject.Instances[i].pointer_rot;
            this.registeredMeshes[i].rotationQuaternion.w = Module.HEAPF64[((this.r) >> 3)];
            this.registeredMeshes[i].rotationQuaternion.x = -Module.HEAPF64[((this.r + 8) >> 3)];
            this.registeredMeshes[i].rotationQuaternion.z = -Module.HEAPF64[((this.r + 16) >> 3)];
            this.registeredMeshes[i].rotationQuaternion.y = -Module.HEAPF64[((this.r + 24) >> 3)];


        }

       // this.collision();


        this.t1 = Date.now() - this.t0;


       // this.container.innerHTML = this.t1 + " ms";;

    }


    static Col = []; 

    private timeT: number = 0; 

    public collision(): void {

        this.timeT++; 

        var nCol = Energy.getGeomsCollisionDataLength();
        var pointer_pos = Energy.getGeomsCollisionData();
        var pointer_body = Energy.getGeomsCollisionBody();

     //  console.log("________________________________________________________")
       
       
      //  console.log("_____size___ =", l); 

        for (var i = 0; i <nCol*3; i=i+3) {
           // var geom = DynamicRay.Instances[i].dxGeom; 
           // var pointer_pos = Energy.dGeomGetCollisionPos(geom); 
         //   console.log(i,"_____________"); 
         //   console.log("x",Module.HEAPF64[((pointer_pos) >> 3)]);          
         //  console.log("z",Module.HEAPF64[((pointer_pos + 8) >> 3)]);
         //   console.log("y",i, Module.HEAPF64[((pointer_pos + 16) >> 3)]);

          //  console.log("x1", Module.getValue(pointer_pos + 0, 'double'));
          //  console.log("z1", Module.getValue(pointer_pos + 8, 'double'));
          //  console.log("y1", Module.getValue(pointer_pos + 16, 'double'));
          

            Energy.Col[i] =  Module.HEAPF64[((pointer_pos) >> 3)]; 
            Energy.Col[i+1] = Module.HEAPF64[((pointer_pos+8) >> 3)]; 
            Energy.Col[i + 2] = Module.HEAPF64[((pointer_pos + 16) >> 3)]; 

         //   console.log("i", Module.HEAP32[((pointer_body) >> 2)]);
          //  console.log("i", Module.HEAP32[((pointer_body+4) >> 2)]);

           // DynamicObject.OInstances()

            var t1 = Module.HEAP32[((pointer_body) >> 2)]; 
            var t2 = Module.HEAP32[((pointer_body+4) >> 2)]; 


           
            if (DynamicObject.OInstances[t1] && DynamicObject.OInstances[t2] ) {
                //  console.log(DynamicObject.OInstances[t].dxGeom); 
                DynamicObject.OInstances[t1].addContact(this.timeT, DynamicObject.OInstances[t2].dxGeom);
            }


            pointer_pos += 24;
            pointer_body += 8;
          
        }

    }


    public doStep(): any {

        // call 'C' run SAFE Metode
        //  Energy.run();
        // TODO check the alternative
        // Module._run();

        if (!this.isRunning) {
            return; 
        }

        // switch between worldstep and quick world step         
        if (this.solver == Energy.QUICK_STEP) {
            for (var i = 0; i < this.numStep; i++) {
                //#IF SAFE 
                //Module._run();
                //Energy.dWorldQuickStep(this.dxWorld, this.stepSize);
                //#IF FAST
                Module._run();
                Module._dWorldQuickStep(this.dxWorld, this.stepSize);
            }
        } else {
            //#IF SAFE 
            //Energy.dWorldStep(this.dxWorld, this.stepSize);
            //#IF FAST
            Module._run();
            Module._dWorldStep(this.dxWorld, this.stepSize);
        }
        // clear contact group c side 
        //#IF SAFE 
        //Energy.dJointGroupEmpty(this.dxContactgroup);
        //#IF FAST
        Module._dJointGroupEmpty(this.dxContactgroup);




    }


    public destroyObjectFromSimulation(mesh: BABYLON.Mesh | BABYLON.InstancedMesh): void {

        // get mesh index and splice
        for (var i = 0; i < this.registeredMeshes.length; i++) {
            if (this.registeredMeshes[i] == mesh) {
                //dispose mesh
                this.registeredMeshes.splice(i, 1);
                mesh.dispose();
                //destroy dynamic object
                DynamicObject.Instances[i].destroyDynamicObject();
                DynamicObject.Instances.splice(i, 1);
                break;
            }
        }

    }

    public destroySimulation() {
        console.log("energy.js : destroy simulation *"); 
        this.pauseSimulation();

        for (var i = 0; i < DynamicObject.Instances.length; i++) {
            Energy.dGeomDestroy(DynamicObject.Instances[i].dxGeom);   
        }
        for (var i = 0; i < Djoint.Instances.length; i++) {
            Djoint.Instances[i].dJointDestroy(); 
        }

       

     
      //  Module._dJointGroupEmpty(this.dxContactgroup);
     //   Module._dJointGroupDestroy(this.dxContactgroup)
     //   Module._dSpaceDestroy(this.dxSpace);
        Module._dWorldDestroy(this.dxWorld);

     //   Energy.closeEnergy(); 

        for (var i = 0; i < this.registeredMeshes.length; i++) {
            this.registeredMeshes[i].dispose();
        }
        DynamicObject.Instances = [];
        Djoint.Instances = []; 
        this.registeredMeshes = []; 


    }

    public __destroySimulation(): void {
        //deprecated 3.2018
        Energy.dWorldDestroy(this.dxWorld);
        for (var i = 0; i < this.registeredMeshes.length; i++) {
            this.registeredMeshes[i].dispose();
        }

        DynamicObject.Instances = [];
        Djoint.Instances = []; 

    }


    public dJointDestroy(jointID: number): void {
        var dJoint = <Djoint>Djoint.Instances[this.getJointByID(jointID)];
        dJoint.dJointDestroy();

    }



    public dBodyEnable(mesh: BABYLON.AbstractMesh) {

        Energy.dBodyEnable(DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dxBody);
    }

    public dBodyDisable(mesh: BABYLON.AbstractMesh) {

        Energy.dBodyDisable(DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dxBody);
    }

    public dBodyIsEnabled(mesh: BABYLON.AbstractMesh): number {
        //TODO write the safe method
        return DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dBodyIsEnabled()
    }




    public addDJointHinge2(body1: BABYLON.Mesh, body2: BABYLON.Mesh, anchor: BABYLON.Vector3, axis1: BABYLON.Vector3, axis2: BABYLON.Vector3, name: string): number {


        if (body1 == null || body2 == null) {
            throw new Error("addDJointHinge2 body1 or/and body2 is null, we need 2 valid mesh");
          //  return;
        }

        var uniqID = this.jointID++;
        var joint: IDJointHinge2 = {
            body1ID: body1.uniqueId,
            body2ID: body2 != null ? body2.uniqueId : 0,
            anchor: anchor,
            axis1: axis1,
            axis2: axis2,
            uniqID: uniqID,
            name: name
        }

        var dJointHinge2: DJointHinge2 = new DJointHinge2(this.dxWorld, this.dxJointGroup, joint.uniqID, joint.name);

        //we need now to match bodyID with dxbody pointer
        var b1: number = DynamicObject.Instances[this.getDynamicObjectByID(joint.body1ID)].dxBody;
        var b2: number = DynamicObject.Instances[this.getDynamicObjectByID(joint.body2ID)].dxBody;




        dJointHinge2.dJointAttach(b1, b2);
        dJointHinge2.dJointSetHinge2Anchor(joint.anchor.x, joint.anchor.z, joint.anchor.y);
        dJointHinge2.dJointSetHinge2Axis1(joint.axis1.x, joint.axis1.z, joint.axis1.y);
        dJointHinge2.dJointSetHinge2Axis2(joint.axis2.x, joint.axis2.z, joint.axis2.y);

        return uniqID;

    }



    public addDJointBall(body1: BABYLON.AbstractMesh, body2: BABYLON.AbstractMesh, anchor: BABYLON.Vector3, name: string): number {

        // only body2 can be null aka attach to world
        if (body1 == null) {
            throw new Error("addDJointBall body1 is null, only body2 can be null");
          //  return;
        }

        var uniqID = this.jointID++;

        var joint: IDJointBall = {
            body1ID: body1.uniqueId,
            body2ID: body2 != null ? body2.uniqueId : 0,
            anchor: anchor,
            uniqID: uniqID,
            name: name
        }

        var dJointBall: DJointBall = new DJointBall(this.dxWorld, this.dxJointGroup, joint.uniqID, joint.name);

        var b1: number = DynamicObject.Instances[this.getDynamicObjectByID(joint.body1ID)].dxBody;
        var b2: number;
        if (joint.body2ID != null) {
            b2 = DynamicObject.Instances[this.getDynamicObjectByID(joint.body2ID)].dxBody;
        } else {
            b2 = 0;
        }

        dJointBall.dJointAttach(b1, b2);
        dJointBall.dJointSetBallAnchor(joint.anchor.x, joint.anchor.z, joint.anchor.y);

        return uniqID;


    }


    public addDJointFixed(body1: BABYLON.Mesh, body2: BABYLON.Mesh, anchor: BABYLON.Vector3): number {
        // TODO  not really tested efficient //
        var uniqID = this.jointID++;
        var joint: IDJointFixed = {
            body1ID: body1.uniqueId,
            body2ID: body2 != null ? body2.uniqueId : null,
            anchor: anchor,
            uniqID: uniqID,
            name: name
        }

        var dJointFixed: DJointFixed = new DJointFixed(this.dxWorld, this.dxJointGroup, joint.uniqID, joint.name);
        var b1: number = DynamicObject.Instances[this.getDynamicObjectByID(joint.body1ID)].dxBody;
        var b2: number;
        if (joint.body2ID != null) {
            b2 = DynamicObject.Instances[this.getDynamicObjectByID(joint.body2ID)].dxBody;
        } else {
            b2 = 0;
        }
        dJointFixed.dJointAttach(b1, b2);

        return uniqID;

    }



    public addDJointHinge(body1: any /* BABYLON.AbstractMesh*/, body2: any /* BABYLON.AbstractMesh*/, anchor: BABYLON.Vector3, axis: BABYLON.Vector3, name: string): number {

        // only body2 can be null aka attach to world
        if (body1 == null) {
            throw new Error("addDJointHinge body1 is null, only body2 can be null");
           // return;
        }

        var uniqID = this.jointID++;
        var joint: IDJointHinge = {
            body1ID: body1.uniqueId,
            body2ID: body2 != null ? body2.uniqueId : null,
            anchor: anchor,
            axis: axis,
            uniqID: uniqID,
            name: name
        }


        var dJointHinge: DJointHinge = new DJointHinge(this.dxWorld, this.dxJointGroup, joint.uniqID, joint.name);

        //we need now to match bodyID with dxbody pointer , test if second body is null
        var b1: number = DynamicObject.Instances[this.getDynamicObjectByID(joint.body1ID)].dxBody;
        var b2: number;
        if (joint.body2ID != null) {
            b2 = DynamicObject.Instances[this.getDynamicObjectByID(joint.body2ID)].dxBody;
        } else {
            b2 = 0;
        }

        dJointHinge.dJointAttach(b1, b2);
        dJointHinge.dJointSetHingeAnchor(joint.anchor.x, joint.anchor.z, joint.anchor.y);
        dJointHinge.dJointSetHingeAxis(joint.axis.x, joint.axis.z, joint.axis.y);

        return uniqID;
    }

    public dJointSetParam(joint: number, parameter: number, value: number): void {

        var jointParameter: ISetDJointParameter = {
            jointID: joint,
            parameter: parameter,
            value: value
        }
        var dJoint = Djoint.Instances[this.getJointByID(jointParameter.jointID)];
        dJoint.dJointSetParam(jointParameter.parameter, jointParameter.value);

    }



    public dJointGetHinge2Angle1(jointID: number): number {
        var dJointHinge = <DJointHinge2>Djoint.Instances[this.getJointByID(jointID)];
        return dJointHinge.dJointGetHinge2Angle1();
    }


    public dBodyGetTorque(body: BABYLON.Mesh): number[] {


        return DynamicObject.Instances[this.getDynamicObjectByID(body.uniqueId)].dBodyGetTorque();

    }

    public dBodyGetForce(mesh: BABYLON.Mesh): number[] {
        return DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dBodyGetForce();
    }

    public getdjointHinge2Anchor(jointID: number): number[] {

        var dJointHinge = <DJointHinge2>Djoint.Instances[this.getJointByID(jointID)];
        return dJointHinge.dJointGetHinge2Anchor();
    }

    public getdjointHinge2Anchor2(jointID: number): number[] {

        var dJointHinge = <DJointHinge2>Djoint.Instances[this.getJointByID(jointID)];
        return dJointHinge.dJointGetHinge2Anchor2();

    }

    public getdjointHinge2Axis1(jointID: number): number[] {

        var dJointHinge = <DJointHinge2>Djoint.Instances[this.getJointByID(jointID)];
        return dJointHinge.dJointGetHinge2Axis1();
    }

    public getdjointHinge2Axis2(jointID: number): number[] {

        var dJointHinge = <DJointHinge2>Djoint.Instances[this.getJointByID(jointID)];
        return dJointHinge.dJointGetHinge2Axis2();

    }
    public getdjointHingeAnchor(jointID: number): number[] {

        var dJointHinge = <DJointHinge>Djoint.Instances[this.getJointByID(jointID)];
        return dJointHinge.dJointGetHingeAnchor();
    }

    public getdjointHingeAnchor2(jointID: number): number[] {

        var dJointHinge = <DJointHinge>Djoint.Instances[this.getJointByID(jointID)];
        return dJointHinge.dJointGetHingeAnchor2();
    }


    public getdjointGetHingeAngle(jointID: number): number {
        var dJointHinge = <DJointHinge>Djoint.Instances[this.getJointByID(jointID)];
        return dJointHinge.dJointGetHingeAngle();
    }

    public getdjointGetHingeAngleRate(jointID: number): number {
        var dJointHinge = <DJointHinge>Djoint.Instances[this.getJointByID(jointID)];
        return dJointHinge.dJointGetHingeAngleRate();
    }

    public getdjointHingeAxis(jointID: number): number[] {

        var dJointHinge = <DJointHinge>Djoint.Instances[this.getJointByID(jointID)];
        return dJointHinge.dJointGetHingeAxis();
    }

    public addDJointSlider(body1: BABYLON.AbstractMesh, body2: any /* BABYLON.AbstractMesh*/, axis: BABYLON.Vector3, name: string): number {

        // only body2 can be null aka attach to world
        if (body1 == null) {
            throw new Error("addDJointSlider body1 is null, only body2 can be null");
           // return;
        }

        var uniqID = this.jointID++;
        var joint: IDJointSlider = {
            body1ID: body1.uniqueId,
            body2ID: body2 != null ? body2.uniqueId : null,
            axis: axis,
            uniqID: uniqID,
            name: name
        }

        var dJointSlider: DJointSlider = new DJointSlider(this.dxWorld, this.dxJointGroup, joint.uniqID, joint.name);

        //we need now to match bodyID with dxbody pointer
        var b1: number = DynamicObject.Instances[this.getDynamicObjectByID(joint.body1ID)].dxBody;
        var b2: number;

        if (joint.body2ID != null) {
            b2 = DynamicObject.Instances[this.getDynamicObjectByID(joint.body2ID)].dxBody;
        } else {
            b2 = 0;
        }


        dJointSlider.dJointAttach(b1, b2);
        dJointSlider.dJointSetSliderAxis(joint.axis.x, joint.axis.z, joint.axis.y);

        return uniqID;
    }



    public addDJointTransmission(body1: BABYLON.AbstractMesh, body2: BABYLON.AbstractMesh, transmissionMode: number, ratio: number, anchor1: BABYLON.Vector3, anchor2: BABYLON.Vector3, axis: BABYLON.Vector3, name: string): number {


        if (body1 == null || body2 == null) {
            throw new Error("addDJointTransmission body1 or/and body2 is null, we need 2 valid mesh");
           // return;
        }

        var uniqID = this.jointID++;
        var joint: IDjointTransmission = {
            body1ID: body1.uniqueId,
            body2ID: body2 != null ? body2.uniqueId : null,
            transmissionMode: transmissionMode,
            ratio: ratio,
            anchor1: anchor1,
            anchor2: anchor2,
            axis: axis,
            uniqID: uniqID,
            name: name
        }



        var dJointTransmission: DJointTransmission = new DJointTransmission(this.dxWorld, this.dxJointGroup, joint.uniqID, joint.name);

        //we need now to match bodyID with dxbody pointer
        var b1: number = DynamicObject.Instances[this.getDynamicObjectByID(joint.body1ID)].dxBody;
        var b2: number = DynamicObject.Instances[this.getDynamicObjectByID(joint.body2ID)].dxBody;

        dJointTransmission.dJointAttach(b1, b2);
        dJointTransmission.dJointSetTransmissionMode(joint.transmissionMode);
        dJointTransmission.dJointSetTransmissionRatio(joint.ratio);
        dJointTransmission.dJointSetTransmissionAnchor1(joint.anchor1.x, joint.anchor1.z, joint.anchor1.y);
        dJointTransmission.dJointSetTransmissionAnchor2(joint.anchor2.x, joint.anchor2.z, joint.anchor2.y);
        dJointTransmission.dJointSetTransmissionAxis(joint.axis.x, joint.axis.z, joint.axis.y);
        return uniqID;
    }



    public addStaticPlane(a: number, b: number, c: number, d: number): void {
        // TODO more development 
        new StaticPlane(this.dxSpace, a, b, c, d);

    }

    public addDynamicRay(length: number): void {

        var ray = new DynamicRay(this.dxSpace, length); 
    }

    public addDynamicTriMesh(mesh: BABYLON.Mesh | BABYLON.InstancedMesh, density: number): void {

        //TODO add interface

        if (mesh.rotationQuaternion == null) {
            var q = BABYLON.Quaternion.RotationYawPitchRoll(mesh.rotation.y, mesh.rotation.x, mesh.rotation.z);
            mesh.rotationQuaternion = q;
        } else {
            //console.log("this mesh is already set with quaternion");
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

        var dynTriMesh: dynamicTriMesh = new dynamicTriMesh(this.dxSpace, this.dxWorld, vertices, indices32, density, mesh.uniqueId, mesh.name);
        dynTriMesh.dGeomSetPosition(mesh.position.x, mesh.position.z, mesh.position.y);
        var rotationQuaternion = mesh.rotationQuaternion.asArray();
        dynTriMesh.dGeomSetQuaternion(rotationQuaternion[3], -rotationQuaternion[0], -rotationQuaternion[2], -rotationQuaternion[1]);

    }

    public addDynamicHeightmap(mesh: BABYLON.Mesh | BABYLON.InstancedMesh, width: number, depth: number, widthSamples: number, depthSamples: number, scale: number, offset: number, thickness: number, bWrap: number): void {

        // get vertices
        var vb = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        var heightsData = new Float64Array(vb.length / 3);
        var index = 0;
        for (var i = 0; i < vb.length; i += 3) {
            heightsData[index++] = vb[i + 1];
        }

        if (mesh.rotationQuaternion == null) {
            var q = BABYLON.Quaternion.RotationYawPitchRoll(mesh.rotation.y, mesh.rotation.x, mesh.rotation.z);
            // little trick to well orient 'data' physic object not babylone one
            var qForDXGeom = BABYLON.Quaternion.RotationYawPitchRoll(mesh.rotation.y, mesh.rotation.x - Math.PI / 2, mesh.rotation.z);
            mesh.rotationQuaternion = q;
        } else {

            // TODO same trick when quaternion are  set
            // console.log("this landscape is already set as quaternion");

        }

        var heightmap: IEnergyDynamicHeightmap = {
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
        }

        var dynamicHeightmap: DynamicHeightmap = new DynamicHeightmap(this.dxSpace, this.dxWorld, heightmap.heightData, heightmap.width, heightmap.depth, heightmap.widthSamples, heightmap.depthSamples, heightmap.scale, heightmap.offset, heightmap.thickness, heightmap.bWrap, heightmap.uniqID, heightmap.name);
        dynamicHeightmap.dGeomSetPosition(heightmap.position.x, heightmap.position.z, heightmap.position.y);
        dynamicHeightmap.dGeomSetQuaternion(heightmap.rotation.w, -heightmap.rotation.x, -heightmap.rotation.z, -heightmap.rotation.y);

    }

    /**
    * @addDynmaicObject. If density !0 we had a geom and a body ELSE we had only a geom
    * @param mesh
    * @param meshType
    * @param density
    * @param direction
    */
    public addDynamicObject(mesh: BABYLON.Mesh | BABYLON.InstancedMesh, meshType: number, density: number, direction?: number) {



        mesh.computeWorldMatrix(true);

        if (mesh instanceof BABYLON.Mesh) {
            var bbox = mesh.getBoundingInfo().boundingBox;
        } else if (mesh instanceof BABYLON.InstancedMesh) {

            var bbox = (<BABYLON.InstancedMesh>mesh).getBoundingInfo().boundingBox;

        }

        if (mesh.rotationQuaternion == null) {
            var q = BABYLON.Quaternion.RotationYawPitchRoll(mesh.rotation.y, mesh.rotation.x, mesh.rotation.z);
            mesh.rotationQuaternion = q;
        }



        // lx ly and lz are not used for the box length computation see in the switch
        var lx = bbox.maximumWorld.x - bbox.minimumWorld.x;
        var ly = bbox.maximumWorld.y - bbox.minimumWorld.y;
        var lz = bbox.maximumWorld.z - bbox.minimumWorld.z;
        var radius: number;
        var length: number;
        var diameter: number;




        switch (meshType) {
            case Energy.SPHERE:
                radius = Math.max((lx), (ly), (lz)) / 2;
                var sphere: IEnergyDynamicSphere = {
                    type: meshType,
                    radius: radius,
                    density: density,
                    rotation: mesh.rotationQuaternion.asArray(),
                    position: mesh.position,
                    name: mesh.name,
                    uniqID: mesh.uniqueId
                }

                this.registeredMeshes.push(mesh);
                var dynamicSphere: DynamicSphere = new DynamicSphere(this.dxSpace, this.dxWorld, sphere.density, sphere.radius, sphere.uniqID, sphere.name);
                dynamicSphere.dGeomSetPosition(sphere.position.x, sphere.position.z, sphere.position.y);
                dynamicSphere.dGeomSetQuaternion(sphere.rotation[3], -sphere.rotation[0], -sphere.rotation[2], -sphere.rotation[1]);



                break;

            case Energy.BOX:

                // compute lx,ly,lz 
                var x = bbox.vectorsWorld[0].subtract(bbox.vectorsWorld[2]).length();
                var z = bbox.vectorsWorld[0].subtract(bbox.vectorsWorld[4]).length();
                var y = bbox.vectorsWorld[0].subtract(bbox.vectorsWorld[3]).length();

                var box: IEnergyDynamicBox = {
                    type: meshType,
                    size: [x, y, z],

                    density: density,
                    rotation: mesh.rotationQuaternion.asArray(),
                    position: mesh.position.asArray(),
                    name: mesh.name,
                    uniqID: mesh.uniqueId
                }

                this.registeredMeshes.push(mesh);
                var dynamicBox: DynamicBox = new DynamicBox(mesh, this.dxSpace, this.dxWorld, box.density, box.size[0], box.size[2], box.size[1], box.uniqID, box.name);
                dynamicBox.dGeomSetPosition(box.position[0], box.position[2], box.position[1]);
                dynamicBox.dGeomSetQuaternion(box.rotation[3], -box.rotation[0], -box.rotation[2], -box.rotation[1]);



                break;
            case Energy.CYLINDER:
                // search for radius and length 
                // Todo check is the mesh is not a real cylinder  //TOD Fix it s buggy
                (lx == ly) ? (diameter = lx, length = lz) : (lx == lz) ? (diameter = lx, length = ly) : (ly == lz) ? (diameter == ly, length = lx) : null;



                var cylinder: IEnergyDynamicCylinder = {
                    type: meshType,
                    radius: diameter / 2,
                    length: length,
                    density: density,
                    direction: direction,
                    position: mesh.position,
                    rotation: mesh.rotationQuaternion.asArray(),
                    name: mesh.name,
                    uniqID: mesh.uniqueId
                }

                console.log(this.registeredMeshes.length);

                this.registeredMeshes.push(mesh);
                var dynamicCylinder: DynamicCylinder = new DynamicCylinder(this.dxSpace, this.dxWorld, cylinder.density, cylinder.radius, cylinder.length, cylinder.direction, cylinder.uniqID, cylinder.name);
                dynamicCylinder.dGeomSetPosition(cylinder.position.x, cylinder.position.z, cylinder.position.y);
                dynamicCylinder.dGeomSetQuaternion(cylinder.rotation[3], -cylinder.rotation[0], -cylinder.rotation[2], -cylinder.rotation[1]);

            //TODO add rotation check for quat to array


        }

    }

    public dBodySetPosition(mesh: BABYLON.AbstractMesh, p: BABYLON.Vector3): void {
        var data: ISetDynamicObjectPosition = {
            bodyID: mesh.uniqueId,
            position: p,
        }
        DynamicObject.Instances[this.getDynamicObjectByID(data.bodyID)].dBodySetPosition(data.position.x, data.position.z, data.position.y);


    }

    public dBodySetQuaternion(mesh: BABYLON.AbstractMesh, q: BABYLON.Quaternion): void {

        var data: ISetDynamicObjectRotation = {
            bodyID: mesh.uniqueId,
            rotation: q
        }

        DynamicObject.Instances[this.getDynamicObjectByID(data.bodyID)].dGeomSetQuaternion(data.rotation.w, -data.rotation.x, -data.rotation.z, -data.rotation.y);

    }

    public dBodySetMass(mesh: BABYLON.Mesh, density: number): void {



        DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dBodySetMass(density);

    }

    public dBodyGetMass(mesh: BABYLON.Mesh): number {

        return DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dBodyGetMass();
    }

    public dBodyAddTorque(mesh: BABYLON.Mesh, f: BABYLON.Vector3, useLocal: boolean): void {

        var data: IAddTorque = {
            bodyID: mesh.uniqueId,
            force: f,
            useLocal: useLocal,
        }
        DynamicObject.Instances[this.getDynamicObjectByID(data.bodyID)].dBodyAddTorque(data.force.x, data.force.z, data.force.y, data.useLocal);

    }

    public dBodyAddForce(mesh: BABYLON.AbstractMesh, f: BABYLON.Vector3, useLocal: boolean = false): void {

        var data: IAddForce = {
            bodyID: mesh.uniqueId,
            force: f,
            useLocal: useLocal
        }
        DynamicObject.Instances[this.getDynamicObjectByID(data.bodyID)].dBodyAddForce(data.force.x, data.force.z, data.force.y, data.useLocal);

    }


    public getDynamicObjectByMesh(mesh: BABYLON.AbstractMesh): DynamicObject {

        return DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)];
    }



    public getDynamicObjectByID(bodyID: number): number {

        for (var i = 0; i < DynamicObject.Instances.length; i++) {
            if (DynamicObject.Instances[i].uniqID == bodyID) {
                return i;
                break;
            }
        }
        return 0;
    }



    public getJointByID(jointID: number): number {
        for (var i = 0; i < Djoint.Instances.length; i++) {
            if (Djoint.Instances[i].uniqID == jointID) {
                return i;
                break;
            }
        }
        return 0;
    }


    public createPhysicMaterial(name: string): DxMaterial {

        var physicMaterial: PhysicMaterial = new PhysicMaterial(name);
        return physicMaterial.dxMaterial;

    }

    public getPhysicMaterialByID(dxMaterial: DxMaterial): number {
        for (var i = 0; i < PhysicMaterial.Instances.length; i++) {
            if (PhysicMaterial.Instances[i].dxMaterial == dxMaterial) {
                return i;
                break;
            }
        }
        return 0;
    }

    public dBodySetSurfaceParameter(mesh: BABYLON.AbstractMesh, parameter: number, value: number) {

        //first get the dxMaterial
        var dxMaterial: DxMaterial = this.getDynamicObjectByMesh(mesh).dxMaterial;
        this.setPhysicMaterialParameter(dxMaterial, parameter, value);
    }

    public dBodyGetSurfaceParameter(mesh: BABYLON.AbstractMesh, parameter: number): number {

        //first get the dxMaterial
        var dxMaterial: DxMaterial = this.getDynamicObjectByMesh(mesh).dxMaterial;

        var physicMaterial: PhysicMaterial = PhysicMaterial.Instances[this.getPhysicMaterialByID(dxMaterial)];
        return physicMaterial.getMaterialParameter(parameter);
    }


    public setPhysicMaterialParameter(dxMaterial: DxMaterial, parameter: number, value: number) {

        var physicMaterial: PhysicMaterial = PhysicMaterial.Instances[this.getPhysicMaterialByID(dxMaterial)];
        physicMaterial.setMaterialParameter(parameter, value);
    }

    public assignPhysicMaterialToMesh(dxMaterial: DxMaterial, mesh: BABYLON.Mesh | BABYLON.InstancedMesh): void {

        var dynmamicObject: DynamicObject = DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)];
        var physicMaterial: PhysicMaterial = PhysicMaterial.Instances[this.getPhysicMaterialByID(dxMaterial)];
        dynmamicObject.dGeomSetMaterial(physicMaterial);

    }

    public dBodyGetPosition(mesh): BABYLON.Vector3 {

        //TODO OR NOT TODO
        return;
    }

    public dBodySetTorque(mesh: BABYLON.AbstractMesh, f: BABYLON.Vector3): void {
        //TODO rename setTorque
        var data: ISetTorque = {
            bodyID: mesh.uniqueId,
            force: f

        }
        DynamicObject.Instances[this.getDynamicObjectByID(data.bodyID)].dBodySetTorque(data.force.x, data.force.z, data.force.y);

    }

    public dBodySetForce(mesh: BABYLON.AbstractMesh, f: BABYLON.Vector3): void {
        //tODO rename setForce
        var data: ISetForce = {
            bodyID: mesh.uniqueId,
            force: f

        }
        DynamicObject.Instances[this.getDynamicObjectByID(data.bodyID)].dBodySetForce(data.force.x, data.force.z, data.force.y);

    }

    public dBodySetLinearVel(mesh: BABYLON.AbstractMesh, f: BABYLON.Vector3): void {

        var data: ISetForce = {
            bodyID: mesh.uniqueId,
            force: f

        }
        DynamicObject.Instances[this.getDynamicObjectByID(data.bodyID)].dBodySetLinearVel(data.force.x, data.force.z, data.force.y);

    }

    public dBodySetAngularVel(mesh: BABYLON.AbstractMesh, f: BABYLON.Vector3): void {

        var data: ISetForce = {
            bodyID: mesh.uniqueId,
            force: f

        }
        DynamicObject.Instances[this.getDynamicObjectByID(data.bodyID)].dBodySetAngularVel(data.force.x, data.force.z, data.force.y);

    }

    public dBodySetZeroForce(mesh: BABYLON.AbstractMesh): void {

        this.dBodyDisable(mesh);
        this.dBodySetForce(mesh, new BABYLON.Vector3(0, 0, 0));
        this.dBodySetTorque(mesh, new BABYLON.Vector3(0, 0, 0));
        this.dBodySetLinearVel(mesh, new BABYLON.Vector3(0, 0, 0));
        this.dBodySetAngularVel(mesh, new BABYLON.Vector3(0, 0, 0));
        this.dBodyEnable(mesh);
    }

    public dBodyGetLinearVel(mesh: BABYLON.AbstractMesh): number[] {
        return DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dBodyGetLinearVel();
    }

    public dBodyGetAngularVel(mesh: BABYLON.AbstractMesh): number[] {
        return DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dBodyGetAngularVel();
    }

    public dBodyGetFlags(mesh: BABYLON.AbstractMesh): number {
        return DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dBodyGetFlags();
    }
    public dBodySetFlags(mesh: BABYLON.AbstractMesh, flags: number) {
        DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dBodySetFlags(flags);
    }

    public dBodySetNotification_interval(mesh: BABYLON.AbstractMesh, interval: number) {
        DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dBodySetNotification_interval(interval);
    }


    public dBodySetFiniteRotationMode(mesh: BABYLON.AbstractMesh, value: number) {
        DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dBodySetFiniteRotationMode(value);
    }


    public dBodySetGyroscopicMode(mesh: BABYLON.AbstractMesh, value: number) {
        DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dBodySetGyroscopicMode(value);
    }


    public dGeomGetPosition(mesh: BABYLON.AbstractMesh): Array<number> {

        return DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dGeomGetPosition();
    }



    public dGeomSetPosition(mesh: BABYLON.AbstractMesh, v: BABYLON.Vector3): void {

        // console.log("energy _ dGeomSetPosition",mesh,v)

        DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dGeomSetPosition(v.x, v.z, v.y);

    }

    public dGeomGetQuaternion(mesh: BABYLON.AbstractMesh): Array<number> {

        return DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dGeomGetQuaternion();

    }

    public dGeomSetQuaternion(mesh: BABYLON.AbstractMesh, q: BABYLON.Quaternion): void {

        DynamicObject.Instances[this.getDynamicObjectByID(mesh.uniqueId)].dGeomSetQuaternion(q.w, -q.x, -q.z, -q.y);

    }







   

 



    public static TEST() { console.log("hello from c"); }

    public static dBodyAddForce: (dxBody: DxBody, fx: number, fy: number, fz: number) => void =  Module.cwrap('dBodyAddForce', '', ['number', 'number', 'number', 'number']);
    public static dBodyAddRelForce: (dxBody: DxBody, fx: number, fy: number, fz: number) => void = Module.cwrap('dBodyAddRelForce', '', ['number', 'number', 'number', 'number']);
    public static dBodyAddRelTorque: (dxBody: DxBody, fx: number, fy: number, fz: number) => void = Module.cwrap('dBodyAddRelTorque', '', ['number', 'number', 'number', 'number']);
    public static dBodyAddTorque: (dxBody: DxBody, fx: number, fy: number, fz: number) => void = Module.cwrap('dBodyAddTorque', '', ['number', 'number', 'number', 'number']);
    public static dBodyCreate: (dxWorld: DxWorld) => DxBody = Module.cwrap('dBodyCreate', 'number', ['number']);
    public static dBodyDestroy: (dxBody: DxBody) => void = Module.cwrap('dBodyDestroy', '', ['number']);
    public static dBodyDisable: (dxBody: DxBody) => void = Module.cwrap('dBodyDisable', '', ['number']);
    public static dBodyEnable: (dxBody: DxBody) => void = Module.cwrap('dBodyEnable', '', ['number']);
    public static dBodyGetAngularVel: (dxBody: DxBody) => number = Module.cwrap('dBodyGetAngularVel', 'number', ['number']);
    public static dBodyGetForce: (dxBody: DxBody) => Vector3_Ptr = Module.cwrap('dBodyGetForce', 'number', ['number']);
    public static dBodyGetLinearVel: (dxBody: DxBody) => number = Module.cwrap('dBodyGetLinearVel', 'number', ['number']);
    public static dBodyGetPosition: (dxBody: DxBody) => Vector3_Ptr = Module.cwrap('dBodyGetPosition', 'number', ['number']);
    public static dBodyGetQuaternion: (dxBody: DxBody) => Vector4_Ptr = Module.cwrap('dBodyGetQuaternion', 'number', ['number']);
    public static dBodyGetTorque: (dxBody: DxBody) => Vector3_Ptr = Module.cwrap('dBodyGetTorque', 'number', ['number']);
    public static dBodyIsEnabled: (dxBody: DxBody) => number = Module.cwrap('dBodyIsEnabled', 'number', ['number']);
    public static dBodySetAngularVel: (dxBody: DxBody, x: number, y: number, z: number) => void = Module.cwrap('dBodySetAngularVel', '', ['number', 'number', 'number', 'number']);
    public static dBodySetAutoDisableAngularThreshold: (dxBody: DxBody, angular_threshold: number) => void = Module.cwrap('dBodySetAutoDisableAngularThreshold', '', ['number', 'number']);
    public static dBodySetAutoDisableAverageSamplesCount: (dxBody: DxBody, average_samples_count: number) => void = Module.cwrap('dBodySetAutoDisableTime', '', ['number', 'number']);
    public static dBodySetAutoDisableFlag: (dxBody: DxBody, do_auto_disable: number) => void = Module.cwrap('dBodySetAutoDisableFlag', '', ['number', 'number']);
    public static dBodySetAutoDisableLinearThreshold: (dxBody: DxBody, linear_threshold: number) => void = Module.cwrap('dBodySetAutoDisableLinearThreshold', '', ['number', 'number']);
    public static dBodySetAutoDisableTime: (dxBody: DxBody, time: number) => void = Module.cwrap('dBodySetAutoDisableTime', '', ['number', 'number']);
    public static dBodySetFiniteRotationMode: (DxBody: DxBody, mode: number) => void = Module.cwrap('dBodySetFiniteRotationMode', '', ['number', 'number']);
    public static dBodySetGyroscopicMode: (DxBody: DxBody, mode: number) => void = Module.cwrap('dBodySetGyroscopicMode', '', ['number', 'number']);
    public static dBodySetForce: (dxBody: DxBody, x: number, y: number, z: number) => void = Module.cwrap('dBodySetForce', '', ['number', 'number', 'number', 'number']);
    public static dBodySetLinearVel: (dxBody: DxBody, x: number, y: number, z: number) => void = Module.cwrap('dBodySetLinearVel', '', ['number', 'number', 'number', 'number']);
    public static dBodySetMass: (dxBody: DxBody, dMassStructPtr: DMass) => void = Module.cwrap('dBodySetMass', '', ['number', 'number']);
    public static dBodyGetMass: (dxBody: DxBody, dMassStrucPtr: DMass) => void = Module.cwrap('dBodyGetMass', '', ['number', 'number']);

    public static dBodySetPosition: (dxBody: DxBody, x: number, y: number, z: number) => void = Module.cwrap('dBodySetPosition', '', ['number', 'number', 'number', 'number']);
    public static dBodySetQuaternion: (dxBody: DxBody, q: Vector4_Ptr) => void = Module.cwrap('dBodySetQuaternion', '', ['number', 'number']);
    public static dBodySetRotation: (dxBody: DxBody, R: DMatrix3x3) => void = Module.cwrap('dBodySetRotation', '', ['number', 'number']);
    public static dBodySetTorque: (dxBody: DxBody, x: number, y: number, z: number) => void = Module.cwrap('dBodySetTorque', '', ['number', 'number', 'number', 'number']);


    public static dBodyGetDxFlags: (dxBody: DxBody) => Pointer = Module.cwrap('dBodyGetDxFlags', 'number', ['number']);
    public static dBodyGetFlags: (dxBody: DxBody) => number = Module.cwrap('dBodyGetFlags', 'number', ['number']);
    public static dBodySetFlags: (dxBody: DxBody, flags: number) => void = Module.cwrap('dBodySetFlags', '', ['number', 'number']);
    public static dBodySetNotification_interval: (dxBody: DxBody, interval: number) => void = Module.cwrap('dBodySetNotification_interval', '', ['number', 'number']);


    public static dCreateBox: (dxSpace: DxSpace, x: number, y: number, z: number) => DxGeom = Module.cwrap('dCreateBox', 'number', ['number', 'number', 'number', 'number']);
    public static dCreateCylinder: (dxSpace: DxSpace, radius: number, length: number) => DxGeom = Module.cwrap('dCreateCylinder', 'number', ['number', 'number']);
    public static dCreateHeightfield: (dxSpace: DxSpace, heightid: Pointer, placeable: number) => number = Module.cwrap('dCreateHeightfield', 'number', ['number', 'number', 'number']);
    public static dCreatePlane: (dxSpace: DxSpace, a: number, b: number, c: number, d: number) => DxGeom = Module.cwrap('dCreatePlane', 'number', ['number', 'number', 'number', 'number', 'number']);
    public static dCreateSphere: (dxSpace: DxSpace, radius: number) => DxGeom = Module.cwrap('dCreateSphere', 'number', ['number', 'number']);
    public static dCreateTriMesh: (dxSpace: DxSpace, Data: DxTriMeshData, dTriCallback: any, dTriArrayCallback: any, dTriRayCallback: any) => DxGeom = Module.cwrap('dCreateTriMesh', 'number', ['number', 'number', 'number', 'number', 'number']);
    public static dCreateRay: (dxSpace: DxSpace, length: number) => DxGeom = Module.cwrap("dCreateRay", "number", ['number', 'number']);
    public static dGeomRaySet: (dxGeom: DxGeom, px: number, py: number, pz: number, dx: number, dy: number, dz: number) => void = Module.cwrap("dGeomRaySet", "", ['number', 'number','number', 'number', 'number', 'number', 'number']);
   

    public static dGeomDestroy: (dxGeom: DxGeom) => void = Module.cwrap('dGeomDestroy', '', ['number']);
    public static dGeomGetMaterial: (dxGeom: DxGeom) => DxMaterial = Module.cwrap('dGeomGetMaterial', 'number', ['number']);
    public static dGeomGetPosition: (dxGeom: DxGeom) => Vector3_Ptr = Module.cwrap('dGeomGetPosition', 'number', ['number']);

   

    // const dReal * dGeomGetCollisionPos(dGeomID geom);

    public static dGeomGetQuaternion: (dxGeom: DxGeom, result: Vector4_Ptr) => void = Module.cwrap('dGeomGetQuaternion', '', ['number', 'number']);
    public static dGeomHeightfieldDataBuildDouble: /*not tested yet*/ (dxHeightfieldData: DxHeightfieldData, pHeightData: Pointer, bCopyHeightData: number, width: number, depth: number, widthSamples: number, depthSamples: number, scale: number, offset: number, thickness: number, bWrap: number) => void = Module.cwrap('dGeomHeightfieldDataBuildDouble', '', ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number']);
    public static dGeomHeightfieldDataCreate: () => DxHeightfieldData = Module.cwrap('dGeomHeightfieldDataCreate', 'number', []);
    public static dGeomHeightfieldDataSetBounds: (d: number, minHeight: number, maxHeight: number) => void = Module.cwrap('dGeomHeightfieldDataSetBounds', '', ['number', 'number', 'number'])
    public static dGeomSetBody: (dxGeom: DxGeom, dxBody: DxBody) => void = Module.cwrap('dGeomSetBody', '', ['number', 'number']);
    public static dGeomSetMaterial: (dxGeom: DxGeom, dxMaterial: DxMaterial) => void = Module.cwrap('dGeomSetMaterial', '', ['number', 'number']);
    public static dGeomSetMotionVector: (dxGeom: DxGeom, motionVector: Vector3_Ptr) => void = Module.cwrap('dGeomSetMotionVector', '', ['number', 'number']);
    public static dGeomSetOffsetPosition: (dxGeom: DxGeom, mc0: number, mc1: number, mc2: number) => void = Module.cwrap('dGeomSetOffsetPosition', '', ['number', 'number', 'number']);
    public static dGeomSetPosition: (dxGeom: DxGeom, x: number, y: number, z: number) => void = Module.cwrap('dGeomSetPosition', '', ['number', 'number', 'number', 'number']);
    public static dGeomSetQuaternion: (dxGeom: DxGeom, q: Vector4_Ptr) => void = Module.cwrap('dGeomSetQuaternion', '', ['number', 'number']);
    public static dGeomTriMeshDataBuildSingle: (dxTriMeshData: DxTriMeshData, vertices: Pointer, VertexStride: number, VertexCount: number, Indices: Pointer, IndexCount: number, TriStride: number) => void = Module.cwrap('dGeomTriMeshDataBuildSingle', '', []);
    public static dGeomTriMeshDataCreate: () => DxTriMeshData = Module.cwrap('dGeomTriMeshDataCreate', 'number', []);

    public static getGeomsCollisionData: () => Pointer = Module.cwrap('getGeomsCollisionData', 'number', []); 
    public static getGeomsCollisionBody: () => Pointer = Module.cwrap('getGeomsCollisionBody', 'number', []); 
    public static getGeomsCollisionDataLength: () => number = Module.cwrap('getGeomsCollisionDataLength', 'number', []); 

    public static dInitODE2: (a: number) => void = Module.cwrap('dInitODE2', '', ['number']);
    public static dInitODE: () => void = Module.cwrap('dInitODE', '', []);

    public static dJointAttach: (dxJoint: DxJoint, dxBody1: DxBody, dxBody2: DxBody) => void = Module.cwrap('dJointAttach', '', ['number', 'number', 'number'])
    public static dJointCreateBall: (dxWorld: DxWorld, dxJointGroup: DxJointGroup) => DxJoint = Module.cwrap('dJointCreateBall', 'number', ['number', 'number']);
    public static dJointCreateHinge2: (dxWorld: DxJoint, dxJointGroup: number) => number = Module.cwrap('dJointCreateHinge2', 'number', ['number', 'number']);
    public static dJointCreateHinge: (dxWorld: DxJoint, dxJointGroup: number) => number = Module.cwrap('dJointCreateHinge', 'number', ['number', 'number']);
    public static dJointCreateSlider: (xxWorld: DxWorld, dxJointGroup: DxJointGroup) => DxJoint = Module.cwrap('dJointCreateSlider', 'number', ['number', 'number']);
    public static dJointCreateTransmission: (dxWorld: DxWorld, dxJointGroup: DxJointGroup) => DxJoint = Module.cwrap('dJointCreateTransmission', '', ['number', 'number']);

    public static dJointCreateAMotor: (dxWorld: DxWorld, dxJointGroup: DxJointGroup) => DxJoint = Module.cwrap('dJointCreateAMotor', '', ['number', 'number']);
    public static dJointCreateLMotor: (dxWorld: DxWorld, dxJointGroup: DxJointGroup) => DxJoint = Module.cwrap('dJointCreateLMotor', '', ['number', 'number']);
    public static dJointCreateUniversal: (dxWorld: DxWorld, dxJointGroup: DxJointGroup) => DxJoint = Module.cwrap('dJointCreateUniversal', '', ['number', 'number']);
    public static dJointCreatePiston: (dxWorld: DxWorld, dxJointGroup: DxJointGroup) => DxJoint = Module.cwrap('dJointCreatePiston', '', ['number', 'number']);
    public static dJointCreateFixed: (dxWorld: DxWorld, dxJointGroup: DxJointGroup) => DxJoint = Module.cwrap('dJointCreateFixed', '', ['number', 'number']);




    public static dJointDestroy: (dxJoint: DxJoint) => void = Module.cwrap('dJointDestroy', '', ['number']);
    public static dJointGetHinge2Anchor2: (dxJoint: DxJoint, result: Vector3_Ptr) => void = Module.cwrap('dJointGetHinge2Anchor2', '', ['number', 'number']);
    public static dJointGetHinge2Anchor: (dxJoint: DxJoint, result: Vector3_Ptr) => void = Module.cwrap('dJointGetHinge2Anchor', '', ['number', 'number']);
    public static dJointGetHinge2Angle1: (dxJoint: DxJoint) => number = Module.cwrap('dJointGetHinge2Angle1', '', ['number']);
    public static dJointGetHinge2Axis1: (dxJoint: DxJoint, result: Vector3_Ptr) => void = Module.cwrap('dJointGetHinge2Axis1', '', ['number', 'number']);
    public static dJointGetHinge2Axis2: (dxJoint: DxJoint, result: Vector3_Ptr) => void = Module.cwrap('dJointGetHinge2Axis2', '', ['number', 'number']);
    public static dJointGetHingeAnchor2: (dxJoint: DxJoint, result: Vector3_Ptr) => void = Module.cwrap('dJointGetHingeAnchor2', '', ['number', 'number']);
    public static dJointGetHingeAnchor: (dxJoint: DxJoint, result: Vector3_Ptr) => void = Module.cwrap('dJointGetHingeAnchor', '', ['number', 'number']);
    public static dJointGetHingeAxis: (dxJoint: DxJoint, result: Vector3_Ptr) => void = Module.cwrap('dJointGetHingeAxis', '', ['number', 'number']);

    public static dJointGetHingeAngle: (dxJoint: DxJoint) => number = Module.cwrap('dJointGetHingeAngle', 'number', ['number']);
    public static dJointGetHingeAngleRate: (dxJoint: DxJoint) => number = Module.cwrap('dJointGetHingeAngleRate', 'number', ['number']);

    public static dJointGroupCreate: (max_size: number) => DxJointGroup = Module.cwrap('dJointGroupCreate', 'number', ['number']);
    public static dJointGroupDestroy: (contactGroup: DxContactGroup) => void = Module.cwrap('dJointGroupDestroy', '', ['number']);
    public static dJointGroupEmpty: (dxJointGroup: DxJointGroup) => void = Module.cwrap('dJointGroupEmpty', '', ['number']);

    public static dJointSetBallAnchor: (dxJoint: DxJoint, x: number, y: number, z: number) => void = Module.cwrap('dJointSetBallAnchor', '', ['number', 'number', 'number', 'number']);
    public static dJointSetBallAnchor2: (dxJoint: DxJoint, x: number, y: number, z: number) => void = Module.cwrap('dJointSetBallAnchor2', '', ['number', 'number', 'number', 'number']);
    public static dJointSetBallParam: (dxJoint: DxJoint, parameter: number, value: number) => void = Module.cwrap('dJointSetBallParam', '', ['number', 'number', 'number']);

    public static dJointGetBallAnchor: (dxJoint: DxJoint, result: Vector3_Ptr) => void = Module.cwrap('dJointGetBallAnchor', '', ['number', 'number']);
    public static dJointGetBallAnchor2: (dxJoint: DxJoint, result: Vector3_Ptr) => void = Module.cwrap('dJointGetBallAnchor2', '', ['number', 'number']);




    public static dJointSetFeedback: (DxJoint: DxJoint, dJointFeedback: DJointFeedback) => void = Module.cwrap('dJointSetFeedback', '', ['number', 'number']);
    public static dJointSetHinge2Anchor: (dxJoint: DxJoint, x: number, y: number, z: number) => void = Module.cwrap('dJointSetHinge2Anchor', '', ['number', 'number', 'number', 'number']);
    public static dJointSetHinge2Axis1: (dxJoint: DxJoint, x: number, y: number, z: number) => void = Module.cwrap('dJointSetHinge2Axis1', '', ['number', 'number', 'number', 'number']);
    public static dJointSetHinge2Axis2: (dxJoint: DxJoint, x: number, y: number, z: number) => void = Module.cwrap('dJointSetHinge2Axis2', '', ['number', 'number', 'number', 'number']);
    public static dJointSetHinge2Param: (dxJoint: DxJoint, parameter: number, value: number) => void = Module.cwrap('dJointSetHinge2Param', '', ['number', 'number', 'number']);
    public static dJointSetHingeAnchor: (dxJoint: DxJoint, x: number, y: number, z: number) => void = Module.cwrap('dJointSetHingeAnchor', '', ['number', 'number', 'number', 'number']);
    public static dJointSetHingeAxis: (dxJoint: DxJoint, x: number, y: number, z: number) => void = Module.cwrap('dJointSetHingeAxis', '', ['number', 'number', 'number', 'number']);
    public static dJointSetHingeParam: (dxJoint: DxJoint, parameter: number, value: number) => void = Module.cwrap('dJointSetHingeParam', '', ['number', 'number', 'number']);
    public static dJointSetSliderAxis: (dxJoint: DxJoint, x: number, y: number, z: number) => void = Module.cwrap('dJointSetSliderAxis', '', ['number', 'number', 'number', 'number']);
    public static dJointSetSliderParam: (dxJoint: DxJoint, parameter: number, value: number) => void = Module.cwrap('dJointSetSliderParam', '', ['number', 'number', 'number']);
    public static dJointSetTransmissionAnchor1: (dxJoint: DxJoint, x: number, y: number, z: number) => void = Module.cwrap('dJointSetTransmissionAnchor1', '', ['number', 'number', 'number', 'number']);
    public static dJointSetTransmissionAnchor2: (dxJoint: DxJoint, x: number, y: number, z: number) => void = Module.cwrap('dJointSetTransmissionAnchor2', '', ['number', 'number', 'number', 'number']);
    public static dJointSetTransmissionAxis1: (dxJoint: DxJoint, x: number, y: number, z: number) => void = Module.cwrap('dJointSetTransmissionAxis1', '', ['number', 'number', 'number', 'number']);
    public static dJointSetTransmissionAxis2: (dxJoint: DxJoint, x: number, y: number, z: number) => void = Module.cwrap('dJointSetTransmissionAxis2', '', ['number', 'number', 'number', 'number']);
    public static dJointSetTransmissionAxis: (dxJoint: DxJoint, x: number, y: number, z: number) => void = Module.cwrap('dJointSetTransmissionAxis', '', ['number', 'number', 'number', 'number']);
    public static dJointSetTransmissionBacklash: (dxJoint: DxJoint, backlash: number) => void = Module.cwrap('dJointSetTransmissionBacklash', '', ['number', 'number']);
    public static dJointSetTransmissionMode: (dxJoint: DxJoint, mode: number) => void = Module.cwrap('dJointSetTransmissionMode', '', ['number', 'number']);
    public static dJointSetTransmissionRatio: (dxJoint: DxJoint, ration: number) => void = Module.cwrap('dJointSetTransmissionRatio', '', ['number', 'number']);

    public static dMassAdjust: (dMass: DMass, newMass: number) => void = Module.cwrap('dMassAdjust', '', ['number', 'number']);
    public static dMassSetBox: (dMass: DMass, density: number, lx: number, ly: number, lz: number) => void = Module.cwrap('dMassSetBox', '', ['number', 'number', 'number', 'number']);
    public static dMassSetCylinder: (dMass: DMass, density: number, direction: number, radius: number, length: number) => void = Module.cwrap('dMassSetCylinder', '', ['number', 'number', 'number', 'number', 'number']);
    public static dMassSetSphere: (dMass: DMass, density: number, radius: number) => void = Module.cwrap('dMassSetSphere', '', ['number', 'number', 'number']);
    public static dMassSetTrimesh: (dMass: DMass, density: number, dxGeom: number) => void = Module.cwrap('dMassSetTrimesh', '', ['number', 'number', 'number']);
    public static dMassTranslate: (dMass: DMass, mc0: number, mc1: number, mc2: number) => void = Module.cwrap('dMassTranslate', '', ['number', 'number', 'number']);
    public static dMaterialCreate: (value: DxWorld) => Pointer = Module.cwrap('dMaterialCreate', 'number', ['number']);
    public static dMaterialGetParameter: (DxMaterial: DxMaterial, parameter: number) => number = Module.cwrap('dMaterialGetParameter', 'number', ['number', 'number']);
    public static dMaterialSetParameter: (DxMaterial: DxMaterial, parameter: number, value: number) => void = Module.cwrap('dMaterialSetParameter', '', ['number', 'number', 'number']);

    public static dRFromAxisAndAngle: (R: DMatrix3x3, ax: number, ay: number, az: number, angle: number) => void = Module.cwrap('dRFromAxisAndAngle', '', ['number', 'number', 'number', 'number', 'number']);
    public static dRFromZAxis: (R: DMatrix3x3, ax: number, ay: number, az: number) => void = Module.cwrap('dRFromZAxis', '', ['number', 'number', 'number', 'number']);
    public static dRSetIdentity: (R: DMatrix3x3) => void = Module.cwrap('dRSetIdentity', '', ['number']);


    public static dAreConnected: (b1: DxBody, b2: DxBody) => number = Module.cwrap('dAreConnected', 'number', ['number', 'number']);
    public static dAreConnectedExcluding: (b1: DxBody, b2: DxBody, jointType: DxJointType) => number = Module.cwrap('dAreConnectedExcluding', 'number', ['number', 'number', 'number']);

    public static dSimpleSpaceCreate: (dxSpace: DxSpace) => DxSpace = Module.cwrap('dSimpleSpaceCreate', 'number', ['number']);
    public static dHashSpaceCreate: (dSpaceID: number) => DxSpace = Module.cwrap('dHashSpaceCreate', 'number', ['number']);
    public static dHashSpaceSetLevels: (dSpaceID: number, minlevel: number, maxlevel: number) => void = Module.cwrap('dHashSpaceSetLevels', '', ['number', 'number', 'number']);




    public static dSpaceDestroy: (dxSpace: DxSpace) => void = Module.cwrap('dSpaceDestroy', '', ['number']);

    public static dSpaceCollide: (dxSpace: DxSpace, dxData: number, nearCallback: any) => void = Module.cwrap('dSpaceCollide', '', ['number', 'number', 'number']);

    public static dWorldCreate: () => DxWorld = Module.cwrap('dWorldCreate', '', ['number']);


    public static dWorldGetGravity2: (dxWorld: DxWorld) => Vector3_Ptr = Module.cwrap('dWorldGetGravity2', 'number', ['number']);

    public static dWorldDestroy: (dxWorld: DxWorld) => void = Module.cwrap('dWorldDestroy', '', ['number']);
    public static dWorldGetQuickStepNumIterations: (dxWorld: DxWorld) => number = Module.cwrap('dWorldGetQuickStepNumIterations', 'number', ['number']);
    public static dWorldQuickStep: (dxWorld: DxWorld, stepsize: number) => number = Module.cwrap('dWorldQuickStep', 'number', ['number', 'number']);
    public static dWorldSetGravity: (dxWorld: DxWorld, x: number, y: number, z: number) => void = Module.cwrap('dWorldSetGravity', '', ['number', 'number', 'number', 'number']);
    public static dWorldSetQuickStepNumIterations: (dxWorld: DxWorld, num: number) => void = Module.cwrap('dWorldSetQuickStepNumIterations', '', ['number', 'number']);
    public static dWorldStep: (dxWorld: DxWorld, stepsize: number) => number = Module.cwrap('dWorldStep', 'number', ['number', 'number']);

    public static dWorldSetAutoDisableAverageSamplesCount: (dxWorld: DxWorld, value: number) => void = Module.cwrap('dWorldSetAutoDisableAverageSamplesCount', '', ['number', 'number']);
    public static dWorldSetAutoDisableFlag: (dxWorld: DxWorld, value: number) => void = Module.cwrap('dWorldSetAutoDisableFlag', '', ['number', 'number']);
    public static dWorldSetAutoDisableLinearThreshold: (dxWorld: DxWorld, linearThreshold: number) => void = Module.cwrap('dWorldSetAutoDisableLinearThreshold', '', ['number', 'number']);
    public static dWorldSetAutoDisableAngularThreshold: (dxWorld: DxWorld, angularThreshold: number) => void = Module.cwrap('dWorldSetAutoDisableAngularThreshold', '', ['number', 'number']);
    public static dWorldSetAutoDisableSteps: (dxWorld: DxWorld, steps: number) => void = Module.cwrap('dWorldSetAutoDisableSteps', '', ['number', 'number']);
    public static dWorldSetAutoDisableTime: (dxWorld: DxWorld, steps: number) => void = Module.cwrap('dWorldSetAutoDisableTime', '', ['number', 'number']);
    public static dWorldSetNotificationInterval: (dxWorld: DxWorld, interval: number) => void = Module.cwrap('dWorldSetNotificationInterval', '', ['number', 'number']);


    //TODO all the getter concerning disableFlag...
    /* int dWorldGetAutoDisableFlag (dWorldID);   
    dReal dWorldGetAutoDisableLinearThreshold (dWorldID);  
    dReal dWorldGetAutoDisableAngularThreshold (dWorldID);
    int ou dreal dWorldGetAutoDisableAverageSamplesCount
    int dWorldGetAutoDisableSteps (dWorldID);   
    dReal dWorldGetAutoDisableTime (dWorldID);*/


    public static dWorldSetFlags: (dxWorld: DxWorld, flag: number) => void = Module.cwrap('dWorldSetFlags', '', ['number', 'number']);
    public static dWorldGetFlags: (dxWorld: DxWorld) => number = Module.cwrap('dWorldGetFlags', 'number', ['number']);
    public static dWorldGetDxFlags: (dxWorld: DxWorld) => Pointer = Module.cwrap('dWorldGetDxFlags', 'number', ['number']);





    public static dWorldSetERP: (dxWorld: DxWorld, erp: number) => void = Module.cwrap('dWorldSetERP', '', ['number', 'number']);
    public static dWorldSetCFM: (dxWorld: DxWorld, cfm: number) => void = Module.cwrap('dWorldSetCFM', '', ['number', 'number']);
    public static dWorldGetERP: (dxWorld: DxWorld) => number = Module.cwrap('dWorldGetERP', 'number', ['number']);
    public static dWorldGetCFM: (dxWorld: DxWorld) => number = Module.cwrap('dWorldGetCFM', 'number', ['number']);

    /*dWorldSetLinearDamping(world, 0.00001);
    dWorldSetAngularDamping(world, 0.005);
    dWorldSetMaxAngularSpeed(world, 200);*/
    //  dWorldSetContactSurfaceLayer




    public static init: (dxWorld: DxWorld, dxSpace: DxSpace, dxContactGroup: DxContactGroup, contactFlagMode: number) => boolean = Module.cwrap('init', 'boolean', ['number', 'number', 'number', 'number']);
    public static setFlagmode: (contactFlagMode: number) => void = Module.cwrap('setFlagmode', '', ['number']);
    public static setFlagmode2: (contactFlagMode: number) => void = Module.cwrap('setFlagmode2', '', ['number']);

    public static setMaxContact: (maxContact: number) => void = Module.cwrap('setMaxContact', '', ['number']);
    public static setTimestep: (step: number, numStep: number) => void = Module.cwrap('setTimestep', '', ['number', 'number']);
    public static run: () => void = Module.cwrap('run', '', []);
    public static closeEnergy: () => void = Module.cwrap('dCloseODE', '', []);


    //deprecated not in use
   // public static dGeomGetCollisionPos: (dxGeom: DxGeom) => Vector3_Ptr = Module.cwrap('dGeomGetCollisionPos', 'number', ['number']);

    // maybe we use that later, need to find the correct method for material

    // '_dGeomGetSlip1','_dGeomSetSlip1','_dGeomGetSlip2','_dGeomSetSlip2','_dGeomGetMu','_dGeomSetMu','_dGeomGetMu2','_dGeomSetMu2','_dGeomGetMotion1','_dGeomSetMotion1','_dGeomGetMotion2','_dGeomSetMotion2','_dGeomGetMotionN','_dGeomSetMotionN','_dGeomGetRho','_dGeomSetRho','_dGeomGetRho2','_dGeomSetRho2','_dGeomGetRhoN','_dGeomSetRhoN','_dGeomGetSoft_erp','_dGeomGetSoft_cfm','_dGeomSetSoft_erp','_dGeomSetSoft_cfm','_dGeomSetBounce','_dGeomSetBounceVel','_dGeomGetBounce','_dGeomGetBounceVel'

    /* public static dGeomGetSoft_erp: (dxGeom: DxGeom) => number = Module.cwrap('dGeomGetSoft_erp', 'number', ['number']);
    public static dGeomSetSoft_erp: (dxGeom: DxGeom, value: number) => void = Module.cwrap('dGeomSetSoft_erp', '', ['number']);
        
    public static dGeomGetSoft_cfm: (dxGeom: DxGeom) => number = Module.cwrap('dGeomGetSoft_cfm', 'number', ['number']);
    public static dGeomSetSoft_cfm: (dxGeom: DxGeom, value: number) => void = Module.cwrap('dGeomSetSoft_cfm', '', ['number']);
        
    public static dGeomGetBounce: (dxGeom: DxGeom) => number = Module.cwrap('dGeomGetBounce', 'number', ['number']);
    public static dGeomSetBounce: (dxGeom: DxGeom, value: number) => void = Module.cwrap('dGeomSetBounce', '', ['number']);
        
    public static dGeomGetBounceVel: (dxGeom: DxGeom) => number = Module.cwrap('dGeomGetBounceVel', 'number', ['number']);
    public static dGeomSetBounceVel: (dxGeom: DxGeom, value: number) => void = Module.cwrap('dGeomSetBounceVel', '', ['number']);
        
    public static dGeomGetMotion1: (dxGeom: DxGeom) => number = Module.cwrap('dGeomGetMotion1', 'number', ['number']);
    public static dGeomSetMotion1: (dxGeom: DxGeom, value: number) => void = Module.cwrap('dGeomSetMotion1', '', ['number']);
        
    public static dGeomGetMotion2: (dxGeom: DxGeom) => number = Module.cwrap('dGeomGetMotion2', 'number', ['number']);
    public static dGeomSetMotion2: (dxGeom: DxGeom, value: number) => void = Module.cwrap('dGeomSetMotion2', '', ['number']);
        
    public static dGeomGetMotionN: (dxGeom: DxGeom) => number = Module.cwrap('dGeomGetMotionN', 'number', ['number']);
    public static dGeomSetMotionN: (dxGeom: DxGeom, value: number) => void = Module.cwrap('dGeomSetMotionN', '', ['number']);
        
    public static dGeomGetRho: (dxGeom: DxGeom) => number = Module.cwrap('dGeomGetRho', 'number', ['number']);
    public static dGeomSetRho: (dxGeom: DxGeom, value: number) => void = Module.cwrap('dGeomSetRho', '', ['number']);
        
    public static dGeomGetRho2: (dxGeom: DxGeom) => number = Module.cwrap('dGeomGetRho2', 'number', ['number']);
    public static dGeomSetRho2: (dxGeom: DxGeom, value: number) => void = Module.cwrap('dGeomSetRho2', '', ['number']);
        
    public static dGeomGetRhoN: (dxGeom: DxGeom) => number = Module.cwrap('dGeomGetRhoN', 'number', ['number']);
    public static dGeomSetRhoN: (dxGeom: DxGeom, value: number) => void = Module.cwrap('dGeomSetRhoN', '', ['number']);
        
    public static dGeomGetMu: (dxGeom: DxGeom) => number = Module.cwrap('dGeomGetMu', 'number', ['number']);
    public static dGeomSetMu: (dxGeom: DxGeom, value: number) => void = Module.cwrap('dGeomSetMu', '', ['number']);
        
    public static dGeomGetMu2: (dxGeom: DxGeom) => number = Module.cwrap('dGeomGetMu2', 'number', ['number']);
    public static dGeomSetMu2: (dxGeom: DxGeom, value: number) => void = Module.cwrap('dGeomSetMu2', '', ['number']);
        
    public static dGeomGetSlip1: (dxGeom: DxGeom) => number = Module.cwrap('dGeomGetSlip1', 'number', ['number']);
    public static dGeomSetSlip1: (dxGeom: DxGeom, value: number) => void = Module.cwrap('dGeomSetSlip1', '', ['number']);
        
    public static dGeomGetSlip2: (dxGeom: DxGeom) => number = Module.cwrap('dGeomGetSlip2', 'number', ['number']);
    public static dGeomSetSlip2: (dxGeom: DxGeom, value: number) => void = Module.cwrap('dGeomSetSlip2', '', ['number']); 
    */


}

//INTERFACE WAS AT FIRST CREATED FOR EASY WORKER USE. KEEP OR NOT

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
    radius: number,
    length: number

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
    //TODO check
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








