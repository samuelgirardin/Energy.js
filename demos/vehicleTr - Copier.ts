class Vehicleg1 {

    private scene: BABYLON.Scene;
    private energy: Energy;

    private carBodies: Array<BABYLON.Mesh> = new Array<BABYLON.Mesh>();
    private carJoints: Array<DxJoint> = new Array<DxJoint>();

    private assetsManager: BABYLON.AssetsManager;

    // wheel meshes
    private wm1: BABYLON.Mesh;
    private wm2: BABYLON.Mesh;
    private wm3: BABYLON.Mesh;
    private wm4: BABYLON.Mesh;
    private wm5: BABYLON.Mesh;
    private wm6: BABYLON.Mesh;

    private wm7: BABYLON.Mesh;
    private wm8: BABYLON.Mesh;
    private wm9: BABYLON.Mesh;
    private wm10: BABYLON.Mesh;

    // joints util
    private anchor1: BABYLON.Vector3;
    private anchor2: BABYLON.Vector3;
    private axis1: BABYLON.Vector3;

    private trailer: BABYLON.Mesh;
    private trailerBodies: any  =[];
    private trailerBodies1: any = [];
    private trailerJoints1: any = [];
    private trailerJoints: any = [];

    private heighmap: BABYLON.Mesh;
    private subdivide: number = 128;

    private doneA: boolean = false; 
    private doneB: boolean = false ; 

    constructor(scene: BABYLON.Scene) {

        /**
       *  Basic 6 wheels vehicle implementation
       *  Not really efficient, better to use dynamic ray (TODO) 
       */

        var contactFlagMode = dContactBounce // dContactSoftCFM | dContactSoftERP;

        this.energy = new Energy(scene, new BABYLON.Vector3(0, -10, 0), Energy.QUICK_STEP, contactFlagMode, 1, 20);
        // normal step mode (more precise)
        //this.energy = new Energy(scene, new BABYLON.Vector3(0, -9.8, 0),  Energy.NORMAL_STEP,contactFlagMode);
        this.energy.setTimeStepAndNumStep(0.025, 1);
        this.energy.setMaxContact(6);

        //parameter for energy to disable idle body // see doc 

        document.getElementById("control").innerHTML = "energy.js - arrow keys to drive - clic first inside html page";

      
        this.scene = scene;
        // this.energy = energy;

        this.assetsManager = new BABYLON.AssetsManager(scene);

        // build car
       // new Heighmap(this.scene, this.energy, true);

        var groundTexture: BABYLON.Texture = new BABYLON.Texture("assets/checker.png", this.scene);
        groundTexture.uScale = groundTexture.vScale = 256;

        var groundMaterial = new BABYLON.StandardMaterial("m", this.scene);
        groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        groundMaterial.diffuseTexture = groundTexture;

        this.heighmap = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "assets/height.jpg", 800, 800, this.subdivide, 0, 30, this.scene, false, () => this.mapIsLoaded());

        this.heighmap.material = groundMaterial;
        this.heighmap.receiveShadows = true;


        // build car
        this.buildCar();
        this.buildTrailer(0);
       // this.buildTrailer1(); 
        this.buildTrailer(1);
        this.buildTrailer(2);
        this.buildTrailer(3);

        // load wheels meshes
        var meshTask = this.assetsManager.addMeshTask("load", "", "assets/", "wheel1.babylon");
        meshTask.onSuccess = (task) => this.wheelLoaded(task);
        this.assetsManager.load();

       


        this.scene.registerBeforeRender(() => this.setBuggyUI());



    }

    private mapIsLoaded(): void {

        this.heighmap.isPickable = false;
        this.heighmap.position = new BABYLON.Vector3(0, 1, 0);

        
            // density is set 0, object is static
        this.energy.addDynamicTriMesh(this.heighmap, 0);

        this.doneB = true; 
        this.go(); 
       

    }



    private wheelLoaded(task: any): void {

        var wm = <BABYLON.Mesh>task.loadedMeshes[0];
        wm.isVisible = false;
        this.wm1 = task.loadedMeshes[0].createInstance("", this.scene);
        this.wm2 = task.loadedMeshes[0].createInstance("", this.scene);
        this.wm3 = task.loadedMeshes[0].createInstance("", this.scene);
        this.wm4 = task.loadedMeshes[0].createInstance("", this.scene);
        this.wm5 = task.loadedMeshes[0].createInstance("", this.scene);
        this.wm6 = task.loadedMeshes[0].createInstance("", this.scene);

        this.wm7 = task.loadedMeshes[0].createInstance("", this.scene);
        this.wm8 = task.loadedMeshes[0].createInstance("", this.scene);
        this.wm9 = task.loadedMeshes[0].createInstance("", this.scene);
        this.wm10 = task.loadedMeshes[0].createInstance("", this.scene);


     /*   Lights.ShadowGenerator.getShadowMap().renderList.push(this.wm1);
        Lights.ShadowGenerator.getShadowMap().renderList.push(this.wm2);
        Lights.ShadowGenerator.getShadowMap().renderList.push(this.wm3);
        Lights.ShadowGenerator.getShadowMap().renderList.push(this.wm4);
        Lights.ShadowGenerator.getShadowMap().renderList.push(this.wm5);
        Lights.ShadowGenerator.getShadowMap().renderList.push(this.wm6);*/


        this.wm1.parent = this.carBodies[1];
        this.wm2.parent = this.carBodies[2];
        this.wm3.parent = this.carBodies[3];
        this.wm4.parent = this.carBodies[4];
        this.wm5.parent = this.carBodies[5];
        this.wm6.parent = this.carBodies[6];

        this.wm7.parent = this.trailerBodies[1];
        this.wm8.parent = this.trailerBodies[2];
        this.wm9.parent = this.trailerBodies1[1];
        this.wm10.parent = this.trailerBodies1[2];


        this.doneA = true; 
        this.go(); 


    }

    private go() {
        if (this.doneA && this.doneB) {
            this.energy.startSimulation();
        }
    }



    private buildTrailer(k:number): void {

        // mat
        var materials: Materials = new Materials(this.scene);



        var scale_con = new BABYLON.Vector3(2, .05, .05);
        var connection: BABYLON.Mesh = BABYLON.Mesh.CreateBox("trailer", 1, this.scene);
        // var connection = this.trimesh.clone("dd");
        connection.scaling = scale_con;
        connection.position = new BABYLON.Vector3(-4*k-2.75, 2.75, 10);
      
        this.energy.addDynamicObject(connection, Energy.BOX, 10);


        var scale = new BABYLON.Vector3(2, .1, 1);
        this.trailer = BABYLON.Mesh.CreateBox("trailer", 1, this.scene);
     
        this.trailerBodies.push(this.trailer);
        this.trailer.scaling = scale;
        this.trailer.position = new BABYLON.Vector3(-4 * k-4.75, 2.75, 10);
        this.energy.addDynamicObject(this.trailer, Energy.BOX, 20);
       


        var wheelRadius = 0.3;
        var wpos1: BABYLON.Vector3 = new BABYLON.Vector3(-4 * k-5.25, 2.5, 10.9);
        var wpos2: BABYLON.Vector3 = new BABYLON.Vector3(-4 * k-5.25, 2.5, 9.1);

        var wheelsPos = new Array<BABYLON.Vector3>(null, wpos1, wpos2);

        for (var i = 1; i <= 2; i++) {
            var tempWheel = BABYLON.Mesh.CreateSphere("wheel" + i, 16, wheelRadius * 3, this.scene);
            tempWheel.material = materials.matBlue;
            tempWheel.position = wheelsPos[i];
            tempWheel.isVisible = false;
            this.trailerBodies[i] = tempWheel;
          //  Lights.ShadowGenerator.getShadowMap().renderList.push(tempWheel);
            this.energy.addDynamicObject(tempWheel, Energy.SPHERE, 10);
            this.energy.dBodySetSurfaceParameter(tempWheel, mu, 1000); 

        }

        for (var i = 0; i < 2; i++) {

            var wpos = this.trailerBodies[i + 1].position;
            var axis1 = new BABYLON.Vector3(0, 1, 0);
            var axis2 = new BABYLON.Vector3(0, 0, i % 2 == 0 ? -1 : 1);
            this.trailerJoints[i] = this.energy.addDJointHinge2(this.trailerBodies[0], this.trailerBodies[i + 1], wpos, axis1, axis2, "wheeljoint" + i);
            this.energy.dJointSetParam(this.trailerJoints[i], dParamLoStop, 0);
            this.energy.dJointSetParam(this.trailerJoints[i], dParamHiStop, 0);
            this.energy.dJointSetParam(this.trailerJoints[i], dParamFMax, 50);

            this.energy.dJointSetParam(this.trailerJoints[i], dParamVel2, 0);
            this.energy.dJointSetParam(this.trailerJoints[i], dParamFMax2, 30);

            this.energy.dJointSetParam(this.trailerJoints[i], dParamSuspensionERP, 0.25);
            this.energy.dJointSetParam(this.trailerJoints[i], dParamSuspensionCFM, 0.008);

        }

        var anchor = new BABYLON.Vector3(-4 * k-3.75, 2.75, 10);
        var axis = new BABYLON.Vector3(0, 0, 1);
        var HingeTrailerConnection = this.energy.addDJointHinge(this.trailer, connection, anchor, axis, "hinge");
        this.energy.dJointSetParam(HingeTrailerConnection, dParamLoStop, -0.45);
        this.energy.dJointSetParam(HingeTrailerConnection, dParamHiStop, 0.15);
        this.energy.dJointSetParam(HingeTrailerConnection, dParamFMax, 50);

        this.energy.dJointSetParam(HingeTrailerConnection, dParamVel2, 0);
        this.energy.dJointSetParam(HingeTrailerConnection, dParamFMax2, 0);

        this.energy.dJointSetParam(HingeTrailerConnection, dParamSuspensionERP, 0.25);
        this.energy.dJointSetParam(HingeTrailerConnection, dParamSuspensionCFM, 0.008);

        anchor = new BABYLON.Vector3(-4 * k-1.75, 2.75, 10);
        var axis = new BABYLON.Vector3(0, 1, 0);
        var HingeConnectionCar = this.energy.addDJointHinge(this.carBodies[0], connection, anchor, axis, "hinge");
        this.energy.dJointSetParam(HingeConnectionCar, dParamLoStop, -1);
        this.energy.dJointSetParam(HingeConnectionCar, dParamHiStop, 1);
        this.energy.dJointSetParam(HingeConnectionCar, dParamFMax, 50);

        this.energy.dJointSetParam(HingeConnectionCar, dParamVel2, 0);
        this.energy.dJointSetParam(HingeConnectionCar, dParamFMax2, 30);

        this.energy.dJointSetParam(HingeConnectionCar, dParamSuspensionERP, 0.25);
        this.energy.dJointSetParam(HingeConnectionCar, dParamSuspensionCFM, 0.008);



    }

    private testJoint;
    private testJoint1;
    private connection;

    private buildTrailer1(): void {

        // mat
        var materials: Materials = new Materials(this.scene);



        var scale_con = new BABYLON.Vector3(2, .05, .05);
        this.connection = BABYLON.Mesh.CreateBox("trailer", 1, this.scene);
        // var connection = this.trimesh.clone("dd");
        this.connection.scaling = scale_con;
        this.connection.position = new BABYLON.Vector3(-6.75, 2.75, 10);
        //  this.energy.addDynamicTriMesh(connection, 40); 
        this.energy.addDynamicObject(this.connection, Energy.BOX, 10);


        var scale = new BABYLON.Vector3(2, .1, 1);
        var trailer = BABYLON.Mesh.CreateBox("trailer", 1, this.scene);
      //  Lights.ShadowGenerator.getShadowMap().renderList.push(trailer);

        //  var trailer = this.trimesh.clone("dd");
        this.trailerBodies1.push(trailer);
        trailer.scaling = scale;
        trailer.position = new BABYLON.Vector3(-8.75, 2.75, 10);
        this.energy.addDynamicObject(trailer, Energy.BOX, 20);
        //  this.energy.addDynamicTriMesh( trailer,  10); 


        var wheelRadius = 0.3;
        var wpos1: BABYLON.Vector3 = new BABYLON.Vector3(-9.25, 2.5, 10.9);
        var wpos2: BABYLON.Vector3 = new BABYLON.Vector3(-9.25, 2.5, 9.1);

        var wheelsPos = new Array<BABYLON.Vector3>(null, wpos1, wpos2);

        for (var i = 1; i <= 2; i++) {
            var tempWheel = BABYLON.Mesh.CreateSphere("wheel" + i, 16, wheelRadius * 3, this.scene);
            tempWheel.material = materials.matBlue;
            tempWheel.position = wheelsPos[i];
            tempWheel.isVisible = false;
            this.trailerBodies1[i] = tempWheel;
          //  Lights.ShadowGenerator.getShadowMap().renderList.push(tempWheel);
            this.energy.addDynamicObject(tempWheel, Energy.SPHERE, 10);
            this.energy.dBodySetSurfaceParameter(tempWheel, mu, 1000); 

        }

        for (var i = 0; i < 2; i++) {

            var wpos = this.trailerBodies1[i + 1].position;
            var axis1 = new BABYLON.Vector3(0, 1, 0);
            var axis2 = new BABYLON.Vector3(0, 0, i % 2 == 0 ? -1 : 1);
            this.trailerJoints1[i] = this.energy.addDJointHinge2(this.trailerBodies1[0], this.trailerBodies1[i + 1], wpos, axis1, axis2, "wheeljoint" + i);
            this.energy.dJointSetParam(this.trailerJoints1[i], dParamLoStop, 0);
            this.energy.dJointSetParam(this.trailerJoints1[i], dParamHiStop, 0);
            this.energy.dJointSetParam(this.trailerJoints1[i], dParamFMax, 50);

            this.energy.dJointSetParam(this.trailerJoints1[i], dParamVel2, 0);
            this.energy.dJointSetParam(this.trailerJoints1[i], dParamFMax2, 30);

            this.energy.dJointSetParam(this.trailerJoints1[i], dParamSuspensionERP, 0.25);
            this.energy.dJointSetParam(this.trailerJoints1[i], dParamSuspensionCFM, 0.008);

        }

        var anchor = new BABYLON.Vector3(-7.75, 2.75, 10);
        var axis = new BABYLON.Vector3(0, 0, 1);
        this.testJoint = this.energy.addDJointHinge(trailer, this.connection, anchor, axis, "hinge");
        this.energy.dJointSetParam(this.testJoint, dParamLoStop, -0.45);
        this.energy.dJointSetParam(this.testJoint, dParamHiStop, 0.15);
        this.energy.dJointSetParam(this.testJoint, dParamSuspensionERP, 0.25);
        this.energy.dJointSetParam(this.testJoint, dParamSuspensionCFM, 0.008);

        anchor = new BABYLON.Vector3(-5.75, 2.75, 10);
        var axis = new BABYLON.Vector3(0, 1, 0);
        this.testJoint1 = this.energy.addDJointHinge(this.trailer, this.connection, anchor, axis, "hinge");
        this.energy.dJointSetParam(this.testJoint1, dParamLoStop, -1);
        this.energy.dJointSetParam(this.testJoint1, dParamHiStop, 1);
        this.energy.dJointSetParam(this.testJoint1, dParamSuspensionERP, 0.25);
        this.energy.dJointSetParam(this.testJoint1, dParamSuspensionCFM, 0.008);



    }


    private buildCar(): void {

        // mat
        var materials: Materials = new Materials(this.scene);

        // car setup       

        var wheelRadius = 0.3;
        var wpos1: BABYLON.Vector3 = new BABYLON.Vector3(-1.9, 2.5, 10.9);
        var wpos2: BABYLON.Vector3 = new BABYLON.Vector3(-1.9, 2.5, 9.1);
        var wpos3: BABYLON.Vector3 = new BABYLON.Vector3(-.7, 2.5, 10.9);
        var wpos4: BABYLON.Vector3 = new BABYLON.Vector3(-.7, 2.5, 9.1);
        var wpos5: BABYLON.Vector3 = new BABYLON.Vector3(2.4, 2.5, 10.9);
        var wpos6: BABYLON.Vector3 = new BABYLON.Vector3(2.4, 2.5, 9.1);
        var wheelsPos = new Array<BABYLON.Vector3>(null, wpos1, wpos2, wpos3, wpos4, wpos5, wpos6);

        // main body
        var car: BABYLON.Mesh = BABYLON.Mesh.CreateBox("car", 1, this.scene);
        var carScale = new BABYLON.Vector3(3.5, .5, 1);
      //  Lights.ShadowGenerator.getShadowMap().renderList.push(car);
        car.scaling = carScale;
        car.position = new BABYLON.Vector3(0, 2.75, 10);
        this.carBodies.push(car);
        this.energy.addDynamicObject(car, Energy.BOX, 50);

        //assign cam 
        Cameras.cameraF.lockedTarget = car;

        //wheels
        for (var i = 1; i <= 6; i++) {
            var tempWheel = BABYLON.Mesh.CreateSphere("wheel" + i, 16, wheelRadius * 3, this.scene);
            tempWheel.material = materials.matBlue;
            tempWheel.position = wheelsPos[i];
            tempWheel.isVisible = false;
            this.carBodies[i] = tempWheel;
          //  Lights.ShadowGenerator.getShadowMap().renderList.push(tempWheel);
            this.energy.addDynamicObject(tempWheel, Energy.SPHERE, 10);
            this.energy.dBodySetSurfaceParameter(tempWheel, mu, 500); 

        }

        //wheel joints
        for (var i = 0; i < 6; i++) {

            var wpos = this.carBodies[i + 1].position;
            var axis1 = new BABYLON.Vector3(0, 1, 0);
            var axis2 = new BABYLON.Vector3(0, 0, i % 2 == 0 ? -1 : 1);
            this.carJoints[i] = this.energy.addDJointHinge2(this.carBodies[0], this.carBodies[i + 1], wpos, axis1, axis2, "wheeljoint" + i);
            this.energy.dJointSetParam(this.carJoints[i], dParamLoStop, 0);
            this.energy.dJointSetParam(this.carJoints[i], dParamHiStop, 0);
            this.energy.dJointSetParam(this.carJoints[i], dParamFMax, 50);

            this.energy.dJointSetParam(this.carJoints[i], dParamVel2, 0);
            this.energy.dJointSetParam(this.carJoints[i], dParamFMax2, 30);

            this.energy.dJointSetParam(this.carJoints[i], dParamSuspensionERP, 0.18);
            this.energy.dJointSetParam(this.carJoints[i], dParamSuspensionCFM, 0.004);

        }

    }

    private setBuggyUI(): void {
        this.steeringControl();
        this.engineControl();
        this.swaybarControl()
    }

    private swaybarControl(): void {

        var amt: number;
        for (var i = 0; i < 6; i++) {
            // get proporties for swaybar.
            var h2anchor = this.energy.getdjointHinge2Anchor(this.carJoints[i]);
            this.anchor1 = new BABYLON.Vector3(h2anchor[0], h2anchor[1], h2anchor[2]);

            var h2anchor2 = this.energy.getdjointHinge2Anchor2(this.carJoints[i]);
            this.anchor2 = new BABYLON.Vector3(h2anchor2[0], h2anchor2[1], h2anchor2[2]);

            var ax1 = this.energy.getdjointHinge2Axis1(this.carJoints[i]);
            this.axis1 = new BABYLON.Vector3(ax1[0], ax1[1], ax1[2]);

            var dif = this.anchor1.subtract(this.anchor2);
            var displacement = (dif.x * this.axis1.x) + (dif.y * this.axis1.y) + (dif.z * this.axis1.z);

            if (displacement > 0) {
                amt = displacement * 800;
                amt > 50 ? amt = 50 : 0;
                var force = this.axis1.scaleInPlace(amt);

                this.energy.dBodyAddForce(this.carBodies[i + 1], force.negate(), false);
            }
        }
    }

    private steeringControl(): void {

        var steeringRate = Math.PI * 4 / 7;
        var steeringLimit = Math.PI / 6;


        for (var i = 0; i < 6; i++) {

            if (i >= 4) {
                // the two front wheels                       
                var steering = Control.Steering;

                if (Math.abs(steering) < 0.1) {
                    steering = 0;
                }

                var desiredPosition = steering * ((i > 1) ? -1 : 1);
                var steeringVelocity = (desiredPosition - this.energy.dJointGetHinge2Angle1(this.carJoints[i])) * 10;

                this.energy.dJointSetParam(this.carJoints[i], dParamHiStop, steeringLimit);
                this.energy.dJointSetParam(this.carJoints[i], dParamLoStop, -steeringLimit);
                this.energy.dJointSetParam(this.carJoints[i], dParamVel, steeringVelocity);
            }
            else {

                // try to keep the 2  rear wheels straight 
                var desiredPosition = 0;
                var steeringVelocity = (desiredPosition - this.energy.dJointGetHinge2Angle1(this.carJoints[i])) * 100;
                this.energy.dJointSetParam(this.carJoints[i], dParamHiStop, 0.01);
                this.energy.dJointSetParam(this.carJoints[i], dParamLoStop, -0.01);
                this.energy.dJointSetParam(this.carJoints[i], dParamVel, steeringVelocity);

            }
        }

    }

    private engineControl(): void {

        var velocity = Control.Velocity;
        var wheelVelocity = 15 * Math.PI * velocity;
        if (velocity != 0) {

            for (var i = 0; i < 6; ++i) {
                //acceleration  0-1 rear wheels 2-3 front wheels 
                this.energy.dJointSetParam(this.carJoints[i], dParamVel2, ((i % 2) == 0) ? -wheelVelocity : wheelVelocity);
                this.energy.dJointSetParam(this.carJoints[i], dParamFMax2, 280);
            }
        } else {
            for (var i = 0; i < 6; ++i) {
                // free wheel
                this.energy.dJointSetParam(this.carJoints[i], dParamFMax2, 20);
                this.energy.dJointSetParam(this.carJoints[i], dParamVel2, ((i % 2) == 0) ? 0 : 0);
            }
        }




    }
}