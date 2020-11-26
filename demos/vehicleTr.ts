class Vehicle1 {

    private scene: BABYLON.Scene;
    private energy: Energy;

    private carBodies: Array<BABYLON.Mesh> = new Array<BABYLON.Mesh>();
    private carJoints: Array<DxJoint> = new Array<DxJoint>();

    private assetsManager: BABYLON.AssetsManager;

    private wm: BABYLON.Mesh;
    private wms=  [];


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

      // this.energy = new Energy(scene, new BABYLON.Vector3(0, -10, 0), Energy.QUICK_STEP, contactFlagMode, 1, 20);
        // normal step mode (more precise)
       this.energy = new Energy(scene, new BABYLON.Vector3(0, -9.8, 0),  Energy.NORMAL_STEP,contactFlagMode,1);

        //Numstep not in use 
        this.energy.setTimeStepAndNumStep(0.033, 0);
        this.energy.setMaxContact(16);

        //parameter for energy to disable idle body // see doc 

       
      
        this.scene = scene;
        // this.energy = energy;

        this.assetsManager = new BABYLON.AssetsManager(scene);

        //heighmap
        var groundTexture: BABYLON.Texture = new BABYLON.Texture("assets/checker.png", this.scene);
        groundTexture.uScale = groundTexture.vScale = 256;
        var groundMaterial = new BABYLON.StandardMaterial("m", this.scene);
        groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        groundMaterial.diffuseTexture = groundTexture;
        this.heighmap = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "assets/height1.jpg", 800, 800, this.subdivide, 0, 30, this.scene, false, () => this.mapIsLoaded());
        this.heighmap.material = groundMaterial;
        this.heighmap.receiveShadows = true;

        // load wheels meshes
        var meshTask = this.assetsManager.addMeshTask("load", "", "assets/", "wheel1.babylon");
        meshTask.onSuccess = (task) => this.wheelLoaded(task);
        this.assetsManager.load();

       



    }

    private control(): void {


        document.getElementById("control").innerHTML = "energy.js - arrow keys to drive - click first inside html page";


       // this.scene.actionManager = new BABYLON.ActionManager(this.scene);
        Control.acMan. registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, (evt) => this.key_up(evt)));
    }

    private key_up(event: any): void {

        var key = event.sourceEvent.key;


        switch (key) {
            case "a":
             //   this.buildTrailer1(2);
                break;
            case "s":
                //  for (var i = 0; i < this.wms.length; i++) {
                if (Lights.ShadowGenerator.getShadowMap().renderList.length != 0) {
                    Lights.ShadowGenerator.getShadowMap().renderList = [];
                } else {

                    //add shadow
                    for (var i = 0; i < this.wms.length; i++) {
                        Lights.ShadowGenerator.getShadowMap().renderList.push(this.wms[i]);
                    }

                }
                  //  console.log()
               // }
                break;
        }


    }

    private go() {
        if (this.doneA && this.doneB) {
            // build car
            this.buildCar();
            this.buildTrailer();

            console.log("car is built");

            for (var i = 0; i < 1; i++) {
                this.buildTrailer1(i);
            }

            //add shadow
            for (i = 0; i < this.wms.length; i++) {
               Lights.ShadowGenerator.getShadowMap().renderList.push(this.wms[i]);
            }

            console.log("shadow added"); 



            this.scene.registerBeforeRender(() => this.setBuggyUI());
            this.control(); 
            this.energy.startSimulation();
        }
    }

    private mapIsLoaded(): void {
        console.log("mapIsloaded"); 
        this.heighmap.isPickable = false;
        this.heighmap.position = new BABYLON.Vector3(0, -2, 0);
      //  this.heighmap.rotation.z = .36
        
            // density is set 0, object is static
        this.energy.addDynamicTriMesh(this.heighmap, 0);
        this.doneB = true; 
        this.go(); 
       

    }



    private wheelLoaded(task: any): void {
        console.log("whell loaded"); 
        this.wm = <BABYLON.Mesh>task.loadedMeshes[0];
        this.wm.isVisible = false;
    
        this.doneA = true; 
        this.go(); 


    }

   

    private cc = []; 

    private buildTrailer(): void {

        // mat
        var materials: Materials = new Materials(this.scene);



        var scale_con = new BABYLON.Vector3(2, .05, .05);
        var connection: BABYLON.Mesh = BABYLON.Mesh.CreateBox("trailer", 1, this.scene);
        // var connection = this.trimesh.clone("dd");
        connection.scaling = scale_con;
        connection.position = new BABYLON.Vector3(-2.75, 2.75, 10);
      
        this.energy.addDynamicObject(connection, Energy.BOX, 10);


        var scale = new BABYLON.Vector3(2, .1, 1);
        this.trailer = BABYLON.Mesh.CreateBox("trailer", 1, this.scene);
        this.wms.push(this.trailer); 
        this.cc.push(this.trailer);
     
        this.trailerBodies.push(this.trailer);
        this.trailer.scaling = scale;
        this.trailer.position = new BABYLON.Vector3(-4.75, 2.75, 10);
        this.energy.addDynamicObject(this.trailer, Energy.BOX, 20);
       


        var wheelRadius = 0.3;
        var wpos1: BABYLON.Vector3 = new BABYLON.Vector3(-5.25, 2.5, 10.9);
        var wpos2: BABYLON.Vector3 = new BABYLON.Vector3(-5.25, 2.5, 9.1);

        var wheelsPos = new Array<BABYLON.Vector3>(null, wpos1, wpos2);

        for (var i = 1; i <= 2; i++) {
            var tempWheel = BABYLON.Mesh.CreateSphere("wheel" + i, 16, wheelRadius * 3, this.scene);
            tempWheel.material = materials.matBlue;
            tempWheel.position = wheelsPos[i];
            tempWheel.isVisible = false;
            this.trailerBodies[i] = tempWheel;
            this.wms.push(this.wm.createInstance(""));
            this.wms[this.wms.length - 1].parent = tempWheel; 
          //  Lights.ShadowGenerator.getShadowMap().renderList.push(tempWheel);
            this.energy.addDynamicObject(tempWheel, Energy.SPHERE, 10);
            this.energy.dBodySetSurfaceParameter(tempWheel, mu, 1000);
            this.energy.dBodySetGyroscopicMode(tempWheel,0)

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

        var anchor = new BABYLON.Vector3(-3.75, 2.75, 10);
        var axis = new BABYLON.Vector3(0, 0, 1);
        var HingeTrailerConnection = this.energy.addDJointHinge(this.trailer, connection, anchor, axis, "hinge");
        this.energy.dJointSetParam(HingeTrailerConnection, dParamLoStop, -0.45);
        this.energy.dJointSetParam(HingeTrailerConnection, dParamHiStop, 0.15);
        this.energy.dJointSetParam(HingeTrailerConnection, dParamFMax, 50);

     //   this.energy.dJointSetParam(HingeTrailerConnection, dParamVel2, 0);
     ///   this.energy.dJointSetParam(HingeTrailerConnection, dParamFMax2, 0);

     //   this.energy.dJointSetParam(HingeTrailerConnection, dParamSuspensionERP, 0.25);
     //   this.energy.dJointSetParam(HingeTrailerConnection, dParamSuspensionCFM, 0.008);

        anchor = new BABYLON.Vector3(-1.75, 2.75, 10);
        var axis = new BABYLON.Vector3(0, 1, 0);
        var HingeConnectionCar = this.energy.addDJointHinge(this.carBodies[0], connection, anchor, axis, "hinge");
        this.energy.dJointSetParam(HingeConnectionCar, dParamLoStop, -1.5);
        this.energy.dJointSetParam(HingeConnectionCar, dParamHiStop, 1.5);
        this.energy.dJointSetParam(HingeConnectionCar, dParamFMax, 50);

    //    this.energy.dJointSetParam(HingeConnectionCar, dParamVel2, 0);
    //    this.energy.dJointSetParam(HingeConnectionCar, dParamFMax2, 30);

   //     this.energy.dJointSetParam(HingeConnectionCar, dParamSuspensionERP, 0.25);
   //     this.energy.dJointSetParam(HingeConnectionCar, dParamSuspensionCFM, 0.008);



    }

    private testJoint;
    private testJoint1;
   // private connection;

    private buildTrailer1(k:number): void {

        // mat
        var materials: Materials = new Materials(this.scene);



        var scale_con = new BABYLON.Vector3(2, .05, .05);
        var connection = BABYLON.Mesh.CreateBox("trailer", 1, this.scene);
        this.wms.push(connection); 
        // var connection = this.trimesh.clone("dd");
         connection.scaling = scale_con;
         connection.position = new BABYLON.Vector3(-4*k-6.75, 2.75, 10);
        //  this.energy.addDynamicTriMesh(connection, 40); 
        this.energy.addDynamicObject(connection, Energy.BOX, 10);


        var scale = new BABYLON.Vector3(2, .1, 1);
        var trailer = BABYLON.Mesh.CreateBox("trailer", 1, this.scene);
        this.cc.push(trailer);
        this.wms.push(trailer);
      //  Lights.ShadowGenerator.getShadowMap().renderList.push(trailer);

        //  var trailer = this.trimesh.clone("dd");
        this.trailerBodies1.push(trailer);
        trailer.scaling = scale;
        trailer.position = new BABYLON.Vector3(-4*k-8.75, 2.75, 10);
        this.energy.addDynamicObject(trailer, Energy.BOX, 50);
        //  this.energy.addDynamicTriMesh( trailer,  10); 


        var wheelRadius = 0.3;
        var wpos1: BABYLON.Vector3 = new BABYLON.Vector3(-4*k-9.25, 2.5, 10.9);
        var wpos2: BABYLON.Vector3 = new BABYLON.Vector3(-4*k-9.25, 2.5, 9.1);

        var wheelsPos = new Array<BABYLON.Vector3>(null, wpos1, wpos2);

        for (var i = 1; i <= 2; i++) {
            var tempWheel = BABYLON.Mesh.CreateSphere("wheel" + i, 16, wheelRadius * 3, this.scene);
            tempWheel.material = materials.matBlue;
            tempWheel.position = wheelsPos[i];
            tempWheel.isVisible = false;
            this.trailerBodies1[i] = tempWheel;
            this.wms.push(this.wm.createInstance(""));
            this.wms[this.wms.length - 1].parent = tempWheel; 
          //  Lights.ShadowGenerator.getShadowMap().renderList.push(tempWheel);
            this.energy.addDynamicObject(tempWheel, Energy.SPHERE, 10);
            this.energy.dBodySetSurfaceParameter(tempWheel, mu, 5000); 

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

        var anchor = new BABYLON.Vector3(-4*k-7.75, 2.75, 10);
        var axis = new BABYLON.Vector3(0, 0, 1);
        this.testJoint = this.energy.addDJointHinge(this.cc[k+1], connection, anchor, axis, "hinge");
        this.energy.dJointSetParam(this.testJoint, dParamLoStop, -0.45);
        this.energy.dJointSetParam(this.testJoint, dParamHiStop, 0.15);
       // this.energy.dJointSetParam(this.testJoint, dParamCFM, 0.00001);
       // this.energy.dJointSetParam(this.testJoint, dParamERP, 0.99);

        anchor = new BABYLON.Vector3(-4*k-5.75, 2.75, 10);
        var axis = new BABYLON.Vector3(0, 1, 0);
        this.testJoint1 = this.energy.addDJointHinge(this.cc[k], connection, anchor, axis, "hinge");
        this.energy.dJointSetParam(this.testJoint1, dParamLoStop, -1.5);
        this.energy.dJointSetParam(this.testJoint1, dParamHiStop, 1.5);
     //   this.energy.dJointSetParam(this.testJoint1, dParamCFM, 0.00001);
     //   this.energy.dJointSetParam(this.testJoint1, dParamERP, 0.99);
      //  this.energy.dJointSetParam(this.testJoint1, dParamSuspensionERP, 0.25);
      //  this.energy.dJointSetParam(this.testJoint1, dParamSuspensionCFM, 0.008);

        this.trailerBodies1 = [];
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
        var wpos5: BABYLON.Vector3 = new BABYLON.Vector3(1.7, 2.5, 10.9);
        var wpos6: BABYLON.Vector3 = new BABYLON.Vector3(1.7, 2.5, 9.1);
        var wheelsPos = new Array<BABYLON.Vector3>(null, wpos1, wpos2, wpos3, wpos4, wpos5, wpos6);

        // main body
        var car: BABYLON.Mesh = BABYLON.Mesh.CreateBox("car", 1, this.scene);
        var carScale = new BABYLON.Vector3(3.5, .5, 1);
      //  Lights.ShadowGenerator.getShadowMap().renderList.push(car);
        car.scaling = carScale;
        car.position = new BABYLON.Vector3(0, 2.75, 10);
        this.carBodies.push(car);
        this.energy.addDynamicObject(car, Energy.BOX, 250);

        //assign cam 
        Cameras.cameraF.lockedTarget = car;

        //wheels
        for (var i = 1; i <= 6; i++) {
            var tempWheel = BABYLON.Mesh.CreateSphere("wheel" + i, 16, wheelRadius * 3, this.scene);
            tempWheel.material = materials.matBlue;
            tempWheel.position = wheelsPos[i];
            tempWheel.isVisible = false;
            this.carBodies[i] = tempWheel;
            this.wms.push(this.wm.createInstance(""));
            this.wms[this.wms.length - 1].parent = tempWheel; 
           
          //  Lights.ShadowGenerator.getShadowMap().renderList.push(tempWheel);
            this.energy.addDynamicObject(tempWheel, Energy.SPHERE, 10);
            this.energy.dBodySetSurfaceParameter(tempWheel, mu, 2500); 

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

            this.energy.dJointSetParam(this.carJoints[i], dParamVel2,0);
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
                amt > 50 ? amt = 500 : 0;
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
                var steeringVelocity = (desiredPosition - this.energy.dJointGetHinge2Angle1(this.carJoints[i])) * 1;

                this.energy.dJointSetParam(this.carJoints[i], dParamHiStop, steeringLimit);
                this.energy.dJointSetParam(this.carJoints[i], dParamLoStop, -steeringLimit);
                this.energy.dJointSetParam(this.carJoints[i], dParamVel, steeringVelocity);
            }
            else {

                // try to keep the 2  rear wheels straight 
                var desiredPosition = 0;
                var steeringVelocity = (desiredPosition - this.energy.dJointGetHinge2Angle1(this.carJoints[i])) * 1;
                this.energy.dJointSetParam(this.carJoints[i], dParamHiStop, 0.01);
                this.energy.dJointSetParam(this.carJoints[i], dParamLoStop, -0.01);
                this.energy.dJointSetParam(this.carJoints[i], dParamVel, steeringVelocity*1000);

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
                this.energy.dJointSetParam(this.carJoints[i], dParamFMax2, 480);
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
